"use client";

import { useState, useEffect, useCallback } from "react";
import { Dices, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generateRandomNumber,
  validateRange,
  DEFAULT_MIN,
  DEFAULT_MAX,
} from "@/lib/random-number";

interface NumberGeneratorProps {
  dictionary: {
    min: string;
    max: string;
    result: string;
    generate: string;
    copy: string;
    copied: string;
  };
}

export function NumberGenerator({ dictionary }: NumberGeneratorProps) {
  const [min, setMin] = useState(DEFAULT_MIN);
  const [max, setMax] = useState(DEFAULT_MAX);
  const [result, setResult] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(() => {
    const validation = validateRange(min, max);
    if (!validation.valid) {
      setError(validation.error || "Nieprawidłowy zakres");
      return;
    }
    
    setError(null);
    setIsAnimating(true);
    
    // Animate through random numbers
    let count = 0;
    const interval = setInterval(() => {
      setResult(generateRandomNumber(min, max));
      count++;
      if (count >= 10) {
        clearInterval(interval);
        setIsAnimating(false);
        setResult(generateRandomNumber(min, max));
      }
    }, 50);
  }, [min, max]);

  // Generate on mount
  useEffect(() => {
    generate();
  }, []);

  const handleCopy = async () => {
    if (result === null) return;
    try {
      await navigator.clipboard.writeText(result.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Nie udało się skopiować:", err);
    }
  };

  const handleMinChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setMin(num);
    } else if (value === "" || value === "-") {
      setMin(0);
    }
  };

  const handleMaxChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setMax(num);
    } else if (value === "" || value === "-") {
      setMax(0);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Dices className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Losuj Liczbę</CardTitle>
        <CardDescription>
          Generuj losową liczbę w wybranym zakresie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Min/Max Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min">{dictionary.min}</Label>
            <Input
              id="min"
              type="number"
              value={min}
              onChange={(e) => handleMinChange(e.target.value)}
              className="text-center"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max">{dictionary.max}</Label>
            <Input
              id="max"
              type="number"
              value={max}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="text-center"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* Result Display */}
        <div className="space-y-2">
          <Label className="text-center block">{dictionary.result}</Label>
          <div className="relative">
            <div
              className={`rounded-lg border-2 border-primary bg-muted p-8 text-center font-mono text-5xl font-bold transition-all ${
                isAnimating ? "animate-pulse" : ""
              }`}
            >
              {result !== null ? result : "?"}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleCopy}
              disabled={result === null}
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

        {/* Generate Button */}
        <Button
          onClick={generate}
          className="w-full gap-2"
          disabled={isAnimating}
        >
          <RefreshCw className={`h-4 w-4 ${isAnimating ? "animate-spin" : ""}`} />
          {dictionary.generate}
        </Button>
      </CardContent>
    </Card>
  );
}
