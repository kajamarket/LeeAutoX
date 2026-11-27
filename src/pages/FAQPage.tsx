import PageHeader from '../components/PageHeader';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import { SEO_DATA } from '../seoData';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';

const EXTRA_FAQS = [
  {
    q: 'What is a "Run and Drive" auction status?',
    a: 'A "Run & Drive" tag from auctions like Copart or IAAI means that the vehicle started, was put into gear, and moved forward under its own power at the time of check-in at the auction lot. It does not guarantee roadworthiness or long-distance reliability, which is why our on-site inspection teams are vital.',
  },
  {
    q: 'Can I import hybrid or fully electric vehicles (EVs) to Nigeria?',
    a: 'Yes, we regularly procure and clear hybrid and electric cars (such as Tesla Models, Hyundai Ioniqs, and Toyota Hybrids). We ensure the high-voltage battery states are checked, and we handle special shipping regulations surrounding lithium-ion cargo containerization.',
  },
  {
    q: 'What happens if a vehicle is damaged during marine transport?',
    a: 'All our cargo shipping containers are fully insured under comprehensive marine cargo insurance. In the rare event of severe shipping line delays, container structural damage, or port handler impact, our insurance covers structural damage repair costs or full replacement valuations.',
  },
  {
    q: 'How do I track my container shipment?',
    a: "Once your container is booked and loaded onto the vessel in Toronto or Montreal, we provide you with the Shipping Line Name (e.g., MSC, Grimaldi, Maersk) and your 11-digit Container Number. You can track its location in real-time on our website or the shipping line's public tracking portal.",
  },
];

export default function FAQPage() {
  const data = SEO_DATA['/faq/'];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <PageHeader
        title={data.heading}
        subtitle={data.description}
        breadcrumbs={data.breadcrumbs}
      />

      <section className="py-16 px-6 md:px-12 bg-[var(--bg)] text-[var(--ink)]">
        <div className="max-w-4xl mx-auto">
          <Reveal variant="rise" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
              <HelpCircle size={22} />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-tight text-[var(--ink)]">
              <AnimatedText text="Advanced Sourcing FAQs" variant="blur-in" />
            </h2>
          </Reveal>

          <div className="space-y-4">
            {EXTRA_FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <Reveal key={idx} variant="rise" delay={idx * 60}>
                  <div className="lx-card overflow-hidden">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="flex justify-between items-center gap-4 w-full p-6 text-left cursor-pointer"
                    >
                      <span className="font-serif text-base md:text-lg font-normal text-[var(--ink)]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[var(--accent)] shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <div className="lx-accordion-body" data-open={isOpen ? 'true' : 'false'}>
                      <div className="lx-accordion-inner">
                        <div className="px-6 pb-6 text-xs md:text-sm leading-relaxed text-[var(--ink-2)] border-t border-[var(--line)] pt-4">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reuse core interactive FAQ */}
      <FAQ />

      <Contact />
    </div>
  );
}
