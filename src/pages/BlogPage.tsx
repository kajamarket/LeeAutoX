import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { BookOpen, Calendar, User, Clock, ArrowLeft, ChevronRight, Share2, Tag, Check } from 'lucide-react';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Contact from '../components/Contact';
import { getAllPosts, getPostBySlug } from '../data/posts';

export default function BlogPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const allPosts = useMemo(() => getAllPosts(), []);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach(p => p.categories?.forEach(c => set.add(c.name)));
    return ['All', ...Array.from(set)];
  }, [allPosts]);

  // If slug is provided, render individual article reader view with Light Mode by default
  if (slug) {
    const cleanSlug = slug.replace(/\/$/, '').toLowerCase();
    const post = getPostBySlug(cleanSlug) || allPosts.find(p => p.slug.toLowerCase() === cleanSlug) || allPosts[0];

    const relatedPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 3);

    const handleShare = () => {
      try {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    };

    return (
      // Article section is in Light Mode by default with black/dark text on white/light background
      <div className="min-h-screen pb-28 bg-[#FAFBFD] text-slate-900 antialiased selection:bg-[#2B59FF]/20 selection:text-slate-900">
        {/* Top Navigation & Breadcrumbs Bar */}
        <div className="sticky top-20 z-20 backdrop-blur-md border-b bg-white/95 border-slate-200 shadow-xs">
          <div className="max-w-[760px] mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#2B59FF] transition-colors"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              All Articles
            </Link>
            <span className="font-mono text-xs uppercase tracking-widest text-[#2B59FF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-bold">
              {post.categories?.[0]?.name || 'Logistics'}
            </span>
          </div>
        </div>

        {/* Focused Reading Column (max-w-[760px]) */}
        <main className="max-w-[760px] mx-auto px-6 md:px-8 pt-10 sm:pt-14">
          <article className="bg-white rounded-3xl shadow-sm border border-slate-200 p-7 sm:p-12 mb-12">
            {/* Main Article Title (Display font, light weight, italic, tight leading) */}
            <h1 className="font-serif italic font-light text-3xl sm:text-5xl lg:text-[52px] leading-[1.12] tracking-tight mb-6 text-slate-950">
              {post.title}
            </h1>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 font-mono mb-10 pb-6 border-b border-slate-200">
              <span className="flex items-center gap-1.5 font-medium text-slate-800">
                <User size={14} className="text-[#2B59FF]" /> {post.author || 'LeeAutoX Team'}
              </span>
              <span className="text-slate-400">·</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Calendar size={14} className="text-[#2B59FF]" />
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-slate-400">·</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Clock size={14} className="text-[#2B59FF]" /> {post.readingTime || '6 min read'}
              </span>
            </div>

            {/* Featured Image & Media Treatment */}
            <div className="mb-10 rounded-3xl overflow-hidden shadow-xl aspect-[16/10] w-full border border-slate-200 relative bg-slate-100">
              <img
                src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'}
                alt={post.featuredImage?.alt || post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Rich Text Prose Styles (.article-content) */}
            <div className="article-content space-y-6 text-slate-800 font-light leading-relaxed text-base sm:text-lg">
              {post.contentHtml ? (
                <div
                  className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:italic prose-a:text-[#2B59FF] prose-a:underline hover:prose-a:text-blue-800"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
              ) : (
                post.paragraphs?.map((para, idx) => {
                  if (para.startsWith('### ')) {
                    const headingText = para.replace('### ', '');
                    return (
                      <h2 key={idx} className="font-serif italic text-2xl sm:text-3xl font-medium text-slate-950 mt-10 mb-4 pt-4 border-t border-slate-100">
                        {headingText}
                      </h2>
                    );
                  }
                  if (para.startsWith('- ')) {
                    return (
                      <li key={idx} className="list-disc pl-2 ml-6 text-slate-800 font-light my-2">
                        {para.replace('- ', '')}
                      </li>
                    );
                  }
                  if (para.startsWith('> ') || para.includes('Key takeaways') || para.includes('Quick answer box')) {
                    return (
                      <blockquote key={idx} className="border-l-4 border-[#2B59FF] bg-blue-50/50 pl-6 py-4 my-6 italic text-slate-900 rounded-r-xl">
                        {para.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  return (
                    <p key={idx} className="text-slate-800 font-light leading-relaxed mb-6">
                      {para}
                    </p>
                  );
                })
              )}
            </div>

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold flex items-center gap-1.5 mr-2 text-slate-500 font-mono uppercase tracking-wider">
                  <Tag size={13} className="text-[#2B59FF]" /> Tags:
                </span>
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-full font-mono transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share & Bottom Back */}
            <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#2B59FF] hover:underline"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Explore more articles
              </Link>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] rounded-xl text-sm font-semibold text-slate-800 transition-all cursor-pointer border border-slate-200"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-600" />
                    <span className="text-emerald-700">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={16} className="text-slate-600" />
                    <span>Share This Article</span>
                  </>
                )}
              </button>
            </div>
          </article>
        </main>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-8 mt-16">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-mono font-bold text-[#2B59FF] uppercase tracking-widest block mb-1">
                Further Reading
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950">
                Related Articles & Guides
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rel, idx) => (
                <Link
                  key={idx}
                  to={`/blog/${rel.slug}/`}
                  className="group rounded-3xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={rel.featuredImage?.url || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'}
                      alt={rel.featuredImage?.alt || rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#2B59FF] uppercase tracking-wider block mb-2">
                        {rel.categories?.[0]?.name || 'Logistics'}
                      </span>
                      <h4 className="font-bold text-lg text-slate-950 group-hover:text-[#2B59FF] transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2 font-light">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 font-mono">
                      <span>{rel.readingTime || '5 min read'}</span>
                      <span className="font-bold text-[#2B59FF] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
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

  const filteredPosts = remainingPosts.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categories?.some(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = searchQuery.trim() === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const leadMatchesFilter = leadPost && (
    (selectedCategory === 'all' || leadPost.categories?.some(c => c.name.toLowerCase() === selectedCategory.toLowerCase())) &&
    (searchQuery.trim() === '' || leadPost.title.toLowerCase().includes(searchQuery.toLowerCase()) || leadPost.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen pb-24 bg-[#FAFBFD] text-slate-900 transition-colors duration-300 antialiased">
      <PageHeader
        title="Automotive Export & Shipping Journal"
        subtitle="Expert insights, Copart auction guides, customs clearing procedures, and container shipping strategies from Canada to West Africa."
        breadcrumbs={[
          { name: 'Home', item: 'https://leeautox.com/' },
          { name: 'Blog', item: 'https://leeautox.com/blog/' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Category Pills */}
          <div className="flex flex-nowrap md:flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedCategory(cat.toLowerCase())}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-[0.98] ${
                  selectedCategory === cat.toLowerCase()
                    ? 'bg-[#2B59FF] text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Lead Featured Article (if matching filter) */}
        {leadPost && leadMatchesFilter && (
          <div className="mb-16">
            <Link
              to={`/blog/${leadPost.slug}/`}
              className="group rounded-3xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100">
                <img
                  src={leadPost.featuredImage?.url || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'}
                  alt={leadPost.featuredImage?.alt || leadPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-[#2B59FF] font-bold text-xs rounded-full uppercase tracking-wider font-mono">
                      Featured Guide
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{leadPost.readingTime || '10 min read'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 group-hover:text-[#2B59FF] transition-colors leading-tight">
                    {leadPost.title}
                  </h2>
                  <p className="text-slate-600 mt-4 text-base line-clamp-3 font-light leading-relaxed">
                    {leadPost.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Calendar size={14} className="text-[#2B59FF]" />
                    <span>{new Date(leadPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <span className="inline-flex items-center gap-2 font-bold text-[#2B59FF] group-hover:translate-x-2 transition-transform">
                    Read Article <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Grid of Articles */}
        {filteredPosts.length === 0 && !leadMatchesFilter ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-400 mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2 text-slate-950">No articles found</h3>
            <p className="text-slate-600">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(leadMatchesFilter ? filteredPosts : allPosts.filter(p => {
              const matchesCategory = selectedCategory === 'all' || p.categories?.some(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
              const matchesSearch = searchQuery.trim() === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesCategory && matchesSearch;
            })).map((post, idx) => (
              <Link
                key={idx}
                to={`/blog/${post.slug}/`}
                className="group rounded-3xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'}
                    alt={post.featuredImage?.alt || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-[#2B59FF] uppercase tracking-wider">
                        {post.categories?.[0]?.name || 'Logistics'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{post.readingTime || '5 min read'}</span>
                    </div>
                    <h3 className="font-bold text-xl text-slate-950 group-hover:text-[#2B59FF] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3 font-light leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#2B59FF]" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-bold text-[#2B59FF] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
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
