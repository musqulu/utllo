"use client";

import { useState, useCallback, useRef } from "react";
import { FileUp, Download, Image, Loader2, X, FileImage } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ImageFormat,
  ConvertedPage,
  ConversionProgress,
  convertPdfToImages,
  createImagesZip,
  downloadPage,
  downloadFile,
  validatePdfFile,
  getFileBaseName,
  SCALE_OPTIONS,
  QUALITY_OPTIONS,
} from "@/lib/pdf-converter";

interface PdfConverterDictionary {
  uploadTitle: string;
  uploadDescription: string;
  dropHere: string;
  selectFile: string;
  orDragDrop: string;
  maxSize: string;
  quality?: string;
  scale: string;
  processing: string;
  page: string;
  downloadPage: string;
  downloadAll: string;
  converting: string;
  of: string;
  newFile: string;
}

interface PdfConverterProps {
  format: ImageFormat;
  dictionary: PdfConverterDictionary;
}

export function PdfConverter({ format, dictionary }: PdfConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ConvertedPage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<ConversionProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(0.92);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    const validation = validatePdfFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || "Nieprawidłowy plik");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setPages([]);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;

    setIsConverting(true);
    setError(null);
    setPages([]);

    try {
      const convertedPages = await convertPdfToImages(
        file,
        { format, scale, quality },
        setProgress
      );
      setPages(convertedPages);
      trackToolEvent(format === "jpg" ? "pdf-to-jpg" : "pdf-to-png", "converters", "use");
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Wystąpił błąd podczas konwersji. Spróbuj ponownie.");
    } finally {
      setIsConverting(false);
      setProgress(null);
    }
  }, [file, format, scale, quality]);

  const handleDownloadAll = useCallback(async () => {
    if (pages.length === 0 || !file) return;

    const baseName = getFileBaseName(file.name);
    const zipBlob = await createImagesZip(pages, format, baseName);
    downloadFile(zipBlob, `${baseName}-${format}.zip`);
  }, [pages, format, file]);

  const handleDownloadPage = useCallback(
    (page: ConvertedPage) => {
      if (!file) return;
      const baseName = getFileBaseName(file.name);
      downloadPage(page, format, baseName);
    },
    [format, file]
  );

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
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  const handleReset = useCallback(() => {
    setFile(null);
    setPages([]);
    setError(null);
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const formatLabel = format.toUpperCase();

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <FileImage className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{dictionary.uploadTitle}</CardTitle>
        <CardDescription>{dictionary.uploadDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                  {dictionary.orDragDrop}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dictionary.maxSize}
                </p>
              </>
            )}
          </div>
        )}

        {/* Selected File Info */}
        {file && !isConverting && pages.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Image className="h-8 w-8 text-primary" />
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

            {/* Options */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Scale */}
              <div className="space-y-2">
                <Label>{dictionary.scale}</Label>
                <div className="flex gap-2">
                  {SCALE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={scale === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setScale(option.value)}
                      className="flex-1"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quality (only for JPG) */}
              {format === "jpg" && dictionary.quality && (
                <div className="space-y-2">
                  <Label>{dictionary.quality}</Label>
                  <div className="flex gap-2 flex-wrap">
                    {QUALITY_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        variant={quality === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuality(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              className="w-full"
              size="lg"
            >
              Konwertuj na {formatLabel}
            </Button>
          </div>
        )}

        {/* Converting Progress */}
        {isConverting && progress && (
          <div className="text-center py-8">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">
              {dictionary.converting} {progress.currentPage} {dictionary.of}{" "}
              {progress.totalPages}...
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(progress.currentPage / progress.totalPages) * 100}%`,
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

        {/* Results */}
        {pages.length > 0 && (
          <div className="space-y-4">
            {/* Download All Button */}
            <div className="flex gap-2">
              <Button onClick={handleDownloadAll} className="flex-1" size="lg">
                <Download className="h-4 w-4 mr-2" />
                {dictionary.downloadAll}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                {dictionary.newFile}
              </Button>
            </div>

            {/* Page Previews */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <div
                  key={page.pageNumber}
                  className="border rounded-lg overflow-hidden bg-muted/50"
                >
                  <div className="aspect-[3/4] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.dataUrl}
                      alt={`${dictionary.page} ${page.pageNumber}`}
                      className="absolute inset-0 w-full h-full object-contain bg-white"
                    />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {dictionary.page} {page.pageNumber}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPage(page)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {formatLabel}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
