import PageHeader from '../components/PageHeader';
import WhyChooseUs from '../components/WhyChooseUs';
import WhyCanada from '../components/WhyCanada';
import Contact from '../components/Contact';
import { SEO_DATA } from '../seoData';
import { Shield, Award, Users, Globe } from 'lucide-react';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';

const PILLARS = [
  {
    icon: Shield,
    title: 'Fully Registered',
    desc: 'Incorporated in Ontario, Canada. Operates legally with certified auction credentials.',
  },
  {
    icon: Award,
    title: '150-Point Check',
    desc: 'Every single car undergoes rigorous physical and record inspections prior to bid placement.',
  },
  {
    icon: Users,
    title: 'In-House Clearing',
    desc: 'Our direct Lagos clearing agency avoids broker markups and protects you from clearing delays.',
  },
  {
    icon: Globe,
    title: 'Last-Mile Freight',
    desc: 'Insured transit routes from North American shipping terminals directly to your African doorstep.',
  },
];

export default function AboutPage() {
  const data = SEO_DATA['/about/'];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <PageHeader
        title={data.heading}
        subtitle={data.description}
        breadcrumbs={data.breadcrumbs}
      />

      {/* Main Content Details */}
      <section className="py-20 px-6 md:px-12 bg-[var(--bg)] text-[var(--ink)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal variant="rise">
            <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase bg-[var(--accent-soft)] rounded-full px-3.5 py-1.5 inline-block mb-4">
              WHO WE ARE
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mb-6 text-[var(--ink)]">
              <AnimatedText text="A Registered Corporation with a Global Sourcing Reach" variant="blur-in" />
            </h2>
            <div className="space-y-6 text-sm md:text-base leading-relaxed text-[var(--ink-2)]">
              <p>
                LeeAutoX is a premier global vehicle procurement and shipping corporation, legally registered in Canada (Corporation No: 1761065-3). We are dedicated to bridging the gap between major North American automotive dealer auctions and international buyers across Africa.
              </p>
              <p>
                Founded on the principles of extreme transparency, technical precision, and absolute integrity, we handle the entire vehicle lifecycle. From reviewing historical Carfax files and biding on dealer-only salvage portals, to loading cars into heavy-duty containers and executing customs clearing in Nigeria, our processes are 100% verified.
              </p>
              <p>
                We do not just import cars; we secure valuable investments. By avoiding high retail dealer markups, we empower our clients to acquire dream vehicles at wholesale auction pricing, with clear, uninflated landing costs.
              </p>
            </div>
          </Reveal>

          {/* Visual Grid Accents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} variant="rise" delay={idx * 70}>
                  <div className="lx-card p-8 h-full">
                    <div className="w-11 h-11 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mb-4">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-serif text-lg font-normal mb-2 text-[var(--ink)]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[var(--ink-2)]">
                      {pillar.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Canada Spotlight */}
      <WhyCanada />

      {/* Reuse the WhyChooseUs Section */}
      <WhyChooseUs />

      <Contact />
    </div>
  );
}
