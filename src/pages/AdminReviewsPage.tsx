import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Download, FileSpreadsheet, ExternalLink, Star, ShieldCheck, Copy, Check, Image as ImageIcon, Video } from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import { useTheme } from '../context/ThemeContext';
import PageHeader from '../components/PageHeader';

const DEFAULT_ADMIN_PIN = '8921';

export default function AdminReviewsPage() {
  const { theme } = useTheme();
  const { reviews, averageRating, totalCount, exportToCSV, exportToJSON } = useReviews();

  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

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

  const handleCopyShareableLink = () => {
    navigator.clipboard.writeText(shareableReviewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0A0A0A] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <PageHeader
        title="Admin Reviews Console"
        subtitle="Confidential review management, Google Business Profile exports, and customer invite tools."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Admin', item: '/admin/reviews/' },
          { name: 'Reviews', item: '/admin/reviews/' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {!isAuthenticated ? (
          /* Authentication Gate */
          <div className="max-w-md mx-auto my-12">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-8 border shadow-2xl ${
                theme === 'dark' ? 'bg-[#121212] border-white/15' : 'bg-white border-slate-200'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#2B59FF]/10 text-[#2B59FF] flex items-center justify-center mx-auto mb-6">
                <Lock size={24} />
              </div>

              <h2 className="text-xl font-serif font-bold text-center mb-2">
                Administrator Authentication
              </h2>
              <p className={`text-xs text-center mb-6 leading-relaxed ${
                theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                Please enter your administrator passcode to access review logs and Google Business Profile export files.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
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
                    className={`w-full px-4 py-3 text-center text-lg tracking-widest font-mono border focus:outline-none focus:border-[#2B59FF] transition-colors ${
                      theme === 'dark' ? 'bg-black border-white/20 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}
                  />
                  {pinError && (
                    <p className="text-xs text-red-400 mt-2 text-center font-mono">
                      Invalid passcode. Please try again.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#2B59FF] hover:bg-[#1a41cc] text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock size={14} />
                  <span>Unlock Admin Console</span>
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-8">
            {/* Top Stat Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-6 border ${theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  Average Star Rating
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-serif font-bold text-amber-400">{averageRating}</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div className={`p-6 border ${theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  Total Reviews Ingested
                </span>
                <span className="text-3xl font-serif font-bold">{totalCount}</span>
              </div>

              <div className={`p-6 border ${theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  Google Sheet Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync Connected
                </span>
              </div>

              <div className={`p-6 border ${theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  Google Schema Injector
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2B59FF] mt-2">
                  <ShieldCheck size={14} /> Active on All Routes
                </span>
              </div>
            </div>

            {/* Quick Actions & Customer Share Link Box */}
            <div className={`p-6 border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
              theme === 'dark' ? 'bg-[#141414] border-white/15' : 'bg-white border-slate-200'
            }`}>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#2B59FF] block mb-1 font-bold">
                  Client Direct Share Link
                </span>
                <h3 className="text-lg font-bold mb-1">
                  Share this link with customers on WhatsApp to collect verified reviews
                </h3>
                <p className={`text-xs font-mono select-all ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  {shareableReviewUrl}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyShareableLink}
                  className="px-5 py-2.5 bg-[#2B59FF] hover:bg-[#1a41cc] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(43,89,255,0.25)]"
                >
                  {copiedLink ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Review Link'}</span>
                </button>

                <a
                  href="/review/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2.5 border text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                    theme === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <ExternalLink size={14} />
                  <span>Open Client View</span>
                </a>
              </div>
            </div>

            {/* Export Actions Suite for Google Business Profile */}
            <div className={`p-6 border ${
              theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-base font-bold font-serif">
                    Google Business Profile (GBP) Export Suite
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Download complete verified review records in CSV format ready for Google Business Profile review appeals, audits, or backup.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <FileSpreadsheet size={15} />
                    <span>Download CSV (Google Format)</span>
                  </button>

                  <button
                    onClick={exportToJSON}
                    className={`px-4 py-2.5 border text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
                      theme === 'dark' ? 'border-white/20 hover:bg-white/10 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Download size={15} />
                    <span>Download JSON Schema</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b font-mono uppercase text-[10px] tracking-wider ${
                      theme === 'dark' ? 'border-white/10 text-zinc-400 bg-black/40' : 'border-slate-200 text-slate-500 bg-slate-100'
                    }`}>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Client Name</th>
                      <th className="py-3 px-4">Location / Role</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Vehicle / Service</th>
                      <th className="py-3 px-4">Review Text</th>
                      <th className="py-3 px-4">Media</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reviews.map((rev) => (
                      <tr
                        key={rev.id}
                        className={`transition-colors ${
                          theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono text-zinc-400 whitespace-nowrap">
                          {rev.date}
                        </td>
                        <td className="py-3.5 px-4 font-bold whitespace-nowrap">
                          {rev.author}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                          {rev.role}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} size={12} className="fill-amber-400" />
                            ))}
                            <span className="ml-1 text-[11px] font-bold text-foreground">
                              {rev.rating}.0
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#2B59FF] font-mono whitespace-nowrap">
                          {rev.service || 'Automotive Import'}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-zinc-300">
                          "{rev.quote}"
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {rev.mediaUrl ? (
                            <button
                              onClick={() => setSelectedMedia({ url: rev.mediaUrl!, type: rev.mediaType || 'image' })}
                              className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline cursor-pointer"
                            >
                              {rev.mediaType === 'video' ? <Video size={13} /> : <ImageIcon size={13} />}
                              <span>View</span>
                            </button>
                          ) : (
                            <span className="text-zinc-600 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-mono">
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'video' ? (
              <video src={selectedMedia.url} controls autoPlay className="max-h-[80vh] w-auto rounded" />
            ) : (
              <img src={selectedMedia.url} alt="Review Proof" className="max-h-[80vh] w-auto object-contain rounded shadow-2xl" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
