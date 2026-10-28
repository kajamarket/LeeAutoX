/**
 * Panoee 360° Virtual Tour Utility
 * Extracts and validates Panoee iframe embed codes and URLs.
 * Strict security: Only allows panoee.com and panoee.net domains.
 */

export function extractPanoeeUrl(input?: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  let rawUrl = '';

  // Case 1: Full HTML iframe embed string e.g. <iframe src="https://tour.panoee.com/..." ...></iframe>
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    rawUrl = srcMatch[1].trim();
  } else if (/^https?:\/\//i.test(trimmed)) {
    // Case 2: Direct URL string
    rawUrl = trimmed;
  }

  if (!rawUrl) return null;

  try {
    const parsed = new URL(rawUrl);
    // Strict domain validation: panoee.com or panoee.net and their subdomains
    const hostname = parsed.hostname.toLowerCase();
    const isAllowedDomain =
      hostname === 'panoee.com' ||
      hostname.endsWith('.panoee.com') ||
      hostname === 'panoee.net' ||
      hostname.endsWith('.panoee.net');

    if (!isAllowedDomain) {
      console.warn(`[Panoee Security] Blocked non-Panoee domain: ${hostname}`);
      return null;
    }

    // Force HTTPS for secure iframe rendering
    parsed.protocol = 'https:';
    return parsed.toString();
  } catch {
    return null;
  }
}

export function has360Content(deg360?: { exterior?: string; interior?: string } | null): boolean {
  if (!deg360) return false;
  const ext = extractPanoeeUrl(deg360.exterior);
  const int = extractPanoeeUrl(deg360.interior);
  return Boolean(ext || int);
}
