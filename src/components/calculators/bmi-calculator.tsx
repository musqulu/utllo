"use client";

import { useState, useCallback } from "react";
import { Scale, RotateCcw } from "lucide-react";
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
  calculateBMI,
  validateBMIInputs,
  getBMICategory,
  getBMICategoryColor,
  getBMICategoryBgColor,
  BMICategory,
  BMI_RANGES,
} from "@/lib/calculators";

interface BMICalculatorDictionary {
  title: string;
  subtitle: string;
  weight: string;
  height: string;
  calculate: string;
  result: string;
  category: string;
  underweight: string;
  normal: string;
  overweight: string;
  obese: string;
  severelyObese: string;
  morbidlyObese: string;
  clear: string;
}

interface BMICalculatorProps {
  dictionary: BMICalculatorDictionary;
}

export function BMICalculator({ dictionary }: BMICalculatorProps) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<BMICategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCategoryLabel = (cat: BMICategory): string => {
    const labels: Record<BMICategory, string> = {
      underweight: dictionary.underweight,
      normal: dictionary.normal,
      overweight: dictionary.overweight,
      obese: dictionary.obese,
      severelyObese: dictionary.severelyObese,
      morbidlyObese: dictionary.morbidlyObese,
    };
    return labels[cat];
  };

  const handleCalculate = useCallback(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    const validation = validateBMIInputs(w, h);
    if (!validation.valid) {
      setError(validation.error || "Nieprawidłowe dane");
      setBmi(null);
      setCategory(null);
      return;
    }

    try {
      const bmiValue = calculateBMI(w, h);
      const bmiCategory = getBMICategory(bmiValue);
      setBmi(bmiValue);
      setCategory(bmiCategory);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setBmi(null);
      setCategory(null);
    }
  }, [weight, height]);

  const handleClear = useCallback(() => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setCategory(null);
    setError(null);
  }, []);

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
          <Scale className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="weight">{dictionary.weight}</Label>
            <Input
              id="weight"
              type="number"
              placeholder="np. 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={handleKeyDown}
              min="1"
              max="500"
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">{dictionary.height}</Label>
            <Input
              id="height"
              type="number"
              placeholder="np. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onKeyDown={handleKeyDown}
              min="1"
              max="300"
              step="1"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex gap-3">
          <Button onClick={handleCalculate} className="flex-1" size="lg">
            <Scale className="h-4 w-4 mr-2" />
            {dictionary.calculate}
          </Button>
          <Button variant="outline" onClick={handleClear} size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            {dictionary.clear}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        {/* Result Display */}
        {bmi !== null && category !== null && (
          <div
            className={`p-6 rounded-lg text-center ${getBMICategoryBgColor(
              category
            )}`}
          >
            <p className="text-sm text-muted-foreground mb-2">
              {dictionary.result}
            </p>
            <p className={`text-5xl font-bold mb-2 ${getBMICategoryColor(category)}`}>
              {bmi.toFixed(1)}
            </p>
            <p className={`text-lg font-semibold ${getBMICategoryColor(category)}`}>
              {getCategoryLabel(category)}
            </p>
          </div>
        )}

        {/* BMI Reference Table */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground text-center">
            Kategorie BMI (WHO)
          </p>
          <div className="grid gap-1">
            {BMI_RANGES.map((range) => (
              <div
                key={range.category}
                className={`flex justify-between items-center px-3 py-2 rounded text-sm ${
                  category === range.category
                    ? getBMICategoryBgColor(range.category) + " font-medium"
                    : "bg-muted/50"
                }`}
              >
                <span>{range.label}</span>
                <span className="text-muted-foreground font-mono text-xs">
                  {range.max === Infinity
                    ? `≥ ${range.min}`
                    : `${range.min} - ${range.max}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
