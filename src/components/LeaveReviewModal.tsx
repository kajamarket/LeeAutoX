import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Upload, Image as ImageIcon, Video, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import { useTheme } from '../context/ThemeContext';
import { CONTACT_INFO } from '../constants';

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaveReviewModal({ isOpen, onClose }: LeaveReviewModalProps) {
  const { theme } = useTheme();
  const { addReview } = useReviews();

  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [service, setService] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFileName, setMediaFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle local image file upload & conversion to Base64 for instant slide display
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB for smooth browser storage)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB for instant upload.');
      return;
    }

    setError('');
    setMediaFileName(file.name);

    if (file.type.startsWith('video/')) {
      setMediaType('video');
    } else {
      setMediaType('image');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMediaUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!author.trim()) {
      setError('Please provide your name or business name.');
      return;
    }
    if (!quote.trim()) {
      setError('Please write a brief review of your experience.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        author: author.trim(),
        role: role.trim() || 'Verified Client',
        service: service.trim() || 'Vehicle Procurement & Logistics',
        quote: quote.trim(),
        rating,
        mediaType,
        mediaUrl: mediaUrl || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setAuthor('');
        setRole('');
        setService('');
        setQuote('');
        setRating(5);
        setMediaType('none');
        setMediaUrl('');
        setMediaFileName('');
      }, 2200);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className={`relative w-full max-w-2xl my-8 border shadow-2xl z-10 overflow-hidden ${
            theme === 'dark' ? 'bg-[#0D0D0D] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-5 border-b ${
            theme === 'dark' ? 'border-white/10 bg-white/[0.02]' : 'border-slate-100 bg-slate-50'
          }`}>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#2B59FF] uppercase block mb-1">
                Client Feedback & Rating
              </span>
              <h2 className="text-xl font-serif font-bold">
                Share Your Experience with LeeAutoX
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {success ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6"
              >
                <CheckCircle size={32} />
              </motion.div>
              <h3 className="text-2xl font-serif font-bold mb-2">Thank You for Your Review!</h3>
              <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
                Your testimonial has been verified and added to our live reviews slide deck and rating ledger.
              </p>
              <div className="text-xs font-mono text-[#2B59FF] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2B59FF] animate-pulse" />
                Updated live in Hero Trust Badge
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Rating Select */}
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 mb-2">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-600 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-xs font-bold text-amber-400">
                    {rating === 5 ? '5.0 — Excellent' : `${rating}.0 / 5.0`}
                  </span>
                </div>
              </div>

              {/* Name & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 mb-1.5">
                    Your Name / Business *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Adebayo K."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm border focus:outline-none focus:border-[#2B59FF] transition-colors ${
                      theme === 'dark' ? 'bg-black/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 mb-1.5">
                    City & Country / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Nigeria or CEO, Auto Fleet"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full px-4 py-2.5 text-sm border focus:outline-none focus:border-[#2B59FF] transition-colors ${
                      theme === 'dark' ? 'bg-black/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Service or Car Model */}
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 mb-1.5">
                  Vehicle Imported or Service Received
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2022 Lexus RX 350 Sourcing & Port Clearance"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm border focus:outline-none focus:border-[#2B59FF] transition-colors ${
                    theme === 'dark' ? 'bg-black/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 mb-1.5">
                  Your Review & Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the speed of delivery, vehicle condition, auction updates, and communication with the LeeAutoX team..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className={`w-full p-4 text-sm border focus:outline-none focus:border-[#2B59FF] transition-colors resize-none leading-relaxed ${
                    theme === 'dark' ? 'bg-black/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Media Upload (Photo / Video proof) */}
              <div className="space-y-2">
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400">
                  Attach Delivery Photo / Video Clip (Optional)
                </label>
                
                <div className={`p-4 border border-dashed flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  theme === 'dark' ? 'border-white/20 bg-white/[0.02]' : 'border-slate-300 bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#2B59FF]/10 text-[#2B59FF]">
                      {mediaType === 'video' ? <Video size={20} /> : <ImageIcon size={20} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold">
                        {mediaFileName ? mediaFileName : 'Upload car delivery photo or handover clip'}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Supports JPG, PNG, WebP, MP4 (Max 5MB)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,video/mp4,video/webm"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>{mediaFileName ? 'Change File' : 'Browse'}</span>
                    </button>
                    {mediaUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setMediaUrl('');
                          setMediaFileName('');
                          setMediaType('none');
                        }}
                        className="px-3 py-2 text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Media Preview if attached */}
                {mediaUrl && (
                  <div className="relative mt-2 rounded overflow-hidden border border-white/10 h-36 bg-black/40 flex items-center justify-center">
                    {mediaType === 'video' ? (
                      <video src={mediaUrl} controls className="max-h-full max-w-full" />
                    ) : (
                      <img src={mediaUrl} alt="Preview" className="h-full w-full object-cover" />
                    )}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                    `Hello LeeAutoX! I am submitting a review on your website. My name is ${author || 'Client'} and I'm sharing my feedback regarding ${service || 'my vehicle'}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 order-2 sm:order-1"
                >
                  <MessageCircle size={14} />
                  <span>Send direct video to our WhatsApp DM</span>
                </a>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#2B59FF] hover:bg-[#1a41cc] text-white font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer order-1 sm:order-2"
                >
                  {isSubmitting ? 'Posting Review...' : 'Submit Verified Review'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
