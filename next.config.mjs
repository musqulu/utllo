import {
  legacyToolRedirects,
  toolEnSlugToPlPath,
} from "./next.config.redirects.mjs";

const plCatToEnCat = {
  generatory: "generators",
  narzedzia: "tools",
  konwertery: "converters",
  losuj: "randomizers",
  kalkulatory: "calculators",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Handle pdf.js worker
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    return config;
  },
  async redirects() {
    const redirects = [];

    // Old English URLs with Polish slugs → canonical English slugs
    redirects.push(
      { source: "/en/kontakt", destination: "/en/contact", permanent: true },
      { source: "/en/o-nas", destination: "/en/about", permanent: true },
      { source: "/en/regulamin", destination: "/en/terms", permanent: true },
      {
        source: "/en/polityka-prywatnosci",
        destination: "/en/privacy",
        permanent: true,
      }
    );

    // =================================================================
    // 1. Legacy flat-URL redirects (old: /:locale/:tool-slug)
    //    Redirect to the new category-based structure.
    //    These run BEFORE middleware, so they still match /:locale/...
    // =================================================================

    // Legacy tool redirects for /en/:tool-slug → /en/:category/:tool-slug
    // Root-level /:old → /:category/:old (Polish flat URLs after /pl strip)
    for (const entry of legacyToolRedirects) {
      const { old, category, plSlug, enToolSlug } = entry;
      const targetPl = plSlug ?? old;
      const targetEn = enToolSlug ?? old;
      const enFolder = plCatToEnCat[category];
      redirects.push({
        source: `/en/${old}`,
        destination: `/en/${enFolder}/${targetEn}`,
        permanent: true,
      });
      redirects.push({
        source: `/${old}`,
        destination: `/${category}/${targetPl}`,
        permanent: true,
      });
    }

    // English slug at root (Polish site) → canonical Polish category + slug.
    // Do NOT redirect /en/{enCat}/{enSlug}: those are valid English URLs and must not be rewritten.
    for (const [enSlug, plPath] of Object.entries(toolEnSlugToPlPath)) {
      const segments = plPath.split("/").filter(Boolean);
      const plCat = segments[0];
      const enCat = plCatToEnCat[plCat];
      if (enCat) {
        redirects.push({
          source: `/${enCat}/${enSlug}`,
          destination: plPath,
          permanent: true,
        });
      }
    }

    // Bookmarks from old bug chain: /en/{enCat}/{polishToolSlug} → canonical English slug
    for (const [enSlug, plPath] of Object.entries(toolEnSlugToPlPath)) {
      const segments = plPath.split("/").filter(Boolean);
      const plCat = segments[0];
      const plToolSlug = segments[1];
      const enCat = plCatToEnCat[plCat];
      if (enCat && plToolSlug && plToolSlug !== enSlug) {
        redirects.push({
          source: `/en/${enCat}/${plToolSlug}`,
          destination: `/en/${enCat}/${enSlug}`,
          permanent: true,
        });
      }
    }

    // =================================================================
    // 2. Old category moves (tools that changed categories)
    //    Now with root paths (no /pl prefix) for Polish
    // =================================================================
    redirects.push(
      // Root (Polish) category moves
      { source: '/narzedzia/generator-hasel', destination: '/generatory/generator-hasel', permanent: true },
      { source: '/narzedzia/lorem-ipsum', destination: '/generatory/generator-lorem-ipsum', permanent: true },
      { source: '/narzedzia/generator-czcionek', destination: '/generatory/generator-czcionek', permanent: true },
      { source: '/narzedzia/rzut-kostka', destination: '/losuj/rzut-kostka', permanent: true },
      { source: '/narzedzia/generator-qr', destination: '/generatory/generator-qr', permanent: true },

      // English category moves (keep /en prefix)
      { source: '/en/narzedzia/generator-hasel', destination: '/en/generators/generator-hasel', permanent: true },
      { source: '/en/narzedzia/lorem-ipsum', destination: '/en/generators/lorem-ipsum-generator', permanent: true },
      { source: '/en/narzedzia/generator-czcionek', destination: '/en/generators/generator-czcionek', permanent: true },
      { source: '/en/narzedzia/rzut-kostka', destination: '/en/randomizers/rzut-kostka', permanent: true },
      { source: '/en/narzedzia/generator-qr', destination: '/en/generators/generator-qr', permanent: true },
    );

    // =================================================================
    // 3. Cross-locale slug redirects
    //    If someone visits English slug at root (Polish context),
    //    redirect to the correct Polish slug. And vice versa for /en/.
    // =================================================================
    const crossLocaleMap = [
      // English slugs at root → correct Polish slugs (root = Polish)
      { source: '/tools', destination: '/narzedzia', permanent: true },
      { source: '/generators', destination: '/generatory', permanent: true },
      { source: '/converters', destination: '/konwertery', permanent: true },
      { source: '/randomizers', destination: '/losuj', permanent: true },
      { source: '/calculators', destination: '/kalkulatory', permanent: true },

      // English slugs at root with tool path
      { source: '/tools/:tool', destination: '/narzedzia/:tool', permanent: true },
      { source: '/generators/:tool', destination: '/generatory/:tool', permanent: true },
      { source: '/converters/:tool', destination: '/konwertery/:tool', permanent: true },
      { source: '/randomizers/:tool', destination: '/losuj/:tool', permanent: true },
      { source: '/calculators/:tool', destination: '/kalkulatory/:tool', permanent: true },

      // Polish slugs under /en/ → correct English slugs
      { source: '/en/narzedzia', destination: '/en/tools', permanent: true },
      { source: '/en/generatory', destination: '/en/generators', permanent: true },
      { source: '/en/konwertery', destination: '/en/converters', permanent: true },
      { source: '/en/losuj', destination: '/en/randomizers', permanent: true },
      { source: '/en/kalkulatory', destination: '/en/calculators', permanent: true },

      // Polish slugs under /en/ with tool path
      { source: '/en/narzedzia/:tool', destination: '/en/tools/:tool', permanent: true },
      { source: '/en/generatory/:tool', destination: '/en/generators/:tool', permanent: true },
      { source: '/en/konwertery/:tool', destination: '/en/converters/:tool', permanent: true },
      { source: '/en/losuj/:tool', destination: '/en/randomizers/:tool', permanent: true },
      { source: '/en/kalkulatory/:tool', destination: '/en/calculators/:tool', permanent: true },

      // English slugs under /pl/ → correct Polish slugs under /pl/
      // (middleware will then 301 /pl/... to root anyway, but this prevents 404 mid-chain)
      { source: '/pl/tools', destination: '/narzedzia', permanent: true },
      { source: '/pl/generators', destination: '/generatory', permanent: true },
      { source: '/pl/converters', destination: '/konwertery', permanent: true },
      { source: '/pl/randomizers', destination: '/losuj', permanent: true },
      { source: '/pl/calculators', destination: '/kalkulatory', permanent: true },
      { source: '/pl/tools/:tool', destination: '/narzedzia/:tool', permanent: true },
      { source: '/pl/generators/:tool', destination: '/generatory/:tool', permanent: true },
      { source: '/pl/converters/:tool', destination: '/konwertery/:tool', permanent: true },
      { source: '/pl/randomizers/:tool', destination: '/losuj/:tool', permanent: true },
      { source: '/pl/calculators/:tool', destination: '/kalkulatory/:tool', permanent: true },
    ];

    redirects.push(...crossLocaleMap);

    return redirects;
  },
};

export default nextConfig;
