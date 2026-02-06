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
import { Switch } from "@/components/ui/switch";
import {
  generateMultipleNumbers,
  validateRange,
  validateCount,
  DEFAULT_MIN,
  DEFAULT_MAX,
  DEFAULT_COUNT,
} from "@/lib/random-number";

interface NumbersGeneratorProps {
  dictionary: {
    min: string;
    max: string;
    count: string;
    unique: string;
    sorted: string;
    results: string;
    generate: string;
    copyAll: string;
    copy: string;
    copied: string;
  };
}

export function NumbersGenerator({ dictionary }: NumbersGeneratorProps) {
  const [min, setMin] = useState(DEFAULT_MIN);
  const [max, setMax] = useState(DEFAULT_MAX);
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [unique, setUnique] = useState(true);
  const [sorted, setSorted] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(() => {
    // Validate range
    const rangeValidation = validateRange(min, max);
    if (!rangeValidation.valid) {
      setError(rangeValidation.error || "Nieprawidłowy zakres");
      return;
    }

    // Validate count
    const countValidation = validateCount(count, min, max, unique);
    if (!countValidation.valid) {
      setError(countValidation.error || "Nieprawidłowa ilość");
      return;
    }

    setError(null);
    setIsAnimating(true);

    // Animate through random numbers
    let animCount = 0;
    const interval = setInterval(() => {
      setResults(generateMultipleNumbers(min, max, count, unique, sorted));
      animCount++;
      if (animCount >= 8) {
        clearInterval(interval);
        setIsAnimating(false);
        setResults(generateMultipleNumbers(min, max, count, unique, sorted));
      }
    }, 60);
  }, [min, max, count, unique, sorted]);

  // Generate on mount
  useEffect(() => {
    generate();
  }, []);

  const handleCopyAll = async () => {
    if (results.length === 0) return;
    try {
      await navigator.clipboard.writeText(results.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Nie udało się skopiować:", err);
    }
  };

  const handleNumberChange = (
    value: string,
    setter: (n: number) => void
  ) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setter(num);
    } else if (value === "" || value === "-") {
      setter(0);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Dices className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Losuj Liczby</CardTitle>
        <CardDescription>
          Generuj wiele losowych liczb naraz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Min/Max/Count Inputs */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="min">{dictionary.min}</Label>
            <Input
              id="min"
              type="number"
              value={min}
              onChange={(e) => handleNumberChange(e.target.value, setMin)}
              className="text-center"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max">{dictionary.max}</Label>
            <Input
              id="max"
              type="number"
              value={max}
              onChange={(e) => handleNumberChange(e.target.value, setMax)}
              className="text-center"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="count">{dictionary.count}</Label>
            <Input
              id="count"
              type="number"
              value={count}
              onChange={(e) => handleNumberChange(e.target.value, setCount)}
              className="text-center"
              min={1}
              max={1000}
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <Label htmlFor="unique" className="cursor-pointer">
              {dictionary.unique}
            </Label>
            <Switch
              id="unique"
              checked={unique}
              onCheckedChange={setUnique}
            />
          </div>
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <Label htmlFor="sorted" className="cursor-pointer">
              {dictionary.sorted}
            </Label>
            <Switch
              id="sorted"
              checked={sorted}
              onCheckedChange={setSorted}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* Results Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{dictionary.results}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAll}
              disabled={results.length === 0}
              className="gap-1 h-8"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-green-500" />
                  {dictionary.copied}
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  {dictionary.copyAll}
                </>
              )}
            </Button>
          </div>
          <div
            className={`rounded-lg border-2 border-primary bg-muted p-4 min-h-[100px] transition-all ${
              isAnimating ? "animate-pulse" : ""
            }`}
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {results.map((num, index) => (
                <span
                  key={index}
                  className="inline-flex items-center justify-center min-w-[3rem] px-3 py-2 bg-background border rounded-md font-mono text-lg font-semibold"
                >
                  {num}
                </span>
              ))}
            </div>
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
