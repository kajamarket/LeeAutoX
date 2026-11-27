import { useState } from 'react';
import { MessageCircle, Phone, FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../constants';

export default function WhatsAppFloat() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[var(--z-sticky)] flex flex-col items-end gap-2.5">
      {expanded && (
        <div className="flex flex-col items-end gap-2 mb-1">
          <Link
            to="/nigeria/import-duty-calculator/"
            onClick={() => setExpanded(false)}
            className="inline-flex items-center gap-2 rounded-full lx-glass px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)] transition-all"
          >
            <FileText size={14} className="text-[var(--accent)]" />
            <span>Duty Calculator</span>
          </Link>
          <a
            href={`tel:${CONTACT_INFO.phoneNG.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 rounded-full lx-glass px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)] transition-all"
          >
            <Phone size={14} className="text-[var(--accent)]" />
            <span>Call Lagos Desk</span>
          </a>
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            <MessageCircle size={14} fill="currentColor" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}

      <div className="flex items-center gap-2">
        <a
          href={`https://wa.me/${CONTACT_INFO.whatsappRaw}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.65)] transition-transform duration-300 ease-[var(--spring)] hover:scale-105 active:scale-95"
        >
          <MessageCircle size={22} fill="currentColor" />
        </a>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={expanded}
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full lx-glass text-[var(--ink)] cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          {expanded ? <X size={15} /> : <Phone size={15} />}
        </button>
      </div>
    </div>
  );
}
