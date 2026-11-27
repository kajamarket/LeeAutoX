import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight, ArrowRight } from 'lucide-react';
import { getAllPosts } from '../data/posts';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';
import { RippleLink } from './ui/ImportedControls';

export default function LatestArticles() {
  const allPosts = getAllPosts();
  if (allPosts.length === 0) return null;

  const leadPost = allPosts[0];
  const supportingPosts = allPosts.slice(1, 6);

  return (
    <section className="lx-band-white relative py-16 border-t border-[var(--line)] transition-colors duration-500 overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="lx-bg-grid absolute inset-0 opacity-35" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 20% 20%, var(--accent-soft) 0%, transparent 72%)',
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <Reveal variant="rise">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--accent-soft)] border border-[var(--accent)]/25 text-[var(--accent)] font-bold text-xs rounded-full uppercase tracking-wider mb-3 font-mono">
                <BookOpen size={14} /> Insights
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[var(--ink)]">
                <AnimatedText text="Automotive & Shipping Guides" variant="mask-rise" />
              </h2>
            </div>
            <RippleLink
              to="/blog/"
              variant="primary"
              className="px-6 py-3.5 text-xs sm:text-sm font-mono uppercase tracking-wider shrink-0"
            >
              View all articles <ArrowRight size={16} />
            </RippleLink>
          </div>
        </Reveal>

        <div className="lx-perspective grid grid-cols-1 lg:grid-cols-12 gap-8">
          {leadPost && (
            <div className="lg:col-span-7">
              <Reveal variant="isometric" col={0} row={0}>
                <Link
                  to={`/blog/${leadPost.slug}/`}
                  className="group lx-card overflow-hidden h-full flex flex-col justify-between hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[var(--surface)]">
                    <img
                      src={leadPost.featuredImage?.url || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'}
                      alt={leadPost.featuredImage?.alt || leadPost.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-wider">
                          {leadPost.categories?.[0]?.name || 'Logistics'}
                        </span>
                        <span className="text-xs text-[var(--ink-2)] font-mono">{leadPost.readingTime || '10 min read'}</span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-tight">
                        {leadPost.title}
                      </h3>
                      <p className="text-[var(--ink-2)] mt-3 text-sm sm:text-base line-clamp-3 leading-relaxed">
                        {leadPost.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--line)] text-xs text-[var(--ink-2)] font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[var(--accent)]" />
                        {new Date(leadPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="font-bold text-[var(--accent)] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Guide <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </div>
          )}

          <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-3.5">
            {supportingPosts.map((post, idx) => (
              <Reveal key={post.slug || idx} variant="isometric" col={1} row={idx}>
                <Link
                  to={`/blog/${post.slug}/`}
                  className={`group lx-card p-3 sm:p-3.5 items-center gap-3.5 sm:gap-4 hover:-translate-y-0.5 ${
                    idx >= 2 ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[var(--surface)] border border-[var(--line)]">
                    <img
                      src={post.featuredImage?.url || 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'}
                      alt={post.featuredImage?.alt || post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider block mb-0.5">
                        {post.categories?.[0]?.name || 'Logistics'}
                      </span>
                      <h4 className="font-serif font-normal text-sm sm:text-base text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--ink-2)] mt-2 pt-1.5 border-t border-[var(--line)] font-mono">
                      <span>{post.readingTime || '5 min read'}</span>
                      <span className="font-bold text-[var(--accent)] inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        Read <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
