"use client";

import { useState, useCallback, useMemo } from "react";
import { Type, Copy, Check, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTextStats, formatTime } from "@/lib/text-counter";

interface CharacterCounterDictionary {
  title: string;
  subtitle: string;
  placeholder: string;
  characters: string;
  charactersNoSpaces: string;
  words: string;
  sentences: string;
  paragraphs: string;
  readingTime: string;
  speakingTime: string;
  minutes: string;
  seconds: string;
  clear: string;
  copy: string;
}

interface CharacterCounterProps {
  dictionary: CharacterCounterDictionary;
}

export function CharacterCounter({ dictionary }: CharacterCounterProps) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => getTextStats(text), [text]);
  const readingTime = useMemo(() => formatTime(stats.readingTimeSeconds), [stats.readingTimeSeconds]);
  const speakingTime = useMemo(() => formatTime(stats.speakingTimeSeconds), [stats.speakingTimeSeconds]);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [text]);

  const handleClear = useCallback(() => {
    setText("");
  }, []);

  const formatTimeDisplay = (time: { minutes: number; seconds: number }) => {
    if (time.minutes > 0) {
      return `${time.minutes} ${dictionary.minutes} ${time.seconds} ${dictionary.seconds}`;
    }
    return `${time.seconds} ${dictionary.seconds}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Type className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{dictionary.title}</CardTitle>
            <CardDescription>{dictionary.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Input */}
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={dictionary.placeholder}
            className="w-full min-h-[200px] p-4 rounded-lg border bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard
            label={dictionary.characters}
            value={stats.characters}
            highlight
          />
          <StatCard
            label={dictionary.charactersNoSpaces}
            value={stats.charactersNoSpaces}
          />
          <StatCard
            label={dictionary.words}
            value={stats.words}
          />
          <StatCard
            label={dictionary.sentences}
            value={stats.sentences}
          />
          <StatCard
            label={dictionary.paragraphs}
            value={stats.paragraphs}
          />
        </div>

        {/* Time Estimates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{dictionary.readingTime}</p>
              <p className="font-medium">{formatTimeDisplay(readingTime)}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{dictionary.speakingTime}</p>
              <p className="font-medium">{formatTimeDisplay(speakingTime)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!text}
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Skopiowano!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                {dictionary.copy}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={!text}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {dictionary.clear}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  highlight?: boolean;
}

function StatCard({ label, value, highlight }: StatCardProps) {
  return (
    <div className={`p-4 rounded-lg text-center ${highlight ? 'bg-primary/10' : 'bg-muted/50'}`}>
      <p className={`text-2xl font-bold ${highlight ? 'text-primary' : ''}`}>
        {value.toLocaleString('pl-PL')}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
