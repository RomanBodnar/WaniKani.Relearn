export function createGrammarSlug(pos: string): string {
  // Simple romanization map for common Japanese terms in parts of speech
  // WaniKani usually uses english, but just in case
  const romanizationMap: Record<string, string> = {
    'する': 'suru',
    'の': 'no',
    'な': 'na',
    'い': 'i',
    'だ': 'da',
  };

  let romanized = pos.toLowerCase();

  // Replace any matching Japanese characters with their romanized version
  for (const [kana, romaji] of Object.entries(romanizationMap)) {
    romanized = romanized.replace(new RegExp(kana, 'g'), romaji);
  }

  // Convert to kebab-case
  return romanized
    // Replace non-alphanumeric characters (including spaces) with a hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}
