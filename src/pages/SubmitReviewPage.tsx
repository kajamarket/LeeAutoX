import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Upload, Image as ImageIcon, Video, CheckCircle, AlertCircle, MessageCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import { useTheme } from '../context/ThemeContext';
import { CONTACT_INFO } from '../constants';
import PageHeader from '../components/PageHeader';

export default function SubmitReviewPage() {
  const { theme } = useTheme();
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
  const [hoverRating, setHoverRating] = useState(0);
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
  }, [initialCar, initialName]);

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
      setError('Failed to submit review. Please try again or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 sm:p-10 border shadow-2xl ${
            theme === 'dark' ? 'bg-[#121212] border-white/15' : 'bg-white border-slate-200'
          }`}
        >
          {success ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6"
              >
                <CheckCircle size={40} />
              </motion.div>

              <h2 className="text-3xl font-serif font-bold mb-3">Review Submitted!</h2>
              <p className={`text-sm max-w-md mb-8 leading-relaxed ${
                theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'
              }`}>
                Thank you, <strong>{author}</strong>! Your review and {rating}-star rating have been recorded and synchronized with our live testimonials ledger.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                    `Hello LeeAutoX! I just left a ${rating}-star review for ${service || 'my vehicle import'}. Thank you for the great service!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Notify Team on WhatsApp</span>
                </a>

                <button
                  onClick={() => navigate('/testimonials/')}
                  className={`px-6 py-3.5 border text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    theme === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  View All Testimonials
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Header Badges */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <span className="text-xs font-mono tracking-wider uppercase text-emerald-400 font-bold">
                    Official LeeAutoX Feedback Form
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  Direct Google Sheet Sync
                </span>
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 mb-2">
                  How would you rate your overall experience? *
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        size={32}
                        className={`transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-600 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-bold text-amber-400 font-mono">
                    {rating === 5 ? '5.0 / 5.0 (Excellent)' : `${rating}.0 / 5.0`}
                  </span>
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 mb-1.5">
                    Your Full Name or Company *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alhaji Babatunde S."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={`w-full px-4 py-3 text-sm border focus:outline-none focus:border-[#2B59FF] transition-colors ${
                      theme === 'dark' ? 'bg-black/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 mb-1.5">
                    Your Location / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Victoria Island, Lagos or Toronto, ON"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full px-4 py-3 text-sm border focus:outline-none focus:border-[#2B59FF] transition-colors ${
                      theme === 'dark' ? 'bg-black/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Service / Vehicle Details */}
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 mb-1.5">
                  Vehicle Model or Service Rendered
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2021 Lexus RX 350 Luxury AWD (Auction & Clearing)"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={`w-full px-4 py-3 text-sm border focus:outline-none focus:border-[#2B59FF] transition-colors ${
                    theme === 'dark' ? 'bg-black/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400 mb-1.5">
                  Your Feedback & Review *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Share details on car condition, auction updates, shipping speed, clearing assistance, and your overall satisfaction..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className={`w-full p-4 text-sm border focus:outline-none focus:border-[#2B59FF] transition-colors resize-none leading-relaxed ${
                    theme === 'dark' ? 'bg-black/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Photo / Video Clip Attachment */}
              <div className="space-y-2">
                <label className="block text-xs font-mono tracking-wider uppercase text-zinc-400">
                  Attach Delivery Photo or Unboxing Video (Optional)
                </label>

                <div className={`p-5 border border-dashed flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  theme === 'dark' ? 'border-white/20 bg-white/[0.02]' : 'border-slate-300 bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#2B59FF]/10 text-[#2B59FF]">
                      {mediaType === 'video' ? <Video size={24} /> : <ImageIcon size={24} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold">
                        {mediaFileName ? mediaFileName : 'Upload car delivery picture or video'}
                      </p>
                      <p className="text-[11px] text-zinc-500">
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
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>{mediaFileName ? 'Change' : 'Choose File'}</span>
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

                {mediaUrl && (
                  <div className="relative mt-2 rounded overflow-hidden border border-white/10 h-44 bg-black/50 flex items-center justify-center">
                    {mediaType === 'video' ? (
                      <video src={mediaUrl} controls className="max-h-full max-w-full" />
                    ) : (
                      <img src={mediaUrl} alt="Preview" className="h-full w-full object-cover" />
                    )}
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/testimonials/')}
                  className={`text-xs flex items-center gap-1.5 cursor-pointer ${
                    theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Testimonials</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-[#2B59FF] hover:bg-[#1a41cc] text-white font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(43,89,255,0.3)]"
                >
                  {isSubmitting ? 'Recording Review...' : 'Publish Verified Review'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
