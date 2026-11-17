import {readFile, writeFile} from 'node:fs/promises';

// Run explicitly to prepare translations; the viewer never calls a translation service.
const atlas = JSON.parse(await readFile('public/models/atlas.json', 'utf8'));
const names = [...new Set([...atlas.parts, ...atlas.concepts].map(item => item.name))];
const translations = {};
const batches = [];
for (let i = 0; i < names.length; i += 25) batches.push(names.slice(i, i + 25));
let cursor = 0;
await Promise.all(Array.from({length: 4}, async () => {
  while (cursor < batches.length) {
    const batch = batches[cursor++];
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.search = new URLSearchParams({client:'gtx', sl:'en', tl:'pt', dt:'t', q:batch.join('\n')}).toString();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Translation failed: ${response.status}`);
    const data = await response.json();
    const lines = data[0].map(segment => segment[0]).join('').trim().split('\n');
    if (lines.length !== batch.length) throw new Error('Translation alignment mismatch');
    batch.forEach((name, i) => { translations[name] = lines[i].trim(); });
  }
}));
await writeFile('scripts/anatomy-translations.generated.json', JSON.stringify(translations, null, 2) + '\n');
console.log(`Prepared ${names.length} translated names. Review before publishing.`);
