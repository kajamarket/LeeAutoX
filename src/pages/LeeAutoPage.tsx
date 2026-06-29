import { motion } from 'motion/react';
import { Wrench, Shield, CheckCircle, ClipboardCheck, MessageSquare, Sparkles, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LeeAutoPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-4xl mx-auto">
        {/* Banner Section */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2B59FF] bg-blue-50 px-3 py-1 rounded-full">
            Dealer Services Division
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900">
            Lee Auto Nigeria — Vehicle Servicing for Dealers in Lagos
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Providing premium pre-sale inspections, light mechanical preparation, cosmetic detailing, and custom verification support for imported vehicles at our Lagos operations terminal.
          </p>
        </div>

        {/* Core Content Block */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12 space-y-8 text-slate-700 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-slate-950 flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#2B59FF]" />
              Who We Are & Our Relationship with LeeAutoX
            </h2>
            <p>
              <strong>Lee Auto Nigeria</strong> is the exclusive dealer-facing vehicle servicing and preparation division of <strong>LeeAutoX</strong>. While LeeAutoX handles the complex international logistics pipeline—including North American auto auction bidding, containerized shipping from Toronto, marine transit, and port clearance—Lee Auto serves as our specialized on-the-ground operational hub in Lagos, Nigeria.
            </p>
            <p>
              Operating out of our secure, fully-equipped facility, Lee Auto bridges the gap between vehicle arrival at the Lagos port and its ultimate handover to commercial showrooms or returning buyers. Our mission is to ensure that every vehicle sourced and imported through our channel undergoes rigorous, professional assessment and preparation before it hitches a ride on Nigerian roads. We serve as a trusted partner for commercial car dealers, bulk fleet operators, returning diaspora clients, and corporate importers who demand transparency and professional excellence.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Four Core Services */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-slate-950 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-[#2B59FF]" />
              Our Four Core Services
            </h2>
            <p>
              To protect dealership margins and ensure absolute buyer satisfaction, we provide four highly structured automotive services designed for high-volume commercial imported fleets:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-[#2B59FF] font-semibold">
                  <ClipboardCheck className="w-5 h-5" />
                  <h3>1. Pre-Sale Inspections</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Every imported vehicle is subjected to a comprehensive diagnostic scan and physical point inspection. We check engine health, transmission shifts, suspension stability, fluid quality, and electronics. Dealers receive a full report to confidently price their units.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-[#2B59FF] font-semibold">
                  <Wrench className="w-5 h-5" />
                  <h3>2. Light Mechanical Prep</h3>
                </div>
                <p className="text-sm text-slate-600">
                  We handle essential mechanical preparations, including oil changes, spark plug replacements, brake pad servicing, battery testing, and minor electrical sorting. This prevents common post-transit starting issues and guarantees a turnkey start on showroom floors.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-[#2B59FF] font-semibold">
                  <Sparkles className="w-5 h-5" />
                  <h3>3. Cosmetic Detailing</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Remove salt residue, marine dust, and transit grime. Our detailing package includes complete exterior washing, compound paint correction, protective waxing, interior vacuuming, leather conditioning, and undercarriage steam cleaning.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-[#2B59FF] font-semibold">
                  <Shield className="w-5 h-5" />
                  <h3>4. VIN & Customs Verification</h3>
                </div>
                <p className="text-sm text-slate-600">
                  We safeguard your business by cross-referencing vehicle chassis numbers (VINs) against the Nigeria Customs Service (NCS) database. This ensures that custom duties were fully assessed and paid legally, avoiding future impound issues.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Who We Serve */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-slate-950 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-[#2B59FF]" />
              Who We Serve
            </h2>
            <p>
              Our specialized services are tailored specifically to the unique needs of several key automotive segments:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Automotive Dealers:</strong> Showcase clean, mechanically verified, and detailed vehicles on your lots. Minimize returns and maintain a stellar reputation among buyers.
              </li>
              <li>
                <strong>Corporate Fleet Operators:</strong> Maintain strict compliance and operational uptime with our volume diagnostics and safety checks.
              </li>
              <li>
                <strong>Returning Diaspora Customers:</strong> Avoid the stress of receiving a car damaged by long-haul marine shipping. Our team receives, preps, and handovers your vehicle in pristine, ready-to-drive condition.
              </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Pricing Section */}
          <section className="space-y-4 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
            <h2 className="text-xl font-serif font-semibold text-slate-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#2B59FF]" />
              Pricing and Custom Service Requests
            </h2>
            <p className="text-sm">
              Because dealer needs vary widely based on fleet volume, mechanical requirements, and vehicle classes, our pricing is fully customizable. We provide generous discounts for multi-unit dealers and recurring partners who utilize LeeAutoX for their sourcing and logistics. 
            </p>
            <p className="text-sm">
              Contact our Lagos operations coordinator today via WhatsApp to discuss your specific requirements, receive a custom quote, and book servicing timeslots for your upcoming port containers.
            </p>
          </section>

          {/* CTA Action */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <a
              href="https://wa.me/2349133886162?text=Hello%20Lee%20Auto%20Nigeria,%20I%20would%20like%20to%20enquire%20about%20vehicle%20servicing%20and%20inspection%20services%20for%20dealers%20in%20Lagos."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-center"
            >
              <MessageSquare className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

        </div>

        {/* Related Services Links */}
        <div className="mt-12 bg-white rounded-xl border border-slate-100 p-8">
          <h3 className="text-lg font-serif font-bold text-slate-950 mb-4 text-center">Related Sourcing & customs Support</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <Link 
              to="/services/vehicle-sourcing/" 
              className="p-3 bg-slate-50 rounded-lg hover:bg-[#2B59FF]/10 hover:text-[#2B59FF] transition-colors font-semibold"
            >
              Vehicle Sourcing
            </Link>
            <Link 
              to="/nigeria/import-duty-calculator/" 
              className="p-3 bg-slate-50 rounded-lg hover:bg-[#2B59FF]/10 hover:text-[#2B59FF] transition-colors font-semibold"
            >
              Import Duty Calculator
            </Link>
            <Link 
              to="/guides/vehicle-inspection-checklist/" 
              className="p-3 bg-slate-50 rounded-lg hover:bg-[#2B59FF]/10 hover:text-[#2B59FF] transition-colors font-semibold"
            >
              Inspection Checklist
            </Link>
            <Link 
              to="/contact/" 
              className="p-3 bg-slate-50 rounded-lg hover:bg-[#2B59FF]/10 hover:text-[#2B59FF] transition-colors font-semibold"
            >
              Contact Team
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
