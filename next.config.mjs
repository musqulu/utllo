/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Handle pdf.js worker
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    return config;
  },
  async redirects() {
    // =================================================================
    // 1. Legacy flat-URL redirects (old: /:locale/:tool-slug)
    //    Redirect to the new category-based Polish structure
    // =================================================================
    const legacyToolRedirects = [
      // Generatory (Generators)
      { old: 'generator-hasel', category: 'generatory' },
      { old: 'lorem-ipsum', category: 'generatory' },
      { old: 'generator-lorem-ipsum', category: 'generatory' },
      { old: 'generator-czcionek', category: 'generatory' },
      { old: 'generator-qr', category: 'generatory' },

      // Narzędzia (Tools)
      { old: 'licznik-znakow', category: 'narzedzia' },
      { old: 'licznik-slow', category: 'narzedzia' },
      { old: 'rzut-kostka', category: 'losuj' },
      { old: 'odliczanie-do-wakacji', category: 'narzedzia' },
      { old: 'odliczanie-do-swiat', category: 'narzedzia' },
      { old: 'odliczanie-do-daty', category: 'narzedzia' },
      { old: 'bialy-ekran', category: 'narzedzia' },
      { old: 'kwota-slownie', category: 'narzedzia' },
      { old: 'szyfr-cezara', category: 'narzedzia' },
      
      // Konwertery (Converters)
      { old: 'pdf-na-word', category: 'konwertery' },
      { old: 'pdf-na-jpg', category: 'konwertery' },
      { old: 'pdf-na-png', category: 'konwertery' },
      
      // Losuj (Randomizers)
      { old: 'losuj-liczbe', category: 'losuj' },
      { old: 'losuj-liczby', category: 'losuj' },
      { old: 'losuj-karte-tarota', category: 'losuj' },
      { old: 'losuj-tak-nie', category: 'losuj' },
      
      // Kalkulatory (Calculators)
      { old: 'kalkulator-proporcji', category: 'kalkulatory' },
      { old: 'kalkulator-bmi', category: 'kalkulatory' },
      { old: 'srednia-wazona', category: 'kalkulatory' },
      { old: 'kalkulator-snu', category: 'kalkulatory' },
      { old: 'kalkulator-kalorii', category: 'kalkulatory' },
      { old: 'kalkulator-grupy-krwi', category: 'kalkulatory' },
      { old: 'kalkulator-inflacji', category: 'kalkulatory' },
      { old: 'kalkulator-psich-lat', category: 'kalkulatory' },
      { old: 'kalkulator-cyfr-rzymskich', category: 'kalkulatory' },
      { old: 'kalkulator-kocich-lat', category: 'kalkulatory' },
    ];

    const redirects = legacyToolRedirects.map(({ old, category }) => ({
      source: `/:locale/${old}`,
      destination: `/:locale/${category}/${old}`,
      permanent: true,
    }));

    // =================================================================
    // 2. Old category moves (tools that changed categories)
    // =================================================================
    redirects.push(
      { source: '/:locale/narzedzia/generator-hasel', destination: '/:locale/generatory/generator-hasel', permanent: true },
      { source: '/:locale/narzedzia/lorem-ipsum', destination: '/:locale/generatory/generator-lorem-ipsum', permanent: true },
      { source: '/:locale/narzedzia/generator-czcionek', destination: '/:locale/generatory/generator-czcionek', permanent: true },
      { source: '/:locale/narzedzia/rzut-kostka', destination: '/:locale/losuj/rzut-kostka', permanent: true },
      { source: '/:locale/narzedzia/generator-qr', destination: '/:locale/generatory/generator-qr', permanent: true },
    );

    // =================================================================
    // 3. Cross-locale slug redirects
    //    If someone visits /en/narzedzia/... (Polish slug under English locale),
    //    redirect to the correct English URL. And vice versa.
    // =================================================================
    const crossLocaleMap = [
      // Category-level cross redirects: Polish slugs under /en/ -> English slugs
      { source: '/en/narzedzia', destination: '/en/tools', permanent: true },
      { source: '/en/generatory', destination: '/en/generators', permanent: true },
      { source: '/en/konwertery', destination: '/en/converters', permanent: true },
      { source: '/en/losuj', destination: '/en/randomizers', permanent: true },
      { source: '/en/kalkulatory', destination: '/en/calculators', permanent: true },

      // English slugs under /pl/ -> Polish slugs
      { source: '/pl/tools', destination: '/pl/narzedzia', permanent: true },
      { source: '/pl/generators', destination: '/pl/generatory', permanent: true },
      { source: '/pl/converters', destination: '/pl/konwertery', permanent: true },
      { source: '/pl/randomizers', destination: '/pl/losuj', permanent: true },
      { source: '/pl/calculators', destination: '/pl/kalkulatory', permanent: true },

      // Catch-all for Polish category slugs with any tool under /en/
      { source: '/en/narzedzia/:tool', destination: '/en/tools/:tool', permanent: true },
      { source: '/en/generatory/:tool', destination: '/en/generators/:tool', permanent: true },
      { source: '/en/konwertery/:tool', destination: '/en/converters/:tool', permanent: true },
      { source: '/en/losuj/:tool', destination: '/en/randomizers/:tool', permanent: true },
      { source: '/en/kalkulatory/:tool', destination: '/en/calculators/:tool', permanent: true },

      // Catch-all for English category slugs with any tool under /pl/
      { source: '/pl/tools/:tool', destination: '/pl/narzedzia/:tool', permanent: true },
      { source: '/pl/generators/:tool', destination: '/pl/generatory/:tool', permanent: true },
      { source: '/pl/converters/:tool', destination: '/pl/konwertery/:tool', permanent: true },
      { source: '/pl/randomizers/:tool', destination: '/pl/losuj/:tool', permanent: true },
      { source: '/pl/calculators/:tool', destination: '/pl/kalkulatory/:tool', permanent: true },
    ];

    redirects.push(...crossLocaleMap);

    return redirects;
  },
};

export default nextConfig;
