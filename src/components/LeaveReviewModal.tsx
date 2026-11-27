import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Image as ImageIcon, Video, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import { CONTACT_INFO } from '../constants';
import { PebbleRating, PaperPlaneButton } from './ui/ImportedControls';

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaveReviewModal({ isOpen, onClose }: LeaveReviewModalProps) {
  const { addReview } = useReviews();

  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [service, setService] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFileName, setMediaFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB for instant upload.');
      return;
    }

    setError('');
    setMediaFileName(file.name);
    setMediaType(file.type.startsWith('video/') ? 'video' : 'image');

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
      console.error('[LeaveReviewModal] Failed to submit review:', err);
      setError("We couldn't send your review. Don't worry, it's on our end. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full px-4 py-2.5 text-sm rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-2)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Leave a Review">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 16 }}
          className="relative w-full max-w-2xl my-8 lx-card z-10 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--line)] bg-[var(--surface)]">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block mb-1 font-bold">
                Client Feedback &amp; Rating
              </span>
              <h2 className="text-xl font-serif font-normal text-[var(--ink)]">
                Share Your Experience with LeeAutoX
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-full border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {success ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-serif font-normal mb-2 text-[var(--ink)]">Thank You for Your Review!</h3>
              <p className="text-sm text-[var(--ink-2)] max-w-md mb-6 leading-relaxed">
                Your testimonial has been verified and added to our live reviews marquee and rating ledger.
              </p>
              <div className="text-xs font-mono text-[var(--accent)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                Updated live in Trust Ledger
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
              {error && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)] mb-2">
                  Your Overall Rating
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <PebbleRating value={rating} onChange={setRating} />
                  <span className="text-xs font-mono font-bold text-amber-500">
                    {rating === 5 ? '5.0 — Excellent' : `${rating}.0 / 5.0`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)] mb-1.5">
                    Your Name / Business *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Adebayo K."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)] mb-1.5">
                    City &amp; Country / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Nigeria"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)] mb-1.5">
                  Vehicle Imported or Service Received
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2022 Lexus RX 350 Sourcing & Port Clearance"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)] mb-1.5">
                  Your Review &amp; Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the speed of delivery, vehicle condition, auction updates, and communication..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)]">
                  Attach Delivery Photo / Video Clip (Optional)
                </label>

                <div className="p-4 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                      {mediaType === 'video' ? <Video size={18} /> : <ImageIcon size={18} />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--ink)]">
                        {mediaFileName ? mediaFileName : 'Upload car delivery photo or handover clip'}
                      </p>
                      <p className="text-[11px] text-[var(--ink-2)]">Supports JPG, PNG, WebP, MP4 (Max 5MB)</p>
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
                      className="lx-pill-btn border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] px-4 py-2 text-xs font-mono uppercase tracking-wider"
                    >
                      <Upload size={14} />
                      <span>{mediaFileName ? 'Change' : 'Browse'}</span>
                    </button>
                    {mediaUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setMediaUrl('');
                          setMediaFileName('');
                          setMediaType('none');
                        }}
                        className="px-3 py-2 text-xs text-red-500 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {mediaUrl && (
                  <div className="relative mt-2 rounded-2xl overflow-hidden border border-[var(--line)] h-36 bg-black/30 flex items-center justify-center">
                    {mediaType === 'video' ? (
                      <video src={mediaUrl} controls className="max-h-full max-w-full" />
                    ) : (
                      <img src={mediaUrl} alt="Preview" className="h-full w-full object-cover" />
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                    `Hello LeeAutoX! I am submitting a review on your website. My name is ${author || 'Client'} and I'm sharing my feedback regarding ${service || 'my vehicle'}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 order-2 sm:order-1"
                >
                  <MessageCircle size={14} />
                  <span>Send video to WhatsApp DM</span>
                </a>

                <PaperPlaneButton
                  type="submit"
                  disabled={isSubmitting}
                  sending={isSubmitting}
                  label={isSubmitting ? 'Posting Review...' : 'Submit Verified Review'}
                  className="w-full sm:w-auto px-7 py-3 order-1 sm:order-2"
                />
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
