import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  Video,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import { CONTACT_INFO } from '../constants';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';
import {
  PebbleRating,
  PaperPlaneButton,
  RippleButton,
} from '../components/ui/ImportedControls';

export default function SubmitReviewPage() {
  const { addReview } = useReviews();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Pre-fill parameters if provided in URL (e.g. /review/?car=2022+Lexus+RX350&name=David)
  const initialCar = searchParams.get('car') || searchParams.get('service') || '';
  const initialName = searchParams.get('name') || '';

  const [author, setAuthor] = useState(initialName);
  const [role, setRole] = useState('');
  const [service, setService] = useState(initialCar);
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
    if (initialCar && !service) setService(initialCar);
    if (initialName && !author) setAuthor(initialName);
  }, [initialCar, initialName, service, author]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      setError('Please write a brief sentence about your experience.');
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
    } catch (err) {
      console.error('[SubmitReviewPage] Failed to submit review:', err);
      setError("We couldn't send your review. Don't worry, it's on our end. Please try again shortly, or reach out on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <PageHeader
        title="Leave a Verified Review"
        subtitle="Thank you for choosing LeeAutoX. Share your vehicle importation experience with our community."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Testimonials', item: '/testimonials/' },
          { name: 'Leave Review', item: '/review/' },
        ]}
      />

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <Reveal variant="rise" immediate>
          <div className="lx-card p-6 sm:p-10">
            {success ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                  <CheckCircle size={38} />
                </div>

                <h2 className="text-3xl font-serif font-normal mb-3 text-[var(--ink)]">
                  <AnimatedText text="Review Submitted!" variant="blur-in" trigger="mount" />
                </h2>
                <p className="text-sm max-w-md mb-8 leading-relaxed text-[var(--ink-2)]">
                  Thank you, <strong className="text-[var(--ink)]">{author}</strong>! Your review and {rating}-star rating have been recorded and synchronized with our live testimonials ledger.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                      `Hello LeeAutoX! I just left a ${rating}-star review for ${service || 'my vehicle import'}. Thank you for the great service!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lx-pill-btn bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider shadow-md"
                  >
                    <MessageCircle size={16} />
                    <span>Notify Team on WhatsApp</span>
                  </a>

                  <RippleButton
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/testimonials/')}
                    className="text-xs font-mono uppercase tracking-wider"
                  >
                    View All Testimonials
                  </RippleButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Header Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--line)]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-mono tracking-wider uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                      Official LeeAutoX Feedback Form
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--ink-2)] uppercase">
                    Direct Google Sheet Sync
                  </span>
                </div>

                {/* Pebble Rating Selector */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)] mb-3">
                    How would you rate your overall experience? *
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    <PebbleRating value={rating} onChange={setRating} />
                    <span className="text-sm font-bold text-[var(--accent)] font-mono tabular-nums">
                      {rating === 5 ? '5.0 / 5.0 (Excellent)' : `${rating}.0 / 5.0`}
                    </span>
                  </div>
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)] mb-1.5">
                      Your Full Name or Company *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alhaji Babatunde S."
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl text-sm border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-2)]/60 focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)] mb-1.5">
                      Your Location / Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Victoria Island, Lagos or Toronto, ON"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl text-sm border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-2)]/60 focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                  </div>
                </div>

                {/* Service / Vehicle Details */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)] mb-1.5">
                    Vehicle Model or Service Rendered
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2021 Lexus RX 350 Luxury AWD (Auction & Clearing)"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl text-sm border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-2)]/60 focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)] mb-1.5">
                    Your Feedback & Review *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Share details on car condition, auction updates, shipping speed, clearing assistance, and your overall satisfaction..."
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full p-4 rounded-2xl text-sm border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-2)]/60 focus:outline-none focus:border-[var(--accent)] transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Photo / Video Clip Attachment */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono tracking-wider uppercase text-[var(--ink-2)]">
                    Attach Delivery Photo or Unboxing Video (Optional)
                  </label>

                  <div className="p-5 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                        {mediaType === 'video' ? <Video size={22} /> : <ImageIcon size={22} />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--ink)]">
                          {mediaFileName ? mediaFileName : 'Upload car delivery picture or video'}
                        </p>
                        <p className="text-[11px] text-[var(--ink-2)]">
                          Supports JPG, PNG, MP4 (Max 5MB)
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
                      <RippleButton
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="!py-2 !px-4 text-xs font-mono uppercase tracking-wider"
                      >
                        <Upload size={14} />
                        <span>{mediaFileName ? 'Change' : 'Choose File'}</span>
                      </RippleButton>
                      {mediaUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setMediaUrl('');
                            setMediaFileName('');
                            setMediaType('none');
                          }}
                          className="px-3 py-2 text-xs text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {mediaUrl && (
                    <div className="relative mt-2 rounded-2xl overflow-hidden border border-[var(--line)] h-44 bg-[var(--surface)] flex items-center justify-center">
                      {mediaType === 'video' ? (
                        <video src={mediaUrl} controls className="max-h-full max-w-full" />
                      ) : (
                        <img src={mediaUrl} alt="Preview" className="h-full w-full object-cover" />
                      )}
                    </div>
                  )}
                </div>

                {/* Submit CTA */}
                <div className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/testimonials/')}
                    className="text-xs flex items-center gap-1.5 cursor-pointer text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Testimonials</span>
                  </button>

                  <PaperPlaneButton
                    type="submit"
                    disabled={isSubmitting}
                    sending={isSubmitting}
                    sent={success}
                    label={isSubmitting ? 'Recording Review...' : 'Publish Verified Review'}
                    className="w-full sm:w-auto justify-center"
                  />
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
