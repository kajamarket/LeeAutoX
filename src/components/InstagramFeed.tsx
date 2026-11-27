import React, { useEffect } from 'react';
import { Instagram } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';

export default function InstagramFeed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://wdg.fouita.com/widgets/0x46bce9.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="lx-band-surface px-4 sm:px-6 md:px-12 py-16 border-t border-[var(--line)] relative overflow-x-clip transition-colors duration-500">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="lx-bg-dots absolute inset-0 opacity-50" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal variant="rise">
          <div className="text-center mb-12">
            <div className="w-12 h-12 bg-[var(--accent-soft)] text-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-5 border border-[var(--accent)]/25">
              <Instagram size={22} />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[var(--ink)] mb-3">
              <AnimatedText text="Follow our journey" variant="fade-up" />
            </h2>
            <p className="text-[var(--ink-2)] text-xs sm:text-sm font-mono tracking-widest uppercase">
              @{CONTACT_INFO.instagram} — Daily arrivals &amp; live auction wins
            </p>
          </div>
        </Reveal>

        <div className="min-h-[380px] lx-card-padded overflow-hidden">
          <div data-key="Grid Instagram Feed " className="ft" id="ftk8stveb" />
        </div>

        <div className="mt-12 text-center">
          <a
            href={`https://instagram.com/${CONTACT_INFO.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="lx-pill-btn border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-xs font-mono uppercase tracking-widest"
          >
            Check out more on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
