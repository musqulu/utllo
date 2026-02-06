/**
 * Text analysis utilities for character and word counting
 */

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
}

export interface WordStats extends TextStats {
  uniqueWords: number;
  avgWordLength: number;
  avgSentenceLength: number;
  wordFrequency: Map<string, number>;
}

// Average reading speed (words per minute)
const READING_WPM = 200;
// Average speaking speed (words per minute)
const SPEAKING_WPM = 150;

/**
 * Count characters in text
 */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * Count characters excluding spaces
 */
export function countCharactersNoSpaces(text: string): number {
  return text.replace(/\s/g, "").length;
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  
  // Split by whitespace and filter empty strings
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Get array of words from text
 */
export function getWords(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  
  return trimmed.split(/\s+/).filter(Boolean);
}

/**
 * Count sentences in text
 * Sentences end with . ! ? or similar punctuation
 */
export function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  
  // Match sentence-ending punctuation followed by space or end of string
  const sentences = trimmed.split(/[.!?]+\s*/).filter((s) => s.trim().length > 0);
  
  // If text doesn't end with punctuation but has content, count it as one sentence
  if (sentences.length === 0 && trimmed.length > 0) {
    return 1;
  }
  
  return sentences.length;
}

/**
 * Count paragraphs in text
 * Paragraphs are separated by one or more newlines
 */
export function countParagraphs(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  
  // Split by double newlines or single newlines
  const paragraphs = trimmed.split(/\n\s*\n|\n/).filter((p) => p.trim().length > 0);
  
  return Math.max(paragraphs.length, trimmed.length > 0 ? 1 : 0);
}

/**
 * Calculate reading time in seconds
 */
export function calculateReadingTime(wordCount: number): number {
  if (wordCount === 0) return 0;
  return Math.ceil((wordCount / READING_WPM) * 60);
}

/**
 * Calculate speaking time in seconds
 */
export function calculateSpeakingTime(wordCount: number): number {
  if (wordCount === 0) return 0;
  return Math.ceil((wordCount / SPEAKING_WPM) * 60);
}

/**
 * Format time in seconds to minutes and seconds
 */
export function formatTime(seconds: number): { minutes: number; seconds: number } {
  return {
    minutes: Math.floor(seconds / 60),
    seconds: seconds % 60,
  };
}

/**
 * Count unique words in text
 */
export function countUniqueWords(text: string): number {
  const words = getWords(text).map((w) => w.toLowerCase().replace(/[^a-ząćęłńóśżź]/gi, ""));
  return new Set(words.filter(Boolean)).size;
}

/**
 * Calculate word frequency
 */
export function getWordFrequency(text: string): Map<string, number> {
  const words = getWords(text).map((w) => w.toLowerCase().replace(/[^a-ząćęłńóśżź]/gi, ""));
  const frequency = new Map<string, number>();
  
  for (const word of words) {
    if (word.length > 0) {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    }
  }
  
  return frequency;
}

/**
 * Get top N most frequent words
 */
export function getTopWords(text: string, n: number = 10): Array<{ word: string; count: number }> {
  const frequency = getWordFrequency(text);
  
  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}

/**
 * Calculate average word length
 */
export function calculateAvgWordLength(text: string): number {
  const words = getWords(text);
  if (words.length === 0) return 0;
  
  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  return Math.round((totalLength / words.length) * 10) / 10;
}

/**
 * Calculate average sentence length (in words)
 */
export function calculateAvgSentenceLength(text: string): number {
  const wordCount = countWords(text);
  const sentenceCount = countSentences(text);
  
  if (sentenceCount === 0) return 0;
  return Math.round((wordCount / sentenceCount) * 10) / 10;
}

/**
 * Get complete text statistics for character counter
 */
export function getTextStats(text: string): TextStats {
  const wordCount = countWords(text);
  
  return {
    characters: countCharacters(text),
    charactersNoSpaces: countCharactersNoSpaces(text),
    words: wordCount,
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    readingTimeSeconds: calculateReadingTime(wordCount),
    speakingTimeSeconds: calculateSpeakingTime(wordCount),
  };
}

/**
 * Get extended word statistics for word counter
 */
export function getWordStats(text: string): WordStats {
  const basicStats = getTextStats(text);
  
  return {
    ...basicStats,
    uniqueWords: countUniqueWords(text),
    avgWordLength: calculateAvgWordLength(text),
    avgSentenceLength: calculateAvgSentenceLength(text),
    wordFrequency: getWordFrequency(text),
  };
}
