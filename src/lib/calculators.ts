/**
 * Proportion Calculator
 * Solves the proportion A:B = C:X for X
 * Formula: X = (B × C) ÷ A
 */
export function solveProportion(a: number, b: number, c: number): number {
  if (a === 0) {
    throw new Error("Wartość A nie może być równa 0");
  }
  return (b * c) / a;
}

/**
 * Validate proportion inputs
 */
export function validateProportionInputs(
  a: number,
  b: number,
  c: number
): { valid: boolean; error?: string } {
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    return { valid: false, error: "Wszystkie wartości muszą być liczbami" };
  }
  if (a === 0) {
    return { valid: false, error: "Wartość A nie może być równa 0" };
  }
  return { valid: true };
}

/**
 * BMI Calculator
 * Calculate Body Mass Index from weight (kg) and height (cm)
 * Formula: BMI = weight / (height in meters)²
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) {
    throw new Error("Wzrost musi być większy od 0");
  }
  if (weightKg <= 0) {
    throw new Error("Waga musi być większa od 0");
  }
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * BMI Categories according to WHO standards
 */
export type BMICategory =
  | "underweight"
  | "normal"
  | "overweight"
  | "obese"
  | "severelyObese"
  | "morbidlyObese";

/**
 * Get BMI category based on BMI value
 */
export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) {
    return "underweight";
  } else if (bmi < 25) {
    return "normal";
  } else if (bmi < 30) {
    return "overweight";
  } else if (bmi < 35) {
    return "obese";
  } else if (bmi < 40) {
    return "severelyObese";
  } else {
    return "morbidlyObese";
  }
}

/**
 * Get color class for BMI category (for visual indicator)
 */
export function getBMICategoryColor(category: BMICategory): string {
  switch (category) {
    case "underweight":
      return "text-blue-500";
    case "normal":
      return "text-green-500";
    case "overweight":
      return "text-yellow-500";
    case "obese":
      return "text-orange-500";
    case "severelyObese":
      return "text-red-500";
    case "morbidlyObese":
      return "text-red-700";
  }
}

/**
 * Get background color class for BMI category
 */
export function getBMICategoryBgColor(category: BMICategory): string {
  switch (category) {
    case "underweight":
      return "bg-blue-100 dark:bg-blue-900/30";
    case "normal":
      return "bg-green-100 dark:bg-green-900/30";
    case "overweight":
      return "bg-yellow-100 dark:bg-yellow-900/30";
    case "obese":
      return "bg-orange-100 dark:bg-orange-900/30";
    case "severelyObese":
      return "bg-red-100 dark:bg-red-900/30";
    case "morbidlyObese":
      return "bg-red-200 dark:bg-red-900/50";
  }
}

/**
 * Validate BMI inputs
 */
export function validateBMIInputs(
  weightKg: number,
  heightCm: number
): { valid: boolean; error?: string } {
  if (isNaN(weightKg) || isNaN(heightCm)) {
    return { valid: false, error: "Waga i wzrost muszą być liczbami" };
  }
  if (weightKg <= 0) {
    return { valid: false, error: "Waga musi być większa od 0" };
  }
  if (heightCm <= 0) {
    return { valid: false, error: "Wzrost musi być większy od 0" };
  }
  if (weightKg > 500) {
    return { valid: false, error: "Waga wydaje się nieprawidłowa" };
  }
  if (heightCm > 300) {
    return { valid: false, error: "Wzrost wydaje się nieprawidłowy" };
  }
  return { valid: true };
}

/**
 * BMI ranges for reference
 */
export const BMI_RANGES = [
  { category: "underweight" as BMICategory, min: 0, max: 18.5, label: "Niedowaga" },
  { category: "normal" as BMICategory, min: 18.5, max: 25, label: "Waga prawidłowa" },
  { category: "overweight" as BMICategory, min: 25, max: 30, label: "Nadwaga" },
  { category: "obese" as BMICategory, min: 30, max: 35, label: "Otyłość I stopnia" },
  { category: "severelyObese" as BMICategory, min: 35, max: 40, label: "Otyłość II stopnia" },
  { category: "morbidlyObese" as BMICategory, min: 40, max: Infinity, label: "Otyłość III stopnia" },
] as const;

// ============================================
// Weighted Average Calculator
// ============================================

export interface WeightedValue {
  id: string;
  value: number | "";
  weight: number | "";
}

export interface WeightedAverageResult {
  average: number;
  sumOfWeights: number;
  validEntries: number;
}

/**
 * Calculate weighted average
 * Formula: Σ(value × weight) / Σ(weight)
 */
export function calculateWeightedAverage(
  entries: WeightedValue[]
): WeightedAverageResult | null {
  const validEntries = entries.filter(
    (e) => e.value !== "" && e.weight !== "" && !isNaN(Number(e.value)) && !isNaN(Number(e.weight))
  );

  if (validEntries.length === 0) {
    return null;
  }

  let sumOfProducts = 0;
  let sumOfWeights = 0;

  for (const entry of validEntries) {
    const value = Number(entry.value);
    const weight = Number(entry.weight);
    sumOfProducts += value * weight;
    sumOfWeights += weight;
  }

  if (sumOfWeights === 0) {
    return null;
  }

  return {
    average: sumOfProducts / sumOfWeights,
    sumOfWeights,
    validEntries: validEntries.length,
  };
}

/**
 * Validate weighted average entries
 */
export function validateWeightedAverageEntries(
  entries: WeightedValue[]
): { valid: boolean; error?: string } {
  const validEntries = entries.filter(
    (e) => e.value !== "" && e.weight !== ""
  );

  if (validEntries.length === 0) {
    return { valid: false, error: "Wprowadź co najmniej jedną parę wartość-waga" };
  }

  const hasNegativeWeight = validEntries.some(
    (e) => Number(e.weight) < 0
  );
  if (hasNegativeWeight) {
    return { valid: false, error: "Wagi nie mogą być ujemne" };
  }

  const sumOfWeights = validEntries.reduce(
    (sum, e) => sum + Number(e.weight),
    0
  );
  if (sumOfWeights === 0) {
    return { valid: false, error: "Suma wag musi być większa od 0" };
  }

  return { valid: true };
}

/**
 * Generate unique ID for weighted value entries
 */
export function generateEntryId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Create empty weighted value entry
 */
export function createEmptyEntry(): WeightedValue {
  return {
    id: generateEntryId(),
    value: "",
    weight: "",
  };
}

/**
 * Example grades for Polish school system
 */
export const EXAMPLE_GRADES: WeightedValue[] = [
  { id: "1", value: 5, weight: 3 },  // Sprawdzian - waga 3
  { id: "2", value: 4, weight: 2 },  // Kartkówka - waga 2
  { id: "3", value: 5, weight: 1 },  // Odpowiedź - waga 1
  { id: "4", value: 3, weight: 2 },  // Kartkówka - waga 2
  { id: "5", value: 4, weight: 1 },  // Praca domowa - waga 1
];

/**
 * Format weighted average result for display
 */
export function formatWeightedAverage(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}
