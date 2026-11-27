import { Wrench, Shield, CheckCircle, ClipboardCheck, Sparkles, AlertTriangle } from 'lucide-react';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Contact from '../components/Contact';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';
import { RippleLink } from '../components/ui/ImportedControls';

const CORE_SERVICES = [
  {
    icon: ClipboardCheck,
    title: '1. Pre-Sale Inspections',
    desc: 'Every imported vehicle is subjected to a comprehensive diagnostic scan and physical point inspection. We check engine health, transmission shifts, suspension stability, fluid quality, and electronics. Dealers receive a full report to confidently price their units.',
  },
  {
    icon: Wrench,
    title: '2. Light Mechanical Prep',
    desc: 'We handle essential mechanical preparations, including oil changes, spark plug replacements, brake pad servicing, battery testing, and minor electrical sorting. This prevents common post-transit starting issues and guarantees a turnkey start on showroom floors.',
  },
  {
    icon: Sparkles,
    title: '3. Cosmetic Detailing',
    desc: 'Remove salt residue, marine dust, and transit grime. Our detailing package includes complete exterior washing, compound paint correction, protective waxing, interior vacuuming, leather conditioning, and undercarriage steam cleaning.',
  },
  {
    icon: Shield,
    title: '4. VIN & Customs Verification',
    desc: 'We safeguard your business by cross-referencing vehicle chassis numbers (VINs) against the Nigeria Customs Service (NCS) database. This ensures that custom duties were fully assessed and paid legally, avoiding future impound issues.',
  },
];

export default function LeeAutoPage() {
  return (
    <div className="bg-[var(--bg)] text-[var(--ink)] min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Banner Section */}
        <Reveal variant="rise" immediate className="text-center mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-soft)] px-3.5 py-1.5 rounded-full inline-block">
            Dealer Services Division
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[var(--ink)]">
            <AnimatedText text="Lee Auto Nigeria — Vehicle Servicing for Dealers in Lagos" variant="blur-in" trigger="mount" />
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--ink-2)] max-w-2xl mx-auto leading-relaxed">
            Providing premium pre-sale inspections, light mechanical preparation, cosmetic detailing, and custom verification support for imported vehicles at our Lagos operations terminal.
          </p>
        </Reveal>

        {/* Core Content Block */}
        <Reveal variant="rise">
          <div className="lx-card p-8 sm:p-12 space-y-8 text-[var(--ink-2)] leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[var(--ink)] flex items-center gap-2.5">
                <Shield className="w-6 h-6 text-[var(--accent)] shrink-0" />
                <span>Who We Are & Our Relationship with LeeAutoX</span>
              </h2>
              <p>
                <strong className="text-[var(--ink)]">Lee Auto Nigeria</strong> is the exclusive dealer-facing vehicle servicing and preparation division of <strong className="text-[var(--ink)]">LeeAutoX</strong>. While LeeAutoX handles the complex international logistics pipeline—including North American auto auction bidding, containerized shipping from Toronto, marine transit, and port clearance—Lee Auto serves as our specialized on-the-ground operational hub in Lagos, Nigeria.
              </p>
              <p>
                Operating out of our secure, fully-equipped facility, Lee Auto bridges the gap between vehicle arrival at the Lagos port and its ultimate handover to commercial showrooms or returning buyers. Our mission is to ensure that every vehicle sourced and imported through our channel undergoes rigorous, professional assessment and preparation before it hitches a ride on Nigerian roads. We serve as a trusted partner for commercial car dealers, bulk fleet operators, returning diaspora clients, and corporate importers who demand transparency and professional excellence.
              </p>
            </section>

            <hr className="border-[var(--line)]" />

            {/* Four Core Services */}
            <section className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[var(--ink)] flex items-center gap-2.5">
                <Wrench className="w-6 h-6 text-[var(--accent)] shrink-0" />
                <span>Our Four Core Services</span>
              </h2>
              <p>
                To protect dealership margins and ensure absolute buyer satisfaction, we provide four highly structured automotive services designed for high-volume commercial imported fleets:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {CORE_SERVICES.map((svc) => {
                  const Icon = svc.icon;
                  return (
                    <div
                      key={svc.title}
                      className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-2.5"
                    >
                      <div className="flex items-center gap-2 text-[var(--accent)] font-semibold">
                        <Icon className="w-5 h-5 shrink-0" />
                        <h3 className="font-serif text-base font-normal text-[var(--ink)]">{svc.title}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                        {svc.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <hr className="border-[var(--line)]" />

            {/* Who We Serve */}
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[var(--ink)] flex items-center gap-2.5">
                <CheckCircle className="w-6 h-6 text-[var(--accent)] shrink-0" />
                <span>Who We Serve</span>
              </h2>
              <p>
                Our specialized services are tailored specifically to the unique needs of several key automotive segments:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[var(--ink)]">Automotive Dealers:</strong> Showcase clean, mechanically verified, and detailed vehicles on your lots. Minimize returns and maintain a stellar reputation among buyers.
                </li>
                <li>
                  <strong className="text-[var(--ink)]">Corporate Fleet Operators:</strong> Maintain strict compliance and operational uptime with our volume diagnostics and safety checks.
                </li>
                <li>
                  <strong className="text-[var(--ink)]">Returning Diaspora Customers:</strong> Avoid the stress of receiving a car damaged by long-haul marine shipping. Our team receives, preps, and handovers your vehicle in pristine, ready-to-drive condition.
                </li>
              </ul>
            </section>

            <hr className="border-[var(--line)]" />

            {/* Pricing Section */}
            <section className="space-y-4 p-6 bg-[var(--accent-soft)] rounded-2xl border border-[var(--accent)]/25">
              <h2 className="text-xl font-serif font-normal text-[var(--ink)] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <span>Pricing and Custom Service Requests</span>
              </h2>
              <p className="text-sm text-[var(--ink-2)]">
                Because dealer needs vary widely based on fleet volume, mechanical requirements, and vehicle classes, our pricing is fully customizable. We provide generous discounts for multi-unit dealers and recurring partners who utilize LeeAutoX for their sourcing and logistics.
              </p>
              <p className="text-sm text-[var(--ink-2)]">
                Contact our Lagos operations coordinator today via WhatsApp to discuss your specific requirements, receive a custom quote, and book servicing timeslots for your upcoming port containers.
              </p>
            </section>

            {/* CTA Action */}
            <div className="pt-4">
              <WhatsAppCTA
                message="Hello LeeAutoX Nigeria, I would like to enquire about vehicle servicing and inspection services for dealers in Lagos."
                title="Chat with our Lagos Operations Coordinator"
                subtitle="Discuss servicing requirements, container unloading slots, and custom dealer fleet inspections."
              />
            </div>
          </div>
        </Reveal>

        {/* Related Services Links */}
        <Reveal variant="rise" className="mt-12">
          <div className="lx-card p-8">
            <h3 className="text-lg font-serif font-normal text-[var(--ink)] mb-5 text-center">
              Related Sourcing & Customs Support
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
              <RippleLink to="/services/vehicle-sourcing/" variant="secondary" className="w-full justify-center">
                Vehicle Sourcing
              </RippleLink>
              <RippleLink to="/nigeria/import-duty-calculator/" variant="secondary" className="w-full justify-center">
                Duty Calculator
              </RippleLink>
              <RippleLink to="/guides/vehicle-inspection-checklist/" variant="secondary" className="w-full justify-center">
                150-Point Checklist
              </RippleLink>
              <RippleLink to="/contact/" variant="secondary" className="w-full justify-center">
                Contact Team
              </RippleLink>
            </div>
          </div>
        </Reveal>
      </div>

      <Contact />
    </div>
  );
}
