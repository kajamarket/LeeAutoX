import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface WhatsAppCTAProps {
  message?: string;
  title?: string;
  subtitle?: string;
}

export default function WhatsAppCTA({ 
  message = "Hello LeeAutoX, I would like to make an inquiry.",
  title = "Speak to us directly on WhatsApp",
  subtitle = "Get instant answers about vehicle availability, pricing, and shipping — our team typically responds within minutes."
}: WhatsAppCTAProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodedMessage}`;

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="bg-[#0D0D0D] border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-white"
    >
      <div>
        <h3 className="font-serif text-xl font-bold text-white mb-1">
          {title}
        </h3>
        <p className="text-white/50 text-sm font-light leading-relaxed max-w-md">
          {subtitle}
        </p>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-2 bg-[#25D366] text-black font-bold text-sm px-6 py-3 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
      >
        <MessageCircle size={16} />
        <span>Chat on WhatsApp</span>
      </a>
    </motion.div>
  );
}
