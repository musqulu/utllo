"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Timer, Play, Square, Hand } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface MetronomeDictionary {
  title: string;
  subtitle: string;
  bpm: string;
  start: string;
  stop: string;
  tapTempo: string;
  timeSignature: string;
  beat: string;
  accentFirst: string;
  tempoPresets: string;
  largo: string;
  adagio: string;
  andante: string;
  moderato: string;
  allegro: string;
  presto: string;
  vivace: string;
}

interface MetronomeProps {
  dictionary: MetronomeDictionary;
}

const TIME_SIGNATURES = [
  { label: "2/4", beats: 2 },
  { label: "3/4", beats: 3 },
  { label: "4/4", beats: 4 },
  { label: "5/4", beats: 5 },
  { label: "6/8", beats: 6 },
  { label: "7/8", beats: 7 },
];

const LOOKAHEAD = 25; // ms - how often to check scheduling
const SCHEDULE_AHEAD = 0.1; // seconds - how far ahead to schedule

export function Metronome({ dictionary }: MetronomeProps) {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSignature, setTimeSignature] = useState(TIME_SIGNATURES[2]); // 4/4
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Create a click sound using Web Audio API
  const playClick = useCallback(
    (time: number, isAccent: boolean) => {
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = isAccent ? 1000 : 800;
      gain.gain.setValueAtTime(isAccent ? 1.0 : 0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      osc.start(time);
      osc.stop(time + 0.05);
    },
    []
  );

  // Scheduler - runs in a loop to schedule upcoming beats
  const scheduler = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD) {
      const isAccent = currentBeatRef.current === 0;
      playClick(nextNoteTimeRef.current, isAccent);

      // Update visual beat (approximate, since audio is scheduled ahead)
      const beatToShow = currentBeatRef.current;
      setTimeout(() => {
        setCurrentBeat(beatToShow);
      }, Math.max(0, (nextNoteTimeRef.current - ctx.currentTime) * 1000));

      // Advance to next beat
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTimeRef.current += secondsPerBeat;
      currentBeatRef.current =
        (currentBeatRef.current + 1) % timeSignature.beats;
    }
  }, [bpm, timeSignature.beats, playClick]);

  // Start/stop logic
  const startMetronome = useCallback(() => {
    if (isPlayingRef.current) return;

    // Create audio context on user interaction (needed for browsers)
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    isPlayingRef.current = true;
    currentBeatRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime;
    setIsPlaying(true);
    setCurrentBeat(0);

    trackToolEvent("metronome", "tools", "use");
  }, []);

  const stopMetronome = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentBeat(-1);
    if (timerIdRef.current !== null) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  // Scheduling loop - runs while playing
  useEffect(() => {
    if (isPlaying) {
      const id = window.setInterval(scheduler, LOOKAHEAD);
      timerIdRef.current = id;
      // Run scheduler immediately
      scheduler();
      return () => {
        clearInterval(id);
        timerIdRef.current = null;
      };
    }
  }, [isPlaying, scheduler]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (timerIdRef.current !== null) {
        clearInterval(timerIdRef.current);
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }, [startMetronome, stopMetronome]);

  // Tap tempo
  const handleTapTempo = useCallback(() => {
    const now = performance.now();
    setTapTimes((prev) => {
      const updated = [...prev, now].slice(-6); // keep last 6 taps
      if (updated.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < updated.length; i++) {
          intervals.push(updated[i] - updated[i - 1]);
        }
        // Filter out outliers (intervals > 2s)
        const valid = intervals.filter((d) => d < 2000);
        if (valid.length > 0) {
          const avgMs = valid.reduce((a, b) => a + b, 0) / valid.length;
          const detectedBpm = Math.round(60000 / avgMs);
          const clamped = Math.max(20, Math.min(300, detectedBpm));
          setBpm(clamped);
        }
      }
      return updated;
    });
  }, []);

  // Reset tap times after 2 seconds of inactivity
  useEffect(() => {
    if (tapTimes.length === 0) return;
    const timeout = setTimeout(() => {
      setTapTimes([]);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [tapTimes]);

  // Tempo presets
  const tempoPresets = [
    { label: dictionary.largo, bpm: 50 },
    { label: dictionary.adagio, bpm: 70 },
    { label: dictionary.andante, bpm: 100 },
    { label: dictionary.moderato, bpm: 112 },
    { label: dictionary.allegro, bpm: 132 },
    { label: dictionary.vivace, bpm: 160 },
    { label: dictionary.presto, bpm: 178 },
  ];

  const handleBpmChange = useCallback((value: number[]) => {
    setBpm(value[0]);
  }, []);

  const handleBpmInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) {
        setBpm(Math.max(20, Math.min(300, val)));
      }
    },
    []
  );

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
        {/* BPM Display & Control */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <input
              type="number"
              min={20}
              max={300}
              value={bpm}
              onChange={handleBpmInput}
              className="w-24 text-center text-4xl font-bold bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none tabular-nums"
              aria-label={dictionary.bpm}
            />
            <span className="text-lg text-muted-foreground font-medium">
              {dictionary.bpm}
            </span>
          </div>

          <Slider
            value={[bpm]}
            onValueChange={handleBpmChange}
            min={20}
            max={300}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>20</span>
            <span>120</span>
            <span>300</span>
          </div>
        </div>

        {/* Beat Indicator */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: timeSignature.beats }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-100 flex items-center justify-center text-xs font-bold ${
                currentBeat === i
                  ? i === 0
                    ? "bg-primary border-primary text-primary-foreground scale-110"
                    : "bg-primary/70 border-primary/70 text-primary-foreground scale-110"
                  : "border-muted-foreground/30 text-muted-foreground/50"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Play/Stop & Tap Tempo */}
        <div className="flex gap-3">
          <Button
            onClick={togglePlay}
            size="lg"
            className="flex-1 gap-2 h-14 text-lg"
            variant={isPlaying ? "destructive" : "default"}
          >
            {isPlaying ? (
              <>
                <Square className="h-5 w-5" />
                {dictionary.stop}
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                {dictionary.start}
              </>
            )}
          </Button>
          <Button
            onClick={handleTapTempo}
            variant="outline"
            size="lg"
            className="gap-2 h-14"
          >
            <Hand className="h-5 w-5" />
            {dictionary.tapTempo}
          </Button>
        </div>

        {/* Time Signature */}
        <div className="space-y-3">
          <Label>{dictionary.timeSignature}</Label>
          <div className="flex flex-wrap gap-2">
            {TIME_SIGNATURES.map((ts) => (
              <Button
                key={ts.label}
                variant={
                  timeSignature.label === ts.label ? "default" : "outline"
                }
                size="sm"
                onClick={() => {
                  setTimeSignature(ts);
                  if (isPlayingRef.current) {
                    currentBeatRef.current = 0;
                  }
                }}
              >
                {ts.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tempo Presets */}
        <div className="space-y-3">
          <Label>{dictionary.tempoPresets}</Label>
          <div className="flex flex-wrap gap-2">
            {tempoPresets.map((preset) => (
              <Badge
                key={preset.label}
                variant={bpm === preset.bpm ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors px-3 py-1.5 text-sm"
                onClick={() => setBpm(preset.bpm)}
              >
                {preset.label} ({preset.bpm})
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
