"use client";

import { useState, useCallback } from "react";
import { Cat, RotateCcw } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics";
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
  CatLifeStage,
  CatYearsResult,
  calculateCatYears,
  CAT_LIFE_EXPECTANCY,
} from "@/lib/calculators";

interface CatYearsCalculatorDictionary {
  title: string;
  subtitle: string;
  catAge: string;
  calculate: string;
  clear: string;
  humanYears: string;
  lifeStage: string;
  result: string;
  lifeExpectancy: string;
  indoor: string;
  outdoor: string;
  kitten: string;
  junior: string;
  adult: string;
  mature: string;
  senior: string;
  geriatric: string;
}

interface CatYearsCalculatorProps {
  dictionary: CatYearsCalculatorDictionary;
}

const LIFE_STAGE_COLORS: Record<CatLifeStage, string> = {
  kitten: "bg-pink-500/10 border-pink-500/30 text-pink-700 dark:text-pink-400",
  junior: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
  adult: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
  mature: "bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-400",
  senior: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
  geriatric: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400",
};

export function CatYearsCalculator({ dictionary }: CatYearsCalculatorProps) {
  const [catAge, setCatAge] = useState("3");
  const [result, setResult] = useState<CatYearsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lifeStageLabels: Record<CatLifeStage, string> = {
    kitten: dictionary.kitten,
    junior: dictionary.junior,
    adult: dictionary.adult,
    mature: dictionary.mature,
    senior: dictionary.senior,
    geriatric: dictionary.geriatric,
  };

  const handleCalculate = useCallback(() => {
    const age = parseFloat(catAge);
    if (isNaN(age) || age < 0 || age > 30) {
      setError("Wiek kota musi być między 0 a 30 lat");
      setResult(null);
      return;
    }

    const calcResult = calculateCatYears(age);
    setResult(calcResult);
    setError(null);
    trackToolEvent("cat-years-calculator", "calculators", "use");
  }, [catAge]);

  const handleClear = useCallback(() => {
    setCatAge("3");
    setResult(null);
    setError(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleCalculate();
    },
    [handleCalculate]
  );

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Cat className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cat Age Input */}
        <div className="space-y-2">
          <Label htmlFor="cat-age">{dictionary.catAge}</Label>
          <Input
            id="cat-age"
            type="number"
            value={catAge}
            onChange={(e) => setCatAge(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="3"
            min="0"
            max="30"
            step="0.5"
            className="text-lg"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleCalculate} className="flex-1" size="lg">
            <Cat className="h-4 w-4 mr-2" />
            {dictionary.calculate}
          </Button>
          <Button variant="outline" onClick={handleClear} size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            {dictionary.clear}
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Main Result */}
            <div className="text-center p-6 rounded-xl border bg-muted/30">
              <p className="text-sm text-muted-foreground mb-2">
                {dictionary.humanYears}
              </p>
              <p className="text-5xl font-bold text-primary mb-1">
                {result.humanYears}
              </p>
              <p className="text-sm text-muted-foreground">
                {dictionary.result}
              </p>
            </div>

            {/* Life Stage */}
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-sm ${
                  LIFE_STAGE_COLORS[result.lifeStage]
                }`}
              >
                {dictionary.lifeStage}: {lifeStageLabels[result.lifeStage]}
              </span>
            </div>

            {/* Life Expectancy */}
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>
                {dictionary.lifeExpectancy} ({dictionary.indoor}): {CAT_LIFE_EXPECTANCY.indoor.min}-{CAT_LIFE_EXPECTANCY.indoor.max} lat
              </p>
              <p>
                {dictionary.lifeExpectancy} ({dictionary.outdoor}): {CAT_LIFE_EXPECTANCY.outdoor.min}-{CAT_LIFE_EXPECTANCY.outdoor.max} lat
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
