"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OnlineTimerDictionary {
  title: string;
  subtitle: string;
  minutes: string;
  seconds: string;
  start: string;
  pause: string;
  resume: string;
  reset: string;
  mute: string;
  unmute: string;
  timeUp: string;
}

interface OnlineTimerProps {
  dictionary: OnlineTimerDictionary;
}

const MAX_MINUTES = 999;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function OnlineTimer({ dictionary }: OnlineTimerProps) {
  const [inputMinutes, setInputMinutes] = useState("5");
  const [inputSeconds, setInputSeconds] = useState("0");
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const targetTimestampRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const totalInputSeconds = useMemo(() => {
    const mins = clamp(Number.parseInt(inputMinutes || "0", 10) || 0, 0, MAX_MINUTES);
    const secs = clamp(Number.parseInt(inputSeconds || "0", 10) || 0, 0, 59);
    return mins * 60 + secs;
  }, [inputMinutes, inputSeconds]);

  const playAlert = useCallback(async () => {
    if (isMuted) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    for (let i = 0; i < 3; i += 1) {
      const start = now + i * 0.25;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.2, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    }
  }, [isMuted]);

  const stopTicking = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (!targetTimestampRef.current) return;

    const diffSeconds = Math.max(0, Math.ceil((targetTimestampRef.current - Date.now()) / 1000));
    setRemainingSeconds(diffSeconds);

    if (diffSeconds <= 0) {
      stopTicking();
      targetTimestampRef.current = null;
      setIsRunning(false);
      setIsFinished(true);
      playAlert();
    }
  }, [playAlert, stopTicking]);

  const startTimer = useCallback(() => {
    if (totalInputSeconds <= 0) return;

    stopTicking();
    setHasStarted(true);
    setIsFinished(false);
    setIsRunning(true);
    setRemainingSeconds(totalInputSeconds);

    targetTimestampRef.current = Date.now() + totalInputSeconds * 1000;
    intervalRef.current = window.setInterval(tick, 250);
    trackToolEvent("online-timer", "tools", "use");
  }, [stopTicking, tick, totalInputSeconds]);

  const pauseTimer = useCallback(() => {
    stopTicking();
    setIsRunning(false);
  }, [stopTicking]);

  const resumeTimer = useCallback(() => {
    if (remainingSeconds <= 0) return;
    setIsRunning(true);
    setIsFinished(false);
    targetTimestampRef.current = Date.now() + remainingSeconds * 1000;
    intervalRef.current = window.setInterval(tick, 250);
  }, [remainingSeconds, tick]);

  const resetTimer = useCallback(() => {
    stopTicking();
    targetTimestampRef.current = null;
    setIsRunning(false);
    setHasStarted(false);
    setIsFinished(false);
    setRemainingSeconds(totalInputSeconds);
  }, [stopTicking, totalInputSeconds]);

  useEffect(() => {
    if (!hasStarted) {
      setRemainingSeconds(totalInputSeconds);
    }
  }, [hasStarted, totalInputSeconds]);

  useEffect(() => {
    return () => {
      stopTicking();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stopTicking]);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Timer className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timer-minutes">{dictionary.minutes}</Label>
            <Input
              id="timer-minutes"
              type="number"
              min={0}
              max={MAX_MINUTES}
              inputMode="numeric"
              disabled={isRunning}
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timer-seconds">{dictionary.seconds}</Label>
            <Input
              id="timer-seconds"
              type="number"
              min={0}
              max={59}
              inputMode="numeric"
              disabled={isRunning}
              value={inputSeconds}
              onChange={(e) => setInputSeconds(e.target.value)}
            />
          </div>
        </div>

        <div
          className={`rounded-xl border p-8 text-center transition-colors ${
            isFinished ? "border-primary bg-primary/10" : "border-border"
          }`}
        >
          <p className="text-5xl font-bold tabular-nums tracking-tight">
            {formatTime(remainingSeconds)}
          </p>
          {isFinished && (
            <p className="mt-3 text-sm font-medium text-primary">{dictionary.timeUp}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {!hasStarted ? (
            <Button
              onClick={startTimer}
              disabled={totalInputSeconds <= 0}
              className="col-span-2 gap-2"
              size="lg"
            >
              <Play className="h-4 w-4" />
              {dictionary.start}
            </Button>
          ) : (
            <>
              <Button onClick={isRunning ? pauseTimer : resumeTimer} className="gap-2" size="lg">
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRunning ? dictionary.pause : dictionary.resume}
              </Button>
              <Button onClick={resetTimer} variant="outline" className="gap-2" size="lg">
                <RotateCcw className="h-4 w-4" />
                {dictionary.reset}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          className="w-full gap-2"
          onClick={() => setIsMuted((prev) => !prev)}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          {isMuted ? dictionary.unmute : dictionary.mute}
        </Button>
      </CardContent>
    </Card>
  );
}
