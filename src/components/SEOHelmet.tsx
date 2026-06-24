import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_DATA } from '../seoData';

export default function SEOHelmet() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Standardize pathname with trailing slashes if not home
    let cleanPath = pathname;
    if (cleanPath !== '/' && !cleanPath.endsWith('/')) {
      cleanPath += '/';
    }

    const data = SEO_DATA[cleanPath] || SEO_DATA['/'];

    // 1. Update title
    document.title = data.title;

    // 2. Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', data.description);

    // 3. Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', data.keywords);

    // 4. Update canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', data.canonical);

    // 5. Inject Schema.org JSON-LD
    let schemaScript = document.getElementById('seo-schema-jsonld') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-schema-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(data.schema);

    // 6. Update Open Graph (OG) tags dynamically
    let metaOgImage = document.querySelector('meta[property="og:image"]');
    if (!metaOgImage) {
      metaOgImage = document.createElement('meta');
      metaOgImage.setAttribute('property', 'og:image');
      document.head.appendChild(metaOgImage);
    }
    metaOgImage.setAttribute('content', 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/cropped-LeeAutoX-lcon-1-430x260-1.png');

    let metaOgUrl = document.querySelector('meta[property="og:url"]');
    if (!metaOgUrl) {
      metaOgUrl = document.createElement('meta');
      metaOgUrl.setAttribute('property', 'og:url');
      document.head.appendChild(metaOgUrl);
    }
    metaOgUrl.setAttribute('content', `https://leeautox.com${cleanPath}`);

    let metaOgType = document.querySelector('meta[property="og:type"]');
    if (!metaOgType) {
      metaOgType = document.createElement('meta');
      metaOgType.setAttribute('property', 'og:type');
      document.head.appendChild(metaOgType);
    }
    metaOgType.setAttribute('content', 'website');

    let metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (!metaOgTitle) {
      metaOgTitle = document.createElement('meta');
      metaOgTitle.setAttribute('property', 'og:title');
      document.head.appendChild(metaOgTitle);
    }
    metaOgTitle.setAttribute('content', data.title);

    let metaOgDesc = document.querySelector('meta[property="og:description"]');
    if (!metaOgDesc) {
      metaOgDesc = document.createElement('meta');
      metaOgDesc.setAttribute('property', 'og:description');
      document.head.appendChild(metaOgDesc);
    }
    metaOgDesc.setAttribute('content', data.description);

    // Cleanup logic (optional, keep schema on unmount or let next route overwrite)
  }, [pathname]);

  return null;
}
