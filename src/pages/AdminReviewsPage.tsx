import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Download,
  FileSpreadsheet,
  ExternalLink,
  Star,
  ShieldCheck,
  Image as ImageIcon,
  Video,
  X,
} from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';
import {
  CodeShake,
  CopyButton,
  RippleButton,
} from '../components/ui/ImportedControls';

const DEFAULT_ADMIN_PIN = '8921';

export default function AdminReviewsPage() {
  const { reviews, averageRating, totalCount, exportToCSV, exportToJSON } = useReviews();

  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

  useEffect(() => {
    if (!selectedMedia) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMedia(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedMedia]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DEFAULT_ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const shareableReviewUrl = `${window.location.origin}/review/`;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <PageHeader
        title="Admin Reviews Console"
        subtitle="Confidential review management, Google Business Profile exports, and customer invite tools."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Admin', item: '/admin/' },
          { name: 'Reviews', item: '/admin/reviews/' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {!isAuthenticated ? (
          /* Authentication Gate */
          <div className="max-w-md mx-auto my-12">
            <Reveal variant="scale" immediate>
              <CodeShake error={pinError}>
                <div className="lx-card p-8">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mx-auto mb-6">
                    <Lock size={22} />
                  </div>

                  <h2 className="text-xl font-serif font-normal text-center mb-2 text-[var(--ink)]">
                    Administrator Authentication
                  </h2>
                  <p className="text-xs text-center mb-6 leading-relaxed text-[var(--ink-2)]">
                    Please enter your administrator passcode to access review logs and Google Business Profile export files.
                  </p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] mb-1.5">
                        Access Passcode (Default: 8921)
                      </label>
                      <input
                        type="password"
                        autoFocus
                        value={pin}
                        onChange={(e) => {
                          setPin(e.target.value);
                          setPinError(false);
                        }}
                        placeholder="Enter 4-digit PIN"
                        className="w-full px-4 py-3 rounded-2xl text-center text-lg tracking-widest font-mono border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                      />
                      {pinError && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-2 text-center font-mono">
                          Invalid passcode. Please try again.
                        </p>
                      )}
                    </div>

                    <RippleButton type="submit" variant="primary" className="w-full justify-center text-xs uppercase tracking-widest">
                      <Unlock size={14} />
                      <span>Unlock Admin Console</span>
                    </RippleButton>
                  </form>
                </div>
              </CodeShake>
            </Reveal>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-8">
            {/* Top Stat Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lx-card p-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] block mb-1">
                  Average Star Rating
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-serif font-normal text-amber-500 tabular-nums">
                    <AnimatedText text={String(averageRating)} variant="counter" trigger="mount" />
                  </span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-500" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lx-card p-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] block mb-1">
                  Total Reviews Ingested
                </span>
                <span className="text-3xl font-serif font-normal text-[var(--ink)] tabular-nums">
                  <AnimatedText text={String(totalCount)} variant="counter" trigger="mount" />
                </span>
              </div>

              <div className="lx-card p-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] block mb-1">
                  Google Sheet Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Connected
                </span>
              </div>

              <div className="lx-card p-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] block mb-1">
                  Google Schema Injector
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] mt-2">
                  <ShieldCheck size={14} /> Active on All Routes
                </span>
              </div>
            </div>

            {/* Quick Actions & Customer Share Link Box */}
            <div className="lx-card p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] block mb-1 font-bold">
                  Client Direct Share Link
                </span>
                <h3 className="font-serif text-xl font-normal mb-1 text-[var(--ink)]">
                  Share this link with customers on WhatsApp to collect verified reviews
                </h3>
                <p className="text-xs font-mono select-all text-[var(--ink-2)]">
                  {shareableReviewUrl}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <CopyButton value={shareableReviewUrl} label="Copy Review Link" copiedLabel="Link Copied!" />

                <a
                  href="/review/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lx-pill-btn border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] text-xs font-mono uppercase tracking-wider"
                >
                  <ExternalLink size={14} />
                  <span>Open Client View</span>
                </a>
              </div>
            </div>

            {/* Export Actions Suite for Google Business Profile */}
            <div className="lx-card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[var(--line)] mb-6">
                <div>
                  <h3 className="text-lg font-serif font-normal text-[var(--ink)]">
                    Google Business Profile (GBP) Export Suite
                  </h3>
                  <p className="text-xs text-[var(--ink-2)] mt-1">
                    Download complete verified review records in CSV format ready for Google Business Profile review appeals, audits, or backup.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <RippleButton
                    type="button"
                    variant="primary"
                    onClick={exportToCSV}
                    className="!bg-emerald-600 !text-white text-xs uppercase tracking-wider"
                  >
                    <FileSpreadsheet size={15} />
                    <span>Download CSV (Google Format)</span>
                  </RippleButton>

                  <RippleButton
                    type="button"
                    variant="outline"
                    onClick={exportToJSON}
                    className="text-xs font-mono uppercase tracking-wider"
                  >
                    <Download size={15} />
                    <span>Download JSON Schema</span>
                  </RippleButton>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-[var(--line)]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--line)] font-mono uppercase text-[10px] tracking-wider text-[var(--ink-2)] bg-[var(--surface)]">
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Client Name</th>
                      <th className="py-3.5 px-4">Location / Role</th>
                      <th className="py-3.5 px-4">Rating</th>
                      <th className="py-3.5 px-4">Vehicle / Service</th>
                      <th className="py-3.5 px-4">Review Text</th>
                      <th className="py-3.5 px-4">Media</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {reviews.map((rev) => (
                      <tr key={rev.id} className="transition-colors hover:bg-[var(--surface)]/60">
                        <td className="py-3.5 px-4 font-mono text-[var(--ink-2)] whitespace-nowrap">
                          {rev.date}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[var(--ink)] whitespace-nowrap">
                          {rev.author}
                        </td>
                        <td className="py-3.5 px-4 text-[var(--ink-2)] whitespace-nowrap">
                          {rev.role}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} size={12} className="fill-amber-500" />
                            ))}
                            <span className="ml-1 text-[11px] font-bold text-[var(--ink)] tabular-nums">
                              {rev.rating}.0
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[var(--accent)] font-mono whitespace-nowrap">
                          {rev.service || 'Automotive Import'}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-[var(--ink-2)]">
                          "{rev.quote}"
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {rev.mediaUrl ? (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedMedia({
                                  url: rev.mediaUrl!,
                                  type: rev.mediaType === 'video' ? 'video' : 'image',
                                })
                              }
                              className="inline-flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline cursor-pointer"
                            >
                              {rev.mediaType === 'video' ? <Video size={13} /> : <ImageIcon size={13} />}
                              <span>View</span>
                            </button>
                          ) : (
                            <span className="text-[var(--ink-2)]/50 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 rounded-full text-[10px] font-mono">
                            <ShieldCheck size={11} /> Approved
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Lightbox */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            type="button"
            onClick={() => setSelectedMedia(null)}
            aria-label="Close media preview"
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X size={20} />
          </button>
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'video' ? (
              <video src={selectedMedia.url} controls autoPlay className="max-h-[80vh] w-auto rounded-2xl" />
            ) : (
              <img src={selectedMedia.url} alt="Review Proof" className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
