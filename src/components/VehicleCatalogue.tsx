import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Info, Loader2 } from 'lucide-react';
import { CATALOGUE_VEHICLES } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { getVehicles } from '../services/wordpress';

export default function VehicleCatalogue() {
  const { theme } = useTheme();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getVehicles();
      if (data && data.length > 0) {
        setVehicles(data);
      } else {
        // Fallback to constants if API fails or returns empty
        setVehicles(CATALOGUE_VEHICLES);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <section id="catalogue" className={`relative transition-colors duration-500 px-6 md:px-12 py-24 overflow-hidden ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-foreground text-background'
    }`}>
      {/* Background Graffiti - Sophisticated Typography Layer */}
      <div className={`absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03] transition-colors duration-500 ${
        theme === 'dark' ? 'text-white' : 'text-background'
      }`}>
        <div className="absolute -top-10 -left-20 text-[20vw] font-black leading-none tracking-tighter rotate-[-12deg] whitespace-nowrap">
          PREMIUM
        </div>
        <div className="absolute top-1/2 -right-40 text-[18vw] font-serif font-bold leading-none rotate-[8deg] whitespace-nowrap">
          AVAILABLE
        </div>
        <div className="absolute -bottom-20 -left-10 text-[25vw] font-black leading-none tracking-tighter rotate-[-15deg] whitespace-nowrap">
          EXCLUSIVE
        </div>

        {/* Random Pattern Accents */}
        <div className="absolute top-[15%] right-[25%] rotate-[30deg] flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-[1px] h-32 transition-colors duration-500 ${theme === 'dark' ? 'bg-white' : 'bg-background'}`} />
          ))}
        </div>
        <div className="absolute bottom-[10%] left-[30%] grid grid-cols-4 gap-4 opacity-50">
          {[...Array(16)].map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full transition-colors duration-500 ${theme === 'dark' ? 'bg-white' : 'bg-background'}`} />
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight text-[#2B59FF] mb-4">
              Cars For Sale
            </h2>
            <p className={`text-sm max-w-md leading-relaxed transition-colors duration-500 ${
              theme === 'dark' ? 'text-white/60' : 'text-background/60'
            }`}>
              Explore our hand-picked selection of high-quality vehicles currently available for procurement from North America.
            </p>
          </div>
          <a
            href="https://leeautox.leeplugshub.com/product-category/cars/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-bold text-[#2B59FF] uppercase tracking-widest hover:translate-x-2 transition-transform"
          >
            View All Vehicles <ArrowRight size={18} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-sm font-mono tracking-widest uppercase">Fetching latest inventory...</p>
            </div>
          ) : (
            vehicles.slice(0, 4).map((vehicle, index) => (
              <motion.a
                key={vehicle.id}
                href={vehicle.link || "https://leeautox.leeplugshub.com/product-category/cars/"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`border group overflow-hidden transition-colors duration-500 block cursor-pointer ${
                  theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-background/5 border-background/10'
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#2B59FF] text-white text-[10px] font-mono px-2 py-1 uppercase tracking-tighter">
                    Available
                  </div>
                </div>
                <div className="p-5">
                  <h3 className={`font-serif text-lg font-bold mb-1 truncate transition-colors duration-500 ${
                    theme === 'dark' ? 'text-white' : 'text-background'
                  }`} dangerouslySetInnerHTML={{ __html: vehicle.name }} />
                  <p className={`text-xs mb-4 font-mono transition-colors duration-500 ${
                    theme === 'dark' ? 'text-white/50' : 'text-background/50'
                  }`}>{vehicle.specs}</p>
                  <div className={`flex items-center justify-between border-t transition-colors duration-500 pt-4 ${
                    theme === 'dark' ? 'border-white/10' : 'border-background/10'
                  }`}>
                    <span className="text-[#2B59FF] font-bold text-sm tracking-tight">{vehicle.price}</span>
                    <div className={`transition-colors ${
                      theme === 'dark' ? 'text-white/40 hover:text-[#2B59FF]' : 'text-background/40 hover:text-[#2B59FF]'
                    }`}>
                      <Info size={16} />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))
          )}
        </div>
        
        {/* Mobile CTA */}
        <div className="mt-12 md:hidden">
           <a
            href="https://leeautox.leeplugshub.com/product-category/cars/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#2B59FF] text-white text-sm font-bold uppercase tracking-widest"
          >
            Browse Full Catalogue <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
