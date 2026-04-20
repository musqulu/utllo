/**
 * SEO redirect helpers: maps English tool slugs to Polish category + slug paths
 * when they differ (fixes /calculators/bmi-calculator → /kalkulatory/kalkulator-bmi).
 */
export const toolEnSlugToPlPath = {
  // generators
  "password-generator": "/generatory/generator-hasel",
  "lorem-ipsum-generator": "/generatory/generator-lorem-ipsum",
  "font-generator": "/generatory/generator-czcionek",
  "qr-generator": "/generatory/generator-qr",
  // tools
  "character-counter": "/narzedzia/licznik-znakow",
  "word-counter": "/narzedzia/licznik-slow",
  "vacation-countdown": "/narzedzia/odliczanie-do-wakacji",
  "christmas-countdown": "/narzedzia/odliczanie-do-swiat",
  "date-countdown": "/narzedzia/odliczanie-do-daty",
  "white-screen": "/narzedzia/bialy-ekran",
  "amount-in-words": "/narzedzia/kwota-slownie",
  "caesar-cipher": "/narzedzia/szyfr-cezara",
  "metronome": "/narzedzia/metronom",
  "online-timer": "/narzedzia/minutnik-online",
  "world-time-dashboard": "/narzedzia/zegar-stref-czasowych",
  "online-alarm-clock": "/narzedzia/budzik-online",
  "online-notepad": "/narzedzia/notatnik-online",
  "diff-checker": "/narzedzia/porownywarka-tekstow",
  // converters (many match)
  "pdf-to-word": "/konwertery/pdf-na-word",
  "pdf-to-jpg": "/konwertery/pdf-na-jpg",
  "pdf-to-png": "/konwertery/pdf-na-png",
  // randomizers
  "random-number": "/losuj/losuj-liczbe",
  "random-numbers": "/losuj/losuj-liczby",
  "random-tarot": "/losuj/losuj-karte-tarota",
  "random-yes-no": "/losuj/losuj-tak-nie",
  "dice-roller": "/losuj/rzut-kostka",
  "coin-flip": "/losuj/rzut-moneta",
  // calculators
  "proportion-calculator": "/kalkulatory/kalkulator-proporcji",
  "bmi-calculator": "/kalkulatory/kalkulator-bmi",
  "weighted-average": "/kalkulatory/srednia-wazona",
  "sleep-calculator": "/kalkulatory/kalkulator-snu",
  "calorie-calculator": "/kalkulatory/kalkulator-kalorii",
  "blood-type-calculator": "/kalkulatory/kalkulator-grupy-krwi",
  "inflation-calculator": "/kalkulatory/kalkulator-inflacji",
  "dog-years-calculator": "/kalkulatory/kalkulator-psich-lat",
  "roman-numerals": "/kalkulatory/kalkulator-cyfr-rzymskich",
  "cat-years-calculator": "/kalkulatory/kalkulator-kocich-lat",
  "fuel-calculator": "/kalkulatory/kalkulator-spalania",
  "electricity-calculator": "/kalkulatory/kalkulator-pradu",
};

/** Legacy flat URLs (Polish slug) → category folder + same slug */
export const legacyToolRedirects = [
  { old: "generator-hasel", category: "generatory" },
  {
    old: "lorem-ipsum",
    category: "generatory",
    plSlug: "generator-lorem-ipsum",
    enToolSlug: "lorem-ipsum-generator",
  },
  { old: "generator-lorem-ipsum", category: "generatory" },
  { old: "generator-czcionek", category: "generatory" },
  { old: "generator-qr", category: "generatory" },

  { old: "licznik-znakow", category: "narzedzia" },
  { old: "licznik-slow", category: "narzedzia" },
  { old: "rzut-kostka", category: "losuj" },
  { old: "odliczanie-do-wakacji", category: "narzedzia" },
  { old: "odliczanie-do-swiat", category: "narzedzia" },
  { old: "odliczanie-do-daty", category: "narzedzia" },
  { old: "bialy-ekran", category: "narzedzia" },
  { old: "kwota-slownie", category: "narzedzia" },
  { old: "szyfr-cezara", category: "narzedzia" },
  { old: "metronom", category: "narzedzia" },
  { old: "minutnik-online", category: "narzedzia" },
  { old: "zegar-stref-czasowych", category: "narzedzia" },
  { old: "budzik-online", category: "narzedzia" },
  { old: "notatnik-online", category: "narzedzia" },
  { old: "porownywarka-tekstow", category: "narzedzia" },

  { old: "pdf-na-word", category: "konwertery" },
  { old: "pdf-na-jpg", category: "konwertery" },
  { old: "pdf-na-png", category: "konwertery" },

  { old: "losuj-liczbe", category: "losuj" },
  { old: "losuj-liczby", category: "losuj" },
  { old: "losuj-karte-tarota", category: "losuj" },
  { old: "losuj-tak-nie", category: "losuj" },
  { old: "rzut-moneta", category: "losuj" },

  { old: "kalkulator-proporcji", category: "kalkulatory" },
  { old: "kalkulator-bmi", category: "kalkulatory" },
  { old: "srednia-wazona", category: "kalkulatory" },
  { old: "kalkulator-snu", category: "kalkulatory" },
  { old: "kalkulator-kalorii", category: "kalkulatory" },
  { old: "kalkulator-grupy-krwi", category: "kalkulatory" },
  { old: "kalkulator-inflacji", category: "kalkulatory" },
  { old: "kalkulator-psich-lat", category: "kalkulatory" },
  { old: "kalkulator-cyfr-rzymskich", category: "kalkulatory" },
  { old: "kalkulator-kocich-lat", category: "kalkulatory" },
  { old: "kalkulator-spalania", category: "kalkulatory" },
  { old: "kalkulator-pradu", category: "kalkulatory" },
];
