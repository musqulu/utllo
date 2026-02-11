"use client";

import { useState, useCallback } from "react";
import { Sparkles, RotateCcw, History, Trash2, Heart, Activity, Briefcase, Flame, Droplets, Wind, Mountain, Star } from "lucide-react";
import Image from "next/image";
import { trackToolEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DrawnCard,
  drawRandomCard,
  Suit,
} from "@/lib/tarot-cards";
import { getLocalizedCard, getSuitName, getArcanaName } from "@/lib/tarot-i18n";

interface TarotReaderDictionary {
  title: string;
  subtitle: string;
  draw: string;
  drawAnother: string;
  upright: string;
  reversed: string;
  meaning: string;
  keywords: string;
  history: string;
  clearHistory: string;
  majorArcana: string;
  minorArcana: string;
  cardOf: string;
  of78: string;
  clickToReveal: string;
  noHistory: string;
  imageDesc: string;
  love: string;
  health: string;
  work: string;
  adviceLabel: string;
  element: string;
  zodiacLabel: string;
  planetLabel: string;
}

interface TarotReaderProps {
  dictionary: TarotReaderDictionary;
  locale?: string;
}

const ELEMENT_ICONS: Record<string, typeof Flame> = {
  "Ogień": Flame,
  "Woda": Droplets,
  "Powietrze": Wind,
  "Ziemia": Mountain,
  "Fire": Flame,
  "Water": Droplets,
  "Air": Wind,
  "Earth": Mountain,
};

type InterpretationTab = "love" | "health" | "work";

export function TarotReader({ dictionary, locale = "pl" }: TarotReaderProps) {
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<DrawnCard[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<InterpretationTab>("love");

  const handleDraw = useCallback(() => {
    if (isAnimating) return;

    if (isFlipped) {
      setIsAnimating(true);
      setIsFlipped(false);
      setTimeout(() => {
        const rawCard = drawRandomCard();
        const newCard = { ...rawCard, card: getLocalizedCard(rawCard.card, locale) };
        setDrawnCard(newCard);
        setActiveTab("love");
        setTimeout(() => {
          setIsFlipped(true);
          setIsAnimating(false);
          setHistory((prev) => [newCard, ...prev].slice(0, 20));
          trackToolEvent("random-tarot", "randomizers", "use");
        }, 300);
      }, 400);
    } else {
      setIsAnimating(true);
      const rawCard2 = drawRandomCard();
      const newCard = { ...rawCard2, card: getLocalizedCard(rawCard2.card, locale) };
      setDrawnCard(newCard);
      setActiveTab("love");
      setTimeout(() => {
        setIsFlipped(true);
        setIsAnimating(false);
        setHistory((prev) => [newCard, ...prev].slice(0, 20));
        trackToolEvent("random-tarot", "randomizers", "use");
      }, 100);
    }
  }, [isFlipped, isAnimating]);

  const handleCardClick = useCallback(() => {
    if (isAnimating || !drawnCard) return;
    if (!isFlipped) {
      setIsFlipped(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, [isFlipped, isAnimating, drawnCard]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setShowHistory(false);
  }, []);

  const getTabContent = (tab: InterpretationTab) => {
    if (!drawnCard) return "";
    switch (tab) {
      case "love": return drawnCard.card.loveMeaning;
      case "health": return drawnCard.card.healthMeaning;
      case "work": return drawnCard.card.workMeaning;
    }
  };

  const TAB_CONFIG = [
    { id: "love" as const, label: dictionary.love, icon: Heart },
    { id: "health" as const, label: dictionary.health, icon: Activity },
    { id: "work" as const, label: dictionary.work, icon: Briefcase },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Card Display Area */}
        <div className="flex flex-col items-center gap-6">
          {/* Tarot Card with Flip Animation */}
          <div
            className="relative cursor-pointer"
            style={{ perspective: "1000px", width: "260px", height: "450px" }}
            onClick={drawnCard && !isFlipped ? handleCardClick : undefined}
          >
            <div
              className="relative w-full h-full"
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.6s ease-in-out",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Card Back */}
              <div
                className="absolute inset-0 rounded-xl overflow-hidden shadow-xl border-2 border-amber-900/20"
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src="/tarot/card-back.png"
                  alt="Tył karty tarota"
                  fill
                  className="object-cover"
                  sizes="260px"
                  priority
                />
                {!drawnCard && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <p className="text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-full">
                      {dictionary.draw}
                    </p>
                  </div>
                )}
                {drawnCard && !isFlipped && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <p className="text-white text-xs font-medium bg-black/40 px-3 py-1.5 rounded-full animate-pulse">
                      {dictionary.clickToReveal}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Front */}
              <div
                className="absolute inset-0 rounded-xl overflow-hidden shadow-xl border-2 border-amber-900/20"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {drawnCard && (
                  <Image
                    src={drawnCard.card.imagePath}
                    alt={drawnCard.card.name}
                    fill
                    className={`object-cover ${drawnCard.isReversed ? "rotate-180" : ""}`}
                    sizes="260px"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Draw Button */}
          <Button
            onClick={handleDraw}
            size="lg"
            disabled={isAnimating}
            className="min-w-[200px]"
          >
            {drawnCard ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                {dictionary.drawAnother}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {dictionary.draw}
              </>
            )}
          </Button>
        </div>

        {/* Card Information */}
        {drawnCard && isFlipped && (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {/* Card Name & Type */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">{drawnCard.card.name}</h3>
              <p className="text-xs text-muted-foreground">{drawnCard.card.nameEn}</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                  {getArcanaName(drawnCard.card.arcana, locale)}
                </span>
                {drawnCard.card.suit && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                    {getSuitName(drawnCard.card.suit as Suit, locale)}
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    drawnCard.isReversed
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-green-500/10 text-green-600 dark:text-green-400"
                  }`}
                >
                  {drawnCard.isReversed ? dictionary.reversed : dictionary.upright}
                </span>
              </div>
            </div>

            {/* Meta Bar: Element, Zodiac, Planet */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              {drawnCard.card.element && (() => {
                const ElementIcon = ELEMENT_ICONS[drawnCard.card.element];
                return (
                  <div className="flex items-center gap-1">
                    <ElementIcon className="h-3.5 w-3.5" />
                    <span>{drawnCard.card.element}</span>
                  </div>
                );
              })()}
              {drawnCard.card.zodiac && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" />
                  <span>{drawnCard.card.zodiac}</span>
                </div>
              )}
              {drawnCard.card.planet && (
                <div className="flex items-center gap-1">
                  <span className="text-base leading-none">☉</span>
                  <span>{drawnCard.card.planet}</span>
                </div>
              )}
            </div>

            {/* Keywords */}
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="text-sm font-semibold mb-2">{dictionary.keywords}</h4>
              <div className="flex flex-wrap gap-2">
                {(drawnCard.isReversed
                  ? drawnCard.card.reversedKeywords
                  : drawnCard.card.uprightKeywords
                ).map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2.5 py-1 rounded-full bg-background text-xs font-medium border"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Image Description */}
            {drawnCard.card.imageDescription && (
              <div className="px-4 py-3 rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  {drawnCard.card.imageDescription}
                </p>
              </div>
            )}

            {/* Meaning */}
            <div className="p-4 rounded-lg border">
              <h4 className="text-sm font-semibold mb-2">{dictionary.meaning}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {drawnCard.isReversed
                  ? drawnCard.card.reversedMeaning
                  : drawnCard.card.uprightMeaning}
              </p>
            </div>

            {/* Love / Health / Work Tabs */}
            <div className="rounded-lg border overflow-hidden">
              <div className="flex border-b">
                {TAB_CONFIG.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary border-b-2 border-primary -mb-px"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getTabContent(activeTab)}
                </p>
              </div>
            </div>

            {/* Advice */}
            {drawnCard.card.advice && (
              <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <h4 className="text-sm font-semibold mb-1 text-amber-700 dark:text-amber-400">
                  {dictionary.adviceLabel}
                </h4>
                <p className="text-sm text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                  {drawnCard.card.advice}
                </p>
              </div>
            )}
          </div>
        )}

        {/* History Toggle */}
        {history.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-muted-foreground"
              >
                <History className="h-4 w-4 mr-2" />
                {dictionary.history} ({history.length})
              </Button>
              {showHistory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-muted-foreground"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {dictionary.clearHistory}
                </Button>
              )}
            </div>

            {showHistory && (
              <div className="space-y-2">
                {history.map((drawn, idx) => (
                  <div
                    key={`${drawn.card.id}-${drawn.timestamp}-${idx}`}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 text-sm"
                  >
                    <div className="w-8 h-12 rounded overflow-hidden border shrink-0 relative">
                      <Image
                        src={drawn.card.imagePath}
                        alt={drawn.card.name}
                        fill
                        className={`object-cover ${drawn.isReversed ? "rotate-180" : ""}`}
                        sizes="32px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{drawn.card.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {drawn.isReversed ? dictionary.reversed : dictionary.upright}
                        {drawn.card.suit && ` • ${getSuitName(drawn.card.suit as Suit, locale)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
