import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight, Star, PlusCircle, Image as ImageIcon, Video, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useReviews } from '../context/ReviewsContext';
import LeaveReviewModal from './LeaveReviewModal';

export default function Testimonials() {
  const { theme } = useTheme();
  const { reviews, averageRating, totalCount } = useReviews();
  const [active, setActive] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMediaPreview, setActiveMediaPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

  const currentReview = reviews[active] || reviews[0];

  const next = () => setActive((prev) => (prev + 1) % reviews.length);
  const prev = () => setActive((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section id="testimonials" className={`relative transition-colors duration-500 px-6 md:px-12 py-24 overflow-hidden ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {/* Background Graffiti - Sophisticated Typography Layer */}
      <div className={`absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03] transition-colors duration-500 ${
        theme === 'dark' ? 'text-white' : 'text-black'
      }`}>
        <div className="absolute -top-10 -left-20 text-[20vw] font-black leading-none tracking-tighter rotate-[-15deg] whitespace-nowrap">
          TRUSTED
        </div>
        <div className="absolute top-1/2 -right-40 text-[18vw] font-serif font-bold leading-none rotate-[12deg] whitespace-nowrap">
          SERVICE
        </div>
        <div className="absolute -bottom-20 -left-10 text-[25vw] font-black leading-none tracking-tighter rotate-[-5deg] whitespace-nowrap">
          DELIVERY
        </div>

        {/* Random Pattern Accents */}
        <div className="absolute top-[10%] left-[30%] rotate-[45deg] flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-[1px] h-32 transition-colors duration-500 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} />
          ))}
        </div>
        <div className="absolute bottom-[20%] right-[20%] grid grid-cols-4 gap-4 opacity-50">
          {[...Array(16)].map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full transition-colors duration-500 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} />
          ))}
        </div>
        <div className="absolute top-[40%] left-[5%] text-[10vw] font-light leading-none rotate-[-10deg]">
          ++++++
        </div>
        <div className={`absolute top-[60%] right-[10%] text-[8vw] font-light leading-none rotate-[20deg] border-t pt-2 transition-colors duration-500 ${
          theme === 'dark' ? 'border-white' : 'border-black'
        }`}>
          002//X
        </div>
        <div className={`absolute bottom-[10%] left-[45%] w-40 h-40 border rounded-full rotate-[30deg] transition-colors duration-500 ${
          theme === 'dark' ? 'border-white/40' : 'border-black/40'
        }`} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Top Summary & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10 text-left">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div>
              <span className="font-serif text-lg font-bold mr-2">{averageRating} / 5.0</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>
                ({totalCount} Verified Client Reviews)
              </span>
            </div>
          </div>

          <div>
            {/* Write a review button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#2B59FF] hover:bg-[#1a41cc] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(43,89,255,0.25)]"
            >
              <PlusCircle size={14} />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        <Quote size={32} className="mx-auto mb-8 opacity-60 transition-colors duration-500 text-[#2B59FF]" />

        {/* Carousel Content */}
        <div className="min-h-[260px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center max-w-3xl"
            >
              {/* Star Rating Badge */}
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(currentReview?.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className={`font-serif text-2xl md:text-3xl font-bold leading-snug mb-8 transition-colors duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                "{currentReview?.quote}"
              </p>
              
              {/* Attached Delivery Photo / Video Preview Pill */}
              {currentReview?.mediaUrl && (
                <div className="mb-6">
                  <button
                    onClick={() => setActiveMediaPreview({ url: currentReview.mediaUrl!, type: currentReview.mediaType || 'image' })}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono border rounded-full transition-colors cursor-pointer ${
                      theme === 'dark' ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white/90' : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {currentReview.mediaType === 'video' ? (
                      <Video size={13} className="text-[#2B59FF]" />
                    ) : (
                      <ImageIcon size={13} className="text-[#2B59FF]" />
                    )}
                    <span>View Client Proof ({currentReview.mediaType === 'video' ? 'Video' : 'Delivery Photo'})</span>
                  </button>
                </div>
              )}

              {/* Author, Role and Service */}
              <div className="flex flex-col items-center gap-1 mb-8">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-base transition-colors duration-500 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    {currentReview?.author}
                  </span>
                  {currentReview?.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                      <ShieldCheck size={10} /> Verified
                    </span>
                  )}
                </div>

                <span className={`text-xs tracking-wide transition-colors duration-500 ${
                  theme === 'dark' ? 'text-white/60' : 'text-black/60'
                }`}>
                  {currentReview?.role}
                </span>

                {currentReview?.service && (
                  <span className="text-[11px] font-mono text-[#2B59FF] mt-0.5">
                    {currentReview.service}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous review"
            className={`w-10 h-10 border flex items-center justify-center transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'border-white/30 text-white hover:bg-white hover:text-black' 
                : 'border-black/30 text-black hover:bg-black hover:text-white'
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  active === i 
                    ? (theme === 'dark' ? 'bg-white w-6' : 'bg-black w-6') 
                    : (theme === 'dark' ? 'bg-white/30 w-1.5' : 'bg-black/30 w-1.5')
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next review"
            className={`w-10 h-10 border flex items-center justify-center transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'border-white/30 text-white hover:bg-white hover:text-black' 
                : 'border-black/30 text-black hover:bg-black hover:text-white'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Media Lightbox Modal */}
      {activeMediaPreview && (
        <div 
          onClick={() => setActiveMediaPreview(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            {activeMediaPreview.type === 'video' ? (
              <video src={activeMediaPreview.url} controls autoPlay className="max-h-[80vh] w-auto rounded" />
            ) : (
              <img src={activeMediaPreview.url} alt="Client Review Photo" className="max-h-[80vh] w-auto object-contain rounded shadow-2xl" />
            )}
          </div>
        </div>
      )}

      {/* Interactive Review Modal */}
      <LeaveReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
