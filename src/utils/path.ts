/**
 * Normalizes a pathname by stripping subfolder/repository-name prefixes (e.g. from GitHub Pages)
 * so that routes, SEO data, and navigation match correctly under any base path.
 */
export function cleanPathname(pathname: string): string {
  let clean = pathname;
  
  // Strip common GitHub Pages or subfolder prefixes if present
  // e.g. /my-repo/guides/ -> /guides/
  const knownSections = [
    '/guides', 
    '/blog', 
    '/services', 
    '/vehicles', 
    '/about', 
    '/how-it-works', 
    '/faq', 
    '/contact', 
    '/testimonials', 
    '/lee-auto', 
    '/nigeria', 
    '/ghana', 
    '/canada'
  ];
  
  for (const section of knownSections) {
    const idx = clean.indexOf(section);
    if (idx !== -1) {
      clean = clean.substring(idx);
      break;
    }
  }
  
  // If no known section is found, but the path is not "/", check if we are in a subdirectory home
  // e.g. /my-repo/ or /my-repo
  if (clean !== '/') {
    const parts = clean.split('/').filter(Boolean);
    if (parts.length <= 1) {
      const firstPart = parts[0];
      if (firstPart && !knownSections.includes('/' + firstPart)) {
        return '/';
      }
    }
  }
  
  return clean;
}
