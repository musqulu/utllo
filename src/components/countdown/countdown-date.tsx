"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, PartyPopper } from "lucide-react";
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
import { getTimeRemaining, formatDate, TimeRemaining } from "@/lib/countdown";

interface CountdownDateDictionary {
  title: string;
  subtitle: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  selectDate: string;
  eventName: string;
  eventPlaceholder: string;
  timeLeft: string;
  dateReached: string;
  timeSince: string;
}

interface CountdownDateProps {
  dictionary: CountdownDateDictionary;
}

export function CountdownDate({ dictionary }: CountdownDateProps) {
  const [targetDate, setTargetDate] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isDateSet, setIsDateSet] = useState(false);

  const handleDateChange = useCallback((dateString: string) => {
    setTargetDate(dateString);
    if (dateString) {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      setTimeRemaining(getTimeRemaining(date));
      setIsDateSet(true);
    } else {
      setTimeRemaining(null);
      setIsDateSet(false);
    }
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const date = new Date(targetDate);
    date.setHours(0, 0, 0, 0);

    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(date));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{dictionary.title}</CardTitle>
            <CardDescription>{dictionary.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date and Event Name Input */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target-date">{dictionary.selectDate}</Label>
            <Input
              id="target-date"
              type="date"
              value={targetDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-name">{dictionary.eventName}</Label>
            <Input
              id="event-name"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder={dictionary.eventPlaceholder}
            />
          </div>
        </div>

        {/* Countdown Display */}
        {isDateSet && timeRemaining && (
          <>
            {/* Event Name Display */}
            {eventName && (
              <div className="text-center">
                <h3 className="text-xl font-semibold text-primary">{eventName}</h3>
              </div>
            )}

            {timeRemaining.isPast ? (
              <div className="text-center py-6">
                <PartyPopper className="h-12 w-12 mx-auto mb-4 text-primary animate-bounce" />
                <h3 className="text-xl font-bold text-primary mb-2">
                  {dictionary.dateReached}
                </h3>
                <p className="text-muted-foreground mb-4">{dictionary.timeSince}:</p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{timeRemaining.days}</div>
                    <div className="text-xs text-muted-foreground">{dictionary.days}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{timeRemaining.hours}</div>
                    <div className="text-xs text-muted-foreground">{dictionary.hours}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{timeRemaining.minutes}</div>
                    <div className="text-xs text-muted-foreground">{dictionary.minutes}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{timeRemaining.seconds}</div>
                    <div className="text-xs text-muted-foreground">{dictionary.seconds}</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-2">
                  <p className="text-sm text-muted-foreground">{dictionary.timeLeft}:</p>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-4 bg-gradient-to-b from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <div className="text-4xl font-bold text-primary">{timeRemaining.days}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.days}</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-b from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <div className="text-4xl font-bold text-primary">{timeRemaining.hours}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.hours}</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-b from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <div className="text-4xl font-bold text-primary">{timeRemaining.minutes}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.minutes}</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-b from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <div className="text-4xl font-bold text-primary">{timeRemaining.seconds}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{dictionary.seconds}</div>
                  </div>
                </div>

                {/* Target Date */}
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{dictionary.selectDate}:</p>
                  <p className="font-medium">{formatDate(new Date(targetDate))}</p>
                </div>
              </>
            )}
          </>
        )}

        {/* Placeholder when no date selected */}
        {!isDateSet && (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Wybierz datę, aby rozpocząć odliczanie</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
