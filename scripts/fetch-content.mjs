import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const siteConfigPath = path.resolve('src/site.config.json');
const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf8'));

const WP_API_URL = process.env.WP_API_URL || siteConfig.wordpress.apiUrl;
const SITE_SLUG = process.env.SITE_SLUG !== undefined ? process.env.SITE_SLUG : siteConfig.wordpress.distributionSlug;

const GENERATED_DIR = path.resolve('src/generated');
const POSTS_JSON_PATH = path.join(GENERATED_DIR, 'posts.json');
const MEDIA_DIR = path.resolve('public/wp-media');

async function ensureDirs() {
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }
  if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
  }
}

async function downloadImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return null;
  try {
    const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
    const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
    const filename = `${hash}${ext}`;
    const localFilePath = path.join(MEDIA_DIR, filename);
    const publicPath = `/wp-media/${filename}`;

    if (fs.existsSync(localFilePath)) {
      return publicPath;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return imageUrl;

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(localFilePath, buffer);
    return publicPath;
  } catch (err) {
    console.warn(`⚠️ Warning: Failed to download image ${imageUrl}:`, err.message);
    return imageUrl;
  }
}

async function fetchWordPressPosts() {
  await ensureDirs();
  console.log(`🌐 Connecting to WordPress API: ${WP_API_URL}`);
  console.log(`🏷️ Target distribution slug: "${SITE_SLUG}"`);

  let posts = [];
  try {
    let termId = null;
    if (SITE_SLUG && SITE_SLUG.trim() !== '') {
      const termsRes = await fetch(`${WP_API_URL}/distribution_site?slug=${encodeURIComponent(SITE_SLUG)}`);
      if (termsRes.ok) {
        const terms = await termsRes.json();
        if (Array.isArray(terms) && terms.length > 0) {
          termId = terms[0].id;
          console.log(`  ✅ Found distribution_site term ID: ${termId}`);
        } else {
          console.warn(`  ⚠️ Distribution slug "${SITE_SLUG}" not found in WordPress terms. Fetching all posts.`);
        }
      }
    }

    let page = 1;
    let totalPages = 1;

    do {
      let endpoint = `${WP_API_URL}/posts?_embed&per_page=100&page=${page}`;
      if (termId) {
        endpoint += `&distribution_site=${termId}`;
      }

      console.log(`  📥 Fetching posts page ${page}...`);
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`WordPress API returned status ${res.status} (${res.statusText})`);
      }

      const totalPagesHeader = res.headers.get('x-wp-totalpages');
      if (totalPagesHeader) {
        totalPages = parseInt(totalPagesHeader, 10) || 1;
      }

      const rawPosts = await res.json();
      if (!Array.isArray(rawPosts)) break;

      for (const p of rawPosts) {
        let featuredImageUrl = '';
        let featuredImageAlt = p.title?.rendered || '';
        const embedded = p._embedded;
        if (embedded && embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0]) {
          const media = embedded['wp:featuredmedia'][0];
          featuredImageUrl = media.source_url || '';
          featuredImageAlt = media.alt_text || featuredImageAlt;
        }

        if (featuredImageUrl) {
          featuredImageUrl = await downloadImage(featuredImageUrl);
        }

        let contentHtml = p.content?.rendered || '';
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        const imgReplacements = new Map();
        while ((match = imgRegex.exec(contentHtml)) !== null) {
          const originalImgUrl = match[1];
          if (!imgReplacements.has(originalImgUrl)) {
            const localImgUrl = await downloadImage(originalImgUrl);
            imgReplacements.set(originalImgUrl, localImgUrl);
          }
        }
        for (const [orig, local] of imgReplacements.entries()) {
          contentHtml = contentHtml.replaceAll(orig, local);
        }

        contentHtml = contentHtml.replace(/srcset="[^"]*"/g, '').replace(/sizes="[^"]*"/g, '');

        const categories = [];
        const tags = [];
        if (embedded && embedded['wp:term']) {
          for (const termGroup of embedded['wp:term']) {
            if (Array.isArray(termGroup)) {
              for (const term of termGroup) {
                if (term.taxonomy === 'category') {
                  categories.push({ name: term.name, slug: term.slug });
                } else if (term.taxonomy === 'post_tag') {
                  tags.push(term.name);
                }
              }
            }
          }
        }

        const plainText = contentHtml.replace(/<[^>]*>/g, '');
        const wordCount = plainText.split(/\s+/).length;
        const readingTimeMins = Math.max(1, Math.ceil(wordCount / 200));

        posts.push({
          id: p.id,
          slug: p.slug,
          title: p.title?.rendered || 'Untitled',
          excerpt: (p.excerpt?.rendered || '').replace(/<[^>]*>/g, '').trim(),
          contentHtml: contentHtml,
          date: p.date,
          modified: p.modified,
          author: embedded?.author?.[0]?.name || 'LeeAutoX Editorial',
          featuredImage: {
            url: featuredImageUrl || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
            alt: featuredImageAlt
          },
          categories: categories.length > 0 ? categories : [{ name: 'Logistics', slug: 'logistics' }],
          tags: tags,
          readingTime: `${readingTimeMins} min read`
        });
      }

      page++;
    } while (page <= totalPages);

    console.log(`✅ Successfully fetched ${posts.length} posts from WordPress.`);
    fs.writeFileSync(POSTS_JSON_PATH, JSON.stringify(posts, null, 2), 'utf8');
  } catch (err) {
    console.warn(`⚠️ WordPress fetch notice: ${err.message}`);
    if (fs.existsSync(POSTS_JSON_PATH)) {
      console.log(`📦 Using existing cached posts.json from previous build.`);
    } else {
      console.log(`ℹ️ Writing empty posts array fallback.`);
      fs.writeFileSync(POSTS_JSON_PATH, JSON.stringify([], null, 2), 'utf8');
    }
  }
}

fetchWordPressPosts();
