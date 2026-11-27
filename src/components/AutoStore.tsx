import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingCart, Wrench } from 'lucide-react';
import { STORE_PRODUCTS } from '../constants';
import { getProducts } from '../services/wordpress';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';
import { OriginalLoader } from './ui/ImportedControls';

export default function AutoStore() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(STORE_PRODUCTS);
        }
      } catch {
        setProducts(STORE_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section
      id="store"
      className="lx-band-dark relative border-t border-[var(--line)] transition-colors duration-500 px-4 sm:px-6 md:px-12 py-16 overflow-x-clip"
    >
      {/* Visible architectural watermark & radial spotlight layer */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <div className="lx-bg-grid absolute inset-0 opacity-50" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 80% 25%, var(--accent-soft) 0%, transparent 72%)',
          }}
        />
        <div className="opacity-[0.075] text-[var(--ink)]">
          <div className="absolute top-1/4 -right-20 text-[18vw] font-black leading-none tracking-tighter rotate-[14deg] whitespace-nowrap">
            GENUINE
          </div>
          <div className="absolute -bottom-10 -left-20 text-[16vw] font-serif font-bold leading-none rotate-[-10deg] whitespace-nowrap">
            QUALITY
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal variant="rise">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[var(--accent)] font-mono text-xs uppercase tracking-[0.2em] font-bold mb-3">
                <Wrench size={14} />
                <span>Storefront</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-tight text-[var(--ink)]">
                <AnimatedText text="Shop Car Parts" variant="word-stagger" />
              </h2>
            </div>
            <p className="text-sm max-w-md leading-relaxed text-[var(--ink-2)]">
              Shop genuine OEM auto parts directly, and we can source any specialized component for your build or repair.
            </p>
          </div>
        </Reveal>

        <div className="lx-perspective grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 min-h-[340px]">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <OriginalLoader label="Syncing parts store" />
            </div>
          ) : (
            products.map((product, index) => (
              <Reveal key={product.id} variant="isometric" col={index % 4} row={Math.floor(index / 4)}>
                <a
                  href={product.link ? product.link : 'https://leeautox.leeplugshub.com/shop'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block lx-card p-3 sm:p-4 h-full cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-[var(--surface)] border border-[var(--line)]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                    <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] shadow-md flex items-center justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)] group-hover:border-[var(--accent)]">
                      <ShoppingCart size={16} />
                    </div>
                  </div>
                  <div className="px-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] font-bold block">
                      {product.category}
                    </span>
                    <h3
                      className="font-serif text-base sm:text-lg font-normal mt-1 text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: product.name }}
                    />
                    <p className="text-xs font-mono font-semibold tabular-nums mt-1.5 text-[var(--ink-2)]">
                      {product.price}
                    </p>
                  </div>
                </a>
              </Reveal>
            ))
          )}
        </div>

        <div className="flex justify-center">
          <a
            href="https://leeautox.leeplugshub.com/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="lx-pill-btn border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] px-8 py-3.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest transition-all"
          >
            Browse Full Shop <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}