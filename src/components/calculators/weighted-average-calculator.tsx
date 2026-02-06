"use client";

import { useState, useCallback, useMemo } from "react";
import { Sigma, Plus, Trash2, Copy, Check, RotateCcw, Sparkles } from "lucide-react";
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
  WeightedValue,
  calculateWeightedAverage,
  validateWeightedAverageEntries,
  createEmptyEntry,
  formatWeightedAverage,
  EXAMPLE_GRADES,
} from "@/lib/calculators";

interface WeightedAverageDictionary {
  title: string;
  subtitle: string;
  value: string;
  weight: string;
  addRow: string;
  removeRow: string;
  calculate: string;
  result: string;
  sumOfWeights: string;
  clear: string;
  copy: string;
  example: string;
  loadExample: string;
}

interface WeightedAverageCalculatorProps {
  dictionary: WeightedAverageDictionary;
}

export function WeightedAverageCalculator({ dictionary }: WeightedAverageCalculatorProps) {
  const [entries, setEntries] = useState<WeightedValue[]>([
    createEmptyEntry(),
    createEmptyEntry(),
    createEmptyEntry(),
  ]);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const validation = validateWeightedAverageEntries(entries);
    if (!validation.valid) return null;
    return calculateWeightedAverage(entries);
  }, [entries]);

  const handleValueChange = useCallback((id: string, value: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, value: value === "" ? "" : parseFloat(value) || "" }
          : entry
      )
    );
  }, []);

  const handleWeightChange = useCallback((id: string, weight: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, weight: weight === "" ? "" : parseFloat(weight) || "" }
          : entry
      )
    );
  }, []);

  const handleAddRow = useCallback(() => {
    setEntries((prev) => [...prev, createEmptyEntry()]);
  }, []);

  const handleRemoveRow = useCallback((id: string) => {
    setEntries((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((entry) => entry.id !== id);
    });
  }, []);

  const handleClear = useCallback(() => {
    setEntries([createEmptyEntry(), createEmptyEntry(), createEmptyEntry()]);
  }, []);

  const handleLoadExample = useCallback(() => {
    setEntries(EXAMPLE_GRADES.map((e) => ({ ...e, id: createEmptyEntry().id })));
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(formatWeightedAverage(result.average));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [result]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sigma className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{dictionary.title}</CardTitle>
            <CardDescription>{dictionary.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Rows */}
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_40px] gap-2 text-sm font-medium text-muted-foreground">
            <span>{dictionary.value}</span>
            <span>{dictionary.weight}</span>
            <span></span>
          </div>

          {/* Entries */}
          {entries.map((entry, index) => (
            <div key={entry.id} className="grid grid-cols-[1fr_1fr_40px] gap-2 items-center">
              <Input
                type="number"
                step="any"
                placeholder={`${dictionary.value} ${index + 1}`}
                value={entry.value}
                onChange={(e) => handleValueChange(entry.id, e.target.value)}
                className="text-center"
              />
              <Input
                type="number"
                step="any"
                min="0"
                placeholder={`${dictionary.weight}`}
                value={entry.weight}
                onChange={(e) => handleWeightChange(entry.id, e.target.value)}
                className="text-center"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveRow(entry.id)}
                disabled={entries.length <= 1}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Row Button */}
        <Button
          variant="outline"
          onClick={handleAddRow}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {dictionary.addRow}
        </Button>

        {/* Result */}
        {result && (
          <div className="p-6 rounded-lg bg-primary/10 text-center space-y-2">
            <p className="text-sm text-muted-foreground">{dictionary.result}</p>
            <p className="text-4xl font-bold text-primary">
              {formatWeightedAverage(result.average)}
            </p>
            <p className="text-sm text-muted-foreground">
              {dictionary.sumOfWeights}: {result.sumOfWeights}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!result}
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Skopiowano!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                {dictionary.copy}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleLoadExample}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {dictionary.loadExample}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {dictionary.clear}
          </Button>
        </div>

        {/* Formula Info */}
        <div className="p-4 rounded-lg bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground mb-2">Wzór na średnią ważoną:</p>
          <p className="font-mono text-sm">
            x̄ = Σ(wartość × waga) / Σ(waga)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
