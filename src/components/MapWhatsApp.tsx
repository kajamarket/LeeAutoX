import { motion } from 'motion/react';
import { MapPin, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export default function MapWhatsApp() {
  return (
    <section id="location" className="bg-black text-white px-6 md:px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-4"
        >
          <MapPin size={14} className="text-white/40" />
          <span className="font-mono text-xs tracking-[0.22em] uppercase text-white/40">
            ONTARIO, CANADA — OUR BASE OF OPERATIONS
          </span>
        </motion.div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/5 border border-white/10 overflow-hidden h-72 w-full mb-8"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11728032.52073682!2d-88.89219635!3d49.25000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb90d7c63ba5%3A0x323555502ab4c477!2sOntario%2C%20Canada!5e0!3m2!1sen!2sng!4v1700000000001!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.85)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/5 border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              Speak to us directly on WhatsApp
            </h3>
            <p className="text-white/50 text-sm font-light leading-relaxed max-w-md">
              Get instant answers about vehicle availability, pricing, and shipping — our team typically responds within minutes.
            </p>
          </div>

          <a
            href={`https://wa.me/${CONTACT_INFO.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-[#25D366] text-black font-bold text-sm px-6 py-3 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageCircle size={16} />
            <span>Chat on WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
