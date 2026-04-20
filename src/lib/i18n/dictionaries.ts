import type { Locale } from "./config";
import pl from "./dictionaries/pl.json";
import en from "./dictionaries/en.json";

type Messages = typeof pl;

const dictionaries: Record<Locale, Messages> = {
  pl,
  en: en as Messages,
};

/**
 * Full locale dictionaries (shared UI + all tools). Loaded via static imports so the
 * server bundle does not depend on fragile per-locale JSON chunks in `.next/server/`
 * (avoids ENOENT on `*_en_json.js` in dev after cache/HMR issues).
 */
export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale];
};
