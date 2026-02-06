// This module should only be imported on the client side
// All functions are designed to run in the browser

export type ImageFormat = "jpg" | "png";

export interface ConversionOptions {
  format: ImageFormat;
  scale: number; // 1, 2, or 3
  quality?: number; // 0-1, only for jpg
}

export interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export interface ConversionProgress {
  currentPage: number;
  totalPages: number;
}

// PDF.js types for our usage
interface PDFDocumentProxy {
  numPages: number;
  getPage(pageNumber: number): Promise<PDFPageProxy>;
}

interface PDFPageProxy {
  getViewport(params: { scale: number }): PDFPageViewport;
  render(params: { canvasContext: CanvasRenderingContext2D; viewport: PDFPageViewport }): { promise: Promise<void> };
}

interface PDFPageViewport {
  width: number;
  height: number;
}

interface PDFJSStatic {
  getDocument(params: { data: ArrayBuffer }): { promise: Promise<PDFDocumentProxy> };
  GlobalWorkerOptions: { workerSrc: string };
}

// Cache for loaded pdf.js library
let pdfjsLib: PDFJSStatic | null = null;
let loadingPromise: Promise<PDFJSStatic> | null = null;

/**
 * Load pdf.js from CDN via script tag to avoid webpack bundling issues
 */
async function loadPdfJs(): Promise<PDFJSStatic> {
  if (pdfjsLib) return pdfjsLib;
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    const existingPdfjs = (window as unknown as Record<string, unknown>).pdfjsLib;
    if (existingPdfjs) {
      pdfjsLib = existingPdfjs as PDFJSStatic;
      resolve(pdfjsLib);
      return;
    }

    // Load the script from CDN
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;

    script.onload = () => {
      const pdfjs = (window as unknown as Record<string, unknown>).pdfjsLib as PDFJSStatic;
      if (pdfjs) {
        // Configure worker
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

/**
 * Convert all pages of a PDF to images using canvas rendering
 */
export async function convertPdfToImages(
  file: File,
  options: ConversionOptions,
  onProgress?: (progress: ConversionProgress) => void
): Promise<ConvertedPage[]> {
  // Load pdf.js from CDN
  const pdfjs = await loadPdfJs();
  
  // Load PDF
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  const pages: ConvertedPage[] = [];

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.({ currentPage: i, totalPages });
    
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: options.scale });

    // Create canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render PDF page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    // Convert to image
    const mimeType = options.format === "jpg" ? "image/jpeg" : "image/png";
    const quality = options.format === "jpg" ? (options.quality ?? 0.92) : undefined;
    const dataUrl = canvas.toDataURL(mimeType, quality);

    // Convert data URL to blob
    const blob = await dataUrlToBlob(dataUrl);

    pages.push({
      pageNumber: i,
      dataUrl,
      blob,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return pages;
}

/**
 * Create a ZIP file containing all converted images
 */
export async function createImagesZip(
  pages: ConvertedPage[],
  format: ImageFormat,
  baseName: string = "pdf-pages"
): Promise<Blob> {
  // Dynamic import of JSZip
  const JSZip = (await import("jszip")).default;
  
  const zip = new JSZip();
  const extension = format === "jpg" ? "jpg" : "png";

  pages.forEach((page) => {
    const fileName = `${baseName}-page-${page.pageNumber}.${extension}`;
    zip.file(fileName, page.blob);
  });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return zipBlob;
}

/**
 * Download a file
 */
export function downloadFile(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download a single page as an image
 */
export function downloadPage(
  page: ConvertedPage,
  format: ImageFormat,
  baseName: string = "page"
): void {
  const extension = format === "jpg" ? "jpg" : "png";
  const fileName = `${baseName}-${page.pageNumber}.${extension}`;
  downloadFile(page.blob, fileName);
}

/**
 * Convert data URL to Blob
 */
async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

/**
 * Validate PDF file
 */
export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 50 * 1024 * 1024; // 50 MB

  if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
    return { valid: false, error: "Plik musi być w formacie PDF" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Plik jest za duży (max 50 MB)" };
  }

  return { valid: true };
}

/**
 * Get file name without extension
 */
export function getFileBaseName(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, "");
}

export const SCALE_OPTIONS = [
  { value: 1, label: "1x (72 DPI)" },
  { value: 2, label: "2x (144 DPI)" },
  { value: 3, label: "3x (216 DPI)" },
] as const;

export const QUALITY_OPTIONS = [
  { value: 0.6, label: "Niska" },
  { value: 0.8, label: "Średnia" },
  { value: 0.92, label: "Wysoka" },
  { value: 1, label: "Maksymalna" },
] as const;
