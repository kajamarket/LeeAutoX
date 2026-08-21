import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_DATA } from '../seoData';
import { cleanPathname } from '../utils/path';
import { useReviews } from '../context/ReviewsContext';

export default function SEOHelmet() {
  const { pathname } = useLocation();
  const { averageRating, totalCount, reviews } = useReviews();

  useEffect(() => {
    // Standardize pathname with trailing slashes if not home
    let cleanPath = cleanPathname(pathname);
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

    // 5. Inject Schema.org JSON-LD with valid AutoDealer review snippet schema
    let schemaScript = document.getElementById('seo-schema-jsonld') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-schema-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    
    // Create valid Google Review Snippet entity (AutoDealer)
    const organizationEntity = {
      '@type': 'AutoDealer',
      '@id': 'https://leeautox.com/#organization',
      'name': 'LeeAutoX',
      'url': 'https://leeautox.com/',
      'logo': 'https://leeplugshub.com/wp-content/uploads/2026/05/LeeAutoX-lcon-1-scaled.png',
      'image': 'https://leeplugshub.com/wp-content/uploads/2026/05/leeautoxhero.png',
      'telephone': '+1-647-389-6162',
      'email': 'info@leeautox.com',
      'priceRange': '$$$$',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Lagos',
        'addressCountry': 'NG'
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+1-647-389-6162',
        'contactType': 'customer service',
        'areaServed': ['NG', 'GH', 'CA'],
        'availableLanguage': ['en']
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': averageRating.toString(),
        'bestRating': '5',
        'worstRating': '1',
        'ratingCount': totalCount.toString(),
        'reviewCount': totalCount.toString()
      },
      'review': reviews.slice(0, 5).map(r => ({
        '@type': 'Review',
        'author': {
          '@type': 'Person',
          'name': r.author
        },
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': r.rating.toString(),
          'bestRating': '5',
          'worstRating': '1'
        },
        'reviewBody': r.quote,
        'datePublished': r.date
      }))
    };

    let graphItems: any[] = [];
    if (data.schema && Array.isArray(data.schema['@graph'])) {
      const filtered = data.schema['@graph'].filter(
        (item: any) => item['@type'] !== 'Organization' && item['@type'] !== 'AutoDealer' && item['@type'] !== 'AutomotiveBusiness'
      );
      graphItems = [organizationEntity, ...filtered];
    } else if (data.schema) {
      const { aggregateRating: _ar, review: _rev, ...cleanPageSchema } = data.schema;
      if (cleanPageSchema['@type'] === 'Organization' || cleanPageSchema['@type'] === 'AutoDealer' || cleanPageSchema['@type'] === 'AutomotiveBusiness') {
        const { '@type': _origType, ...restProps } = cleanPageSchema;
        graphItems = [{ ...organizationEntity, ...restProps, '@type': 'AutoDealer', aggregateRating: organizationEntity.aggregateRating, review: organizationEntity.review }];
      } else {
        const pageNode = {
          ...cleanPageSchema,
          '@id': `https://leeautox.com${cleanPath}#webpage`,
          'isPartOf': { '@id': 'https://leeautox.com/#organization' }
        };
        graphItems = [organizationEntity, pageNode];
      }
    } else {
      graphItems = [organizationEntity];
    }

    const enrichedSchema = {
      '@context': 'https://schema.org',
      '@graph': graphItems
    };

    schemaScript.textContent = JSON.stringify(enrichedSchema);

    // 6. Update Open Graph (OG) tags dynamically
    let metaOgImage = document.querySelector('meta[property="og:image"]');
    if (!metaOgImage) {
      metaOgImage = document.createElement('meta');
      metaOgImage.setAttribute('property', 'og:image');
      document.head.appendChild(metaOgImage);
    }
    metaOgImage.setAttribute('content', data.defaultImage || 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/cropped-LeeAutoX-lcon-1-430x260-1.png');

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

    // 7. Update Twitter Card tags dynamically
    let metaTwitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!metaTwitterCard) {
      metaTwitterCard = document.createElement('meta');
      metaTwitterCard.setAttribute('name', 'twitter:card');
      document.head.appendChild(metaTwitterCard);
    }
    metaTwitterCard.setAttribute('content', 'summary_large_image');

    let metaTwitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!metaTwitterTitle) {
      metaTwitterTitle = document.createElement('meta');
      metaTwitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(metaTwitterTitle);
    }
    metaTwitterTitle.setAttribute('content', data.twitterTitle || data.ogTitle || data.title);

    let metaTwitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!metaTwitterDesc) {
      metaTwitterDesc = document.createElement('meta');
      metaTwitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(metaTwitterDesc);
    }
    metaTwitterDesc.setAttribute('content', data.twitterDescription || data.ogDescription || data.description);

    let metaTwitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!metaTwitterImage) {
      metaTwitterImage = document.createElement('meta');
      metaTwitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(metaTwitterImage);
    }
    metaTwitterImage.setAttribute('content', data.defaultImage || 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/cropped-LeeAutoX-lcon-1-430x260-1.png');

    let metaTwitterSite = document.querySelector('meta[name="twitter:site"]');
    if (!metaTwitterSite) {
      metaTwitterSite = document.createElement('meta');
      metaTwitterSite.setAttribute('name', 'twitter:site');
      document.head.appendChild(metaTwitterSite);
    }
    metaTwitterSite.setAttribute('content', '@leeautox');
  }, [pathname]);

  return null;
}
