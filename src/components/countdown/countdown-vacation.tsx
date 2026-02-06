"use client";

import { useState, useEffect } from "react";
import { Sun, Palmtree } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getTimeRemaining,
  getNextVacationDate,
  isVacationPeriod,
  formatDate,
  getVacationYear,
  TimeRemaining,
} from "@/lib/countdown";

interface CountdownVacationDictionary {
  title: string;
  subtitle: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  vacationStart: string;
  timeLeft: string;
  vacationStarted: string;
  enjoy: string;
}

interface CountdownVacationProps {
  dictionary: CountdownVacationDictionary;
}

export function CountdownVacation({ dictionary }: CountdownVacationProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isVacation, setIsVacation] = useState(false);
  const [vacationDate, setVacationDate] = useState<Date | null>(null);
  const [vacationYear, setVacationYear] = useState<number>(2026);

  useEffect(() => {
    const targetDate = getNextVacationDate();
    setVacationDate(targetDate);
    setVacationYear(getVacationYear());
    setIsVacation(isVacationPeriod());
    setTimeRemaining(getTimeRemaining(targetDate));

    const interval = setInterval(() => {
      setIsVacation(isVacationPeriod());
      setTimeRemaining(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeRemaining) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-1">
        <CardHeader className="bg-background rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{dictionary.title} {vacationYear}</CardTitle>
              <CardDescription>{dictionary.subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </div>
      <CardContent className="pt-6">
        {isVacation ? (
          <div className="text-center py-8">
            <Palmtree className="h-16 w-16 mx-auto mb-4 text-yellow-500 animate-bounce" />
            <h3 className="text-2xl font-bold text-yellow-600 mb-2">
              {dictionary.vacationStarted}
            </h3>
            <p className="text-muted-foreground">{dictionary.enjoy}</p>
          </div>
        ) : (
          <>
            {/* Countdown Display */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="text-center p-4 bg-gradient-to-b from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-lg">
                <div className="text-4xl font-bold text-yellow-600">{timeRemaining.days}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.days}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-lg">
                <div className="text-4xl font-bold text-orange-600">{timeRemaining.hours}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.hours}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-lg">
                <div className="text-4xl font-bold text-red-500">{timeRemaining.minutes}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.minutes}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 rounded-lg">
                <div className="text-4xl font-bold text-pink-500">{timeRemaining.seconds}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.seconds}</div>
              </div>
            </div>

            {/* Target Date */}
            {vacationDate && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{dictionary.vacationStart}:</p>
                <p className="font-medium">{formatDate(vacationDate)}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
