"use client";

import { useState, useCallback, useRef } from "react";
import { FileUp, Download, FileText, Loader2, X, Info } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ConversionProgress,
  convertPdfToWord,
  validatePdfFile,
  getFileBaseName,
} from "@/lib/pdf-to-word-converter";

interface PdfToWordDictionary {
  title: string;
  subtitle: string;
  selectFile: string;
  dragDrop: string;
  dropHere: string;
  maxSize: string;
  convert: string;
  download: string;
  converting: string;
  extracting: string;
  generating: string;
  page: string;
  of: string;
  done: string;
  error: string;
  newFile: string;
  textOnly: string;
  noText: string;
  pages: string;
}

interface PdfToWordConverterProps {
  dictionary: PdfToWordDictionary;
}

export function PdfToWordConverter({ dictionary }: PdfToWordConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<ConversionProgress | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    const validation = validatePdfFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || "Nieprawidłowy plik");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResultBlob(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;

    setIsConverting(true);
    setError(null);
    setResultBlob(null);

    try {
      const blob = await convertPdfToWord(file, setProgress);
      setResultBlob(blob);
      trackToolEvent("pdf-to-word", "converters", "use");
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Wystąpił błąd podczas konwersji. Spróbuj ponownie.");
    } finally {
      setIsConverting(false);
      setProgress(null);
    }
  }, [file]);

  const handleDownload = useCallback(() => {
    if (!resultBlob || !file) return;

    const baseName = getFileBaseName(file.name);
    const url = URL.createObjectURL(resultBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${baseName}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [resultBlob, file]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFileSelect(droppedFile);
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) handleFileSelect(selectedFile);
    },
    [handleFileSelect]
  );

  const handleReset = useCallback(() => {
    setFile(null);
    setResultBlob(null);
    setError(null);
    setProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {dictionary.textOnly}
          </p>
        </div>

        {/* File Upload Area */}
        {!file && (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileInputChange}
            />
            <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragging ? (
              <p className="text-lg font-medium text-primary">
                {dictionary.dropHere}
              </p>
            ) : (
              <>
                <p className="text-lg font-medium mb-1">
                  {dictionary.selectFile}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {dictionary.dragDrop}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dictionary.maxSize}
                </p>
              </>
            )}
          </div>
        )}

        {/* Selected File Info */}
        {file && !isConverting && !resultBlob && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleReset}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleConvert} className="w-full" size="lg">
              <FileText className="h-4 w-4 mr-2" />
              {dictionary.convert}
            </Button>
          </div>
        )}

        {/* Converting Progress */}
        {isConverting && progress && (
          <div className="text-center py-8">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">
              {progress.stage === "extracting"
                ? `${dictionary.extracting} - ${dictionary.page} ${progress.currentPage} ${dictionary.of} ${progress.totalPages}`
                : dictionary.generating}
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    progress.stage === "generating"
                      ? 100
                      : (progress.currentPage / progress.totalPages) * 90
                  }%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Result */}
        {resultBlob && (
          <div className="space-y-4">
            <div className="text-center p-6 rounded-xl border bg-green-500/5 border-green-500/20">
              <FileText className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-3" />
              <p className="text-lg font-semibold text-green-700 dark:text-green-300 mb-1">
                {dictionary.done}
              </p>
              <p className="text-sm text-muted-foreground">
                {file?.name ? getFileBaseName(file.name) + ".docx" : "document.docx"} ({(resultBlob.size / 1024).toFixed(1)} KB)
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1" size="lg">
                <Download className="h-4 w-4 mr-2" />
                {dictionary.download}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                {dictionary.newFile}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
