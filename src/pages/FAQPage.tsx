import PageHeader from '../components/PageHeader';
import FAQ from '../components/FAQ';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQPage() {
  const { theme } = useTheme();
  const data = SEO_DATA['/faq/'];

  const EXTRA_FAQS = [
    {
      q: 'What is a "Run and Drive" auction status?',
      a: 'A "Run & Drive" tag from auctions like Copart or IAAI means that the vehicle started, was put into gear, and moved forward under its own power at the time of check-in at the auction lot. It does not guarantee roadworthiness or long-distance reliability, which is why our on-site inspection teams are vital.'
    },
    {
      q: 'Can I import hybrid or fully electric vehicles (EVs) to Nigeria?',
      a: 'Yes, we regularly procure and clear hybrid and electric cars (such as Tesla Models, Hyundai Ioniqs, and Toyota Hybrids). We ensure the high-voltage battery states are checked, and we handle special shipping regulations surrounding lithium-ion cargo containerization.'
    },
    {
      q: 'What happens if a vehicle is damaged during marine transport?',
      a: 'All our cargo shipping containers are fully insured under comprehensive marine cargo insurance. In the rare event of severe shipping line delays, container structural damage, or port handler impact, our insurance covers structural damage repair costs or full replacement valuations.'
    },
    {
      q: 'How do I track my container shipment?',
      a: 'Once your container is booked and loaded onto the vessel in Toronto or Montreal, we provide you with the Shipping Line Name (e.g., MSC, Grimaldi, Maersk) and your 11-digit Container Number. You can track its location in real-time on our website or the shipping line\'s public tracking portal.'
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={data.heading} 
        subtitle={data.description} 
        breadcrumbs={data.breadcrumbs} 
      />

      <section className={`py-16 px-6 md:px-12 ${
        theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <HelpCircle size={28} className="text-[#2B59FF]" />
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
              Advanced Sourcing FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {EXTRA_FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div 
                  key={idx} 
                  className={`border transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="flex justify-between items-center w-full p-6 text-left"
                  >
                    <span className="font-bold text-sm md:text-base uppercase tracking-tight">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={18} 
                      className={`text-[#2B59FF] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {isOpen && (
                    <div className={`px-6 pb-6 text-xs md:text-sm leading-relaxed ${
                      theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reuse core interactive FAQ */}
      <FAQ />
    </div>
  );
}
