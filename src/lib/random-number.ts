/**
 * Generate a random integer between min and max (inclusive)
 * Uses crypto.getRandomValues for better randomness
 */
export function generateRandomNumber(min: number, max: number): number {
  if (min > max) {
    [min, max] = [max, min];
  }
  
  const range = max - min + 1;
  
  // Use crypto for better randomness
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return min + (array[0] % range);
  }
  
  // Fallback to Math.random
  return Math.floor(Math.random() * range) + min;
}

/**
 * Validate min/max inputs
 */
export function validateRange(min: number, max: number): { valid: boolean; error?: string } {
  if (isNaN(min) || isNaN(max)) {
    return { valid: false, error: "Wartości muszą być liczbami" };
  }
  
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    return { valid: false, error: "Wartości muszą być liczbami całkowitymi" };
  }
  
  if (min > max) {
    return { valid: false, error: "Minimum nie może być większe od maksimum" };
  }
  
  const MAX_SAFE = Number.MAX_SAFE_INTEGER;
  const MIN_SAFE = Number.MIN_SAFE_INTEGER;
  
  if (min < MIN_SAFE || max > MAX_SAFE) {
    return { valid: false, error: "Wartości poza bezpiecznym zakresem" };
  }
  
  return { valid: true };
}

export const DEFAULT_MIN = 1;
export const DEFAULT_MAX = 100;
export const DEFAULT_COUNT = 5;

/**
 * Generate multiple random numbers
 * @param min - minimum value (inclusive)
 * @param max - maximum value (inclusive)
 * @param count - how many numbers to generate
 * @param unique - if true, all numbers will be unique (no duplicates)
 * @param sorted - if true, results will be sorted ascending
 */
export function generateMultipleNumbers(
  min: number,
  max: number,
  count: number,
  unique: boolean = false,
  sorted: boolean = false
): number[] {
  const range = max - min + 1;
  
  // If unique and count > range, limit count
  const actualCount = unique ? Math.min(count, range) : count;
  
  const numbers: number[] = [];
  const usedNumbers = new Set<number>();
  
  while (numbers.length < actualCount) {
    const num = generateRandomNumber(min, max);
    
    if (unique) {
      if (!usedNumbers.has(num)) {
        usedNumbers.add(num);
        numbers.push(num);
      }
    } else {
      numbers.push(num);
    }
  }
  
  if (sorted) {
    numbers.sort((a, b) => a - b);
  }
  
  return numbers;
}

/**
 * Validate count input
 */
export function validateCount(count: number, min: number, max: number, unique: boolean): { valid: boolean; error?: string } {
  if (isNaN(count) || !Number.isInteger(count)) {
    return { valid: false, error: "Ilość musi być liczbą całkowitą" };
  }
  
  if (count < 1) {
    return { valid: false, error: "Ilość musi być większa od 0" };
  }
  
  if (count > 1000) {
    return { valid: false, error: "Maksymalna ilość to 1000" };
  }
  
  const range = max - min + 1;
  if (unique && count > range) {
    return { valid: false, error: `Nie można wylosować ${count} unikalnych liczb z zakresu ${range}` };
  }
  
  return { valid: true };
}
