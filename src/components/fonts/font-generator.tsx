"use client";

import { useState, useCallback, useMemo } from "react";
import { ALargeSmall, Copy, Check, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface FontGeneratorDictionary {
  title: string;
  subtitle: string;
  placeholder: string;
  defaultText: string;
  fontSize: string;
  allFonts: string;
  serif: string;
  sansSerif: string;
  display: string;
  handwriting: string;
  monospace: string;
  copyFont: string;
  copied: string;
  fontPairings: string;
  heading: string;
  body: string;
  searchFonts: string;
  noResults: string;
  googleFonts: string;
}

interface FontGeneratorProps {
  dictionary: FontGeneratorDictionary;
}

// Unicode character mappings for different font styles
const FONT_STYLES: { name: string; category: string; transform: (text: string) => string }[] = [
  {
    name: "Pogrubiony (Bold)",
    category: "podstawowe",
    transform: (text) => transformText(text, "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇", "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭", "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"),
  },
  {
    name: "Kursywa (Italic)",
    category: "podstawowe",
    transform: (text) => transformText(text, "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻", "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡"),
  },
  {
    name: "Pogrubiona kursywa",
    category: "podstawowe",
    transform: (text) => transformText(text, "𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯", "𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕"),
  },
  {
    name: "Monospace",
    category: "podstawowe",
    transform: (text) => transformText(text, "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣", "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉", "𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"),
  },
  {
    name: "Skrypt (Script)",
    category: "dekoracyjne",
    transform: (text) => transformText(text, "𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏", "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵"),
  },
  {
    name: "Pogrubiony skrypt",
    category: "dekoracyjne",
    transform: (text) => transformText(text, "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃", "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩"),
  },
  {
    name: "Fraktura (Gothic)",
    category: "dekoracyjne",
    transform: (text) => transformText(text, "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷", "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ"),
  },
  {
    name: "Pogrubiona Fraktura",
    category: "dekoracyjne",
    transform: (text) => transformText(text, "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟", "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅"),
  },
  {
    name: "Podwójne kreski",
    category: "dekoracyjne",
    transform: (text) => transformText(text, "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫", "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ", "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"),
  },
  {
    name: "W kółku",
    category: "symbole",
    transform: (text) => transformText(text, "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ", "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ", "⓪①②③④⑤⑥⑦⑧⑨"),
  },
  {
    name: "Negatyw w kółku",
    category: "symbole",
    transform: (text) => transformText(text, "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩", "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩", "⓿❶❷❸❹❺❻❼❽❾"),
  },
  {
    name: "W kwadracie",
    category: "symbole",
    transform: (text) => transformText(text, "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉", "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"),
  },
  {
    name: "Negatyw w kwadracie",
    category: "symbole",
    transform: (text) => transformText(text, "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉", "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"),
  },
  {
    name: "Styl azjatycki",
    category: "stylizowane",
    transform: (text) => transformTextWithMap(text, {
      'a': '卂', 'b': '乃', 'c': '匚', 'd': 'ᗪ', 'e': '乇', 'f': '千', 'g': 'ᘜ', 'h': '卄',
      'i': '丨', 'j': 'ﾌ', 'k': 'Ҝ', 'l': 'ㄥ', 'm': '爪', 'n': '几', 'o': 'ㄖ', 'p': '卩',
      'q': 'Ɋ', 'r': '尺', 's': '丂', 't': 'ㄒ', 'u': 'ㄩ', 'v': 'ᐯ', 'w': '山', 'x': '乂',
      'y': 'ㄚ', 'z': '乙',
    }),
  },
  {
    name: "Etiopski",
    category: "stylizowane",
    transform: (text) => transformTextWithMap(text, {
      'a': 'ል', 'b': 'ጌ', 'c': 'ር', 'd': 'ዕ', 'e': 'ቿ', 'f': 'ቻ', 'g': 'ኗ', 'h': 'ዘ',
      'i': 'ጎ', 'j': 'ጋ', 'k': 'ጕ', 'l': 'ረ', 'm': 'ጠ', 'n': 'ክ', 'o': 'ዐ', 'p': 'የ',
      'q': 'ዒ', 'r': 'ዪ', 's': 'ነ', 't': 'ፕ', 'u': 'ሁ', 'v': 'ሀ', 'w': 'ሠ', 'x': 'ሸ',
      'y': 'ሃ', 'z': 'ጊ',
    }),
  },
  {
    name: "Falowany tekst",
    category: "stylizowane",
    transform: (text) => transformTextWithMap(text, {
      'a': 'ค', 'b': '๒', 'c': 'ς', 'd': '๔', 'e': 'є', 'f': 'Ŧ', 'g': 'ﻮ', 'h': 'ђ',
      'i': 'เ', 'j': 'ן', 'k': 'к', 'l': 'ɭ', 'm': 'ო', 'n': 'ภ', 'o': '๏', 'p': 'ק',
      'q': 'ợ', 'r': 'г', 's': 'ร', 't': 'Շ', 'u': 'ย', 'v': 'ש', 'w': 'ฬ', 'x': 'א',
      'y': 'ץ', 'z': 'չ',
    }),
  },
  {
    name: "Uroczy tekst",
    category: "stylizowane",
    transform: (text) => transformTextWithMap(text, {
      'a': 'ᗩ', 'b': 'ᗷ', 'c': 'ᑕ', 'd': 'ᗪ', 'e': 'E', 'f': 'ᖴ', 'g': 'G', 'h': 'ᕼ',
      'i': 'I', 'j': 'ᒍ', 'k': 'K', 'l': 'ᒪ', 'm': 'ᗰ', 'n': 'ᑎ', 'o': 'O', 'p': 'ᑭ',
      'q': 'ᑫ', 'r': 'ᖇ', 's': 'ᔕ', 't': 'T', 'u': 'ᑌ', 'v': 'ᐯ', 'w': 'ᗯ', 'x': '᙭',
      'y': 'Y', 'z': 'ᘔ',
    }),
  },
  {
    name: "Zakrzywiony tekst",
    category: "stylizowane",
    transform: (text) => transformTextWithMap(text, {
      'a': 'α', 'b': 'в', 'c': '¢', 'd': '∂', 'e': 'є', 'f': 'ƒ', 'g': 'g', 'h': 'н',
      'i': 'ι', 'j': 'נ', 'k': 'к', 'l': 'ℓ', 'm': 'м', 'n': 'η', 'o': 'σ', 'p': 'ρ',
      'q': 'q', 'r': 'я', 's': 'ѕ', 't': 'т', 'u': 'υ', 'v': 'ν', 'w': 'ω', 'x': 'χ',
      'y': 'у', 'z': 'z',
    }),
  },
  {
    name: "Małe litery (subscript)",
    category: "inne",
    transform: (text) => transformTextWithMap(text, {
      'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ',
      'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ',
      'x': 'ₓ', '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆',
      '7': '₇', '8': '₈', '9': '₉',
    }),
  },
  {
    name: "Górny indeks (superscript)",
    category: "inne",
    transform: (text) => transformTextWithMap(text, {
      'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ',
      'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ',
      'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ',
      'z': 'ᶻ', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶',
      '7': '⁷', '8': '⁸', '9': '⁹',
    }),
  },
  {
    name: "Do góry nogami",
    category: "inne",
    transform: (text) => {
      const map: Record<string, string> = {
        'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
        'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
        'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
        'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ',
        'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N',
        'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ɹ', 'S': 'S', 'T': '⊥', 'U': '∩', 'V': 'Λ',
        'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
        '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0', '.': '˙', ',': "'",
        "'": ',', '"': ',,', '!': '¡', '?': '¿', '[': ']', ']': '[', '(': ')', ')': '(',
        '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾',
      };
      return text.split('').reverse().map(c => map[c] || c).join('');
    },
  },
  {
    name: "Przekreślony",
    category: "inne",
    transform: (text) => text.split('').map(c => c + '\u0336').join(''),
  },
  {
    name: "Podkreślony",
    category: "inne",
    transform: (text) => text.split('').map(c => c + '\u0332').join(''),
  },
  {
    name: "Z gwiazdkami",
    category: "dekoracje",
    transform: (text) => `✨ ${text} ✨`,
  },
  {
    name: "Z serduszkami",
    category: "dekoracje",
    transform: (text) => `♥ ${text} ♥`,
  },
  {
    name: "W nawiasach",
    category: "dekoracje",
    transform: (text) => `【${text}】`,
  },
  {
    name: "Estetyczny",
    category: "dekoracje",
    transform: (text) => text.split('').join(' '),
  },
  {
    name: "W chmurce",
    category: "dekoracje",
    transform: (text) => `☁️ ${text} ☁️`,
  },
  {
    name: "Z kwiatkami",
    category: "dekoracje",
    transform: (text) => `✿ ${text} ✿`,
  },
];

// Transform text using standard Unicode math alphanumerics
function transformText(text: string, lower: string, upper: string, digits?: string): string {
  const lowerChars = [...lower];
  const upperChars = [...upper];
  const digitChars = digits ? [...digits] : null;
  
  return [...text].map(char => {
    const lowerIndex = char.charCodeAt(0) - 'a'.charCodeAt(0);
    const upperIndex = char.charCodeAt(0) - 'A'.charCodeAt(0);
    const digitIndex = char.charCodeAt(0) - '0'.charCodeAt(0);
    
    if (lowerIndex >= 0 && lowerIndex < 26) {
      return lowerChars[lowerIndex] || char;
    }
    if (upperIndex >= 0 && upperIndex < 26) {
      return upperChars[upperIndex] || char;
    }
    if (digitChars && digitIndex >= 0 && digitIndex < 10) {
      return digitChars[digitIndex] || char;
    }
    return char;
  }).join('');
}

// Transform text using custom character map
function transformTextWithMap(text: string, map: Record<string, string>): string {
  return [...text].map(char => {
    const lower = char.toLowerCase();
    if (map[lower]) {
      return char === char.toUpperCase() ? map[lower].toUpperCase() : map[lower];
    }
    return char;
  }).join('');
}

export function FontGenerator({ dictionary }: FontGeneratorProps) {
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filteredStyles = useMemo(() => {
    if (!search) return FONT_STYLES;
    const searchLower = search.toLowerCase();
    return FONT_STYLES.filter(style => 
      style.name.toLowerCase().includes(searchLower) ||
      style.category.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const handleCopy = useCallback(async (transformedText: string, index: number) => {
    try {
      await navigator.clipboard.writeText(transformedText);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const displayText = text || dictionary.defaultText;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <ALargeSmall className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{dictionary.title}</CardTitle>
            <CardDescription>{dictionary.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Input */}
        <div className="relative">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={dictionary.placeholder}
            className="text-lg pr-10"
          />
          {text && (
            <button
              onClick={() => setText("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={dictionary.searchFonts}
            className="pl-9"
          />
        </div>

        {/* Font Styles List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredStyles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{dictionary.noResults}</p>
          ) : (
            filteredStyles.map((style, index) => {
              const transformedText = style.transform(displayText);
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{style.name}</span>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleCopy(transformedText, index)}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          {dictionary.copied}
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Kopiuj
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xl break-all leading-relaxed">
                    {transformedText}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
