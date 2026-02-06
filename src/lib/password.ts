export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const SIMILAR_CHARS = "0O1lI";

export function generatePassword(options: PasswordOptions): string {
  let chars = "";

  if (options.uppercase) {
    chars += UPPERCASE;
  }
  if (options.lowercase) {
    chars += LOWERCASE;
  }
  if (options.numbers) {
    chars += NUMBERS;
  }
  if (options.symbols) {
    chars += SYMBOLS;
  }

  // Remove similar characters if option is enabled
  if (options.excludeSimilar) {
    chars = chars
      .split("")
      .filter((char) => !SIMILAR_CHARS.includes(char))
      .join("");
  }

  // Fallback to lowercase if no options selected
  if (chars.length === 0) {
    chars = LOWERCASE;
  }

  let password = "";
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  for (let i = 0; i < options.length; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
}

export interface StrengthResult {
  score: number;
  label: string;
  color: string;
}

export function calculateStrength(password: string): StrengthResult {
  let score = 0;

  // Length scoring (up to 40 points)
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length >= 24) score += 10;

  // Character variety scoring (up to 40 points)
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 10;

  // Bonus for mixing (up to 20 points)
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  
  if (varietyCount >= 3) score += 10;
  if (varietyCount === 4) score += 10;

  // Cap at 100
  score = Math.min(score, 100);

  // Determine label and color
  if (score <= 25) {
    return { score, label: "Bardzo słabe", color: "bg-red-500" };
  } else if (score <= 50) {
    return { score, label: "Słabe", color: "bg-orange-500" };
  } else if (score <= 75) {
    return { score, label: "Średnie", color: "bg-yellow-500" };
  } else if (score <= 90) {
    return { score, label: "Silne", color: "bg-green-500" };
  } else {
    return { score, label: "Bardzo silne", color: "bg-green-700" };
  }
}

export const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
};
