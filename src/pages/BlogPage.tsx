import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Calendar, User, Clock, ArrowLeft, ChevronRight, Share2, Tag } from 'lucide-react';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Contact from '../components/Contact';
import { getAllPosts, getPostBySlug, PostItem } from '../data/posts';

export default function BlogPage() {
  const { slug } = useParams<{ slug?: string }>();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const allPosts = useMemo(() => getAllPosts(), []);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach(p => p.categories.forEach(c => set.add(c.name)));
    return ['All', ...Array.from(set)];
  }, [allPosts]);

  // If slug is provided, render individual article page
  if (slug) {
    const post = getPostBySlug(slug);

    if (!post) {
      return (
        <div className={`min-h-screen pt-32 pb-20 px-4 text-center ${theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-slate-50 text-slate-900'}`}>
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you are looking for might have been moved or does not exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B59FF] text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={18} />
            Return to Blog
          </Link>
        </div>
      );
    }

    const relatedPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 3);

    const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    };

    return (
      <div className={`min-h-screen pb-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <PageHeader
          title={post.title}
          subtitle={`Published on ${new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • By ${post.author}`}
        />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          {/* Article Main Card */}
          <div className={`rounded-3xl border shadow-2xl overflow-hidden p-6 sm:p-10 lg:p-12 ${
            theme === 'dark' ? 'bg-[#141414] border-neutral-800' : 'bg-white border-slate-200'
          }`}>
            {/* Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-200 dark:border-neutral-800 text-sm">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar size={15} /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5"><Clock size={15} /> {post.readingTime}</span>
                <span className="flex items-center gap-1.5"><User size={15} /> {post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                {post.categories.map((cat, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-500/10 text-[#2B59FF] font-semibold rounded-full text-xs">
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-10 rounded-2xl overflow-hidden shadow-lg aspect-[16/9] bg-neutral-200 dark:bg-neutral-800">
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-foreground/90 leading-relaxed text-base sm:text-lg">
              {post.contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
              ) : (
                post.paragraphs?.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))
              )}
            </div>

            {/* Tags Footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold flex items-center gap-1 mr-2 text-muted-foreground">
                  <Tag size={14} /> Tags:
                </span>
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-muted-foreground text-xs rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share and Back Action */}
            <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#2B59FF] hover:underline"
              >
                <ArrowLeft size={16} /> Back to all articles
              </Link>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl text-sm font-semibold transition-colors"
              >
                <Share2 size={16} /> {copied ? 'Link Copied!' : 'Share Article'}
              </button>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-20">
              <h3 className="text-2xl font-black mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rel, idx) => (
                  <Link
                    key={idx}
                    to={`/blog/${rel.slug}/`}
                    className={`group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col ${
                      theme === 'dark' ? 'bg-[#141414] border-neutral-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                      <img
                        src={rel.featuredImage.url}
                        alt={rel.featuredImage.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-[#2B59FF]">{rel.categories[0]?.name || 'Logistics'}</span>
                        <h4 className="font-bold text-lg mt-1 group-hover:text-[#2B59FF] transition-colors line-clamp-2">
                          {rel.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {rel.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        <span>{rel.readingTime}</span>
                        <span className="font-bold text-[#2B59FF] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

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
    const matchesCategory = selectedCategory === 'all' || p.categories.some(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = searchQuery.trim() === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const leadMatchesFilter = leadPost && (
    (selectedCategory === 'all' || leadPost.categories.some(c => c.name.toLowerCase() === selectedCategory.toLowerCase())) &&
    (searchQuery.trim() === '' || leadPost.title.toLowerCase().includes(searchQuery.toLowerCase()) || leadPost.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <PageHeader
        title="Automotive Export & Shipping Journal"
        subtitle="Expert insights, Copart auction guides, customs clearing procedures, and container shipping strategies from Canada to West Africa."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat.toLowerCase())}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedCategory === cat.toLowerCase()
                    ? 'bg-[#2B59FF] text-white shadow-lg shadow-blue-500/25'
                    : theme === 'dark' ? 'bg-[#141414] text-neutral-400 hover:text-white border border-neutral-800' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
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
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF] ${
                theme === 'dark' ? 'bg-[#141414] border-neutral-800 text-white placeholder-neutral-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>

        {/* Lead Featured Article (if matching filter) */}
        {leadPost && leadMatchesFilter && (
          <div className="mb-16">
            <Link
              to={`/blog/${leadPost.slug}/`}
              className={`group rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 ${
                theme === 'dark' ? 'bg-[#141414] border-neutral-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                <img
                  src={leadPost.featuredImage.url}
                  alt={leadPost.featuredImage.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-[#2B59FF] font-bold text-xs rounded-full uppercase tracking-wider">
                      Featured Guide
                    </span>
                    <span className="text-xs text-muted-foreground">{leadPost.readingTime}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black group-hover:text-[#2B59FF] transition-colors leading-tight">
                    {leadPost.title}
                  </h2>
                  <p className="text-muted-foreground mt-4 text-base line-clamp-3">
                    {leadPost.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={14} />
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
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(leadMatchesFilter ? filteredPosts : allPosts.filter(p => {
              const matchesCategory = selectedCategory === 'all' || p.categories.some(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
              const matchesSearch = searchQuery.trim() === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesCategory && matchesSearch;
            })).map((post, idx) => (
              <Link
                key={idx}
                to={`/blog/${post.slug}/`}
                className={`group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col ${
                  theme === 'dark' ? 'bg-[#141414] border-neutral-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-[#2B59FF] uppercase tracking-wider">
                        {post.categories[0]?.name || 'Logistics'}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.readingTime}</span>
                    </div>
                    <h3 className="font-extrabold text-xl group-hover:text-[#2B59FF] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
