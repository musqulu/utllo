"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { i18n } from "@/lib/i18n/config";
import {
  tools,
  categoryMeta,
  getCategoryBySlug,
  getToolSlug,
  getCategorySlug,
  ToolCategory,
} from "@/lib/tools";

const LOCALE_LABELS: Record<string, string> = {
  pl: "Polski",
  en: "English",
};

const LOCALE_FLAGS: Record<string, string> = {
  pl: "PL",
  en: "EN",
};

interface LanguageSwitcherProps {
  locale: string;
}

/**
 * Translates the current pathname from one locale to another.
 * Handles locale prefix, category slugs, and tool slugs.
 */
function translatePath(pathname: string, fromLocale: string, toLocale: string): string {
  // Split path: /pl/narzedzia/licznik-znakow -> ["", "pl", "narzedzia", "licznik-znakow"]
  const segments = pathname.split("/");

  if (segments.length < 2) return `/${toLocale}`;

  // Replace locale
  segments[1] = toLocale;

  // If there's a category segment (index 2)
  if (segments.length >= 3 && segments[2]) {
    const categoryId = getCategoryBySlug(segments[2], fromLocale);
    if (categoryId) {
      segments[2] = getCategorySlug(categoryId, toLocale);

      // If there's a tool segment (index 3)
      if (segments.length >= 4 && segments[3]) {
        const tool = tools.find((t) => {
          return t.category === categoryId && t.slugs[fromLocale] === segments[3];
        });
        if (tool) {
          segments[3] = getToolSlug(tool, toLocale);
        }
      }
    }
  }

  return segments.join("/");
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (targetLocale: string) => {
    // Set cookie for persistence
    document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=${60 * 60 * 24 * 365}`;

    // Translate the current path to the target locale
    const newPath = translatePath(pathname, locale, targetLocale);
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-sm font-medium">
          <Globe className="h-4 w-4" />
          <span>{LOCALE_FLAGS[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {i18n.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`gap-2 ${loc === locale ? "font-semibold" : ""}`}
          >
            <span className="text-xs font-mono w-6">{LOCALE_FLAGS[loc]}</span>
            <span>{LOCALE_LABELS[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
