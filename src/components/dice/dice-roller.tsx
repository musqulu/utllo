"use client";

import { useState, useCallback, useMemo } from "react";
import { Dices, RotateCcw, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface DiceRollerDictionary {
  title: string;
  subtitle: string;
  roll: string;
  rolling: string;
  result: string;
  total: string;
  numberOfDice: string;
  diceType: string;
  history: string;
  clearHistory: string;
  sides: string;
  average: string;
  min: string;
  max: string;
}

interface DiceRollerProps {
  dictionary: DiceRollerDictionary;
}

interface RollResult {
  id: string;
  dice: number[];
  total: number;
  diceCount: number;
  diceType: number;
  timestamp: Date;
}

const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];

// Visual dice face for D6
function DiceFace({ value, size = "large" }: { value: number; size?: "large" | "small" }) {
  const dotSize = size === "large" ? "w-3 h-3" : "w-1.5 h-1.5";
  const containerSize = size === "large" ? "w-16 h-16" : "w-8 h-8";
  const gap = size === "large" ? "gap-1" : "gap-0.5";

  const dotPositions: Record<number, string[]> = {
    1: ["col-start-2 row-start-2"],
    2: ["col-start-1 row-start-1", "col-start-3 row-start-3"],
    3: ["col-start-1 row-start-1", "col-start-2 row-start-2", "col-start-3 row-start-3"],
    4: ["col-start-1 row-start-1", "col-start-3 row-start-1", "col-start-1 row-start-3", "col-start-3 row-start-3"],
    5: ["col-start-1 row-start-1", "col-start-3 row-start-1", "col-start-2 row-start-2", "col-start-1 row-start-3", "col-start-3 row-start-3"],
    6: ["col-start-1 row-start-1", "col-start-3 row-start-1", "col-start-1 row-start-2", "col-start-3 row-start-2", "col-start-1 row-start-3", "col-start-3 row-start-3"],
  };

  return (
    <div className={`${containerSize} bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md p-1.5 grid grid-cols-3 grid-rows-3 ${gap}`}>
      {dotPositions[value]?.map((pos, i) => (
        <div key={i} className={`${dotSize} ${pos} rounded-full bg-primary justify-self-center self-center`} />
      ))}
    </div>
  );
}

// Generic dice display for non-D6
function GenericDice({ value, sides, size = "large" }: { value: number; sides: number; size?: "large" | "small" }) {
  const containerSize = size === "large" ? "w-16 h-16" : "w-8 h-8";
  const fontSize = size === "large" ? "text-xl" : "text-xs";

  return (
    <div className={`${containerSize} bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md flex items-center justify-center`}>
      <span className={`${fontSize} font-bold text-primary`}>{value}</span>
    </div>
  );
}

export function DiceRoller({ dictionary }: DiceRollerProps) {
  const [diceCount, setDiceCount] = useState(1);
  const [diceType, setDiceType] = useState(6);
  const [currentRoll, setCurrentRoll] = useState<number[] | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<RollResult[]>([]);

  const rollDice = useCallback(() => {
    setIsRolling(true);

    // Animation: show random values quickly
    let animationCount = 0;
    const animationInterval = setInterval(() => {
      const tempRoll = Array.from({ length: diceCount }, () =>
        Math.floor(Math.random() * diceType) + 1
      );
      setCurrentRoll(tempRoll);
      animationCount++;

      if (animationCount >= 10) {
        clearInterval(animationInterval);

        // Final roll
        const finalRoll = Array.from({ length: diceCount }, () =>
          Math.floor(Math.random() * diceType) + 1
        );
        setCurrentRoll(finalRoll);
        setIsRolling(false);

        // Add to history
        const result: RollResult = {
          id: Math.random().toString(36).substring(2, 9),
          dice: finalRoll,
          total: finalRoll.reduce((a, b) => a + b, 0),
          diceCount,
          diceType,
          timestamp: new Date(),
        };
        setHistory((prev) => [result, ...prev.slice(0, 19)]);
      }
    }, 50);
  }, [diceCount, diceType]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const total = useMemo(() => {
    if (!currentRoll) return 0;
    return currentRoll.reduce((a, b) => a + b, 0);
  }, [currentRoll]);

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const allTotals = history.map((r) => r.total);
    return {
      average: (allTotals.reduce((a, b) => a + b, 0) / allTotals.length).toFixed(1),
      min: Math.min(...allTotals),
      max: Math.max(...allTotals),
    };
  }, [history]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Dices className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{dictionary.title}</CardTitle>
            <CardDescription>{dictionary.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dice Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{dictionary.numberOfDice}: {diceCount}</Label>
            <Slider
              value={[diceCount]}
              onValueChange={(value) => setDiceCount(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>{dictionary.diceType}</Label>
            <Select
              value={diceType.toString()}
              onValueChange={(value) => setDiceType(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DICE_TYPES.map((type) => (
                  <SelectItem key={type} value={type.toString()}>
                    D{type} ({type} {dictionary.sides})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Roll Button */}
        <Button
          onClick={rollDice}
          disabled={isRolling}
          size="lg"
          className="w-full text-lg py-6"
        >
          <Dices className={`h-5 w-5 mr-2 ${isRolling ? "animate-spin" : ""}`} />
          {isRolling ? dictionary.rolling : dictionary.roll}
        </Button>

        {/* Current Roll Display */}
        {currentRoll && (
          <div className="p-6 rounded-lg bg-muted/50 space-y-4">
            <div className="flex flex-wrap justify-center gap-3">
              {currentRoll.map((value, index) => (
                <div
                  key={index}
                  className={`transition-transform ${isRolling ? "animate-bounce" : ""}`}
                >
                  {diceType === 6 ? (
                    <DiceFace value={value} />
                  ) : (
                    <GenericDice value={value} sides={diceType} />
                  )}
                </div>
              ))}
            </div>
            {currentRoll.length > 1 && (
              <div className="text-center">
                <span className="text-sm text-muted-foreground">{dictionary.total}: </span>
                <span className="text-3xl font-bold text-primary">{total}</span>
              </div>
            )}
            {currentRoll.length === 1 && (
              <div className="text-center">
                <span className="text-sm text-muted-foreground">{dictionary.result}: </span>
                <span className="text-3xl font-bold text-primary">{currentRoll[0]}</span>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <History className="h-4 w-4" />
                {dictionary.history}
              </div>
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                <Trash2 className="h-4 w-4 mr-1" />
                {dictionary.clearHistory}
              </Button>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 rounded bg-muted">
                  <div className="text-muted-foreground">{dictionary.average}</div>
                  <div className="font-bold">{stats.average}</div>
                </div>
                <div className="p-2 rounded bg-muted">
                  <div className="text-muted-foreground">{dictionary.min}</div>
                  <div className="font-bold">{stats.min}</div>
                </div>
                <div className="p-2 rounded bg-muted">
                  <div className="text-muted-foreground">{dictionary.max}</div>
                  <div className="font-bold">{stats.max}</div>
                </div>
              </div>
            )}

            {/* History List */}
            <div className="max-h-40 overflow-y-auto space-y-1">
              {history.map((roll) => (
                <div
                  key={roll.id}
                  className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm"
                >
                  <span className="text-muted-foreground">
                    {roll.diceCount}×D{roll.diceType}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      [{roll.dice.join(", ")}]
                    </span>
                    <span className="font-bold">= {roll.total}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
