"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { i18n } from "@/lib/i18n/config";
import { translateStaticPageSlug } from "@/lib/i18n/static-pages";
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
 * Detects the current locale from the pathname.
 * If the path starts with a known non-default locale prefix (e.g. /en/...),
 * returns that locale. Otherwise returns the default locale (pl).
 */
function detectLocaleFromPath(pathname: string): string {
  for (const locale of i18n.locales) {
    if (locale === i18n.defaultLocale) continue;
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return i18n.defaultLocale;
}

/**
 * Strips the locale prefix from a pathname.
 * /en/tools/password-generator -> ["tools", "password-generator"]
 * /generatory/generator-hasel -> ["generatory", "generator-hasel"] (root = PL, no prefix)
 */
function getPathSegments(pathname: string, currentLocale: string): string[] {
  const segments = pathname.split("/").filter(Boolean);

  // If path starts with a non-default locale prefix, strip it
  if (currentLocale !== i18n.defaultLocale && segments[0] === currentLocale) {
    return segments.slice(1);
  }

  return segments;
}

/**
 * Translates path segments from one locale to another and builds the target URL.
 * Handles category slugs, tool slugs, and static pages.
 * Default locale (pl) uses root paths; non-default locales use /{locale}/... prefix.
 */
function translatePath(pathname: string, fromLocale: string, toLocale: string): string {
  const segments = getPathSegments(pathname, fromLocale);

  // Home page
  if (segments.length === 0) {
    return toLocale === i18n.defaultLocale ? "/" : `/${toLocale}`;
  }

  const translated = [...segments];

  // Try to translate category slug (first segment)
  if (translated[0]) {
    const categoryId = getCategoryBySlug(translated[0], fromLocale);
    if (categoryId) {
      translated[0] = getCategorySlug(categoryId, toLocale);

      // Try to translate tool slug (second segment)
      if (translated[1]) {
        const tool = tools.find((t) => {
          return t.category === categoryId && t.slugs[fromLocale] === translated[1];
        });
        if (tool) {
          translated[1] = getToolSlug(tool, toLocale);
        }
      }
    }
  }

  // Static legal/info pages (kontakt ↔ contact, etc.)
  if (translated.length === 1) {
    const mapped = translateStaticPageSlug(
      translated[0],
      fromLocale,
      toLocale
    );
    if (mapped) {
      translated[0] = mapped;
    }
  }

  // Build final path: default locale → root, non-default → /{locale}/...
  const prefix = toLocale === i18n.defaultLocale ? "" : `/${toLocale}`;
  return `${prefix}/${translated.join("/")}`;
}

function setLocaleCookie(targetLocale: string) {
  if (typeof document === "undefined") return;
  document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  // Detect the actual locale from the URL (since PL pages have no prefix)
  const detectedLocale = detectLocaleFromPath(pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-sm font-medium">
          <Globe className="h-4 w-4" />
          <span>{LOCALE_FLAGS[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {i18n.locales.map((loc) => {
          const href = translatePath(pathname, detectedLocale, loc);
          return (
            <DropdownMenuItem key={loc} asChild>
              <Link
                href={href}
                hrefLang={loc === "pl" ? "pl-PL" : "en"}
                className={`gap-2 cursor-pointer flex w-full ${loc === locale ? "font-semibold" : ""}`}
                onClick={() => setLocaleCookie(loc)}
              >
                <span className="text-xs font-mono w-6">{LOCALE_FLAGS[loc]}</span>
                <span>{LOCALE_LABELS[loc]}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
