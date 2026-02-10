// Caesar cipher encrypt/decrypt for Latin alphabet (A-Z, a-z)
// Non-letter characters (digits, spaces, punctuation, Polish diacritics) pass through unchanged.

const UPPER_A = 65; // 'A'
const LOWER_A = 97; // 'a'
const ALPHA_SIZE = 26;

function shiftChar(char: string, shift: number): string {
  const code = char.charCodeAt(0);

  // Uppercase A-Z
  if (code >= UPPER_A && code < UPPER_A + ALPHA_SIZE) {
    return String.fromCharCode(((code - UPPER_A + shift) % ALPHA_SIZE + ALPHA_SIZE) % ALPHA_SIZE + UPPER_A);
  }

  // Lowercase a-z
  if (code >= LOWER_A && code < LOWER_A + ALPHA_SIZE) {
    return String.fromCharCode(((code - LOWER_A + shift) % ALPHA_SIZE + ALPHA_SIZE) % ALPHA_SIZE + LOWER_A);
  }

  // Everything else passes through unchanged
  return char;
}

/**
 * Encrypt text using the Caesar cipher with the given shift (1-25).
 * Each Latin letter is shifted forward by `shift` positions.
 * Non-Latin characters (Polish diacritics, digits, punctuation, spaces) are unchanged.
 */
export function caesarEncrypt(text: string, shift: number): string {
  const normalizedShift = ((shift % ALPHA_SIZE) + ALPHA_SIZE) % ALPHA_SIZE;
  return text.split("").map((ch) => shiftChar(ch, normalizedShift)).join("");
}

/**
 * Decrypt text using the Caesar cipher with the given shift (1-25).
 * Reverses the encryption by shifting backward.
 */
export function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, -shift);
}
