"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordDisplayProps {
  password: string;
  onRegenerate: () => void;
}

export function PasswordDisplay({ password, onRegenerate }: PasswordDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Nie udało się skopiować hasła:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-lg border bg-muted p-4 font-mono text-lg break-all">
          {password}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          title={copied ? "Skopiowano!" : "Kopiuj do schowka"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <Button onClick={onRegenerate} className="w-full gap-2">
        <RefreshCw className="h-4 w-4" />
        Generuj Nowe Hasło
      </Button>
    </div>
  );
}
