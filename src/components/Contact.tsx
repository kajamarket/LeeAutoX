import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';
import { PaperPlaneButton, CopyButton } from './ui/ImportedControls';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = `Hello my name is "${formData.name}", my phone number is "${formData.phone}" and I would like to make an enquiry on a "${formData.vehicle}". ${formData.details}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const inputClass =
    'w-full border-b border-[var(--line)] bg-transparent py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--ink-2)]/50';

  return (
    <section
      id="contact"
      className="lx-band-white relative border-t border-[var(--line)] transition-colors duration-500 px-4 sm:px-6 md:px-12 pt-6 pb-16 overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="lx-bg-lanes absolute inset-0 opacity-45" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Left Column */}
        <Reveal variant="slide-right">
          <div>
            <span className="inline-block text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--accent)] font-bold mb-3">
              Direct Concierge Desk
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.06] mb-6 text-[var(--ink)]">
              <AnimatedText text="Ready to order" variant="mask-rise" />
              <br />
              <span className="italic font-normal text-[var(--accent)]">your next vehicle?</span>
            </h2>
            <p className="text-[var(--ink-2)] text-sm sm:text-base leading-relaxed max-w-md mb-8">
              Tell us what you&apos;re looking for and we&apos;ll get back to you within 24 hours with availability, pricing, and shipping details — no commitment required.
            </p>

            {/* Unboxed plain contact information separated by whitespace & subtle hairlines */}
            <div className="divide-y divide-[var(--line)] text-sm">
              <div className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Mail size={15} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-2)] block mb-1">
                      Email
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <a
                        href={`mailto:${CONTACT_INFO.email1}`}
                        className="text-[var(--ink)] hover:text-[var(--accent)] underline decoration-[var(--line)] underline-offset-4 transition-colors break-all"
                      >
                        {CONTACT_INFO.email1}
                      </a>
                      <span className="text-[var(--line)] hidden sm:inline">·</span>
                      <a
                        href={`mailto:${CONTACT_INFO.email2}`}
                        className="text-[var(--ink)] hover:text-[var(--accent)] underline decoration-[var(--line)] underline-offset-4 transition-colors break-all"
                      >
                        {CONTACT_INFO.email2}
                      </a>
                    </div>
                  </div>
                </div>
                <CopyButton value={CONTACT_INFO.email1} label="Copy Email" className="self-start sm:self-center shrink-0" />
              </div>

              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Phone size={15} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-2)] block mb-1">
                      WhatsApp &amp; Direct Line
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono">
                      <a
                        href={`https://wa.me/${CONTACT_INFO.whatsappRaw}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--ink)] hover:text-[var(--accent)] underline decoration-[var(--line)] underline-offset-4 transition-colors"
                      >
                        {CONTACT_INFO.whatsapp}
                      </a>
                      <span className="text-[var(--line)] hidden sm:inline">·</span>
                      <a
                        href={`tel:${CONTACT_INFO.phoneNG.replace(/[^\d+]/g, '')}`}
                        className="text-[var(--ink-2)] hover:text-[var(--accent)] underline decoration-[var(--line)] underline-offset-4 transition-colors"
                      >
                        {CONTACT_INFO.phoneNG}
                      </a>
                    </div>
                  </div>
                </div>
                <CopyButton value={CONTACT_INFO.whatsapp} label="Copy Number" className="self-start sm:self-center shrink-0" />
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--ink-2)]">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-2)] block mb-0.5">
                      Canada Depot
                    </span>
                    <span className="text-[var(--ink)]">{CONTACT_INFO.addressCA}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-2)] block mb-0.5">
                      Nigeria Office
                    </span>
                    <span className="text-[var(--ink)]">{CONTACT_INFO.addressNG}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                Also looking for gadgets, laptops, or phones?{' '}
                <a
                  href="https://leeplugshub.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
                >
                  Visit Leeplugshub.com
                </a>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Right Column - Form */}
        <Reveal variant="slide-left" delay={80}>
          <div className="lx-card-padded p-6 sm:p-8 relative">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="name" className="text-[11px] font-mono tracking-[0.2em] uppercase text-[var(--ink-2)] block mb-1.5">
                      FULL NAME
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="text-[11px] font-mono tracking-[0.2em] uppercase text-[var(--ink-2)] block mb-1.5">
                      PHONE NUMBER
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 ..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="vehicle" className="text-[11px] font-mono tracking-[0.2em] uppercase text-[var(--ink-2)] block mb-1.5">
                      VEHICLE OF INTEREST
                    </label>
                    <input
                      id="vehicle"
                      type="text"
                      value={formData.vehicle}
                      onChange={handleChange}
                      placeholder="e.g. 2022 Toyota Land Cruiser, Ford F-150..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="details" className="text-[11px] font-mono tracking-[0.2em] uppercase text-[var(--ink-2)] block mb-1.5">
                      ADDITIONAL DETAILS
                    </label>
                    <textarea
                      id="details"
                      rows={3}
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="Budget, delivery location, preferred payment plan..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <PaperPlaneButton type="submit" label="Send Inquiry via WhatsApp" className="w-full sm:w-auto px-7 py-3.5" />
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 flex flex-col items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center">
                    <ArrowRight size={18} />
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-[var(--ink)]">Enquiry sent via WhatsApp.</h3>
                  <p className="text-[var(--ink-2)] text-sm">
                    We&apos;ve received your request. Our team will also reach out within 24 hours with verified auction options.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono text-[var(--accent)] underline underline-offset-4 mt-2 cursor-pointer"
                  >
                    Send another request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
