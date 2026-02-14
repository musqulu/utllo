import {
  KeyRound,
  FileText,
  QrCode,
  Type,
  LetterText,
  ALargeSmall,
  Droplets,
  TrendingUp,
  Dog,
  Image,
  Dices,
  Sparkles,
  HelpCircle,
  Calculator,
  Scale,
  Sigma,
  Wrench,
  ArrowRightLeft,
  Sun,
  Gift,
  Calendar,
  Moon,
  Flame,
  Monitor,
  CaseSensitive,
  Lock,
  Crown,
  Cat,
  Timer,
  LucideIcon,
} from "lucide-react";

export type ToolCategory = "tools" | "generators" | "converters" | "randomizers" | "calculators";

export interface CategoryMeta {
  slugs: Record<string, string>;
  icon: LucideIcon;
}

export const categoryMeta: Record<ToolCategory, CategoryMeta> = {
  tools: { slugs: { pl: "narzedzia", en: "tools" }, icon: Wrench },
  generators: { slugs: { pl: "generatory", en: "generators" }, icon: Sparkles },
  converters: { slugs: { pl: "konwertery", en: "converters" }, icon: ArrowRightLeft },
  randomizers: { slugs: { pl: "losuj", en: "randomizers" }, icon: Dices },
  calculators: { slugs: { pl: "kalkulatory", en: "calculators" }, icon: Calculator },
};

export const allCategoryIds: ToolCategory[] = ["tools", "generators", "converters", "randomizers", "calculators"];

export interface Tool {
  id: string;
  slugs: Record<string, string>;
  icon: LucideIcon;
  isReady: boolean;
  category: ToolCategory;
}

export const tools: Tool[] = [
  // Generatory (Generators)
  {
    id: "password-generator",
    slugs: { pl: "generator-hasel", en: "password-generator" },
    icon: KeyRound,
    isReady: true,
    category: "generators",
  },
  {
    id: "lorem-ipsum",
    slugs: { pl: "generator-lorem-ipsum", en: "lorem-ipsum-generator" },
    icon: FileText,
    isReady: true,
    category: "generators",
  },
  {
    id: "font-generator",
    slugs: { pl: "generator-czcionek", en: "font-generator" },
    icon: ALargeSmall,
    isReady: true,
    category: "generators",
  },

  // Narzędzia (Tools)
  {
    id: "qr-generator",
    slugs: { pl: "generator-qr", en: "qr-generator" },
    icon: QrCode,
    isReady: true,
    category: "generators",
  },
  {
    id: "character-counter",
    slugs: { pl: "licznik-znakow", en: "character-counter" },
    icon: Type,
    isReady: true,
    category: "tools",
  },
  {
    id: "word-counter",
    slugs: { pl: "licznik-slow", en: "word-counter" },
    icon: LetterText,
    isReady: true,
    category: "tools",
  },
  {
    id: "dice-roll",
    slugs: { pl: "rzut-kostka", en: "dice-roller" },
    icon: Dices,
    isReady: true,
    category: "randomizers",
  },
  {
    id: "countdown-vacation",
    slugs: { pl: "odliczanie-do-wakacji", en: "vacation-countdown" },
    icon: Sun,
    isReady: true,
    category: "tools",
  },
  {
    id: "countdown-christmas",
    slugs: { pl: "odliczanie-do-swiat", en: "christmas-countdown" },
    icon: Gift,
    isReady: true,
    category: "tools",
  },
  {
    id: "countdown-date",
    slugs: { pl: "odliczanie-do-daty", en: "date-countdown" },
    icon: Calendar,
    isReady: true,
    category: "tools",
  },
  {
    id: "white-screen",
    slugs: { pl: "bialy-ekran", en: "white-screen" },
    icon: Monitor,
    isReady: true,
    category: "tools",
  },
  {
    id: "amount-in-words",
    slugs: { pl: "kwota-slownie", en: "amount-in-words" },
    icon: CaseSensitive,
    isReady: true,
    category: "tools",
  },
  {
    id: "caesar-cipher",
    slugs: { pl: "szyfr-cezara", en: "caesar-cipher" },
    icon: Lock,
    isReady: true,
    category: "tools",
  },
  {
    id: "metronome",
    slugs: { pl: "metronom", en: "metronome" },
    icon: Timer,
    isReady: true,
    category: "tools",
  },

  // Konwertery (Converters)
  {
    id: "pdf-to-word",
    slugs: { pl: "pdf-na-word", en: "pdf-to-word" },
    icon: FileText,
    isReady: true,
    category: "converters",
  },
  {
    id: "pdf-to-jpg",
    slugs: { pl: "pdf-na-jpg", en: "pdf-to-jpg" },
    icon: Image,
    isReady: true,
    category: "converters",
  },
  {
    id: "pdf-to-png",
    slugs: { pl: "pdf-na-png", en: "pdf-to-png" },
    icon: Image,
    isReady: true,
    category: "converters",
  },

  // Losuj (Randomizers)
  {
    id: "random-number",
    slugs: { pl: "losuj-liczbe", en: "random-number" },
    icon: Dices,
    isReady: true,
    category: "randomizers",
  },
  {
    id: "random-numbers",
    slugs: { pl: "losuj-liczby", en: "random-numbers" },
    icon: Dices,
    isReady: true,
    category: "randomizers",
  },
  {
    id: "random-tarot",
    slugs: { pl: "losuj-karte-tarota", en: "random-tarot" },
    icon: Sparkles,
    isReady: true,
    category: "randomizers",
  },
  {
    id: "random-yesno",
    slugs: { pl: "losuj-tak-nie", en: "random-yes-no" },
    icon: HelpCircle,
    isReady: true,
    category: "randomizers",
  },

  // Kalkulatory (Calculators)
  {
    id: "proportion-calculator",
    slugs: { pl: "kalkulator-proporcji", en: "proportion-calculator" },
    icon: Calculator,
    isReady: true,
    category: "calculators",
  },
  {
    id: "bmi-calculator",
    slugs: { pl: "kalkulator-bmi", en: "bmi-calculator" },
    icon: Scale,
    isReady: true,
    category: "calculators",
  },
  {
    id: "weighted-average",
    slugs: { pl: "srednia-wazona", en: "weighted-average" },
    icon: Sigma,
    isReady: true,
    category: "calculators",
  },
  {
    id: "sleep-calculator",
    slugs: { pl: "kalkulator-snu", en: "sleep-calculator" },
    icon: Moon,
    isReady: true,
    category: "calculators",
  },
  {
    id: "calorie-calculator",
    slugs: { pl: "kalkulator-kalorii", en: "calorie-calculator" },
    icon: Flame,
    isReady: true,
    category: "calculators",
  },
  {
    id: "blood-type-calculator",
    slugs: { pl: "kalkulator-grupy-krwi", en: "blood-type-calculator" },
    icon: Droplets,
    isReady: true,
    category: "calculators",
  },
  {
    id: "inflation-calculator",
    slugs: { pl: "kalkulator-inflacji", en: "inflation-calculator" },
    icon: TrendingUp,
    isReady: true,
    category: "calculators",
  },
  {
    id: "dog-years-calculator",
    slugs: { pl: "kalkulator-psich-lat", en: "dog-years-calculator" },
    icon: Dog,
    isReady: true,
    category: "calculators",
  },
  {
    id: "roman-numerals",
    slugs: { pl: "kalkulator-cyfr-rzymskich", en: "roman-numerals" },
    icon: Crown,
    isReady: true,
    category: "calculators",
  },
  {
    id: "cat-years-calculator",
    slugs: { pl: "kalkulator-kocich-lat", en: "cat-years-calculator" },
    icon: Cat,
    isReady: true,
    category: "calculators",
  },
];

// --- Helper functions ---

export function getToolSlug(tool: Tool, locale: string): string {
  return tool.slugs[locale] || tool.slugs.pl;
}

export function getCategorySlug(category: ToolCategory, locale: string): string {
  return categoryMeta[category].slugs[locale] || categoryMeta[category].slugs.pl;
}

export function getToolBySlug(slug: string, locale?: string): Tool | undefined {
  if (locale) {
    return tools.find((tool) => tool.slugs[locale] === slug);
  }
  // Search all locales
  return tools.find((tool) => Object.values(tool.slugs).includes(slug));
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getAvailableTools(): Tool[] {
  return tools.filter((tool) => tool.isReady);
}

export function getCategoryBySlug(slug: string, locale?: string): ToolCategory | undefined {
  for (const [category, meta] of Object.entries(categoryMeta)) {
    if (locale) {
      if (meta.slugs[locale] === slug) return category as ToolCategory;
    } else {
      if (Object.values(meta.slugs).includes(slug)) return category as ToolCategory;
    }
  }
  return undefined;
}

export function getToolUrl(tool: Tool, locale: string): string {
  const catSlug = getCategorySlug(tool.category, locale);
  const toolSlug = getToolSlug(tool, locale);
  return `/${locale}/${catSlug}/${toolSlug}`;
}

export function getCategoryUrl(category: ToolCategory, locale: string): string {
  return `/${locale}/${getCategorySlug(category, locale)}`;
}

export function getToolByCategoryAndSlug(
  categorySlug: string,
  toolSlug: string,
  locale?: string
): Tool | undefined {
  const category = getCategoryBySlug(categorySlug, locale);
  if (!category) return undefined;
  if (locale) {
    return tools.find((tool) => tool.category === category && tool.slugs[locale] === toolSlug);
  }
  return tools.find((tool) => tool.category === category && Object.values(tool.slugs).includes(toolSlug));
}

export function getRelatedTools(currentToolId: string, limit: number = 3): Tool[] {
  const currentTool = getToolById(currentToolId);
  if (!currentTool) return [];
  
  return tools
    .filter((tool) => tool.category === currentTool.category && tool.id !== currentToolId)
    .slice(0, limit);
}

/**
 * Given a tool and a source locale, returns the equivalent URL path for a target locale.
 * Useful for the language switcher.
 */
export function getToolUrlForLocale(tool: Tool, targetLocale: string): string {
  return getToolUrl(tool, targetLocale);
}

/**
 * Find a tool by any slug from any locale (for routing).
 */
export function findToolByAnyCategoryAndSlug(
  categorySlug: string,
  toolSlug: string
): { tool: Tool; locale: string } | undefined {
  for (const [category, meta] of Object.entries(categoryMeta)) {
    for (const [locale, slug] of Object.entries(meta.slugs)) {
      if (slug === categorySlug) {
        const tool = tools.find(
          (t) => t.category === category && t.slugs[locale] === toolSlug
        );
        if (tool) return { tool, locale };
      }
    }
  }
  return undefined;
}
