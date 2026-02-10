"use client";

import { useState, useCallback, useMemo } from "react";
import { Lock, Copy, Check, RotateCcw } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics";
import { caesarEncrypt, caesarDecrypt } from "@/lib/caesar-cipher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CaesarCipherDictionary {
  title: string;
  subtitle: string;
  inputLabel: string;
  inputPlaceholder: string;
  result: string;
  shift: string;
  encrypt: string;
  decrypt: string;
  copy: string;
  copied: string;
  clear: string;
}

interface CaesarCipherProps {
  dictionary: CaesarCipherDictionary;
}

export function CaesarCipher({ dictionary }: CaesarCipherProps) {
  const [text, setText] = useState("");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!text.trim()) return "";
    return mode === "encrypt"
      ? caesarEncrypt(text, shift)
      : caesarDecrypt(text, shift);
  }, [text, shift, mode]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackToolEvent("caesar-cipher", "tools", "copy");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setText("");
    setCopied(false);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Lock className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === "encrypt" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("encrypt")}
            className="flex-1"
          >
            {dictionary.encrypt}
          </Button>
          <Button
            variant={mode === "decrypt" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("decrypt")}
            className="flex-1"
          >
            {dictionary.decrypt}
          </Button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <Label htmlFor="caesar-input">{dictionary.inputLabel}</Label>
          <textarea
            id="caesar-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={dictionary.inputPlaceholder}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
        </div>

        {/* Shift Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>{dictionary.shift}</Label>
            <span className="text-2xl font-bold text-primary tabular-nums">
              {shift}
            </span>
          </div>
          <Slider
            value={[shift]}
            onValueChange={(val) => setShift(val[0])}
            min={1}
            max={25}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>13 (ROT13)</span>
            <span>25</span>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-3">
            <Label>{dictionary.result}</Label>
            <div className="p-4 rounded-xl border bg-muted/50 min-h-[60px]">
              <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
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
