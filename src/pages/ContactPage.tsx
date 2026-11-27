import PageHeader from '../components/PageHeader';
import Contact from '../components/Contact';
import MapWhatsApp from '../components/MapWhatsApp';
import { SEO_DATA } from '../seoData';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import Reveal from '../components/ui/Reveal';
import { CopyButton } from '../components/ui/ImportedControls';

export default function ContactPage() {
  const data = SEO_DATA['/contact/'];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <PageHeader
        title={data.heading}
        subtitle={data.description}
        breadcrumbs={data.breadcrumbs}
      />

      {/* Main Location Details */}
      <section className="py-16 px-6 md:px-12 bg-[var(--bg)] text-[var(--ink)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Toronto Office */}
          <Reveal variant="rise" delay={0}>
            <div className="lx-card p-8 h-full flex flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block mb-2 font-mono">
                  NORTH AMERICA HEADQUARTERS
                </span>
                <h3 className="font-serif text-2xl font-normal mb-5 tracking-tight text-[var(--ink)]">
                  Toronto, Canada
                </h3>

                <div className="space-y-4 text-xs md:text-sm text-[var(--ink-2)]">
                  <div className="flex gap-3 items-start">
                    <MapPin size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                    <span>
                      {CONTACT_INFO.addressCA} (Corp: {CONTACT_INFO.corpNumber})
                    </span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Phone size={18} className="text-[var(--accent)] shrink-0" />
                    <span className="font-mono tabular-nums">{CONTACT_INFO.phone}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Mail size={18} className="text-[var(--accent)] shrink-0" />
                    <span className="break-all">{CONTACT_INFO.email1}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--line)]">
                <CopyButton value={CONTACT_INFO.phone} label="Copy Phone" />
                <CopyButton value={CONTACT_INFO.addressCA} label="Copy Address" />
              </div>
            </div>
          </Reveal>

          {/* Lagos Clearing Hub */}
          <Reveal variant="rise" delay={80}>
            <div className="lx-card p-8 h-full flex flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block mb-2 font-mono">
                  WEST AFRICA LOGISTICS HUB
                </span>
                <h3 className="font-serif text-2xl font-normal mb-5 tracking-tight text-[var(--ink)]">
                  Lagos, Nigeria
                </h3>

                <div className="space-y-4 text-xs md:text-sm text-[var(--ink-2)]">
                  <div className="flex gap-3 items-start">
                    <MapPin size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                    <span>{CONTACT_INFO.addressNG}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Phone size={18} className="text-[var(--accent)] shrink-0" />
                    <span className="font-mono tabular-nums">{CONTACT_INFO.phoneNG}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Mail size={18} className="text-[var(--accent)] shrink-0" />
                    <span className="break-all">{CONTACT_INFO.email2}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--line)]">
                <CopyButton value={CONTACT_INFO.phoneNG} label="Copy Phone" />
                <CopyButton value={CONTACT_INFO.addressNG} label="Copy Address" />
              </div>
            </div>
          </Reveal>

          {/* Business Hours */}
          <Reveal variant="rise" delay={160}>
            <div className="lx-card p-8 h-full flex flex-col justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase block mb-2 font-mono">
                  DEDICATED COORDINATION
                </span>
                <h3 className="font-serif text-2xl font-normal mb-5 tracking-tight text-[var(--ink)]">
                  Working Hours
                </h3>

                <div className="space-y-4 text-xs md:text-sm text-[var(--ink-2)]">
                  <div className="flex gap-3 items-start">
                    <Clock size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[var(--ink)]">Monday - Friday</p>
                      <p className="font-mono text-xs mt-0.5">9:00 AM - 6:00 PM (EST / GMT+1)</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Clock size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[var(--ink)]">Saturday</p>
                      <p className="font-mono text-xs mt-0.5">10:00 AM - 3:00 PM (Lagos Office Only)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--line)]">
                <CopyButton value={CONTACT_INFO.email1} label="Copy Email" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reuse map and WhatsApp float elements */}
      <MapWhatsApp />
      <Contact />
    </div>
  );
}
