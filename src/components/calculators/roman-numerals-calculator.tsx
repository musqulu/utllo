"use client";

import { useState, useCallback, useMemo } from "react";
import { Crown, Copy, Check, RotateCcw } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics";
import { toRoman, fromRoman, isValidRoman } from "@/lib/roman-numerals";
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

interface RomanNumeralsDictionary {
  title: string;
  subtitle: string;
  arabicToRoman: string;
  romanToArabic: string;
  inputArabic: string;
  inputRoman: string;
  placeholderArabic: string;
  placeholderRoman: string;
  result: string;
  copy: string;
  copied: string;
  clear: string;
  invalidNumber: string;
  invalidRoman: string;
  referenceTable: string;
}

interface RomanNumeralsCalculatorProps {
  dictionary: RomanNumeralsDictionary;
}

const REFERENCE = [
  { arabic: 1, roman: "I" },
  { arabic: 4, roman: "IV" },
  { arabic: 5, roman: "V" },
  { arabic: 9, roman: "IX" },
  { arabic: 10, roman: "X" },
  { arabic: 40, roman: "XL" },
  { arabic: 50, roman: "L" },
  { arabic: 90, roman: "XC" },
  { arabic: 100, roman: "C" },
  { arabic: 400, roman: "CD" },
  { arabic: 500, roman: "D" },
  { arabic: 900, roman: "CM" },
  { arabic: 1000, roman: "M" },
];

export function RomanNumeralsCalculator({ dictionary }: RomanNumeralsCalculatorProps) {
  const [mode, setMode] = useState<"toRoman" | "toArabic">("toRoman");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: "", error: "" };

    if (mode === "toRoman") {
      const num = parseInt(input.trim(), 10);
      if (isNaN(num) || num < 1 || num > 3999) {
        return { result: "", error: dictionary.invalidNumber };
      }
      return { result: toRoman(num), error: "" };
    } else {
      const upper = input.trim().toUpperCase();
      if (!isValidRoman(upper)) {
        return { result: "", error: dictionary.invalidRoman };
      }
      return { result: String(fromRoman(upper)), error: "" };
    }
  }, [input, mode, dictionary.invalidNumber, dictionary.invalidRoman]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackToolEvent("roman-numerals", "calculators", "copy");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setInput("");
    setCopied(false);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Crown className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === "toRoman" ? "default" : "outline"}
            size="sm"
            onClick={() => { setMode("toRoman"); setInput(""); }}
            className="flex-1"
          >
            {dictionary.arabicToRoman}
          </Button>
          <Button
            variant={mode === "toArabic" ? "default" : "outline"}
            size="sm"
            onClick={() => { setMode("toArabic"); setInput(""); }}
            className="flex-1"
          >
            {dictionary.romanToArabic}
          </Button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <Label htmlFor="roman-input">
            {mode === "toRoman" ? dictionary.inputArabic : dictionary.inputRoman}
          </Label>
          <Input
            id="roman-input"
            type="text"
            inputMode={mode === "toRoman" ? "numeric" : "text"}
            value={input}
            onChange={(e) => setInput(mode === "toArabic" ? e.target.value.toUpperCase() : e.target.value)}
            placeholder={mode === "toRoman" ? dictionary.placeholderArabic : dictionary.placeholderRoman}
            className="text-lg"
          />
        </div>

        {/* Error */}
        {error && input.trim() && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-3">
            <Label>{dictionary.result}</Label>
            <div className="p-4 rounded-xl border bg-muted/50 text-center">
              <p className="text-3xl font-bold tracking-wider">{result}</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    {dictionary.copied}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {dictionary.copy}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="h-4 w-4 mr-2" />
                {dictionary.clear}
              </Button>
            </div>
          </div>
        )}

        {/* Reference Table */}
        <div className="space-y-2">
          <Label>{dictionary.referenceTable}</Label>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {REFERENCE.map((item) => (
              <button
                key={item.arabic}
                onClick={() => {
                  if (mode === "toRoman") {
                    setInput(String(item.arabic));
                  } else {
                    setInput(item.roman);
                  }
                }}
                className="p-2 rounded-lg border bg-muted/30 hover:bg-muted transition-colors text-center cursor-pointer"
              >
                <span className="block text-xs text-muted-foreground">{item.arabic}</span>
                <span className="block font-semibold text-sm">{item.roman}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
