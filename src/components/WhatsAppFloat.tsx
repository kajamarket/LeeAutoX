import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { CONTACT_INFO } from '../constants';

export default function WhatsAppFloat() {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const iconWrapperRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered dynamic wobble/tilt
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY;
          lastScrollY = currentScrollY;

          if (iconWrapperRef.current && Math.abs(delta) > 1) {
            // Calculate tilt based on scroll velocity (capped at ±12deg)
            const tilt = Math.max(-12, Math.min(12, delta * 0.35));
            gsap.to(iconWrapperRef.current, {
              rotation: tilt,
              y: Math.max(-6, Math.min(6, -delta * 0.15)),
              duration: 0.25,
              ease: 'power1.out',
              overwrite: 'auto',
              onComplete: () => {
                gsap.to(iconWrapperRef.current, {
                  rotation: 0,
                  y: 0,
                  duration: 0.7,
                  ease: 'elastic.out(1.2, 0.4)',
                });
              },
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.a
      ref={containerRef}
      href={`https://wa.me/${CONTACT_INFO.whatsappRaw}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.18, rotate: -8 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      className="fixed bottom-28 right-8 z-[100] w-11 h-11 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer border border-white/20 select-none group"
      aria-label="Contact us on WhatsApp"
    >
      {/* Gentle Continuous Floating & Wobble Loop */}
      <motion.div
        ref={iconWrapperRef}
        animate={{
          y: [-3, 3, -3],
          rotate: [-3, 3, -3],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: 'easeInOut',
        }}
        className="flex items-center justify-center"
      >
        <MessageCircle size={22} fill="currentColor" className="text-white drop-shadow-sm" />
      </motion.div>

      {/* Pulsating Radar Ping Effect (Kept Intact) */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />
    </motion.a>
  );
}
