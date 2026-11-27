import { MapPin, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { useTheme } from '../context/ThemeContext';
import Reveal from './ui/Reveal';

export default function MapWhatsApp() {
  const { theme } = useTheme();

  return (
    <section
      id="location"
      className="lx-band-dark relative border-t border-[var(--line)] px-4 sm:px-6 md:px-12 py-16 transition-colors duration-500 overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="lx-bg-grid absolute inset-0 opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 85% 20%, var(--accent-soft) 0%, transparent 72%)',
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal variant="rise">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={14} className="text-[var(--accent)]" />
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-[var(--ink-2)]">
              ONTARIO, CANADA — OUR BASE OF OPERATIONS
            </span>
          </div>
        </Reveal>

        <Reveal variant="scale" delay={60}>
          <div className="lx-card-padded overflow-hidden mb-8">
            <div className="h-72 w-full rounded-2xl overflow-hidden bg-[var(--surface)]">
              <iframe
                title="LeeAutoX Ontario Operations Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11728032.52073682!2d-88.89219635!3d49.25000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb90d7c63ba5%3A0x323555502ab4c477!2sOntario%2C%20Canada!5e0!3m2!1sen!2sng!4v1700000000001!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: theme === 'dark' ? 'invert(90%) hue-rotate(180deg) brightness(0.88)' : 'none',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <div className="lx-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[var(--ink)] mb-1">
                Speak to us directly on WhatsApp
              </h3>
              <p className="text-[var(--ink-2)] text-sm leading-relaxed max-w-md">
                Get instant answers about vehicle availability, pricing, and shipping — our team typically responds within minutes. Or send a detailed inquiry below.
              </p>
            </div>

            <a
              href={`https://wa.me/${CONTACT_INFO.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 lx-pill-btn bg-[#25D366] text-black font-bold text-sm px-6 py-3 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              <MessageCircle size={16} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
