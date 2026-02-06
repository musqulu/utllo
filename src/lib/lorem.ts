// Classic Lorem Ipsum words pool
const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "dolorem", "adipisci", "numquam",
  "eius", "modi", "tempora", "incidunt", "magnam", "aliquam", "quaerat",
  "minima", "nostrum", "exercitationem", "ullam", "corporis", "suscipit",
  "laboriosam", "aliquid", "commodi", "consequatur", "autem", "vel", "eum",
  "iure", "quam", "nihil", "molestiae", "illum", "quo", "voluptas", "nulla",
  "recusandae", "itaque", "earum", "rerum", "hic", "tenetur", "sapiente",
  "delectus", "reiciendis", "voluptatibus", "maiores", "alias", "perferendis",
  "doloribus", "asperiores", "repellat", "temporibus", "quibusdam", "officiis",
  "debitis", "necessitatibus", "saepe", "eveniet", "voluptates", "repudiandae",
  "molestias", "excepturi", "libero", "blanditiis", "praesentium", "deleniti",
  "atque", "corrupti", "quos", "quas", "accusamus", "odio", "dignissimos",
  "ducimus", "facilis", "distinctio", "nam", "harum", "quidem", "rerum",
  "facere", "possimus", "assumenda", "repellendus", "temporibus", "quibusdam"
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate random Lorem Ipsum words
 */
export function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(getRandomWord());
  }
  return words.join(" ");
}

/**
 * Generate random Lorem Ipsum sentences
 * Each sentence has 8-15 words
 */
export function generateSentences(count: number): string {
  const sentences: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const wordCount = getRandomInt(8, 15);
    const words: string[] = [];
    
    for (let j = 0; j < wordCount; j++) {
      words.push(getRandomWord());
    }
    
    // Capitalize first word and add period
    words[0] = capitalizeFirst(words[0]);
    sentences.push(words.join(" ") + ".");
  }
  
  return sentences.join(" ");
}

/**
 * Generate random Lorem Ipsum paragraphs
 * Each paragraph has 4-8 sentences
 */
export function generateParagraphs(count: number): string {
  const paragraphs: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const sentenceCount = getRandomInt(4, 8);
    const paragraph = generateSentences(sentenceCount);
    paragraphs.push(paragraph);
  }
  
  return paragraphs.join("\n\n");
}

export type LoremType = "paragraphs" | "sentences" | "words";

export interface LoremOptions {
  type: LoremType;
  count: number;
}

export function generateLorem(options: LoremOptions): string {
  switch (options.type) {
    case "paragraphs":
      return generateParagraphs(options.count);
    case "sentences":
      return generateSentences(options.count);
    case "words":
      return generateWords(options.count);
    default:
      return generateParagraphs(options.count);
  }
}

export const LOREM_LIMITS = {
  paragraphs: { min: 1, max: 20, default: 5 },
  sentences: { min: 1, max: 50, default: 10 },
  words: { min: 1, max: 500, default: 50 },
} as const;
