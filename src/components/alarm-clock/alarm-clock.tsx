"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell, Play, Volume2, VolumeX } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export interface AlarmClockDictionary {
  title: string;
  subtitle: string;
  hour: string;
  minute: string;
  arm: string;
  cancel: string;
  presetsTitle: string;
  preset5: string;
  preset10: string;
  testSound: string;
  countdownLabel: string;
  ringsAt: string;
  tomorrow: string;
  mute: string;
  unmute: string;
  dismiss: string;
  snooze5: string;
  snooze10: string;
  alarmFiring: string;
  notificationBody: string;
  disclaimer: string;
  hiddenTabWarning: string;
  soundLabel: string;
  soundClassic: string;
  soundDigital: string;
  soundBell: string;
  soundChime: string;
  soundSoft: string;
  soundRadar: string;
  soundPulse: string;
  strictStopLabel: string;
  strictStopHint: string;
}

interface AlarmClockProps {
  dictionary: AlarmClockDictionary;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatClock(d: Date): string {
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function isAlarmNextCalendarDay(alarm: Date, now: Date): boolean {
  const a = new Date(alarm.getFullYear(), alarm.getMonth(), alarm.getDate());
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return a > n;
}

function computeNextRingFromClock(hour: number, minute: number): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime();
}

export type AlarmSoundId =
  | "classic"
  | "digital"
  | "bell"
  | "chime"
  | "soft"
  | "radar"
  | "pulse";

const LOUD_PEAK = 0.44;

function envelopeTone(
  ctx: AudioContext,
  start: number,
  duration: number,
  freq: number,
  type: OscillatorType,
  peak: number
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function playAlarmSound(
  ctx: AudioContext,
  startTime: number,
  soundId: AlarmSoundId,
  muted: boolean
): void {
  if (muted) return;
  switch (soundId) {
    case "classic": {
      const steps = 10;
      for (let i = 0; i < steps; i += 1) {
        const t0 = startTime + i * 0.28;
        envelopeTone(ctx, t0, 0.24, i % 2 === 0 ? 880 : 660, "sine", LOUD_PEAK);
      }
      break;
    }
    case "digital": {
      for (let i = 0; i < 14; i += 1) {
        const t0 = startTime + i * 0.16;
        envelopeTone(ctx, t0, 0.1, 1400, "square", LOUD_PEAK * 0.88);
      }
      break;
    }
    case "bell": {
      for (let i = 0; i < 3; i += 1) {
        const t0 = startTime + i * 0.85;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, t0);
        osc.frequency.exponentialRampToValueAtTime(180, t0 + 0.65);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(LOUD_PEAK * 0.95, t0 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.75);
      }
      break;
    }
    case "chime": {
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      for (let i = 0; i < freqs.length; i += 1) {
        const t0 = startTime + i * 0.42;
        envelopeTone(ctx, t0, 0.38, freqs[i], "sine", LOUD_PEAK * 0.9);
      }
      break;
    }
    case "soft": {
      const softPeak = LOUD_PEAK * 0.55;
      const notes = [392, 440, 494, 523.25, 494, 440];
      for (let i = 0; i < notes.length; i += 1) {
        const t0 = startTime + i * 0.38;
        envelopeTone(ctx, t0, 0.32, notes[i], "sine", softPeak);
      }
      break;
    }
    case "radar": {
      for (let p = 0; p < 6; p += 1) {
        const t0 = startTime + p * 0.48;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1800, t0);
        osc.frequency.exponentialRampToValueAtTime(400, t0 + 0.35);
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(LOUD_PEAK * 0.75, t0 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.36);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.38);
      }
      break;
    }
    case "pulse": {
      for (let i = 0; i < 20; i += 1) {
        const t0 = startTime + i * 0.12;
        envelopeTone(ctx, t0, 0.08, i % 2 === 0 ? 320 : 960, "triangle", LOUD_PEAK * 0.92);
      }
      break;
    }
    default:
      break;
  }
}

function alarmPhraseDurationMs(soundId: AlarmSoundId): number {
  let sec: number;
  switch (soundId) {
    case "classic":
      sec = 10 * 0.28 + 0.24 + 0.15;
      break;
    case "digital":
      sec = 14 * 0.16 + 0.12;
      break;
    case "bell":
      sec = 3 * 0.85 + 0.75;
      break;
    case "chime":
      sec = 4 * 0.42 + 0.38 + 0.1;
      break;
    case "soft":
      sec = 6 * 0.38 + 0.32 + 0.12;
      break;
    case "radar":
      sec = 6 * 0.48 + 0.38;
      break;
    case "pulse":
      sec = 20 * 0.12 + 0.1;
      break;
    default:
      sec = 3;
  }
  return Math.ceil((sec + 0.45) * 1000);
}

export function AlarmClock({ dictionary }: AlarmClockProps) {
  const [hourStr, setHourStr] = useState("7");
  const [minuteStr, setMinuteStr] = useState("0");
  const [phase, setPhase] = useState<"idle" | "armed" | "ringing">("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [ringAtLabel, setRingAtLabel] = useState("");
  const [isNextDay, setIsNextDay] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [soundId, setSoundId] = useState<AlarmSoundId>("classic");
  const [strictStopOnly, setStrictStopOnly] = useState(false);

  const targetTimestampRef = useRef<number | null>(null);
  const tickIntervalRef = useRef<number | null>(null);
  const ringIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const ringTriggeredRef = useRef(false);
  const isMutedRef = useRef(false);
  const soundIdRef = useRef<AlarmSoundId>("classic");
  const strictStopOnlyRef = useRef(false);
  const isRingingRef = useRef(false);

  const parsedHour = useMemo(() => clamp(Number.parseInt(hourStr || "0", 10) || 0, 0, 23), [hourStr]);
  const parsedMinute = useMemo(() => clamp(Number.parseInt(minuteStr || "0", 10) || 0, 0, 59), [minuteStr]);

  const mutedForRingPlayback = useCallback(() => {
    if (isRingingRef.current && strictStopOnlyRef.current) return false;
    return isMutedRef.current;
  }, []);

  const ensureAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    return ctx;
  }, []);

  const stopTicking = useCallback(() => {
    if (tickIntervalRef.current !== null) {
      window.clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  const stopRinging = useCallback(() => {
    if (ringIntervalRef.current !== null) {
      window.clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {
        /* ignore */
      }
      wakeLockRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const ts = targetTimestampRef.current;
    if (!ts || ringTriggeredRef.current) return;
    const diff = Math.max(0, Math.ceil((ts - Date.now()) / 1000));
    setRemainingSeconds(diff);
    if (diff <= 0) {
      ringTriggeredRef.current = true;
      stopTicking();
      isRingingRef.current = true;
      setPhase("ringing");
      void (async () => {
        const ctx = await ensureAudio();
        const muted = mutedForRingPlayback();
        playAlarmSound(ctx, ctx.currentTime, soundIdRef.current, muted);
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          try {
            new Notification(dictionary.alarmFiring, { body: dictionary.notificationBody, silent: true });
          } catch {
            /* ignore */
          }
        }
      })();
      const repeatMs = alarmPhraseDurationMs(soundIdRef.current);
      ringIntervalRef.current = window.setInterval(() => {
        void (async () => {
          const ctx = await ensureAudio();
          playAlarmSound(ctx, ctx.currentTime, soundIdRef.current, mutedForRingPlayback());
        })();
      }, repeatMs);
    }
  }, [dictionary.alarmFiring, dictionary.notificationBody, ensureAudio, mutedForRingPlayback, stopTicking]);

  const armFromTimestamp = useCallback(
    async (targetMs: number) => {
      await ensureAudio();
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch {
          /* ignore */
        }
      }
      ringTriggeredRef.current = false;
      isRingingRef.current = false;
      stopTicking();
      stopRinging();
      await releaseWakeLock();
      targetTimestampRef.current = targetMs;
      const at = new Date(targetMs);
      const now = new Date();
      setIsNextDay(isAlarmNextCalendarDay(at, now));
      setRingAtLabel(formatClock(at));
      setPhase("armed");
      tick();
      tickIntervalRef.current = window.setInterval(tick, 250);
      trackToolEvent("online-alarm-clock", "tools", "use");

      if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        } catch {
          /* ignore */
        }
      }
    },
    [ensureAudio, releaseWakeLock, stopRinging, stopTicking, tick]
  );

  const armClock = useCallback(async () => {
    const targetMs = computeNextRingFromClock(parsedHour, parsedMinute);
    await armFromTimestamp(targetMs);
  }, [armFromTimestamp, parsedHour, parsedMinute]);

  const presetMinutes = useCallback(
    async (mins: number) => {
      const targetMs = Date.now() + mins * 60 * 1000;
      const at = new Date(targetMs);
      setHourStr(String(at.getHours()));
      setMinuteStr(String(at.getMinutes()));
      await armFromTimestamp(targetMs);
    },
    [armFromTimestamp]
  );

  const cancelAlarm = useCallback(async () => {
    stopTicking();
    stopRinging();
    ringTriggeredRef.current = false;
    isRingingRef.current = false;
    targetTimestampRef.current = null;
    setPhase("idle");
    setRemainingSeconds(0);
    setRingAtLabel("");
    await releaseWakeLock();
  }, [releaseWakeLock, stopRinging, stopTicking]);

  const dismiss = useCallback(async () => {
    stopRinging();
    ringTriggeredRef.current = false;
    isRingingRef.current = false;
    targetTimestampRef.current = null;
    setPhase("idle");
    setRemainingSeconds(0);
    setRingAtLabel("");
    await releaseWakeLock();
  }, [releaseWakeLock, stopRinging]);

  const snooze = useCallback(
    async (minutes: number) => {
      stopRinging();
      ringTriggeredRef.current = false;
      isRingingRef.current = false;
      const targetMs = Date.now() + minutes * 60 * 1000;
      const at = new Date(targetMs);
      const now = new Date();
      setHourStr(String(at.getHours()));
      setMinuteStr(String(at.getMinutes()));
      targetTimestampRef.current = targetMs;
      setIsNextDay(isAlarmNextCalendarDay(at, now));
      setRingAtLabel(formatClock(at));
      setPhase("armed");
      tick();
      tickIntervalRef.current = window.setInterval(tick, 250);
      trackToolEvent("online-alarm-clock", "tools", "use");
      if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
        await releaseWakeLock();
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        } catch {
          /* ignore */
        }
      }
    },
    [releaseWakeLock, stopRinging, tick]
  );

  const testSound = useCallback(async () => {
    const ctx = await ensureAudio();
    playAlarmSound(ctx, ctx.currentTime, soundIdRef.current, isMutedRef.current);
  }, [ensureAudio]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    soundIdRef.current = soundId;
  }, [soundId]);

  useEffect(() => {
    strictStopOnlyRef.current = strictStopOnly;
  }, [strictStopOnly]);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.visibilityState === "hidden");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    return () => {
      stopTicking();
      stopRinging();
      void releaseWakeLock();
      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [releaseWakeLock, stopRinging, stopTicking]);

  const disabledInputs = phase === "armed" || phase === "ringing";

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Bell className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">{dictionary.disclaimer}</p>
        {tabHidden && phase === "armed" && (
          <p className="text-sm text-amber-600 dark:text-amber-400">{dictionary.hiddenTabWarning}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="alarm-sound">{dictionary.soundLabel}</Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <Select
                value={soundId}
                onValueChange={(v) => setSoundId(v as AlarmSoundId)}
                disabled={disabledInputs}
              >
                <SelectTrigger id="alarm-sound" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">{dictionary.soundClassic}</SelectItem>
                  <SelectItem value="digital">{dictionary.soundDigital}</SelectItem>
                  <SelectItem value="bell">{dictionary.soundBell}</SelectItem>
                  <SelectItem value="chime">{dictionary.soundChime}</SelectItem>
                  <SelectItem value="soft">{dictionary.soundSoft}</SelectItem>
                  <SelectItem value="radar">{dictionary.soundRadar}</SelectItem>
                  <SelectItem value="pulse">{dictionary.soundPulse}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 sm:w-auto w-full"
              disabled={disabledInputs}
              onClick={() => void testSound()}
            >
              {dictionary.testSound}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Label htmlFor="strict-stop" className="text-base">
              {dictionary.strictStopLabel}
            </Label>
            <p className="text-sm text-muted-foreground">{dictionary.strictStopHint}</p>
          </div>
          <Switch
            id="strict-stop"
            checked={strictStopOnly}
            onCheckedChange={setStrictStopOnly}
            disabled={disabledInputs}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="alarm-hour">{dictionary.hour}</Label>
            <Input
              id="alarm-hour"
              type="number"
              min={0}
              max={23}
              inputMode="numeric"
              disabled={disabledInputs}
              value={hourStr}
              onChange={(e) => setHourStr(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alarm-minute">{dictionary.minute}</Label>
            <Input
              id="alarm-minute"
              type="number"
              min={0}
              max={59}
              inputMode="numeric"
              disabled={disabledInputs}
              value={minuteStr}
              onChange={(e) => setMinuteStr(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">{dictionary.presetsTitle}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" disabled={disabledInputs} onClick={() => void presetMinutes(5)}>
              {dictionary.preset5}
            </Button>
            <Button type="button" variant="secondary" size="sm" disabled={disabledInputs} onClick={() => void presetMinutes(10)}>
              {dictionary.preset10}
            </Button>
          </div>
        </div>

        {phase === "armed" && (
          <div className="rounded-xl border border-border p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">{dictionary.countdownLabel}</p>
            <p className="text-4xl font-bold tabular-nums tracking-tight">{formatCountdown(remainingSeconds)}</p>
            <p className="text-sm">
              {dictionary.ringsAt} <span className="font-medium">{ringAtLabel}</span>
              {isNextDay && <span className="text-muted-foreground"> ({dictionary.tomorrow})</span>}
            </p>
          </div>
        )}

        {phase === "ringing" && (
          <div className="rounded-xl border border-primary bg-primary/10 p-6 text-center space-y-4">
            <p className="text-lg font-semibold text-primary">{dictionary.alarmFiring}</p>
            {strictStopOnly && (
              <p className="text-sm text-muted-foreground">{dictionary.strictStopHint}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => void dismiss()} variant="default" size="lg">
                {dictionary.dismiss}
              </Button>
              <Button onClick={() => void snooze(5)} variant="outline" size="lg">
                {dictionary.snooze5}
              </Button>
              <Button onClick={() => void snooze(10)} variant="outline" size="lg">
                {dictionary.snooze10}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {phase === "idle" ? (
            <Button onClick={() => void armClock()} className="gap-2 sm:col-span-2" size="lg">
              <Play className="h-4 w-4" />
              {dictionary.arm}
            </Button>
          ) : phase === "armed" ? (
            <Button onClick={() => void cancelAlarm()} variant="outline" className="gap-2 sm:col-span-2" size="lg">
              {dictionary.cancel}
            </Button>
          ) : null}
        </div>

        <div className="flex justify-stretch">
          <Button variant="ghost" className="gap-2 w-full sm:w-auto" type="button" onClick={() => setIsMuted((p) => !p)}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isMuted ? dictionary.unmute : dictionary.mute}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
