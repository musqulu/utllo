import {
  KeyRound,
  Fingerprint,
  FileText,
  Palette,
  Braces,
  Binary,
  Hash,
  QrCode,
  Type,
  LetterText,
  ALargeSmall,
  Youtube,
  Music,
  FileOutput,
  Image,
  Dices,
  Quote,
  BookOpen,
  Sparkles,
  HelpCircle,
  Calculator,
  Scale,
  Sigma,
  Wrench,
  ArrowRightLeft,
  Timer,
  Sun,
  Gift,
  Calendar,
  LucideIcon,
} from "lucide-react";

export type ToolCategory = "tools" | "converters" | "randomizers" | "calculators";

export interface CategoryMeta {
  slug: string;
  icon: LucideIcon;
  name: string;
}

export const categoryMeta: Record<ToolCategory, CategoryMeta> = {
  tools: { slug: "narzedzia", icon: Wrench, name: "Narzędzia" },
  converters: { slug: "konwertery", icon: ArrowRightLeft, name: "Konwertery" },
  randomizers: { slug: "losuj", icon: Dices, name: "Losuj" },
  calculators: { slug: "kalkulatory", icon: Calculator, name: "Kalkulatory" },
};

export const allCategoryIds: ToolCategory[] = ["tools", "converters", "randomizers", "calculators"];

export interface Tool {
  id: string;
  slug: string;
  icon: LucideIcon;
  isReady: boolean;
  category: ToolCategory;
}

export const tools: Tool[] = [
  // Narzędzia (Tools)
  {
    id: "password-generator",
    slug: "generator-hasel",
    icon: KeyRound,
    isReady: true,
    category: "tools",
  },
  {
    id: "uuid-generator",
    slug: "generator-uuid",
    icon: Fingerprint,
    isReady: false,
    category: "tools",
  },
  {
    id: "lorem-ipsum",
    slug: "lorem-ipsum",
    icon: FileText,
    isReady: true,
    category: "tools",
  },
  {
    id: "color-converter",
    slug: "konwerter-kolorow",
    icon: Palette,
    isReady: false,
    category: "tools",
  },
  {
    id: "json-formatter",
    slug: "formatter-json",
    icon: Braces,
    isReady: false,
    category: "tools",
  },
  {
    id: "base64",
    slug: "base64",
    icon: Binary,
    isReady: false,
    category: "tools",
  },
  {
    id: "hash-generator",
    slug: "generator-hashy",
    icon: Hash,
    isReady: false,
    category: "tools",
  },
  {
    id: "qr-generator",
    slug: "generator-qr",
    icon: QrCode,
    isReady: false,
    category: "tools",
  },
  {
    id: "character-counter",
    slug: "licznik-znakow",
    icon: Type,
    isReady: true,
    category: "tools",
  },
  {
    id: "word-counter",
    slug: "licznik-slow",
    icon: LetterText,
    isReady: true,
    category: "tools",
  },
  {
    id: "dice-roll",
    slug: "rzut-kostka",
    icon: Dices,
    isReady: true,
    category: "tools",
  },
  {
    id: "font-generator",
    slug: "generator-czcionek",
    icon: ALargeSmall,
    isReady: true,
    category: "tools",
  },
  {
    id: "countdown-vacation",
    slug: "odliczanie-do-wakacji",
    icon: Sun,
    isReady: true,
    category: "tools",
  },
  {
    id: "countdown-christmas",
    slug: "odliczanie-do-swiat",
    icon: Gift,
    isReady: true,
    category: "tools",
  },
  {
    id: "countdown-date",
    slug: "odliczanie-do-daty",
    icon: Calendar,
    isReady: true,
    category: "tools",
  },

  // Konwertery (Converters)
  {
    id: "youtube-converter",
    slug: "konwerter-youtube",
    icon: Youtube,
    isReady: false,
    category: "converters",
  },
  {
    id: "mp3-converter",
    slug: "konwerter-mp3",
    icon: Music,
    isReady: false,
    category: "converters",
  },
  {
    id: "pdf-to-word",
    slug: "pdf-na-word",
    icon: FileText,
    isReady: false,
    category: "converters",
  },
  {
    id: "word-to-pdf",
    slug: "word-na-pdf",
    icon: FileOutput,
    isReady: false,
    category: "converters",
  },
  {
    id: "pdf-to-jpg",
    slug: "pdf-na-jpg",
    icon: Image,
    isReady: true,
    category: "converters",
  },
  {
    id: "pdf-to-png",
    slug: "pdf-na-png",
    icon: Image,
    isReady: true,
    category: "converters",
  },

  // Losuj (Randomizers)
  {
    id: "random-number",
    slug: "losuj-liczbe",
    icon: Dices,
    isReady: true,
    category: "randomizers",
  },
  {
    id: "random-numbers",
    slug: "losuj-liczby",
    icon: Dices,
    isReady: true,
    category: "randomizers",
  },
  {
    id: "random-quote",
    slug: "losuj-cytat",
    icon: Quote,
    isReady: false,
    category: "randomizers",
  },
  {
    id: "random-bible",
    slug: "losuj-cytat-biblia",
    icon: BookOpen,
    isReady: false,
    category: "randomizers",
  },
  {
    id: "random-tarot",
    slug: "losuj-karte-tarota",
    icon: Sparkles,
    isReady: false,
    category: "randomizers",
  },
  {
    id: "random-yesno",
    slug: "losuj-tak-nie",
    icon: HelpCircle,
    isReady: true,
    category: "randomizers",
  },

  // Kalkulatory (Calculators)
  {
    id: "proportion-calculator",
    slug: "kalkulator-proporcji",
    icon: Calculator,
    isReady: true,
    category: "calculators",
  },
  {
    id: "bmi-calculator",
    slug: "kalkulator-bmi",
    icon: Scale,
    isReady: true,
    category: "calculators",
  },
  {
    id: "weighted-average",
    slug: "srednia-wazona",
    icon: Sigma,
    isReady: true,
    category: "calculators",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
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

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  for (const [category, meta] of Object.entries(categoryMeta)) {
    if (meta.slug === slug) {
      return category as ToolCategory;
    }
  }
  return undefined;
}

export function getToolUrl(tool: Tool, locale: string): string {
  const catMeta = categoryMeta[tool.category];
  return `/${locale}/${catMeta.slug}/${tool.slug}`;
}

export function getCategoryUrl(category: ToolCategory, locale: string): string {
  return `/${locale}/${categoryMeta[category].slug}`;
}

export function getToolByCategoryAndSlug(
  categorySlug: string,
  toolSlug: string
): Tool | undefined {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  return tools.find((tool) => tool.category === category && tool.slug === toolSlug);
}

export function getRelatedTools(currentToolId: string, limit: number = 3): Tool[] {
  const currentTool = getToolById(currentToolId);
  if (!currentTool) return [];
  
  return tools
    .filter((tool) => tool.category === currentTool.category && tool.id !== currentToolId)
    .slice(0, limit);
}
