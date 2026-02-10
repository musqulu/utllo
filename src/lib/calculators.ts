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

// ============================================
// Sleep Calculator
// ============================================

/** Duration of one full sleep cycle in minutes */
export const SLEEP_CYCLE_MINUTES = 90;

/** Average time it takes to fall asleep in minutes */
export const FALL_ASLEEP_MINUTES = 14;

/** Number of cycles to calculate (3 through 6) */
export const SLEEP_CYCLES = [6, 5, 4, 3] as const;

export type SleepQuality = "optimal" | "good" | "minimum";

export interface SleepTimeResult {
  time: Date;
  cycles: number;
  totalHours: number;
  quality: SleepQuality;
}

/**
 * Get sleep quality rating based on number of cycles
 */
export function getSleepQuality(cycles: number): SleepQuality {
  if (cycles >= 5) return "optimal";
  if (cycles === 4) return "good";
  return "minimum";
}

/**
 * Get color classes for sleep quality
 */
export function getSleepQualityColor(quality: SleepQuality): string {
  switch (quality) {
    case "optimal":
      return "text-green-600 dark:text-green-400";
    case "good":
      return "text-yellow-600 dark:text-yellow-400";
    case "minimum":
      return "text-red-600 dark:text-red-400";
  }
}

/**
 * Get background color classes for sleep quality
 */
export function getSleepQualityBgColor(quality: SleepQuality): string {
  switch (quality) {
    case "optimal":
      return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
    case "good":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    case "minimum":
      return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
  }
}

/**
 * Calculate optimal bedtimes given a desired wake-up time.
 * Subtracts N cycles + fall-asleep time from the wake-up time.
 */
export function calculateBedtimes(wakeUpTime: Date): SleepTimeResult[] {
  return SLEEP_CYCLES.map((cycles) => {
    const totalSleepMinutes = cycles * SLEEP_CYCLE_MINUTES;
    const totalMinutes = totalSleepMinutes + FALL_ASLEEP_MINUTES;
    const bedtime = new Date(wakeUpTime.getTime() - totalMinutes * 60 * 1000);
    return {
      time: bedtime,
      cycles,
      totalHours: totalSleepMinutes / 60,
      quality: getSleepQuality(cycles),
    };
  });
}

/**
 * Calculate optimal wake-up times given a desired bedtime.
 * Adds fall-asleep time + N cycles to the bedtime.
 */
export function calculateWakeUpTimes(bedTime: Date): SleepTimeResult[] {
  return SLEEP_CYCLES.map((cycles) => {
    const totalSleepMinutes = cycles * SLEEP_CYCLE_MINUTES;
    const totalMinutes = totalSleepMinutes + FALL_ASLEEP_MINUTES;
    const wakeUp = new Date(bedTime.getTime() + totalMinutes * 60 * 1000);
    return {
      time: wakeUp,
      cycles,
      totalHours: totalSleepMinutes / 60,
      quality: getSleepQuality(cycles),
    };
  });
}

/**
 * Format a Date as HH:MM string
 */
export function formatSleepTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Create a Date object from hours and minutes (today's date)
 */
export function createTimeDate(hours: number, minutes: number): Date {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// ============================================
// Calorie Calculator (Mifflin-St Jeor)
// ============================================

export type Gender = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "lightlyActive"
  | "moderatelyActive"
  | "veryActive"
  | "extremelyActive";

export type CalorieGoalType =
  | "loseWeight"
  | "slowCut"
  | "maintenance"
  | "leanBulk"
  | "bulk";

export interface CalorieGoalResult {
  goal: CalorieGoalType;
  calories: number;
  adjustment: number;
  weeklyKgChange: number;
  macros: MacroSplit;
}

export interface MacroSplit {
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
}

export interface CalorieCalculationResult {
  bmr: number;
  tdee: number;
  goals: CalorieGoalResult[];
}

/** Activity level multipliers for TDEE calculation */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
  extremelyActive: 1.9,
};

/** Calorie adjustments per day for each goal */
export const GOAL_ADJUSTMENTS: Record<CalorieGoalType, number> = {
  loseWeight: -500,
  slowCut: -250,
  maintenance: 0,
  leanBulk: 250,
  bulk: 500,
};

/**
 * Approximate weekly kg change per goal.
 * 1 kg of body fat ~ 7700 kcal.
 */
const WEEKLY_KG_CHANGE: Record<CalorieGoalType, number> = {
  loseWeight: -0.45,
  slowCut: -0.23,
  maintenance: 0,
  leanBulk: 0.23,
  bulk: 0.45,
};

/**
 * Calculate BMR using Mifflin-St Jeor formula
 * Men:   BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
 * Women: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

/**
 * Calculate TDEE from BMR and activity level
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

/**
 * Calculate macro split based on calories and goal type
 * - Weight loss: higher protein (35%), moderate carbs (40%), lower fat (25%)
 * - Maintenance: balanced (30% protein, 40% carbs, 30% fat)
 * - Muscle gain: moderate protein (30%), higher carbs (45%), moderate fat (25%)
 */
export function calculateMacros(calories: number, goal: CalorieGoalType): MacroSplit {
  let proteinPct: number;
  let carbsPct: number;
  let fatPct: number;

  switch (goal) {
    case "loseWeight":
    case "slowCut":
      proteinPct = 0.35;
      carbsPct = 0.40;
      fatPct = 0.25;
      break;
    case "maintenance":
      proteinPct = 0.30;
      carbsPct = 0.40;
      fatPct = 0.30;
      break;
    case "leanBulk":
    case "bulk":
      proteinPct = 0.30;
      carbsPct = 0.45;
      fatPct = 0.25;
      break;
  }

  return {
    protein: Math.round((calories * proteinPct) / 4), // 4 kcal per gram of protein
    carbs: Math.round((calories * carbsPct) / 4),      // 4 kcal per gram of carbs
    fat: Math.round((calories * fatPct) / 9),           // 9 kcal per gram of fat
  };
}

/**
 * Calculate all goal-based calorie targets from TDEE
 */
export function calculateGoalCalories(tdee: number): CalorieGoalResult[] {
  const goals: CalorieGoalType[] = [
    "loseWeight",
    "slowCut",
    "maintenance",
    "leanBulk",
    "bulk",
  ];

  return goals.map((goal) => {
    const adjustment = GOAL_ADJUSTMENTS[goal];
    const calories = Math.round(tdee + adjustment);
    return {
      goal,
      calories,
      adjustment,
      weeklyKgChange: WEEKLY_KG_CHANGE[goal],
      macros: calculateMacros(calories, goal),
    };
  });
}

/**
 * Full calorie calculation pipeline
 */
export function calculateCalories(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel
): CalorieCalculationResult {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const goals = calculateGoalCalories(tdee);
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), goals };
}

/**
 * Validate calorie calculator inputs
 */
export function validateCalorieInputs(
  weight: number,
  height: number,
  age: number
): { valid: boolean; error?: string } {
  if (isNaN(weight) || isNaN(height) || isNaN(age)) {
    return { valid: false, error: "Wszystkie wartości muszą być liczbami" };
  }
  if (weight <= 0 || weight > 500) {
    return { valid: false, error: "Waga musi być między 1 a 500 kg" };
  }
  if (height <= 0 || height > 300) {
    return { valid: false, error: "Wzrost musi być między 1 a 300 cm" };
  }
  if (age < 1 || age > 120) {
    return { valid: false, error: "Wiek musi być między 1 a 120 lat" };
  }
  return { valid: true };
}

// ============================================================
// Blood Type Calculator
// ============================================================

export type BloodType = "A" | "B" | "AB" | "O";
export type RhFactor = "+" | "-";

export interface BloodTypeResult {
  type: string; // e.g. "A+", "O-"
  probability: number; // 0-100
}

/**
 * ABO alleles: each phenotype maps to possible genotype pairs.
 * Since we don't know the exact genotype, we assume equal probability
 * for each possible genotype.
 */
type Allele = "A" | "B" | "O";

const ABO_GENOTYPES: Record<BloodType, [Allele, Allele][]> = {
  A: [["A", "A"], ["A", "O"]],
  B: [["B", "B"], ["B", "O"]],
  AB: [["A", "B"]],
  O: [["O", "O"]],
};

/**
 * Rh alleles: + can be DD or Dd, - is dd.
 */
type RhAllele = "D" | "d";

const RH_GENOTYPES: Record<RhFactor, [RhAllele, RhAllele][]> = {
  "+": [["D", "D"], ["D", "d"]],
  "-": [["d", "d"]],
};

/**
 * Determine phenotype from a pair of ABO alleles.
 */
function aboPhenotype(a1: Allele, a2: Allele): BloodType {
  const set = new Set([a1, a2]);
  if (set.has("A") && set.has("B")) return "AB";
  if (set.has("A")) return "A";
  if (set.has("B")) return "B";
  return "O";
}

/**
 * Determine Rh phenotype from a pair of Rh alleles.
 */
function rhPhenotype(r1: RhAllele, r2: RhAllele): RhFactor {
  return r1 === "D" || r2 === "D" ? "+" : "-";
}

/**
 * Calculate possible child blood types from parents' blood types.
 * Uses Punnett square with equal probability assumption for heterozygous genotypes.
 */
export function calculateChildBloodTypes(
  parent1Type: BloodType,
  parent1Rh: RhFactor,
  parent2Type: BloodType,
  parent2Rh: RhFactor
): BloodTypeResult[] {
  const p1AboGenotypes = ABO_GENOTYPES[parent1Type];
  const p2AboGenotypes = ABO_GENOTYPES[parent2Type];
  const p1RhGenotypes = RH_GENOTYPES[parent1Rh];
  const p2RhGenotypes = RH_GENOTYPES[parent2Rh];

  // Count outcomes for each full blood type
  const outcomes: Record<string, number> = {};
  let totalCombinations = 0;

  // For each possible genotype combination of parents
  for (const p1Abo of p1AboGenotypes) {
    for (const p2Abo of p2AboGenotypes) {
      for (const p1Rh of p1RhGenotypes) {
        for (const p2Rh of p2RhGenotypes) {
          // ABO Punnett square: 4 combinations per parent genotype pair
          for (const a1 of p1Abo) {
            for (const a2 of p2Abo) {
              // Rh Punnett square: 4 combinations per parent genotype pair
              for (const r1 of p1Rh) {
                for (const r2 of p2Rh) {
                  const abo = aboPhenotype(a1, a2);
                  const rh = rhPhenotype(r1, r2);
                  const key = `${abo}${rh}`;
                  outcomes[key] = (outcomes[key] || 0) + 1;
                  totalCombinations++;
                }
              }
            }
          }
        }
      }
    }
  }

  // Convert to percentages and sort by probability (descending)
  const results: BloodTypeResult[] = Object.entries(outcomes)
    .map(([type, count]) => ({
      type,
      probability: Math.round((count / totalCombinations) * 10000) / 100,
    }))
    .sort((a, b) => b.probability - a.probability);

  return results;
}

// ============================================================
// Inflation Calculator
// ============================================================

export interface InflationYearData {
  year: number;
  value: number; // equivalent cost in that year
  loss: number; // cumulative purchasing power loss
  lossPercent: number;
}

export interface InflationResult {
  futureValue: number;
  purchasingPowerLoss: number;
  purchasingPowerPercent: number;
  yearByYear: InflationYearData[];
}

/**
 * Calculate how inflation changes the value of money over time.
 * futureValue = amount * (1 + rate/100)^years
 * This represents how much the same goods/services would cost after N years.
 * purchasingPowerLoss = futureValue - amount (how much more you'd pay).
 */
export function calculateInflation(
  amount: number,
  annualRate: number,
  years: number
): InflationResult {
  const yearByYear: InflationYearData[] = [];

  for (let y = 1; y <= years; y++) {
    const value = amount * Math.pow(1 + annualRate / 100, y);
    const loss = value - amount;
    const lossPercent = (loss / amount) * 100;
    yearByYear.push({
      year: y,
      value: Math.round(value * 100) / 100,
      loss: Math.round(loss * 100) / 100,
      lossPercent: Math.round(lossPercent * 100) / 100,
    });
  }

  const futureValue = yearByYear.length > 0
    ? yearByYear[yearByYear.length - 1].value
    : amount;
  const purchasingPowerLoss = Math.round((futureValue - amount) * 100) / 100;
  const purchasingPowerPercent = Math.round(((futureValue - amount) / amount) * 10000) / 100;

  return {
    futureValue,
    purchasingPowerLoss,
    purchasingPowerPercent,
    yearByYear,
  };
}

/**
 * Calculate effective annual inflation rate from past and current amounts.
 * rate = ((currentAmount / pastAmount)^(1/years) - 1) * 100
 */
export function calculateEffectiveInflation(
  pastAmount: number,
  currentAmount: number,
  years: number
): number {
  if (pastAmount <= 0 || years <= 0) return 0;
  const rate = (Math.pow(currentAmount / pastAmount, 1 / years) - 1) * 100;
  return Math.round(rate * 100) / 100;
}

/**
 * Validate inflation calculator inputs.
 */
export function validateInflationInputs(
  amount: number,
  rate: number,
  years: number
): { valid: boolean; error?: string } {
  if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
    return { valid: false, error: "Wszystkie wartości muszą być liczbami" };
  }
  if (amount <= 0) {
    return { valid: false, error: "Kwota musi być większa niż 0" };
  }
  if (rate < -50 || rate > 1000) {
    return { valid: false, error: "Stopa inflacji musi być między -50% a 1000%" };
  }
  if (years < 1 || years > 100 || !Number.isInteger(years)) {
    return { valid: false, error: "Liczba lat musi być liczbą całkowitą od 1 do 100" };
  }
  return { valid: true };
}

// ============================================================
// Dog Years Calculator
// ============================================================

export type DogSize = "small" | "medium" | "large" | "giant";

export type DogLifeStage =
  | "puppy"
  | "young"
  | "adult"
  | "senior"
  | "geriatric";

export interface DogYearsResult {
  humanYears: number;
  lifeStage: DogLifeStage;
}

/**
 * Incremental human-years per dog-year, based on veterinary research.
 * Year 1 and 2 are fast development; year 3+ depends on size.
 * Data based on American Veterinary Medical Association guidelines
 * and the University of California San Diego 2019 study adaptations.
 */
const DOG_AGING_RATES: Record<DogSize, number[]> = {
  //           yr1  yr2  yr3+ (per additional year)
  small:  [15, 9, 4],   // <10 kg
  medium: [15, 9, 5],   // 10-25 kg
  large:  [15, 9, 6],   // 25-45 kg
  giant:  [15, 9, 8],   // >45 kg
};

/**
 * Life stage thresholds in human-equivalent years.
 */
function getDogLifeStage(humanYears: number, size: DogSize): DogLifeStage {
  // Smaller dogs become seniors later, larger dogs earlier
  const seniorThresholds: Record<DogSize, number> = {
    small: 50,
    medium: 45,
    large: 42,
    giant: 38,
  };
  const geriatricThresholds: Record<DogSize, number> = {
    small: 70,
    medium: 65,
    large: 60,
    giant: 55,
  };

  if (humanYears <= 12) return "puppy";
  if (humanYears <= 24) return "young";
  if (humanYears < seniorThresholds[size]) return "adult";
  if (humanYears < geriatricThresholds[size]) return "senior";
  return "geriatric";
}

/**
 * Calculate human-equivalent age for a dog.
 * Supports fractional dog ages (e.g. 1.5 years).
 */
export function calculateDogYears(
  dogAge: number,
  size: DogSize
): DogYearsResult {
  const rates = DOG_AGING_RATES[size];
  let humanYears = 0;

  if (dogAge <= 0) {
    return { humanYears: 0, lifeStage: "puppy" };
  }

  if (dogAge <= 1) {
    // Proportional first year
    humanYears = dogAge * rates[0];
  } else if (dogAge <= 2) {
    // Full first year + proportional second year
    humanYears = rates[0] + (dogAge - 1) * rates[1];
  } else {
    // First two years + additional years at size-specific rate
    humanYears = rates[0] + rates[1] + (dogAge - 2) * rates[2];
  }

  humanYears = Math.round(humanYears * 10) / 10;

  return {
    humanYears,
    lifeStage: getDogLifeStage(humanYears, size),
  };
}

/**
 * Average life expectancy in dog years by size.
 */
export const DOG_LIFE_EXPECTANCY: Record<DogSize, { min: number; max: number }> = {
  small: { min: 12, max: 16 },
  medium: { min: 10, max: 14 },
  large: { min: 8, max: 12 },
  giant: { min: 6, max: 10 },
};

// =====================================================
// Cat Years Calculator
// =====================================================

export type CatLifeStage = "kitten" | "junior" | "adult" | "mature" | "senior" | "geriatric";

export interface CatYearsResult {
  humanYears: number;
  lifeStage: CatLifeStage;
}

/**
 * Calculate human equivalent age for a cat.
 * Formula:
 *   Year 1 = 15 human years
 *   Year 2 = 24 human years (total)
 *   Each year after 2 = +4 human years
 * Fractional values are interpolated linearly within each range.
 */
export function calculateCatHumanAge(catAge: number): number {
  if (catAge <= 0) return 0;

  let humanYears: number;

  if (catAge <= 1) {
    humanYears = catAge * 15;
  } else if (catAge <= 2) {
    humanYears = 15 + (catAge - 1) * 9; // 9 more to reach 24 at year 2
  } else {
    humanYears = 24 + (catAge - 2) * 4;
  }

  return Math.round(humanYears * 10) / 10;
}

/**
 * Get cat life stage based on cat age in years.
 */
export function getCatLifeStage(catAge: number): CatLifeStage {
  if (catAge < 0.5) return "kitten";
  if (catAge < 3) return "junior";
  if (catAge < 7) return "adult";
  if (catAge < 11) return "mature";
  if (catAge < 15) return "senior";
  return "geriatric";
}

/**
 * Calculate cat years result.
 */
export function calculateCatYears(catAge: number): CatYearsResult {
  return {
    humanYears: calculateCatHumanAge(catAge),
    lifeStage: getCatLifeStage(catAge),
  };
}

/**
 * Average life expectancy for cats.
 */
export const CAT_LIFE_EXPECTANCY = {
  indoor: { min: 12, max: 18 },
  outdoor: { min: 5, max: 10 },
};
