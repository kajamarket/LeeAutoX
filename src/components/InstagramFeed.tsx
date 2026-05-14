import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export default function InstagramFeed() {
  useEffect(() => {
    // Dynamically load the widget script
    const script = document.createElement('script');
    script.src = "https://wdg.fouita.com/widgets/0x46bce9.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount to prevent duplicate injections
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="px-6 md:px-12 py-24 bg-foreground dark:bg-muted/10 relative overflow-hidden">
      {/* Decorative Graffiti Background Asset (Simplified for integration) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
         <div className="absolute top-1/4 left-1/4 font-serif text-[20rem] font-black -rotate-12 whitespace-nowrap">
          AUTHENTIC
         </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-12 h-12 bg-[#2B59FF]/10 text-[#2B59FF] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Instagram size={24} />
          </motion.div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-background dark:text-foreground mb-4">
            Follow our journey
          </h2>
          <p className="text-background/60 dark:text-muted-foreground text-sm font-mono tracking-widest uppercase">
            @{CONTACT_INFO.instagram}
          </p>
        </div>

        {/* Embedded Instagram Feed */}
        <div className="min-h-[400px]">
          <div data-key="Grid Instagram Feed " className="ft" id="ftk8stveb"></div>
        </div>
        
        <div className="mt-16 text-center">
          <a
            href={`https://instagram.com/${CONTACT_INFO.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-3 border-b-2 border-[#2B59FF] text-[#2B59FF] font-bold text-sm tracking-widest uppercase hover:text-white transition-colors"
          >
            Check out more on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
