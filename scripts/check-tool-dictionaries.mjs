/**
 * Verifies every tool id in src/lib/tools.ts has matching entries under `tools`
 * in both pl.json and en.json. Run: node scripts/check-tool-dictionaries.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const toolsTs = fs.readFileSync(path.join(root, "src/lib/tools.ts"), "utf8");
const toolIds = [...toolsTs.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);

const pl = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/i18n/dictionaries/pl.json"), "utf8")
);
const en = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/i18n/dictionaries/en.json"), "utf8")
);

const plKeys = new Set(Object.keys(pl.tools ?? {}));
const enKeys = new Set(Object.keys(en.tools ?? {}));
const idSet = new Set(toolIds);

let failed = false;

for (const id of idSet) {
  if (!plKeys.has(id)) {
    console.error(`Missing pl.tools["${id}"]`);
    failed = true;
  }
  if (!enKeys.has(id)) {
    console.error(`Missing en.tools["${id}"]`);
    failed = true;
  }
}

for (const k of plKeys) {
  if (!idSet.has(k)) {
    console.error(`Extra pl.tools["${k}"] (no matching tool id in tools.ts)`);
    failed = true;
  }
}
for (const k of enKeys) {
  if (!idSet.has(k)) {
    console.error(`Extra en.tools["${k}"] (no matching tool id in tools.ts)`);
    failed = true;
  }
}

for (const id of idSet) {
  const plTool = pl.tools[id];
  const enTool = en.tools[id];
  if (!plTool || !enTool) continue;
  const plSeo = plTool.seoContent?.length ?? 0;
  const enSeo = enTool.seoContent?.length ?? 0;
  if (plSeo > 0 && enSeo > 0 && enSeo < plSeo) {
    console.error(
      `en.tools["${id}"].seoContent has fewer blocks than Polish (${enSeo} < ${plSeo}). Translate missing sections.`
    );
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log(`OK: ${toolIds.length} tools, pl/en dictionary keys match, seoContent block counts OK.`);
