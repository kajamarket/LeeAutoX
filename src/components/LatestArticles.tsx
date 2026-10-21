import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Calendar, ChevronRight, ArrowRight } from 'lucide-react';
import { getAllPosts } from '../data/posts';

export default function LatestArticles() {
  const { theme } = useTheme();
  const posts = getAllPosts().slice(0, 4); // Get top 4 recent posts

  if (posts.length === 0) return null;

  const leadPost = posts[0];
  const supportingPosts = posts.slice(1, 4);

  return (
    <section className={`py-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0B0B0B]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-[#2B59FF] font-bold text-xs rounded-full uppercase tracking-wider mb-3">
              <BookOpen size={14} /> Journal & Insights
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Latest Automotive & Shipping Guides
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-base">
              Expert guides on Copart auction bidding, ocean freight containerization, customs tariff valuation, and vehicle import procedures from Canada to Nigeria and Ghana.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B59FF] text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors shrink-0"
          >
            View all articles <ArrowRight size={18} />
          </Link>
        </div>

        {/* Magazine Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lead Article (Large Card) */}
          {leadPost && (
            <div className="lg:col-span-7">
              <Link
                to={`/blog/${leadPost.slug}/`}
                className={`group rounded-3xl border overflow-hidden h-full flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${
                  theme === 'dark' ? 'bg-[#141414] border-neutral-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  <img
                    src={leadPost.featuredImage.url}
                    alt={leadPost.featuredImage.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-[#2B59FF] uppercase tracking-wider">
                        {leadPost.categories[0]?.name || 'Logistics'}
                      </span>
                      <span className="text-xs text-muted-foreground">{leadPost.readingTime}</span>
                    </div>
                    <h3 className="text-2xl font-black group-hover:text-[#2B59FF] transition-colors leading-tight">
                      {leadPost.title}
                    </h3>
                    <p className="text-muted-foreground mt-3 text-sm sm:text-base line-clamp-3">
                      {leadPost.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200/60 dark:border-neutral-800 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {new Date(leadPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-bold text-[#2B59FF] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Guide <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Supporting Articles Stack */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {supportingPosts.map((post, idx) => (
              <Link
                key={idx}
                to={`/blog/${post.slug}/`}
                className={`group rounded-2xl border p-5 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  theme === 'dark' ? 'bg-[#141414] border-neutral-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-200 dark:bg-neutral-800">
                  <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#2B59FF] uppercase tracking-wider">
                      {post.categories[0]?.name || 'Logistics'}
                    </span>
                    <h4 className="font-extrabold text-base sm:text-lg mt-1 group-hover:text-[#2B59FF] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-2 border-t border-neutral-200/50 dark:border-neutral-800">
                    <span>{post.readingTime}</span>
                    <span className="font-bold text-[#2B59FF] inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Read <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
