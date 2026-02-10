// PDF to Word converter - client-side text extraction + DOCX generation
// Uses PDF.js for text extraction and docx package for Word file creation

import { validatePdfFile, getFileBaseName } from "./pdf-converter";

// Re-export helpers
export { validatePdfFile, getFileBaseName };

// PDF.js types
interface PDFDocumentProxy {
  numPages: number;
  getPage(pageNumber: number): Promise<PDFPageProxy>;
}

interface PDFPageProxy {
  getTextContent(): Promise<PDFTextContent>;
  getViewport(params: { scale: number }): { height: number };
}

interface PDFTextContent {
  items: PDFTextItem[];
}

interface PDFTextItem {
  str: string;
  transform: number[]; // [scaleX, skewX, skewY, scaleY, translateX, translateY]
  hasEOL?: boolean;
}

interface PDFJSStatic {
  getDocument(params: { data: ArrayBuffer }): { promise: Promise<PDFDocumentProxy> };
  GlobalWorkerOptions: { workerSrc: string };
}

export interface ConversionProgress {
  currentPage: number;
  totalPages: number;
  stage: "extracting" | "generating";
}

// Cache for loaded pdf.js library
let pdfjsLib: PDFJSStatic | null = null;
let loadingPromise: Promise<PDFJSStatic> | null = null;

async function loadPdfJs(): Promise<PDFJSStatic> {
  if (pdfjsLib) return pdfjsLib;
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const existingPdfjs = (window as unknown as Record<string, unknown>).pdfjsLib;
    if (existingPdfjs) {
      pdfjsLib = existingPdfjs as PDFJSStatic;
      resolve(pdfjsLib);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;

    script.onload = () => {
      const pdfjs = (window as unknown as Record<string, unknown>).pdfjsLib as PDFJSStatic;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        pdfjsLib = pdfjs;
        resolve(pdfjs);
      } else {
        reject(new Error("Failed to load pdf.js library"));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load pdf.js script"));
    };

    document.head.appendChild(script);
  });

  return loadingPromise;
}

interface TextLine {
  y: number;
  items: { x: number; text: string }[];
}

/**
 * Extract text from a single PDF page, reconstructing reading order.
 * Returns an array of paragraph strings.
 */
async function extractPageText(page: PDFPageProxy): Promise<string[]> {
  const textContent = await page.getTextContent();
  const viewport = page.getViewport({ scale: 1 });
  const pageHeight = viewport.height;

  if (textContent.items.length === 0) return [];

  // Convert items to positioned text with Y inverted (PDF Y goes up)
  const positioned = textContent.items
    .filter((item) => item.str.trim().length > 0 || item.hasEOL)
    .map((item) => ({
      text: item.str,
      x: item.transform[4],
      y: pageHeight - item.transform[5], // Invert Y for top-to-bottom
      hasEOL: item.hasEOL || false,
    }));

  if (positioned.length === 0) return [];

  // Group into lines (items at similar Y positions, threshold ~3px)
  const LINE_THRESHOLD = 3;
  const lines: TextLine[] = [];

  for (const item of positioned) {
    let foundLine = false;
    for (const line of lines) {
      if (Math.abs(line.y - item.y) < LINE_THRESHOLD) {
        line.items.push({ x: item.x, text: item.text });
        foundLine = true;
        break;
      }
    }
    if (!foundLine) {
      lines.push({ y: item.y, items: [{ x: item.x, text: item.text }] });
    }
  }

  // Sort lines top-to-bottom
  lines.sort((a, b) => a.y - b.y);

  // Sort items within each line left-to-right
  for (const line of lines) {
    line.items.sort((a, b) => a.x - b.x);
  }

  // Concatenate line text
  const lineTexts = lines.map((line) =>
    line.items.map((item) => item.text).join(" ").trim()
  ).filter((text) => text.length > 0);

  // Group lines into paragraphs (larger Y gap = new paragraph)
  if (lineTexts.length === 0) return [];

  const PARAGRAPH_GAP = 10; // Y distance threshold for paragraph break
  const paragraphs: string[] = [];
  let currentParagraph = lineTexts[0];

  for (let i = 1; i < lines.length; i++) {
    const lineText = lineTexts[i];
    if (!lineText) continue;

    const gap = lines[i].y - lines[i - 1].y;

    if (gap > PARAGRAPH_GAP) {
      // New paragraph
      paragraphs.push(currentParagraph);
      currentParagraph = lineText;
    } else {
      // Continue paragraph
      currentParagraph += " " + lineText;
    }
  }

  if (currentParagraph) {
    paragraphs.push(currentParagraph);
  }

  return paragraphs;
}

/**
 * Convert a PDF file to a Word (.docx) Blob.
 * Extracts text from each page and creates a Word document.
 */
export async function convertPdfToWord(
  file: File,
  onProgress?: (progress: ConversionProgress) => void
): Promise<Blob> {
  // Load PDF.js
  const pdfjs = await loadPdfJs();

  // Load PDF
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  // Extract text from all pages
  const allPageTexts: string[][] = [];

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.({ currentPage: i, totalPages, stage: "extracting" });

    const page = await pdf.getPage(i);
    const paragraphs = await extractPageText(page);
    allPageTexts.push(paragraphs);
  }

  // Generate DOCX
  onProgress?.({ currentPage: totalPages, totalPages, stage: "generating" });

  const { Document, Paragraph, TextRun, PageBreak, Packer } = await import("docx");

  const children: InstanceType<typeof Paragraph>[] = [];

  for (let pageIdx = 0; pageIdx < allPageTexts.length; pageIdx++) {
    const pageParagraphs = allPageTexts[pageIdx];

    if (pageParagraphs.length === 0) {
      // Empty page - add a note
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[Strona ${pageIdx + 1} - brak tekstu]`,
              italics: true,
              color: "999999",
            }),
          ],
        })
      );
    } else {
      for (const text of pageParagraphs) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text })],
            spacing: { after: 120 },
          })
        );
      }
    }

    // Add page break between pages (but not after the last page)
    if (pageIdx < allPageTexts.length - 1) {
      children.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
