import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import Reveal from './ui/Reveal';

interface WhatsAppCTAProps {
  message?: string;
  title?: string;
  subtitle?: string;
}

export default function WhatsAppCTA({
  message = 'Hello LeeAutoX, I would like to make an inquiry.',
  title = 'Speak to us directly on WhatsApp',
  subtitle = 'Get instant answers about vehicle availability, pricing, and shipping — our team typically responds within minutes.',
}: WhatsAppCTAProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodedMessage}`;

  return (
    <Reveal variant="rise">
      <div className="lx-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[var(--ink)] mb-1">
            {title}
          </h3>
          <p className="text-[var(--ink-2)] text-sm leading-relaxed max-w-md">
            {subtitle}
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 lx-pill-btn bg-[#25D366] text-black font-bold text-sm px-6 py-3 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap shadow-md"
        >
          <MessageCircle size={16} />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </Reveal>
  );
}
