/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Handle pdf.js worker
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    return config;
  },
  async redirects() {
    // Redirects from old URL structure to new category-based URLs
    // Old: /:locale/:tool-slug
    // New: /:locale/:category-slug/:tool-slug
    
    const toolRedirects = [
      // Narzędzia (Tools)
      { old: 'generator-hasel', category: 'narzedzia' },
      { old: 'generator-uuid', category: 'narzedzia' },
      { old: 'lorem-ipsum', category: 'narzedzia' },
      { old: 'konwerter-kolorow', category: 'narzedzia' },
      { old: 'formatter-json', category: 'narzedzia' },
      { old: 'base64', category: 'narzedzia' },
      { old: 'generator-hashy', category: 'narzedzia' },
      { old: 'generator-qr', category: 'narzedzia' },
      { old: 'licznik-znakow', category: 'narzedzia' },
      { old: 'licznik-slow', category: 'narzedzia' },
      { old: 'rzut-kostka', category: 'narzedzia' },
      { old: 'generator-czcionek', category: 'narzedzia' },
      { old: 'odliczanie-do-wakacji', category: 'narzedzia' },
      { old: 'odliczanie-do-swiat', category: 'narzedzia' },
      { old: 'odliczanie-do-daty', category: 'narzedzia' },
      
      // Konwertery (Converters)
      { old: 'konwerter-youtube', category: 'konwertery' },
      { old: 'konwerter-mp3', category: 'konwertery' },
      { old: 'pdf-na-word', category: 'konwertery' },
      { old: 'word-na-pdf', category: 'konwertery' },
      { old: 'pdf-na-jpg', category: 'konwertery' },
      { old: 'pdf-na-png', category: 'konwertery' },
      
      // Losuj (Randomizers)
      { old: 'losuj-liczbe', category: 'losuj' },
      { old: 'losuj-liczby', category: 'losuj' },
      { old: 'losuj-cytat', category: 'losuj' },
      { old: 'losuj-cytat-biblia', category: 'losuj' },
      { old: 'losuj-karte-tarota', category: 'losuj' },
      { old: 'losuj-tak-nie', category: 'losuj' },
      
      // Kalkulatory (Calculators)
      { old: 'kalkulator-proporcji', category: 'kalkulatory' },
      { old: 'kalkulator-bmi', category: 'kalkulatory' },
      { old: 'srednia-wazona', category: 'kalkulatory' },
    ];

    return toolRedirects.map(({ old, category }) => ({
      source: `/:locale/${old}`,
      destination: `/:locale/${category}/${old}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
