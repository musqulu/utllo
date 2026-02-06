"use client";

import { useState, useCallback } from "react";
import { Calculator, Copy, Check, RotateCcw } from "lucide-react";
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
import { solveProportion, validateProportionInputs } from "@/lib/calculators";

interface ProportionCalculatorDictionary {
  title: string;
  subtitle: string;
  valueA: string;
  valueB: string;
  valueC: string;
  valueX: string;
  calculate: string;
  result: string;
  formula: string;
  copy: string;
  clear: string;
}

interface ProportionCalculatorProps {
  dictionary: ProportionCalculatorDictionary;
}

export function ProportionCalculator({ dictionary }: ProportionCalculatorProps) {
  const [valueA, setValueA] = useState("");
  const [valueB, setValueB] = useState("");
  const [valueC, setValueC] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = useCallback(() => {
    const a = parseFloat(valueA);
    const b = parseFloat(valueB);
    const c = parseFloat(valueC);

    const validation = validateProportionInputs(a, b, c);
    if (!validation.valid) {
      setError(validation.error || "Nieprawidłowe dane");
      setResult(null);
      return;
    }

    try {
      const x = solveProportion(a, b, c);
      setResult(x);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    }
  }, [valueA, valueB, valueC]);

  const handleClear = useCallback(() => {
    setValueA("");
    setValueB("");
    setValueC("");
    setResult(null);
    setError(null);
  }, []);

  const handleCopy = useCallback(async () => {
    if (result !== null) {
      await navigator.clipboard.writeText(result.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCalculate();
      }
    },
    [handleCalculate]
  );

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formula Display */}
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground font-mono">
            {dictionary.formula}
          </p>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="valueA">{dictionary.valueA}</Label>
            <Input
              id="valueA"
              type="number"
              placeholder="np. 2"
              value={valueA}
              onChange={(e) => setValueA(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valueB">{dictionary.valueB}</Label>
            <Input
              id="valueB"
              type="number"
              placeholder="np. 4"
              value={valueB}
              onChange={(e) => setValueB(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valueC">{dictionary.valueC}</Label>
            <Input
              id="valueC"
              type="number"
              placeholder="np. 6"
              value={valueC}
              onChange={(e) => setValueC(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valueX">{dictionary.valueX}</Label>
            <div className="relative">
              <Input
                id="valueX"
                type="text"
                value={result !== null ? result.toFixed(4).replace(/\.?0+$/, "") : ""}
                readOnly
                className="bg-muted font-bold text-lg pr-10"
                placeholder="?"
              />
              {result !== null && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Visual Proportion */}
        <div className="flex items-center justify-center gap-2 text-lg font-mono">
          <span className="px-3 py-1 bg-primary/10 rounded">{valueA || "A"}</span>
          <span>:</span>
          <span className="px-3 py-1 bg-primary/10 rounded">{valueB || "B"}</span>
          <span>=</span>
          <span className="px-3 py-1 bg-primary/10 rounded">{valueC || "C"}</span>
          <span>:</span>
          <span className="px-3 py-1 bg-primary text-primary-foreground rounded font-bold">
            {result !== null ? result.toFixed(2).replace(/\.?0+$/, "") : "X"}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleCalculate} className="flex-1" size="lg">
            <Calculator className="h-4 w-4 mr-2" />
            {dictionary.calculate}
          </Button>
          <Button variant="outline" onClick={handleClear} size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            {dictionary.clear}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
