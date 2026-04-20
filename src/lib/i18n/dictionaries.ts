import type { Locale } from "./config";

const dictionaries = {
  pl: () => import("./dictionaries/pl.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

/**
 * Full locale dictionaries (shared UI + all tools). For further CWV gains, tool-specific
 * `seoContent` could be split into `dictionaries/tools/{locale}/{toolId}.json` and merged
 * in the tool page only — not implemented here to avoid a large migration.
 */
export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
