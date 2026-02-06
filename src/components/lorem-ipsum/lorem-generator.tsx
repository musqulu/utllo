"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  generateLorem,
  LoremType,
  LOREM_LIMITS,
} from "@/lib/lorem";

interface LoremGeneratorProps {
  dictionary: {
    paragraphs: string;
    sentences: string;
    words: string;
    count: string;
    generate: string;
    copy: string;
    copied: string;
  };
}

export function LoremGenerator({ dictionary }: LoremGeneratorProps) {
  const [type, setType] = useState<LoremType>("paragraphs");
  const [count, setCount] = useState<number>(LOREM_LIMITS.paragraphs.default);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const limits = LOREM_LIMITS[type];

  const regenerate = useCallback(() => {
    const newText = generateLorem({ type, count });
    setText(newText);
  }, [type, count]);

  // Generate on mount and when options change
  useEffect(() => {
    regenerate();
  }, [regenerate]);

  // Reset count when type changes
  useEffect(() => {
    setCount(LOREM_LIMITS[type].default);
  }, [type]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Nie udało się skopiować tekstu:", err);
    }
  };

  const getTypeLabel = (t: LoremType) => {
    switch (t) {
      case "paragraphs":
        return dictionary.paragraphs;
      case "sentences":
        return dictionary.sentences;
      case "words":
        return dictionary.words;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Lorem Ipsum</CardTitle>
        <CardDescription>
          Generuj tekst zastępczy do swoich projektów
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type Selection */}
        <div className="space-y-2">
          <Label>Typ tekstu</Label>
          <Tabs value={type} onValueChange={(v) => setType(v as LoremType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="paragraphs">
                {dictionary.paragraphs}
              </TabsTrigger>
              <TabsTrigger value="sentences">
                {dictionary.sentences}
              </TabsTrigger>
              <TabsTrigger value="words">
                {dictionary.words}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Count Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>{dictionary.count}</Label>
            <span className="text-sm font-medium">
              {count} {getTypeLabel(type).toLowerCase()}
            </span>
          </div>
          <Slider
            min={limits.min}
            max={limits.max}
            step={1}
            value={[count]}
            onValueChange={([value]) => setCount(value)}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="relative">
            <div className="rounded-lg border bg-muted p-4 max-h-80 overflow-y-auto whitespace-pre-wrap text-sm">
              {text}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleCopy}
              title={copied ? dictionary.copied : dictionary.copy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Regenerate Button */}
        <Button onClick={regenerate} className="w-full gap-2">
          <RefreshCw className="h-4 w-4" />
          {dictionary.generate}
        </Button>
      </CardContent>
    </Card>
  );
}
