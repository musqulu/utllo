// Roman numeral conversion utilities

const ROMAN_VALUES: [string, number][] = [
  ["M", 1000],
  ["CM", 900],
  ["D", 500],
  ["CD", 400],
  ["C", 100],
  ["XC", 90],
  ["L", 50],
  ["XL", 40],
  ["X", 10],
  ["IX", 9],
  ["V", 5],
  ["IV", 4],
  ["I", 1],
];

const ROMAN_MAP: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

// Strict regex for valid Roman numerals (1-3999)
const ROMAN_REGEX = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

/**
 * Convert an Arabic number (1-3999) to a Roman numeral string.
 * Returns empty string for out-of-range values.
 */
export function toRoman(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) return "";

  let result = "";
  let remaining = num;

  for (const [symbol, value] of ROMAN_VALUES) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
}

/**
 * Convert a Roman numeral string to an Arabic number.
 * Returns 0 for invalid input.
 */
export function fromRoman(roman: string): number {
  const upper = roman.trim().toUpperCase();
  if (!isValidRoman(upper)) return 0;

  let result = 0;

  for (let i = 0; i < upper.length; i++) {
    const current = ROMAN_MAP[upper[i]];
    const next = i + 1 < upper.length ? ROMAN_MAP[upper[i + 1]] : 0;

    if (current < next) {
      result -= current;
    } else {
      result += current;
    }
  }

  return result;
}

/**
 * Validate whether a string is a well-formed Roman numeral (1-3999).
 */
export function isValidRoman(roman: string): boolean {
  const upper = roman.trim().toUpperCase();
  if (upper.length === 0) return false;
  return ROMAN_REGEX.test(upper);
}
