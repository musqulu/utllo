"use client";

import { useState, useCallback, useMemo } from "react";
import { CaseSensitive, Copy, Check, RotateCcw } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics";
import { numberToPolishWords, numberToPolishCurrency } from "@/lib/number-to-words";
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

interface AmountInWordsDictionary {
  title: string;
  subtitle: string;
  inputLabel: string;
  inputPlaceholder: string;
  result: string;
  copy: string;
  copied: string;
  clear: string;
  currency: string;
  numberOnly: string;
}

interface AmountInWordsProps {
  dictionary: AmountInWordsDictionary;
}

export function AmountInWords({ dictionary }: AmountInWordsProps) {
  const [input, setInput] = useState("");
  const [currencyMode, setCurrencyMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const cleaned = input.replace(/\s/g, "").replace(/,/g, ".");
    const num = parseFloat(cleaned);
    if (isNaN(num)) return "";
    if (Math.abs(num) > 999_999_999_999_999) return "";

    if (currencyMode) {
      return numberToPolishCurrency(num);
    }
    return numberToPolishWords(num);
  }, [input, currencyMode]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackToolEvent("amount-in-words", "tools", "copy");
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
            <CaseSensitive className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={currencyMode ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrencyMode(true)}
            className="flex-1"
          >
            {dictionary.currency}
          </Button>
          <Button
            variant={!currencyMode ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrencyMode(false)}
            className="flex-1"
          >
            {dictionary.numberOnly}
          </Button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <Label htmlFor="amount-input">{dictionary.inputLabel}</Label>
          <Input
            id="amount-input"
            type="text"
            inputMode="decimal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={dictionary.inputPlaceholder}
            className="text-lg"
          />
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-3">
            <Label>{dictionary.result}</Label>
            <div className="p-4 rounded-xl border bg-muted/50 min-h-[60px]">
              <p className="text-base leading-relaxed first-letter:uppercase">
                {result}
              </p>
            </div>

            {/* Actions */}
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
      </CardContent>
    </Card>
  );
}
