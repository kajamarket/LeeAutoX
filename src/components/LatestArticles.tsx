import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight, ArrowRight } from 'lucide-react';
import { getAllPosts } from '../data/posts';

export default function LatestArticles() {
  const posts = getAllPosts().slice(0, 4); // Get top 4 recent posts
  if (posts.length === 0) return null;

  const leadPost = posts[0];
  const supportingPosts = posts.slice(1, 4);

  return (
    // Explicitly light mode article section with black/dark text on white/light background
    <section className="py-24 bg-[#FAFBFD] text-slate-900 border-t border-slate-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-[#2B59FF] font-bold text-xs rounded-full uppercase tracking-wider mb-3 font-mono">
              <BookOpen size={14} /> Journal & Insights
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-950">
              Latest Automotive & Shipping Guides
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl text-base font-light leading-relaxed">
              Expert guides on Copart auction bidding, ocean freight containerization, customs tariff valuation, and vehicle import procedures from Canada to Nigeria and Ghana.
            </p>
          </div>
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#2B59FF] text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 active:scale-[0.98] transition-all shrink-0 text-sm tracking-wide"
          >
            View all articles <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Magazine Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lead Article (Large Card) */}
          {leadPost && (
            <div className="lg:col-span-7">
              <Link
                to={`/blog/${leadPost.slug}/`}
                className="group rounded-3xl border border-slate-200 bg-white overflow-hidden h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={leadPost.featuredImage?.url || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'}
                    alt={leadPost.featuredImage?.alt || leadPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-[#2B59FF] uppercase tracking-wider">
                        {leadPost.categories?.[0]?.name || 'Logistics'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{leadPost.readingTime || '10 min read'}</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 group-hover:text-[#2B59FF] transition-colors leading-tight">
                      {leadPost.title}
                    </h3>
                    <p className="text-slate-600 mt-3 text-sm sm:text-base line-clamp-3 font-light leading-relaxed">
                      {leadPost.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#2B59FF]" />
                      {new Date(leadPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="font-bold text-[#2B59FF] inline-flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
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
                className="group rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'}
                    alt={post.featuredImage?.alt || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#2B59FF] uppercase tracking-wider block mb-1">
                      {post.categories?.[0]?.name || 'Logistics'}
                    </span>
                    <h4 className="font-bold text-base sm:text-lg text-slate-950 group-hover:text-[#2B59FF] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100 font-mono">
                    <span>{post.readingTime || '5 min read'}</span>
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
