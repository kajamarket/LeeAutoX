import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { BookOpen, Calendar, User, Clock, ArrowLeft, ChevronRight, Tag } from 'lucide-react';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Contact from '../components/Contact';
import { getAllPosts, getPostBySlug } from '../data/posts';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';
import { LeafTabs, CopyButton, TideProgressBar } from '../components/ui/ImportedControls';

export default function BlogPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allPosts = useMemo(() => getAllPosts(), []);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach((p) => p.categories?.forEach((c) => set.add(c.name)));
    return ['All', ...Array.from(set)];
  }, [allPosts]);

  // Individual article reader view
  if (slug) {
    const cleanSlug = slug.replace(/\/$/, '').toLowerCase();
    const post =
      getPostBySlug(cleanSlug) ||
      allPosts.find((p) => p.slug.toLowerCase() === cleanSlug) ||
      allPosts[0];

    const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
      <div className="min-h-screen pb-28 bg-[var(--bg)] text-[var(--ink)] antialiased selection:bg-[var(--accent-soft)] selection:text-[var(--ink)]">
        {/* Top Navigation & Reading Progress Bar */}
        <div className="sticky top-20 z-[20] lx-glass border-b border-[var(--line)]">
          <div className="max-w-[780px] mx-auto px-6 md:px-8 py-4 flex items-center justify-between gap-4">
            <Link
              to="/blog/"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] hover:text-[var(--accent)] transition-colors"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>All Articles</span>
            </Link>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent)]/25 px-3 py-1 rounded-full font-bold">
              {post.categories?.[0]?.name || 'Logistics'}
            </span>
          </div>
          <TideProgressBar />
        </div>

        {/* Focused Reading Column */}
        <main className="max-w-[780px] mx-auto px-6 md:px-8 pt-10 sm:pt-14">
          <Reveal variant="rise" immediate>
            <article className="lx-card p-7 sm:p-12 mb-12">
              <h1 className="font-serif font-normal text-3xl sm:text-5xl lg:text-[50px] leading-[1.12] tracking-tight mb-6 text-[var(--ink)]">
                <AnimatedText text={post.title} variant="blur-in" trigger="mount" />
              </h1>

              {/* Metadata Bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[var(--ink-2)] font-mono mb-10 pb-6 border-b border-[var(--line)]">
                <span className="flex items-center gap-1.5 font-medium text-[var(--ink)]">
                  <User size={14} className="text-[var(--accent)]" /> {post.author || 'LeeAutoX Team'}
                </span>
                <span className="opacity-40">·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[var(--accent)]" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="opacity-40">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[var(--accent)]" /> {post.readingTime || '6 min read'}
                </span>
              </div>

              {/* Featured Image & Media Treatment */}
              <div className="mb-10 lx-media aspect-[16/10] w-full relative bg-[var(--surface)] shadow-md">
                <img
                  src={
                    post.featuredImage?.url ||
                    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
                  }
                  alt={post.featuredImage?.alt || post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Rich Text Prose Styles */}
              <div className="article-content space-y-6 text-[var(--ink-2)] font-light leading-relaxed text-base sm:text-lg">
                {post.contentHtml ? (
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-normal prose-a:text-[var(--accent)] prose-a:underline hover:prose-a:opacity-80 prose-strong:text-[var(--ink)]"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                  />
                ) : (
                  post.paragraphs?.map((para, idx) => {
                    if (para.startsWith('### ')) {
                      const headingText = para.replace('### ', '');
                      return (
                        <h2
                          key={idx}
                          className="font-serif text-2xl sm:text-3xl font-normal text-[var(--ink)] mt-10 mb-4 pt-4 border-t border-[var(--line)]"
                        >
                          {headingText}
                        </h2>
                      );
                    }
                    if (para.startsWith('- ')) {
                      return (
                        <li key={idx} className="list-disc pl-2 ml-6 text-[var(--ink-2)] font-light my-2">
                          {para.replace('- ', '')}
                        </li>
                      );
                    }
                    if (
                      para.startsWith('> ') ||
                      para.includes('Key takeaways') ||
                      para.includes('Quick answer box')
                    ) {
                      return (
                        <blockquote
                          key={idx}
                          className="border-l-4 border-[var(--accent)] bg-[var(--accent-soft)] pl-6 py-4 pr-4 my-6 italic text-[var(--ink)] rounded-r-2xl"
                        >
                          {para.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    return (
                      <p key={idx} className="text-[var(--ink-2)] font-light leading-relaxed mb-6">
                        {para}
                      </p>
                    );
                  })
                )}
              </div>

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-[var(--line)] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold flex items-center gap-1.5 mr-2 text-[var(--ink-2)] font-mono uppercase tracking-wider">
                    <Tag size={13} className="text-[var(--accent)]" /> Tags:
                  </span>
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-2)] text-xs rounded-full font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share & Bottom Back */}
              <div className="mt-10 pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  to="/blog/"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Explore more articles</span>
                </Link>
                <CopyButton
                  value={shareUrl}
                  label="Share This Article"
                  copiedLabel="Link Copied!"
                />
              </div>
            </article>
          </Reveal>
        </main>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-8 mt-16">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-widest block mb-1">
                Further Reading
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[var(--ink)]">
                Related Articles & Guides
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rel, idx) => (
                <Reveal key={rel.slug || idx} variant="rise" delay={idx * 70}>
                  <Link
                    to={`/blog/${rel.slug}/`}
                    className="group lx-card overflow-hidden hover:-translate-y-1 flex flex-col h-full"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[var(--surface)]">
                      <img
                        src={
                          rel.featuredImage?.url ||
                          'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
                        }
                        alt={rel.featuredImage?.alt || rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-wider block mb-2">
                          {rel.categories?.[0]?.name || 'Logistics'}
                        </span>
                        <h4 className="font-serif text-lg font-normal text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                          {rel.title}
                        </h4>
                        <p className="text-sm text-[var(--ink-2)] mt-2 line-clamp-2 font-light">
                          {rel.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--ink-2)] pt-4 border-t border-[var(--line)] font-mono">
                        <span>{rel.readingTime || '5 min read'}</span>
                        <span className="font-bold text-[var(--accent)] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <div className="mt-20">
          <WhatsAppCTA
            title="Have Questions About Importing Your Next Vehicle?"
            subtitle="Chat directly with our Canadian and Nigerian logistics desks for immediate shipping quotes and auction insights."
          />
        </div>
      </div>
    );
  }

  // Blog Archive List View
  const leadPost = allPosts[0];
  const remainingPosts = allPosts.slice(1);

  const filteredPosts = remainingPosts.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.categories?.some((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const leadMatchesFilter =
    leadPost &&
    (selectedCategory === 'all' ||
      leadPost.categories?.some((c) => c.name.toLowerCase() === selectedCategory.toLowerCase())) &&
    (searchQuery.trim() === '' ||
      leadPost.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leadPost.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen pb-24 bg-[var(--bg)] text-[var(--ink)] antialiased">
      <PageHeader
        title="Automotive Export & Shipping Journal"
        subtitle="Expert insights, Copart auction guides, customs clearing procedures, and container shipping strategies from Canada to West Africa."
        breadcrumbs={[
          { name: 'Home', item: 'https://leeautox.com/' },
          { name: 'Blog', item: 'https://leeautox.com/blog/' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <LeafTabs
            options={categories.map((cat) => ({ value: cat.toLowerCase(), label: cat }))}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            className="max-w-full"
          />

          {/* Search Input */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] placeholder:text-[var(--ink-2)]/60 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        {/* Lead Featured Article */}
        {leadPost && leadMatchesFilter && (
          <Reveal variant="rise" className="mb-16">
            <Link
              to={`/blog/${leadPost.slug}/`}
              className="group lx-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-[var(--surface)]">
                <img
                  src={
                    leadPost.featuredImage?.url ||
                    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
                  }
                  alt={leadPost.featuredImage?.alt || leadPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[var(--accent-soft)] border border-[var(--accent)]/25 text-[var(--accent)] font-bold text-xs rounded-full uppercase tracking-wider font-mono">
                      Featured Guide
                    </span>
                    <span className="text-xs text-[var(--ink-2)] font-mono">
                      {leadPost.readingTime || '10 min read'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-tight">
                    {leadPost.title}
                  </h2>
                  <p className="text-[var(--ink-2)] mt-4 text-base line-clamp-3 font-light leading-relaxed">
                    {leadPost.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-[var(--line)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--ink-2)] font-mono">
                    <Calendar size={14} className="text-[var(--accent)]" />
                    <span>
                      {new Date(leadPost.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 font-bold text-[var(--accent)] group-hover:translate-x-2 transition-transform">
                    Read Article <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Grid of Articles */}
        {filteredPosts.length === 0 && !leadMatchesFilter ? (
          <div className="text-center py-20 lx-card">
            <BookOpen size={48} className="mx-auto text-[var(--ink-2)] mb-4 opacity-50" />
            <h3 className="text-xl font-serif font-normal mb-2 text-[var(--ink)]">
              No articles found
            </h3>
            <p className="text-[var(--ink-2)]">
              Try adjusting your search query or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(leadMatchesFilter
              ? filteredPosts
              : allPosts.filter((p) => {
                  const matchesCategory =
                    selectedCategory === 'all' ||
                    p.categories?.some((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());
                  const matchesSearch =
                    searchQuery.trim() === '' ||
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesCategory && matchesSearch;
                })
            ).map((post, idx) => (
              <Reveal key={post.slug || idx} variant="rise" delay={(idx % 3) * 65}>
                <Link
                  to={`/blog/${post.slug}/`}
                  className="group lx-card overflow-hidden hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[var(--surface)]">
                    <img
                      src={
                        post.featuredImage?.url ||
                        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
                      }
                      alt={post.featuredImage?.alt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-wider">
                          {post.categories?.[0]?.name || 'Logistics'}
                        </span>
                        <span className="text-xs text-[var(--ink-2)] font-mono">
                          {post.readingTime || '5 min read'}
                        </span>
                      </div>
                      <h3 className="font-serif font-normal text-xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[var(--ink-2)] mt-2 line-clamp-3 font-light leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--ink-2)] pt-4 border-t border-[var(--line)] font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[var(--accent)]" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="font-bold text-[var(--accent)] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <div className="mt-24">
        <Contact />
      </div>
    </div>
  );
}
