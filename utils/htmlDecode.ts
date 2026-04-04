export function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };

  let decoded = text;

  Object.keys(entities).forEach((entity) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), entities[entity]);
  });

  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });

  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}
