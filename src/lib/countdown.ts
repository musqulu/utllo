/**
 * Countdown Timer Utilities
 */

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isPast: boolean;
}

/**
 * Calculate time remaining until a target date
 */
export function getTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const isPast = diff < 0;
  const absDiff = Math.abs(diff);

  const totalSeconds = Math.floor(absDiff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isPast,
  };
}

/**
 * Get the next summer vacation start date (Poland)
 * Summer vacation in Poland typically starts around June 28
 */
export function getNextVacationDate(): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Summer vacation typically starts on the last Friday of June
  // For simplicity, we'll use June 28 (commonly around this date)
  let vacationStart = new Date(currentYear, 5, 28, 0, 0, 0); // June 28
  
  // If we're past this year's vacation start, get next year's
  if (now > vacationStart) {
    // Check if we're still in vacation period (until August 31)
    const vacationEnd = new Date(currentYear, 7, 31, 23, 59, 59); // August 31
    if (now <= vacationEnd) {
      // Still in vacation
      return vacationStart;
    }
    // Get next year's vacation
    vacationStart = new Date(currentYear + 1, 5, 28, 0, 0, 0);
  }
  
  return vacationStart;
}

/**
 * Check if currently in vacation period
 */
export function isVacationPeriod(): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const vacationStart = new Date(currentYear, 5, 28, 0, 0, 0); // June 28
  const vacationEnd = new Date(currentYear, 7, 31, 23, 59, 59); // August 31
  
  return now >= vacationStart && now <= vacationEnd;
}

/**
 * Get the next Christmas Eve date (December 24)
 */
export function getNextChristmasDate(): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Christmas Eve is December 24
  let christmas = new Date(currentYear, 11, 24, 0, 0, 0);
  
  // If we're past Christmas Eve this year, get next year's
  if (now > christmas) {
    // Check if we're still in Christmas period (December 24-26)
    const christmasEnd = new Date(currentYear, 11, 26, 23, 59, 59);
    if (now <= christmasEnd) {
      return christmas;
    }
    christmas = new Date(currentYear + 1, 11, 24, 0, 0, 0);
  }
  
  return christmas;
}

/**
 * Check if currently in Christmas period (Dec 24-26)
 */
export function isChristmasPeriod(): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const christmasStart = new Date(currentYear, 11, 24, 0, 0, 0);
  const christmasEnd = new Date(currentYear, 11, 26, 23, 59, 59);
  
  return now >= christmasStart && now <= christmasEnd;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date, locale: string = 'pl-PL'): string {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time remaining as a string
 */
export function formatTimeRemaining(time: TimeRemaining): string {
  const parts = [];
  if (time.days > 0) parts.push(`${time.days} dni`);
  if (time.hours > 0) parts.push(`${time.hours} godz.`);
  if (time.minutes > 0) parts.push(`${time.minutes} min`);
  if (time.seconds > 0) parts.push(`${time.seconds} sek`);
  return parts.join(' ') || '0 sekund';
}

/**
 * Get year for vacation (current or next)
 */
export function getVacationYear(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const vacationStart = new Date(currentYear, 5, 28, 0, 0, 0);
  const vacationEnd = new Date(currentYear, 7, 31, 23, 59, 59);
  
  if (now > vacationEnd) {
    return currentYear + 1;
  }
  return currentYear;
}

/**
 * Get year for Christmas (current or next)
 */
export function getChristmasYear(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const christmasEnd = new Date(currentYear, 11, 26, 23, 59, 59);
  
  if (now > christmasEnd) {
    return currentYear + 1;
  }
  return currentYear;
}
