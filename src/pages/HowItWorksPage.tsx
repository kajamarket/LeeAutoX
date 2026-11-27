import PageHeader from '../components/PageHeader';
import Process from '../components/Process';
import Contact from '../components/Contact';
import { SEO_DATA } from '../seoData';
import { Compass, Ship, FileText, CheckCircle } from 'lucide-react';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';

const LOGISTICS_STEPS = [
  {
    icon: Compass,
    title: '1. Request & Bidding Strategy',
    desc: 'You specify the car, make, year, and target auction lot. Our licensed Canada brokers review historical data (Carfax, Autocheck, Copart records) to build a smart, risk-free bidding ceiling.',
  },
  {
    icon: CheckCircle,
    title: '2. Sourcing & On-site Verification',
    desc: 'Once our bid wins, we inspect the car directly at the yard. We verify that there are no hidden structural issues, engine compression failures, or title-brand mismatch errors before cleared for export.',
  },
  {
    icon: Ship,
    title: '3. Container Shipping & Tracking',
    desc: 'We load your vehicle in heavy-duty steel shipping containers out of our Scarborough depot. Each vehicle is securely strapped to prevent shifting, and global container tracking numbers are issued immediately.',
  },
  {
    icon: FileText,
    title: '4. Lagos Customs Clearing & Handover',
    desc: 'Upon arrival at Apapa or Tin Can port, our clearing coordinators prepare full documentation, handle valuations, pay duty levies, and clear the car safely. We coordinate the direct, fully washed handover on our lot or at your doorstep.',
  },
];

export default function HowItWorksPage() {
  const data = SEO_DATA['/how-it-works/'];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <PageHeader
        title={data.heading}
        subtitle={data.description}
        breadcrumbs={data.breadcrumbs}
      />

      <section className="py-16 px-6 md:px-12 bg-[var(--bg)] text-[var(--ink)]">
        <Reveal variant="rise" className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase bg-[var(--accent-soft)] rounded-full px-3.5 py-1.5 inline-block mb-3">
            LOGISTICS ROADMAP
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-[var(--ink)]">
            <AnimatedText text="How We Get Your Vehicle Safely to You" variant="blur-in" />
          </h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-[var(--ink-2)] max-w-2xl mx-auto">
            Importing a vehicle from Canada or the USA shouldn't be an opaque black box. We have designed a transparent, milestone-driven framework that guarantees peace of mind and constant tracking.
          </p>
        </Reveal>

        {/* Detailed Logistics Steps */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {LOGISTICS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} variant="rise" delay={idx * 75}>
                <div className="lx-card p-7 flex gap-5 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0 border border-[var(--accent)]/20">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-normal mb-2 text-[var(--ink)]">
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-sm leading-relaxed text-[var(--ink-2)]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Reuse the interactive Process flow */}
      <Process />

      <Contact />
    </div>
  );
}
