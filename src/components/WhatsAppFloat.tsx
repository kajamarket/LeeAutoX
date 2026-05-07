import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={`https://wa.me/${CONTACT_INFO.whatsappRaw}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-28 right-8 z-[100] w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer border border-white/20"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={20} fill="currentColor" className="text-white" />
      
      {/* Pulse Effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25"></span>
    </motion.a>
  );
}
