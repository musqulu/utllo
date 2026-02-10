// Polish number-to-words converter with currency support

const ONES = [
  "", "jeden", "dwa", "trzy", "cztery", "pięć",
  "sześć", "siedem", "osiem", "dziewięć", "dziesięć",
  "jedenaście", "dwanaście", "trzynaście", "czternaście", "piętnaście",
  "szesnaście", "siedemnaście", "osiemnaście", "dziewiętnaście",
];

const TENS = [
  "", "", "dwadzieścia", "trzydzieści", "czterdzieści", "pięćdziesiąt",
  "sześćdziesiąt", "siedemdziesiąt", "osiemdziesiąt", "dziewięćdziesiąt",
];

const HUNDREDS = [
  "", "sto", "dwieście", "trzysta", "czterysta", "pięćset",
  "sześćset", "siedemset", "osiemset", "dziewięćset",
];

// [singular, plural (2-4), plural (5+)]
const SCALE: [string, string, string][] = [
  ["", "", ""],
  ["tysiąc", "tysiące", "tysięcy"],
  ["milion", "miliony", "milionów"],
  ["miliard", "miliardy", "miliardów"],
  ["bilion", "biliony", "bilionów"],
  ["biliard", "biliardy", "biliardów"],
  ["trylion", "tryliony", "trylionów"],
];

function getPolishPlural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n);
  if (abs === 1) return forms[0];
  const lastTwo = abs % 100;
  const lastOne = abs % 10;
  if (lastTwo >= 12 && lastTwo <= 14) return forms[2];
  if (lastOne >= 2 && lastOne <= 4) return forms[1];
  return forms[2];
}

function convertHundreds(n: number): string {
  if (n === 0) return "";

  const parts: string[] = [];
  const h = Math.floor(n / 100);
  const remainder = n % 100;

  if (h > 0) {
    parts.push(HUNDREDS[h]);
  }

  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(ONES[remainder]);
    } else {
      const t = Math.floor(remainder / 10);
      const o = remainder % 10;
      parts.push(TENS[t]);
      if (o > 0) {
        parts.push(ONES[o]);
      }
    }
  }

  return parts.join(" ");
}

/**
 * Convert a non-negative integer to Polish words.
 * Supports numbers up to trylions.
 */
function integerToWords(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return `minus ${integerToWords(-n)}`;

  const parts: string[] = [];
  let remaining = Math.floor(n);
  let scaleIndex = 0;

  while (remaining > 0) {
    const chunk = remaining % 1000;
    remaining = Math.floor(remaining / 1000);

    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk);
      if (scaleIndex === 0) {
        parts.unshift(chunkWords);
      } else {
        const scaleWord = getPolishPlural(chunk, SCALE[scaleIndex]);
        // Special case: "tysiąc" (not "jeden tysiąc") when chunk is exactly 1
        if (chunk === 1 && scaleIndex >= 1) {
          parts.unshift(scaleWord);
        } else {
          parts.unshift(`${chunkWords} ${scaleWord}`);
        }
      }
    }

    scaleIndex++;
  }

  return parts.join(" ");
}

/**
 * Convert a number to Polish words (plain number, no currency).
 */
export function numberToPolishWords(value: number): string {
  if (!isFinite(value)) return "";
  if (value === 0) return "zero";

  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const intPart = Math.floor(absValue);
  const decimalStr = absValue.toFixed(10).split(".")[1]?.replace(/0+$/, "") || "";

  let result = integerToWords(intPart);

  if (decimalStr.length > 0) {
    const decimalWords = decimalStr.split("").map((d) => ONES[parseInt(d)] || "zero").join(" ");
    result += ` przecinek ${decimalWords}`;
  }

  if (isNegative) {
    result = `minus ${result}`;
  }

  return result;
}

// Currency helpers
const ZLOTY_FORMS: [string, string, string] = ["złoty", "złote", "złotych"];
const GROSZ_FORMS: [string, string, string] = ["grosz", "grosze", "groszy"];

/**
 * Convert a number to Polish currency words (PLN).
 * Rounds to 2 decimal places.
 * Example: 1234.56 → "jeden tysiąc dwieście trzydzieści cztery złote pięćdziesiąt sześć groszy"
 */
export function numberToPolishCurrency(value: number): string {
  if (!isFinite(value)) return "";

  const isNegative = value < 0;
  const absValue = Math.abs(value);

  // Round to 2 decimal places
  const rounded = Math.round(absValue * 100) / 100;
  const intPart = Math.floor(rounded);
  const decPart = Math.round((rounded - intPart) * 100);

  const intWords = integerToWords(intPart);
  const zlotyForm = getPolishPlural(intPart, ZLOTY_FORMS);

  let result = `${intWords} ${zlotyForm}`;

  if (decPart > 0) {
    const decWords = integerToWords(decPart);
    const groszForm = getPolishPlural(decPart, GROSZ_FORMS);
    result += ` ${decWords} ${groszForm}`;
  } else {
    result += ` zero groszy`;
  }

  if (isNegative) {
    result = `minus ${result}`;
  }

  return result;
}
