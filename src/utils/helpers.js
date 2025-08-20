export function parseLinkHeader(header) {
  if (!header) return {};
  header = header.trim();
  if (/^link\s*:/i.test(header)) header = header.replace(/^link\s*:\s*/i, '');
  if ((header.startsWith('"') && header.endsWith('"')) ||
    (header.startsWith("'") && header.endsWith("'"))) {
    header = header.slice(1, -1);
  }
  const links = {};
  const parts = header.split(',');
  for (const part of parts) {
    const m = part.trim().match(/^<([^>]+)>\s*;\s*rel\s*=\s*"?([^";]+)"?/i);
    if (!m) continue;
    const url = m[1];
    const rels = m[2].trim().split(/\s+/);
    for (const rel of rels) {
      links[rel] = url;
    }
  }
  return links;
}