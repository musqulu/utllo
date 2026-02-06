"use client";

import { useState, useEffect } from "react";
import { Gift, Snowflake } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getTimeRemaining,
  getNextChristmasDate,
  isChristmasPeriod,
  formatDate,
  getChristmasYear,
  TimeRemaining,
} from "@/lib/countdown";

interface CountdownChristmasDictionary {
  title: string;
  subtitle: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  christmasDate: string;
  timeLeft: string;
  christmasNow: string;
  merryChristmas: string;
}

interface CountdownChristmasProps {
  dictionary: CountdownChristmasDictionary;
}

export function CountdownChristmas({ dictionary }: CountdownChristmasProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isChristmas, setIsChristmas] = useState(false);
  const [christmasDate, setChristmasDate] = useState<Date | null>(null);
  const [christmasYear, setChristmasYear] = useState<number>(2026);

  useEffect(() => {
    const targetDate = getNextChristmasDate();
    setChristmasDate(targetDate);
    setChristmasYear(getChristmasYear());
    setIsChristmas(isChristmasPeriod());
    setTimeRemaining(getTimeRemaining(targetDate));

    const interval = setInterval(() => {
      setIsChristmas(isChristmasPeriod());
      setTimeRemaining(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeRemaining) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 p-1">
        <CardHeader className="bg-background rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{dictionary.title} {christmasYear}</CardTitle>
              <CardDescription>{dictionary.subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </div>
      <CardContent className="pt-6">
        {isChristmas ? (
          <div className="text-center py-8">
            <div className="relative inline-block">
              <Snowflake className="h-16 w-16 mx-auto mb-4 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">
              {dictionary.christmasNow}
            </h3>
            <p className="text-muted-foreground">{dictionary.merryChristmas}</p>
            <div className="mt-4 text-4xl">🎄🎅🎁</div>
          </div>
        ) : (
          <>
            {/* Countdown Display */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="text-center p-4 bg-gradient-to-b from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 rounded-lg border border-red-200 dark:border-red-900">
                <div className="text-4xl font-bold text-red-600">{timeRemaining.days}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.days}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-lg border border-green-200 dark:border-green-900">
                <div className="text-4xl font-bold text-green-600">{timeRemaining.hours}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.hours}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 rounded-lg border border-red-200 dark:border-red-900">
                <div className="text-4xl font-bold text-red-600">{timeRemaining.minutes}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.minutes}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-lg border border-green-200 dark:border-green-900">
                <div className="text-4xl font-bold text-green-600">{timeRemaining.seconds}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.seconds}</div>
              </div>
            </div>

            {/* Target Date */}
            {christmasDate && (
              <div className="text-center p-4 bg-gradient-to-r from-red-50 via-white to-green-50 dark:from-red-950/20 dark:via-background dark:to-green-950/20 rounded-lg border border-red-100 dark:border-red-900">
                <p className="text-sm text-muted-foreground mb-1">{dictionary.christmasDate}:</p>
                <p className="font-medium">{formatDate(christmasDate)}</p>
                <div className="mt-2 text-2xl">🎄</div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
