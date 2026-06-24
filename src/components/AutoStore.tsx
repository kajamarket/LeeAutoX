import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingCart, Wrench, Loader2 } from 'lucide-react';
import { STORE_PRODUCTS } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { getProducts } from '../services/wordpress';

export default function AutoStore() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getProducts();
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // Fallback to constants if API fails or returns empty
        setProducts(STORE_PRODUCTS);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <section id="store" className={`relative transition-colors duration-500 px-6 md:px-12 py-24 overflow-hidden ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-foreground text-background'
    }`}>
      {/* Background Graffiti - Sophisticated Typography Layer */}
      <div className={`absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03] transition-colors duration-500 ${
        theme === 'dark' ? 'text-white' : 'text-background'
      }`}>
        <div className="absolute top-1/4 -right-20 text-[20vw] font-black leading-none tracking-tighter rotate-[15deg] whitespace-nowrap">
          GENUINE
        </div>
        <div className="absolute -bottom-10 -left-20 text-[18vw] font-serif font-bold leading-none rotate-[-10deg] whitespace-nowrap">
          QUALITY
        </div>
        
        {/* Random Pattern Accents */}
        <div className="absolute top-[10%] left-[20%] rotate-[-45deg] flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-[1px] h-32 transition-colors duration-500 ${theme === 'dark' ? 'bg-white' : 'bg-background'}`} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[#2B59FF] font-mono text-xs uppercase tracking-[0.2em] mb-4">
              <Wrench size={14} />
              <span>Storefront</span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight text-[#2B59FF]">
              Parts & Tools
            </h2>
          </div>
          <p className={`text-sm max-w-xs leading-relaxed transition-colors duration-500 ${
            theme === 'dark' ? 'text-white/60' : 'text-background/60'
          }`}>
            Premium automotive parts, professional-grade tools, and essential accessories for your vehicle's maintenance.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 min-h-[400px]">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-sm font-mono tracking-widest uppercase">Syncing parts store...</p>
            </div>
          ) : (
            products.map((product, index) => (
              <motion.a
                key={product.id}
                href={product.link ? product.link : "https://leeautox.leeplugshub.com/shop"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group block cursor-pointer"
              >
                <div className={`relative aspect-square overflow-hidden mb-4 border transition-colors duration-500 ${
                  theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-background/10 border-background/5'
                }`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-white shadow-lg flex items-center justify-center translate-y-12 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#2B59FF] hover:text-white text-black">
                    <ShoppingCart size={18} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#2B59FF] font-bold">{product.category}</span>
                  <h3 className={`font-serif text-lg font-bold mt-1 group-hover:text-[#2B59FF] transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-background'
                  }`} dangerouslySetInnerHTML={{ __html: product.name }} />
                  <p className={`text-xs mt-1 transition-colors duration-500 ${
                    theme === 'dark' ? 'text-white/40' : 'text-background/40'
                  }`}>{product.price}</p>
                </div>
              </motion.a>
            ))
          )}
        </div>

        <div className="flex justify-center">
          <a
            href="https://leeautox.leeplugshub.com/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 bg-transparent border-2 border-[#2B59FF] text-[#2B59FF] text-sm font-bold uppercase tracking-widest overflow-hidden transition-all hover:text-white"
          >
            <span className="relative z-10 flex items-center gap-2">
              Browse Full Shop <ArrowRight size={18} />
            </span>
            <div className="absolute inset-0 bg-[#2B59FF] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
          </a>
        </div>
      </div>
    </section>
  );
}