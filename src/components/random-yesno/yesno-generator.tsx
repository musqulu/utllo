"use client";

import { useState, useCallback } from "react";
import { HelpCircle, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
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

interface YesNoGeneratorProps {
  dictionary: {
    yes: string;
    no: string;
    askQuestion: string;
    questionPlaceholder: string;
    generate: string;
    result: string;
    tryAgain: string;
  };
}

type Answer = "yes" | "no" | null;

function generateYesNo(): Answer {
  // Use crypto for better randomness
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % 2 === 0 ? "yes" : "no";
  }
  return Math.random() < 0.5 ? "yes" : "no";
}

export function YesNoGenerator({ dictionary }: YesNoGeneratorProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<Answer>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const generate = useCallback(() => {
    setShowResult(false);
    setIsAnimating(true);
    setAnswer(null);

    // Animate through yes/no
    let count = 0;
    const interval = setInterval(() => {
      setAnswer(generateYesNo());
      count++;
      if (count >= 12) {
        clearInterval(interval);
        setIsAnimating(false);
        const finalAnswer = generateYesNo();
        setAnswer(finalAnswer);
        setShowResult(true);
      }
    }, 100);
  }, []);

  const getAnswerStyles = () => {
    if (!answer || isAnimating) {
      return "bg-muted text-muted-foreground";
    }
    if (answer === "yes") {
      return "bg-green-500 text-white";
    }
    return "bg-red-500 text-white";
  };

  const getAnswerIcon = () => {
    if (!answer || isAnimating) {
      return <HelpCircle className="h-16 w-16" />;
    }
    if (answer === "yes") {
      return <ThumbsUp className="h-16 w-16" />;
    }
    return <ThumbsDown className="h-16 w-16" />;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Losuj Tak/Nie</CardTitle>
        <CardDescription>
          Pozwól losowi podjąć decyzję za Ciebie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Input */}
        <div className="space-y-2">
          <Label htmlFor="question">{dictionary.askQuestion}</Label>
          <Input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={dictionary.questionPlaceholder}
            className="text-center"
          />
        </div>

        {/* Display question if entered */}
        {question && showResult && (
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground italic">
              &quot;{question}&quot;
            </p>
          </div>
        )}

        {/* Result Display */}
        <div className="space-y-2">
          {(answer || isAnimating) && (
            <Label className="text-center block">{dictionary.result}</Label>
          )}
          <div
            className={`rounded-xl p-8 transition-all duration-300 ${getAnswerStyles()} ${
              isAnimating ? "animate-pulse scale-95" : showResult ? "scale-100" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              {getAnswerIcon()}
              <span className="text-4xl font-bold tracking-wider">
                {answer === "yes"
                  ? dictionary.yes
                  : answer === "no"
                  ? dictionary.no
                  : "?"}
              </span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generate}
          className="w-full gap-2"
          size="lg"
          disabled={isAnimating}
        >
          <RefreshCw className={`h-4 w-4 ${isAnimating ? "animate-spin" : ""}`} />
          {showResult ? dictionary.tryAgain : dictionary.generate}
        </Button>
      </CardContent>
    </Card>
  );
}
