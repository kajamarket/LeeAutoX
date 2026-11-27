import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { SEO_DATA } from '../seoData';
import { MapPin, Shield, Check, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import ImportDutyCalculator from '../components/ImportDutyCalculator';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Contact from '../components/Contact';
import { cleanPathname } from '../utils/path';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';
import { RippleLink } from '../components/ui/ImportedControls';

export default function GeoPage() {
  const { pathname } = useLocation();

  // Standardize trailing slash
  let cleanPath = cleanPathname(pathname);
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  const data = SEO_DATA[cleanPath] || SEO_DATA['/nigeria/'];

  // Check which hub we are viewing
  const isNigeria = cleanPath.includes('nigeria');
  const isGhana = cleanPath.includes('ghana');
  const isCanada = cleanPath.includes('canada');

  // Customize text based on geography
  let localTitle = 'Local Clearance and Distribution';
  let localDesc = 'We handle all documentation, freight custom checking, and last-mile logistics.';
  let regionalSpecs: string[] = [];

  if (isNigeria) {
    localTitle = 'Nigeria Port Customs Clearances';
    localDesc = 'Our certified clearing agency coordinates with Nigeria Custom Service at Apapa, Tin Can, and PTML ports.';
    regionalSpecs = [
      'Genuine Customs Duty Assessed via official VIN clearance.',
      'Container offloading inspections inside secure port terminals.',
      'Insured car carrier transit options to Abuja, Port Harcourt, and Ibadan.',
      'Lagos holding yard support and direct physical vehicle handovers.'
    ];
  } else if (isGhana) {
    localTitle = 'Ghana Tema Port Clearances';
    localDesc = 'Direct customs integration at Tema port coordinates complete vehicle clearing and documentation.';
    regionalSpecs = [
      'Custom duty check based on CC rating and vehicle age thresholds.',
      'Tema port handling and secure container unstowing.',
      'Transit clearances bound for Accra, Kumasi, and Tamale.',
      'Milestone billing with secure GHS Cedi local escrow.'
    ];
  } else if (isCanada) {
    localTitle = 'Canada Sourcing & Port Outbound Logistics';
    localDesc = 'Sourcing vehicles across Ontario, Quebec, and British Columbia dealer auctions with secure freight loading.';
    regionalSpecs = [
      'Licensed Canadian dealer auction accounts with premium bidding power.',
      'Rigorous physical lot inspection on GTA Copart yards prior to bidding.',
      'In-house Scarborough depot containerization and steel strapping.',
      'Export title clearance with Canadian Border Services Agency (CBSA).'
    ];
  }

  // Pre-built WhatsApp custom message based on path
  const whatsappMsg = encodeURIComponent(
    `Hello LeeAutoX, I would like to inquire about car sourcing and clearance options for ${data.heading} (Reference: ${cleanPath}).`
  );
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${whatsappMsg}`;

  const isScarborough = cleanPath.includes('scarborough');
  const isLagos = cleanPath.includes('lagos') || (isNigeria && !cleanPath.includes('calculator') && !cleanPath.includes('abuja') && !cleanPath.includes('port-harcourt'));

  if (isScarborough) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <PageHeader
          title="Car auctions in Scarborough: Ontario sourcing hub"
          subtitle="Direct, licensed wholesale sourcing from premier Ontario car auctions including Copart Cookstown, ADESA Toronto, and Impact Auto Auctions, direct to Lagos or Tema."
          breadcrumbs={data.breadcrumbs}
        />

        {/* Article Body Section */}
        <section className="py-16 px-6 md:px-12 bg-[var(--bg)] text-[var(--ink)]">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase bg-[var(--accent-soft)] px-3.5 py-1.5 rounded-full inline-block mb-4 font-mono">
              ONTARIO SOURCING TERMINAL
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mb-6 text-[var(--ink)]">
              <AnimatedText text="Car auctions in Scarborough: Ontario sourcing hub" variant="mask-rise" />
            </h1>

            {/* Quick Answer Box */}
            <Reveal variant="rise">
              <div className="lx-card p-6 sm:p-7 border border-[var(--accent)]/30 bg-[var(--accent-soft)]/50 my-6 text-[var(--ink)]">
                <span className="text-[11px] font-mono uppercase font-bold tracking-[0.14em] text-[var(--accent)] block mb-2">QUICK ANSWER</span>
                <p className="text-sm md:text-base leading-relaxed text-[var(--ink)]">
                  Car auctions in Scarborough and the Greater Toronto Area allow international buyers to acquire wholesale clean title and insurance salvage vehicles at trade pricing. Through a licensed broker like LeeAutoX, buyers access restricted auctions, receive physical lot inspections, and manage container loading from a local depot for export to West Africa.
                </p>
              </div>
            </Reveal>

            {/* Key Takeaways */}
            <aside aria-label="summary" className="lx-card p-6 sm:p-7 border border-[var(--line)] my-6 bg-[var(--card)] text-[var(--ink-2)]">
              <span className="text-[11px] font-mono uppercase font-bold tracking-[0.14em] text-[var(--accent)] block mb-3">KEY TAKEAWAYS</span>
              <ul className="space-y-2.5 text-xs md:text-sm">
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent)] font-bold">•</span><span>Access dealer-only auction platforms across Ontario without an independent commercial license.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent)] font-bold">•</span><span>On-site physical yard inspections identify hidden structural damage and diagnostic fault codes.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent)] font-bold">•</span><span>Centralized loading in Scarborough optimizes container packing and export paperwork.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent)] font-bold">•</span><span>LeeAutoX coordinates the entire pipeline from auction bidding to destination port clearance.</span></li>
              </ul>
            </aside>

            <div className="space-y-6 text-sm md:text-base leading-relaxed font-sans mt-8 text-[var(--ink-2)] lx-prose">
              <p>
                The Greater Toronto Area serves as the central hub for Canada's wholesale automotive trade. Commercial dealers, insurance underwriters, and fleet leasing companies liquidate thousands of vehicles weekly through regional auction facilities. For buyers importing cars into Nigeria or Ghana, sourcing vehicles through Scarborough provides direct access to high-volume auctions while establishing a central point for consolidation, mechanical inspection, and ocean containerization.
              </p>
              <p>
                Understanding how local auctions operate, which facilities offer the best value, and how to inspect vehicles prior to bidding protects your capital and ensures that imported vehicles meet your mechanical expectations.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-12 mb-4 tracking-tight text-[var(--ink)]">
                Major Ontario auction yards accessible from Scarborough
              </h2>
              <p>
                Three primary auction networks dominate the automotive wholesale sector in Southern Ontario:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2 my-4 text-[var(--ink-2)]">
                <li className="leading-relaxed"><strong className="text-[var(--ink)]">Copart Canada (Cookstown and Bowmanville):</strong> Copart operates large storage yards holding insurance claim units, financial repossessions, and clean-title fleet trade-ins. The Cookstown facility north of Toronto features an extensive inventory of late-model SUVs and light trucks with cosmetic or light repairable damage.</li>
                <li className="leading-relaxed"><strong className="text-[var(--ink)]">Impact Auto Auctions (Oshawa and Stoney Creek):</strong> Operating across Canada as part of IAA Holdings, Impact Auto specializes in insurance salvage and collision vehicles. Their facilities near Toronto provide steady inventory for rebuilders seeking deep purchase discounts.</li>
                <li className="leading-relaxed"><strong className="text-[var(--ink)]">ADESA Toronto (Milton):</strong> ADESA runs dealer-consignment and commercial wholesale auctions. Inventory primarily consists of off-lease passenger cars, government fleet turn-ins, and dealer trade-ins that carry clean titles and complete maintenance records.</li>
              </ul>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-12 mb-4 tracking-tight text-[var(--ink)]">
                Why physical lot inspection matters before bidding
              </h2>
              <p>
                Online bidding platforms provide photographs and basic vehicle descriptions, but digital listings cannot substitute for hands-on evaluation. Photographs routinely hide frame corrosion, structural misalignments, and fluid leaks that cost thousands of dollars to rectify after export.
              </p>
              <p>
                Before placing bids on auction inventory, our technicians visit regional yards to verify critical checkpoints. We inspect the engine oil and radiator coolant for contamination, scan the on-board diagnostics (OBD2) port for masked fault codes, confirm that all airbag modules are intact, and check undercarriage frame rails for collision straightening marks.
              </p>
              <p>
                Review our <Link to="/guides/vehicle-inspection-checklist/" className="text-[var(--accent)] font-semibold underline hover:opacity-80 transition-opacity">Copart pre-purchase 150-point inspection checklist</Link> to examine the mechanical standards our team verifies on auction lots.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-12 mb-4 tracking-tight text-[var(--ink)]">
                Container consolidation and export loading in Scarborough
              </h2>
              <p>
                Once a vehicle is won at auction, managing inland transport and marine loading efficiently keeps total costs under control.
              </p>
              <p>
                LeeAutoX coordinates flatbed towing directly from the auction yard to our consolidation depot in Scarborough. At our facility, vehicles are prepared for ocean freight: batteries are safely disconnected, fluids checked, and export documentation cross-referenced against provincial vehicle ownership slips.
              </p>
              <p>
                For containerized export, our loading crew packs up to four vehicles into a single 40-foot high-cube shipping container using heavy-duty tire straps and timber bracing. Multi-car consolidation splits ocean freight and terminal handling expenses among multiple vehicles, significantly lowering the per-unit landing cost compared to single-vehicle transport. From Scarborough, loaded containers travel by rail to container marine terminals in Montreal or Halifax for vessel loading.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-12 mb-4 tracking-tight text-[var(--ink)]">
                Export documentation handled at the Ontario hub
              </h2>
              <p>
                Exporting a motor vehicle from Canada requires rigorous compliance with the Canada Border Services Agency (CBSA) export reporting regulations. Failing to complete mandatory documentation can lead to border delays, impoundment, or refusal of carrier loading.
              </p>
              <p>
                Our administrative staff verifies that provincial vehicle titles (ownership permits) are stamped for export, verifies that no outstanding liens or chattel mortgages remain on the vehicle identification number (VIN), and files the digital export declaration through the Canadian Export Reporting System (CERS). This administrative clearance ensures smooth handover to ocean carriers and compliance at destination ports.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-12 mb-4 tracking-tight text-[var(--ink)]">
                Frequently asked questions
              </h2>

              <div className="my-4">
                <h3 className="font-serif text-xl font-normal mt-8 mb-2 tracking-tight text-[var(--ink)]">
                  Can private individuals buy directly from dealer auctions in Ontario?
                </h3>
                <p className="text-sm md:text-base leading-relaxed">
                  Most wholesale auto auctions in Ontario require an active motor vehicle dealer license issued by the Ontario Motor Vehicle Industry Council (OMVIC). LeeAutoX holds the requisite licensing and acts as your authorized purchasing broker, allowing you to bid on dealer-only inventory without obtaining a commercial license.
                </p>
              </div>

              <div className="my-4">
                <h3 className="font-serif text-xl font-normal mt-8 mb-2 tracking-tight text-[var(--ink)]">
                  How quickly are vehicles moved from the auction yard after bidding?
                </h3>
                <p className="text-sm md:text-base leading-relaxed">
                  Auction yards charge daily storage fees starting 2 to 3 business days after the sale date. Our dispatch team arranges flatbed transport within 24 to 48 hours of auction settlement to eliminate storage surcharges.
                </p>
              </div>

              <div className="my-4">
                <h3 className="font-serif text-xl font-normal mt-8 mb-2 tracking-tight text-[var(--ink)]">
                  What vehicle title types are eligible for export?
                </h3>
                <p className="text-sm md:text-base leading-relaxed">
                  Clean-title, salvage-title, and rebuilt-title vehicles are eligible for export from Canada. However, vehicles with a "Non-Repairable" or "Certificate of Destruction" brand cannot be registered or exported. Our staff screens vehicle titles before bidding to prevent ineligible purchases.
                </p>
              </div>

              <div className="my-4">
                <h3 className="font-serif text-xl font-normal mt-8 mb-2 tracking-tight text-[var(--ink)]">
                  How can I start sourcing from Ontario auctions?
                </h3>
                <p className="text-sm md:text-base leading-relaxed">
                  Send your vehicle criteria, model preferences, and budget to our Scarborough team via WhatsApp at +1 (647) 389-6162. We will set up live auction searches, review current run lists, and guide you through each bidding opportunity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action / WhatsApp section */}
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
          <WhatsAppCTA 
            message={`Hello LeeAutoX, I would like to inquire about car sourcing and clearance options for ${data.heading} (Reference: ${cleanPath}).`}
            title="Start Sourcing from Canadian Auctions Today"
            subtitle="Why pay exorbitant local markups when you can secure a custom, verified car direct from Canada? Connect with our active Scarborough logistics representative."
          />
        </section>
      </div>
    );
  }

  const isCalculator = cleanPath.includes('calculator');

  if (isCalculator) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <PageHeader
          title="Nigeria Customs Duty Calculator 2026"
          subtitle="Calculate estimated customs duty, shipping freight, port levies, VAT, and total landing costs for vehicles imported into Nigeria ports (Apapa, PTML, Tin Can)."
          breadcrumbs={data.breadcrumbs}
        />

        {/* Introduction / High-Quality SEO Content */}
        <section className="py-16 px-6 md:px-12 bg-[var(--bg)] text-[var(--ink)]">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase bg-[var(--accent-soft)] px-3.5 py-1.5 rounded-full inline-block mb-4 font-mono">
              VALUATION PORTAL
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mb-6 text-[var(--ink)]">
              <AnimatedText text="Direct Nigeria Customs Duty Calculator & Landing Cost Estimator" variant="mask-rise" />
            </h1>

            {/* Quick Answer Box */}
            <Reveal variant="rise">
              <div className="lx-card p-6 sm:p-7 border border-[var(--accent)]/30 bg-[var(--accent-soft)]/50 my-6 text-[var(--ink)]">
                <span className="text-[11px] font-mono uppercase font-bold tracking-[0.14em] text-[var(--accent)] block mb-2">QUICK ANSWER</span>
                <p className="text-sm md:text-base leading-relaxed text-[var(--ink)]">
                  A Nigeria customs car duty calculator computes the total clearance taxes payable on imported vehicles based on their Cost, Insurance, and Freight (CIF) value. Tariffs include an import duty (20% for cars, 10% for commercial vehicles), a 7% port surcharge, a 0.5% ECOWAS Trade Liberalization Scheme levy, and 7.5% Value Added Tax. Use our interactive estimator below or consult LeeAutoX for official VIN valuation assessments.
                </p>
              </div>
            </Reveal>

            {/* Key Takeaways */}
            <aside aria-label="summary" className="lx-card p-6 sm:p-7 border border-[var(--line)] my-6 bg-[var(--card)] text-[var(--ink-2)]">
              <span className="text-[11px] font-mono uppercase font-bold tracking-[0.14em] text-[var(--accent)] block mb-3">KEY TAKEAWAYS</span>
              <ul className="space-y-2.5 text-xs md:text-sm">
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent)] font-bold">•</span><span>Nigeria customs tariffs are assessed on the CIF benchmark rather than the domestic purchase price alone.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent)] font-bold">•</span><span>Vehicle age depreciation allowances reduce assessed values for models over five and ten years old.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent)] font-bold">•</span><span>Clearing terminal storage and shipping demurrage begin accruing if documentation is not prepared early.</span></li>
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent)] font-bold">•</span><span>LeeAutoX calculates all line items in advance to prevent clearance delays at Lagos ports.</span></li>
              </ul>
            </aside>

            <div className="space-y-6 text-sm md:text-base leading-relaxed font-sans mt-8 text-[var(--ink-2)] lx-prose">
              <p>
                Navigating the financial complexity of vehicle clearing at Nigerian ports requires professional precision. Our live <strong className="text-[var(--ink)]">Nigeria customs duty calculator</strong> utilizes the latest Nigeria Customs Service (NCS) Common External Tariff (CET) guidelines and official valuation metrics to determine realistic port landing costs.
              </p>
              <p>
                Rather than relying on risky verbal estimates, our interactive tool helps you compute exactly what is required to clear passenger sedans, high-ground SUVs, or commercial trucks at Apapa, Tin Can, or PTML terminals. Understand your liabilities, plan your acquisition budget, and import with absolute confidence.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-12 mb-4 tracking-tight text-[var(--ink)]">
                Understanding the CIF calculation model
              </h2>
              <p>
                Under the Nigeria Customs Service Common External Tariff (CET) guidelines, clearing assessments are calculated on the Cost, Insurance, and Freight (CIF) value of the vehicle, not simply the auction invoice total. The CIF value is converted into Nigerian Naira using the official customs exchange rate published on the Nigeria Customs portal.
              </p>
              <p>
                The standard statutory charges applied to vehicle imports include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm pl-4 text-[var(--ink-2)]">
                <li><strong className="text-[var(--ink)]">Import Duty (CET):</strong> Assessed at 20% of the CIF value for passenger vehicles (cars, SUVs, passenger vans) and 10% for commercial trucks and buses.</li>
                <li><strong className="text-[var(--ink)]">Port Surcharge:</strong> Set at 7% calculated directly on the import duty amount.</li>
                <li><strong className="text-[var(--ink)]">ECOWAS Trade Liberalization Scheme (ETLS):</strong> A regional treaty levy of 0.5% applied to the CIF total.</li>
                <li><strong className="text-[var(--ink)]">Comprehensive Import Supervision Scheme (CISS):</strong> An inspection fee of 1% assessed on the Free on Board (FOB) value.</li>
                <li><strong className="text-[var(--ink)]">Value Added Tax (VAT):</strong> Calculated at 7.5% across the combined sum of CIF value, import duty, port surcharge, ETLS, and CISS.</li>
              </ul>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-12 mb-4 tracking-tight text-[var(--ink)]">
                Customs vehicle age depreciation rebates
              </h2>
              <p>
                The Nigeria Customs Service recognizes standard annual depreciation when establishing the valuation benchmark for used vehicles. Models between 5 and 9 years old generally receive an automatic age rebate against the original base catalog value, while models 10 years or older receive up to a 40% valuation reduction. Vehicles manufactured more than 12 to 15 years prior to the date of arrival face import prohibitions or heavy penalties depending on the specific customs tariff band in effect.
              </p>
            </div>
          </div>
        </section>

        {/* The Live Interactive Calculator */}
        <section className="py-12 px-6 md:px-12 border-t border-b border-[var(--line)] bg-[var(--surface)]">
          <div className="max-w-4xl mx-auto">
            {/* Context & Purpose Banner */}
            <div className="lx-card p-6 sm:p-7 border border-[var(--accent)]/30 bg-[var(--card)] mb-10">
              <span className="text-[11px] font-mono uppercase font-bold tracking-[0.14em] text-[var(--accent)] block mb-2">
                CUSTOMS VALUATION OVERVIEW
              </span>
              <h3 className="font-serif text-xl font-normal mb-2 text-[var(--ink)]">
                Calculate Your Total Cleared Landed Cost Before Bidding
              </h3>
              <p className="text-xs md:text-sm leading-relaxed mb-3 text-[var(--ink-2)]">
                This interactive tool estimates your full landing cost when importing a car from Canada to Nigeria. In Nigeria, customs duties are calculated on the <strong className="text-[var(--ink)]">Cost, Insurance, and Freight (CIF)</strong> value of the vehicle using statutory CET rates averaging <strong className="text-[var(--ink)]">~43% of CIF</strong>.
              </p>
              <p className="text-xs leading-relaxed text-[var(--ink-2)]">
                <strong className="text-[var(--ink)]">Notice on Exchange Rates:</strong> Nigeria Customs Service computes duties using its own <strong className="text-[var(--ink)]">official customs valuation exchange rate (currently ~₦1,400–₦1,450/USD)</strong>, which is independent of commercial bank or parallel open-market rates. Customs exchange rates and fiscal tariffs fluctuate periodically per official circulars.
              </p>

              {/* Pillar Cross-Links */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[var(--line)] text-xs">
                <Link to="/guides/import-car-canada-to-nigeria/" className="text-[var(--accent)] font-semibold hover:underline">
                  ← Complete Canada to Nigeria Import Guide
                </Link>
                <span className="text-[var(--ink-2)]">•</span>
                <Link to="/guides/shipping-cost-canada-to-nigeria/" className="text-[var(--accent)] font-semibold hover:underline">
                  Full Shipping Cost Breakdown
                </Link>
                <span className="text-[var(--ink-2)]">•</span>
                <Link to="/guides/roro-vs-container-shipping-canada-to-nigeria/" className="text-[var(--accent)] font-semibold hover:underline">
                  RoRo vs Container Shipping
                </Link>
              </div>
            </div>

            <ImportDutyCalculator />

            {/* Worked Example Calculations Cards */}
            <div className="mt-14">
              <span className="text-[11px] font-mono uppercase font-bold tracking-[0.14em] text-[var(--accent)] block mb-2">
                PRACTICAL BENCHMARKS
              </span>
              <h3 className="font-serif text-2xl font-normal tracking-tight mb-4 text-[var(--ink)]">
                Worked Clearing Examples (~43% CIF Benchmark)
              </h3>
              <p className="text-xs md:text-sm mb-6 leading-relaxed text-[var(--ink-2)]">
                Based on the standard formula: <code className="bg-[var(--accent-soft)] text-[var(--accent)] px-2 py-0.5 rounded-full font-mono font-bold">Duty = CIF (USD) × Customs FX (~₦1,425/$) × 0.43</code>. Here is how representative vehicles calculate under current working parameters:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Example 1 */}
                <Reveal variant="isometric" delay={0}>
                  <div className="lx-card h-full p-6 border border-[var(--line)] bg-[var(--card)]">
                    <span className="text-[10px] font-bold uppercase text-[var(--accent)] font-mono block mb-1">
                      Mid-Size Sedan
                    </span>
                    <h4 className="font-serif text-lg font-normal mb-3 text-[var(--ink)]">
                      2020 Toyota Camry
                    </h4>
                    <div className="space-y-2 text-xs text-[var(--ink-2)] font-mono tabular-nums">
                      <div className="flex justify-between">
                        <span>CIF Valuation:</span>
                        <strong className="text-[var(--ink)]">$5,000 USD</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>CIF in Naira (@ ₦1,425):</span>
                        <strong className="text-[var(--ink)]">₦7.13M</strong>
                      </div>
                      <div className="flex justify-between border-t pt-2 border-[var(--line)]">
                        <span>Statutory Duty (@ 43%):</span>
                        <strong className="text-[var(--accent)]">~₦3.06M</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Ocean Freight:</span>
                        <strong className="text-[var(--ink)]">C$2,800</strong>
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--ink-2)] mt-3 pt-2.5 border-t border-[var(--line)]">
                      Est. total clearing & port handling: ~₦3.51M.
                    </p>
                  </div>
                </Reveal>

                {/* Example 2 */}
                <Reveal variant="isometric" delay={75}>
                  <div className="lx-card h-full p-6 border border-[var(--line)] bg-[var(--card)]">
                    <span className="text-[10px] font-bold uppercase text-[var(--accent)] font-mono block mb-1">
                      Mid-Size SUV / Crossover
                    </span>
                    <h4 className="font-serif text-lg font-normal mb-3 text-[var(--ink)]">
                      2021 Toyota RAV4 / Highlander
                    </h4>
                    <div className="space-y-2 text-xs text-[var(--ink-2)] font-mono tabular-nums">
                      <div className="flex justify-between">
                        <span>CIF Valuation:</span>
                        <strong className="text-[var(--ink)]">$9,500 USD</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>CIF in Naira (@ ₦1,425):</span>
                        <strong className="text-[var(--ink)]">₦13.54M</strong>
                      </div>
                      <div className="flex justify-between border-t pt-2 border-[var(--line)]">
                        <span>Statutory Duty (@ 43%):</span>
                        <strong className="text-[var(--accent)]">~₦5.82M</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Ocean Freight:</span>
                        <strong className="text-[var(--ink)]">C$3,100</strong>
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--ink-2)] mt-3 pt-2.5 border-t border-[var(--line)]">
                      Est. total clearing & port handling: ~₦6.42M.
                    </p>
                  </div>
                </Reveal>

                {/* Example 3 */}
                <Reveal variant="isometric" delay={150}>
                  <div className="lx-card h-full p-6 border border-[var(--line)] bg-[var(--card)]">
                    <span className="text-[10px] font-bold uppercase text-[var(--accent)] font-mono block mb-1">
                      Luxury Executive SUV
                    </span>
                    <h4 className="font-serif text-lg font-normal mb-3 text-[var(--ink)]">
                      2021 Lexus RX350
                    </h4>
                    <div className="space-y-2 text-xs text-[var(--ink-2)] font-mono tabular-nums">
                      <div className="flex justify-between">
                        <span>CIF Valuation:</span>
                        <strong className="text-[var(--ink)]">$14,000 USD</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>CIF in Naira (@ ₦1,425):</span>
                        <strong className="text-[var(--ink)]">₦19.95M</strong>
                      </div>
                      <div className="flex justify-between border-t pt-2 border-[var(--line)]">
                        <span>Statutory Duty (@ 43%):</span>
                        <strong className="text-[var(--accent)]">~₦8.58M</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Ocean Freight:</span>
                        <strong className="text-[var(--ink)]">C$3,300</strong>
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--ink-2)] mt-3 pt-2.5 border-t border-[var(--line)]">
                      Est. total clearing & port handling: ~₦9.23M.
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* Resource Links Banner */}
              <div className="mt-8 lx-card p-6 border border-[var(--line)] bg-[var(--card)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-[var(--ink)] block">Looking for financing options?</span>
                  <span className="text-[var(--ink-2)]">Pay 50% down at auction and spread shipping and clearing over milestones.</span>
                </div>
                <RippleLink to="/services/installment-plans/" variant="secondary" className="shrink-0 text-xs">
                  Explore Installment Plans
                </RippleLink>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Instructions & Inputs Explanation */}
        <section className="py-16 px-6 md:px-12 bg-[var(--bg)] text-[var(--ink)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight mb-4 text-[var(--ink)]">
              Step-by-Step Instructions: How to Use the Customs Calculator
            </h2>
            <p className="text-sm leading-relaxed mb-8 text-[var(--ink-2)]">
              Our tool is designed for ease of use. Follow these detailed instructions to check your vehicle's total cleared landing cost in less than 60 seconds:
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center font-mono font-bold text-sm shrink-0">1</span>
                <div>
                  <h4 className="font-serif text-lg font-normal text-[var(--ink)]">Select Your Vehicle Classification</h4>
                  <p className="text-xs sm:text-sm mt-1 text-[var(--ink-2)]">
                    Choose between <strong className="text-[var(--ink)]">Sedan</strong>, <strong className="text-[var(--ink)]">SUV</strong>, <strong className="text-[var(--ink)]">Truck</strong>, or <strong className="text-[var(--ink)]">Luxury</strong>. This selector controls the base marine freight shipping costs and applies appropriate CET duty rates (commercial trucks get a lower 10% duty rate compared to passenger cars).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center font-mono font-bold text-sm shrink-0">2</span>
                <div>
                  <h4 className="font-serif text-lg font-normal text-[var(--ink)]">Input the Vehicle Year</h4>
                  <p className="text-xs sm:text-sm mt-1 text-[var(--ink-2)]">
                    Select the manufacturing year of the vehicle. Our engine automatically applies the standard NCS age depreciation rebates. Vehicles older than 10 years enjoy a 40% duty discount, while vehicles between 5 to 10 years get a 20% duty discount.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center font-mono font-bold text-sm shrink-0">3</span>
                <div>
                  <h4 className="font-serif text-lg font-normal text-[var(--ink)]">Enter the FOB Purchase Value (in USD)</h4>
                  <p className="text-xs sm:text-sm mt-1 text-[var(--ink-2)]">
                    Input the dollar price of the vehicle at the Canadian or American auto auction (Copart, ADESA, etc.). The calculator converts this to Naira using the prevailing commercial shipping exchange rates (currently pegged at ₦1,520/$).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center font-mono font-bold text-sm shrink-0">4</span>
                <div>
                  <h4 className="font-serif text-lg font-normal text-[var(--ink)]">Review and Verify with an Agent</h4>
                  <p className="text-xs sm:text-sm mt-1 text-[var(--ink-2)]">
                    Once calculations are generated, click the <strong className="text-[var(--ink)]">"Connect with Clearing Officer"</strong> button to send a pre-filled, highly itemized report directly to our active Lagos port desk. Our customs agents will verify the current VIN valuation assessment in real-time.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Detailed Guidance */}
            <div className="space-y-6 text-sm md:text-base leading-relaxed font-sans mt-16 border-t border-[var(--line)] pt-12 text-[var(--ink-2)] lx-prose">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal mb-4 tracking-tight text-[var(--ink)]">
                Local port handling, terminal, and demurrage fees
              </h2>
              <p>
                In addition to official customs tariffs, every vehicle discharged at Apapa, Tin Can Island, or PTML terminal incurs commercial terminal charges:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm pl-4">
                <li><strong className="text-[var(--ink)]">Terminal Delivery Order (TDO) charge:</strong> Terminal operators (such as Grimaldi at PTML or APM Terminals at Apapa) charge cargo handling and forklift unstowing fees, typically ranging from ₦180,000 to ₦350,000 depending on vehicle dimensions.</li>
                <li><strong className="text-[var(--ink)]">Shipping line local administrative release:</strong> Carriers charge documentation fees before releasing the electronic delivery order.</li>
                <li><strong className="text-[var(--ink)]">Demurrage and storage penalties:</strong> Most terminal operators grant three to five business days of free storage following vessel discharge. If customs clearing is delayed beyond this window, daily storage charges accrue exponentially.</li>
              </ul>
              <p>
                Read our detailed <Link to="/blog/shipping-car-canada-nigeria-complete-guide-2026/" className="text-[var(--accent)] font-semibold underline hover:opacity-80 transition-opacity">shipping a car from Canada to Nigeria</Link> guide for end-to-end transit timelines and port logistics insights.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-12 mb-4 tracking-tight text-[var(--ink)]">
                How the VIN valuation assessment system works
              </h2>
              <p>
                The Nigeria Customs Service operates an electronic VIN valuation system that pulls factory build data, engine displacement, and historical valuation tables to establish minimum clearance benchmarks. Submitting an invoice below the VIN benchmark triggers valuation queries and penalty assessments.
              </p>
              <p>
                Our licensed clearing agents in Lagos review VIN listings before your cargo arrives, matching your vehicle against the live customs database to generate accurate Single Goods Declarations (SGD).
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal mt-12 mb-4 tracking-tight text-[var(--ink)]">
                Frequently asked questions
              </h2>

              <div className="my-4">
                <h3 className="font-serif text-xl font-normal mt-8 mb-2 tracking-tight text-[var(--ink)]">
                  Can I clear my vehicle myself without a licensed clearing agent?
                </h3>
                <p className="text-sm md:text-base leading-relaxed">
                  The Nigeria Customs Service requires cargo declarations to be filed by licensed customs clearing agents possessing operational Direct Trader Input (DTI) access. LeeAutoX operates with accredited clearing partners to process Single Goods Declarations and physical releases.
                </p>
              </div>

              <div className="my-4">
                <h3 className="font-serif text-xl font-normal mt-8 mb-2 tracking-tight text-[var(--ink)]">
                  How does the customs foreign exchange rate affect my final duty?
                </h3>
                <p className="text-sm md:text-base leading-relaxed">
                  Customs calculates duty in Nigerian Naira based on the foreign exchange rate assigned to the customs system on the date the assessment is generated. Fluctuations in the official rate directly adjust the Naira total payable.
                </p>
              </div>

              <div className="my-4">
                <h3 className="font-serif text-xl font-normal mt-8 mb-2 tracking-tight text-[var(--ink)]">
                  What documents are required to clear a vehicle at Lagos ports?
                </h3>
                <p className="text-sm md:text-base leading-relaxed">
                  You require the original Bill of Lading (or electronic sea waybill), the original commercial purchase invoice, export title documents from the origin country, and an assessment notice generated through the customs trade portal.
                </p>
              </div>

              <div className="my-4">
                <h3 className="font-serif text-xl font-normal mt-8 mb-2 tracking-tight text-[var(--ink)]">
                  How can I get an exact customs clearance quote for my vehicle?
                </h3>
                <p className="text-sm md:text-base leading-relaxed">
                  Submit your vehicle VIN, year, make, and purchase price to our Lagos port team via WhatsApp at +234 809 918 6162. We generate an itemized assessment covering customs duties, terminal fees, and shipping delivery orders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action / WhatsApp section */}
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--line)]">
          <WhatsAppCTA
            message={`Hello LeeAutoX! I am reviewing the Nigeria Customs Duty Calculator and would like an exact clearance quote for my vehicle.`}
            title="Need an Exact Customs Clearance Assessment?"
            subtitle="Connect directly with our licensed Lagos port clearing team to verify your vehicle VIN assessment and total landing cost in real-time."
          />
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <PageHeader
        title={data.heading}
        subtitle={data.description}
        breadcrumbs={data.breadcrumbs}
      />

      {/* Local Spotlight Section */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-[var(--bg)] text-[var(--ink)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal variant="rise">
            <div>
              <span className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase bg-[var(--accent-soft)] px-3.5 py-1.5 rounded-full inline-block mb-4 font-mono">
                REGIONAL OPERATING PROCEDURES
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mb-5 text-[var(--ink)]">
                <AnimatedText text={localTitle} variant="word-stagger" />
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-8 text-[var(--ink-2)]">
                {localDesc} By establishing permanent direct desks in Toronto, Canada, alongside our core clearance hubs in Apapa (Lagos) and Tema (Ghana), LeeAutoX provides complete cross-border transaction protection.
              </p>

              <div className="space-y-4">
                {regionalSpecs.map((spec, index) => (
                  <div key={index} className="flex gap-3 items-start text-xs md:text-sm">
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-soft)] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={13} className="text-[var(--accent)]" />
                    </div>
                    <span className="text-[var(--ink-2)]">
                      {spec}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Quick Action Bento Grid */}
          <div className="grid grid-cols-1 gap-5">
            <Reveal variant="isometric" delay={0}>
              <div className="lx-card p-7 border border-[var(--line)] bg-[var(--card)]">
                <div className="flex gap-4 items-start mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-normal text-[var(--ink)]">Active Hub Address</h3>
                    <p className="text-xs text-[var(--ink-2)]">
                      Fully staffed office location for document handovers and consultation.
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {isCanada ? 'Greater Toronto Area, Ontario, Canada' : isGhana ? 'Tema Port Hub & Accra Office, Ghana' : CONTACT_INFO.addressNG}
                </p>
              </div>
            </Reveal>

            <Reveal variant="isometric" delay={80}>
              <div className="lx-card p-7 border border-[var(--line)] bg-[var(--card)]">
                <div className="flex gap-4 items-start mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
                    <Shield size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-normal text-[var(--ink)]">Authorized Representatives</h3>
                    <p className="text-xs text-[var(--ink-2)]">
                      All pre-orders are contractually backed under Corporation No: 1761065-3.
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                  We encourage all clients to communicate with our certified logistics agents via our verified channels. Your payments are mapped directly to corresponding milestone events in real-time.
                </p>
              </div>
            </Reveal>

            <Reveal variant="rise" delay={140}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="lx-pill-btn w-full justify-center bg-[#25D366] text-[#081A0E] font-bold hover:brightness-105 transition-all cursor-pointer text-sm uppercase tracking-wider shadow-sm"
              >
                <MessageCircle size={18} />
                <span>Connect with {isCanada ? 'Toronto' : isGhana ? 'Accra' : 'Lagos'} Representative</span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Dedicated Lagos Port Operations Deep-Dive */}
      {isLagos && (
        <section className="py-16 px-6 md:px-12 border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="max-w-3xl">
              <span className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase bg-[var(--accent-soft)] px-3.5 py-1.5 rounded-full inline-block mb-4 font-mono">
                LAGOS MARITIME GATEWAYS
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mb-4 text-[var(--ink)]">
                Direct Port Clearance at Apapa & Tin Can Island Terminals
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-[var(--ink-2)]">
                Lagos handles over 80% of Nigeria's vehicle imports across two primary maritime complexes: <strong className="text-[var(--ink)]">Apapa Port</strong> (principally <strong className="text-[var(--ink)]">APM Terminals</strong>) and <strong className="text-[var(--ink)]">Tin Can Island Port</strong> (including <strong className="text-[var(--ink)]">TICT</strong> and <strong className="text-[var(--ink)]">PTML Terminal</strong>). Our dedicated on-ground clearance agents manage the entire terminal interface from cargo discharge to final gate exit.
              </p>
            </div>

            {/* Critical Form M Pre-Shipment Warning */}
            <div className="lx-card p-6 sm:p-7 border border-rose-500/35 bg-rose-500/8">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold tracking-[0.14em] text-rose-500 block">
                  MANDATORY PRE-SHIPMENT REQUIREMENT
                </span>
                <h4 className="font-serif text-xl font-normal text-[var(--ink)]">
                  Form M Must Be Opened at a Nigerian Bank Before the Vehicle Ships
                </h4>
                <p className="text-xs md:text-sm leading-relaxed text-[var(--ink-2)]">
                  Nigeria Customs Service regulations strictly mandate that <strong className="text-[var(--ink)]">Form M be registered through an authorized commercial bank in Nigeria before the shipping container departs Canadian waters (Montreal or Halifax)</strong>. Arriving at Lagos ports without a pre-validated Form M is the <strong className="text-[var(--ink)]">single most common cause of multi-week port delays, severe terminal demurrage (₦30,000–₦70,000/day), and punitive manual inspection penalties</strong>. LeeAutoX assists you in assembling your proforma invoices early so Form M is active before container loading.
                </p>
              </div>
            </div>

            {/* Operational Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="lx-card p-6 border border-[var(--line)] bg-[var(--card)]">
                <span className="text-[11px] font-mono uppercase font-bold text-[var(--accent)] tracking-wider block mb-1.5">
                  DISCHARGE TERMINALS
                </span>
                <h4 className="font-serif text-xl font-normal mb-2 text-[var(--ink)]">
                  APM Terminals & Tin Can
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-2)]">
                  Direct cargo tracking at APM Terminals Apapa, Tin Can Island Container Terminal (TICT), and PTML. We process electronic delivery orders (EDO) directly with international shipping lines (Maersk, MSC, Hapag-Lloyd, Grimaldi).
                </p>
              </div>

              <div className="lx-card p-6 border border-[var(--line)] bg-[var(--card)]">
                <span className="text-[11px] font-mono uppercase font-bold text-[var(--accent)] tracking-wider block mb-1.5">
                  CLEARING TIMELINE
                </span>
                <h4 className="font-serif text-xl font-normal mb-2 text-[var(--ink)]">
                  2 to 4 Weeks from Discharge
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-2)]">
                  Standard customs clearing in Lagos typically requires <strong className="text-[var(--ink)]">2 to 4 weeks once the vessel arrives and discharges</strong> cargo. Timelines depend on terminal crane congestion, customs server uptime, and document readiness.
                </p>
              </div>

              <div className="lx-card p-6 border border-[var(--line)] bg-[var(--card)]">
                <span className="text-[11px] font-mono uppercase font-bold text-[var(--accent)] tracking-wider block mb-1.5">
                  PHYSICAL INSPECTION
                </span>
                <h4 className="font-serif text-xl font-normal mb-2 text-[var(--ink)]">
                  NCS Joint Terminal Exam
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-2)]">
                  Customs examination officers break the numbered container bolt seal during a joint physical exam. Inspectors verify chassis VIN stampings against the Single Goods Declaration (SGD), confirm engine integrity, and issue official gate passes.
                </p>
              </div>
            </div>

            {/* Essential Guides Cross-Links */}
            <div className="lx-card p-6 sm:p-7 border border-[var(--line)] bg-[var(--card)]">
              <h4 className="text-xs font-mono font-bold uppercase tracking-[0.14em] text-[var(--accent)] mb-2">
                RECOMMENDED IMPORT GUIDES & TOOLS
              </h4>
              <p className="text-xs md:text-sm mb-4 leading-relaxed text-[var(--ink-2)]">
                Plan your vehicle import with full transparency using our dedicated guides and calculators:
              </p>
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-semibold">
                <Link to="/guides/import-car-canada-to-nigeria/" className="text-[var(--accent)] hover:underline">
                  Complete Canada to Nigeria Import Guide →
                </Link>
                <Link to="/guides/shipping-cost-canada-to-nigeria/" className="text-[var(--accent)] hover:underline">
                  Full 2026 Shipping Cost Breakdown →
                </Link>
                <Link to="/nigeria/import-duty-calculator/" className="text-[var(--accent)] hover:underline">
                  Nigeria Import Duty Calculator →
                </Link>
                <Link to="/services/installment-plans/" className="text-[var(--accent)] hover:underline">
                  Naira Milestone Installment Plans →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dedicated Ghana Tema Port Hub Section */}
      {isGhana && (
        <section className="py-16 px-6 md:px-12 border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="max-w-3xl">
              <span className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase bg-[var(--accent-soft)] px-3.5 py-1.5 rounded-full inline-block mb-4 font-mono">
                GHANA LOGISTICS GATEWAY
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mb-4 text-[var(--ink)]">
                Tema Port Vehicle Sourcing & Customs Clearance
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-[var(--ink-2)]">
                The <strong className="text-[var(--ink)]">Port of Tema</strong> (including the Golden Jubilee Terminal and modern MPS Terminal 3) is the primary maritime hub for Ghanaian auto buyers importing vehicles from North America. LeeAutoX provides seamless door-to-port and cleared-at-doorstep services across Greater Accra, Kumasi, and Takoradi.
              </p>
            </div>

            {/* Ghana Operational Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="lx-card p-6 border border-[var(--line)] bg-[var(--card)]">
                <span className="text-[11px] font-mono uppercase font-bold text-[var(--accent)] tracking-wider block mb-1.5">
                  OCEAN TRANSIT
                </span>
                <h4 className="font-serif text-xl font-normal mb-2 text-[var(--ink)]">
                  5 to 8 Weeks Port-to-Port
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-2)]">
                  Containerized vessels departing Canadian Atlantic ports (Halifax and Montreal) reach Tema port in 5 to 8 weeks. Steel containerization protects your vehicle against salt spray and eliminates pilferage during transit.
                </p>
              </div>

              <div className="lx-card p-6 border border-[var(--line)] bg-[var(--card)]">
                <span className="text-[11px] font-mono uppercase font-bold text-[var(--accent)] tracking-wider block mb-1.5">
                  LOCAL CURRENCY
                </span>
                <h4 className="font-serif text-xl font-normal mb-2 text-[var(--ink)]">
                  Milestone Payments in Cedis (GHS)
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-2)]">
                  Avoid FX exchange friction by funding your vehicle pre-order through structured milestone payments in Ghanaian Cedis (GHS) directly to our registered partner accounts, mapped to auction acquisition, container loading, and port arrival.
                </p>
              </div>

              <div className="lx-card p-6 border border-[var(--line)] bg-[var(--card)]">
                <span className="text-[11px] font-mono uppercase font-bold text-[var(--accent)] tracking-wider block mb-1.5">
                  TEMA CLEARANCE
                </span>
                <h4 className="font-serif text-xl font-normal mb-2 text-[var(--ink)]">
                  GRA Customs Processing
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--ink-2)]">
                  Our accredited clearing partners interface with the Ghana Revenue Authority (GRA) Customs Division. Duty assessments are verified by engine displacement (cc) and age band before unstowing at Tema terminals.
                </p>
              </div>
            </div>

            {/* Ghana Contact & Inquiry Notice */}
            <div className="lx-card p-6 sm:p-7 border border-[var(--line)] bg-[var(--card)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-[var(--ink)] block text-base font-serif">Need a Tema Port Landing Assessment?</span>
                <span className="text-[var(--ink-2)]">
                  Ghana inquiries and vehicle pre-orders are managed directly through our central logistics WhatsApp desk (+1 647 389-6162) with on-ground clearing liaisons in Tema.
                </span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="lx-pill-btn bg-[#25D366] text-[#081A0E] font-bold uppercase tracking-wider text-xs hover:brightness-105 transition-all shrink-0"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Sourcing Duty Calculator Link */}
      {isNigeria && !cleanPath.includes('calculator') && (
        <section className="py-14 border-t border-[var(--line)] bg-[var(--surface)] text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h3 className="font-serif text-2xl md:text-3xl font-normal tracking-tight mb-3 text-[var(--ink)]">
              Check Landing Costs Instantly
            </h3>
            <p className="text-xs sm:text-sm mb-7 text-[var(--ink-2)]">
              Want to see the specific Custom Duty and clearing costs for a 2021 Hyundai Sonata or Toyota Prado? Open our dynamic Customs Duty Calculator.
            </p>
            <RippleLink to="/nigeria/import-duty-calculator/" variant="primary" className="text-xs uppercase tracking-widest">
              Launch Nigeria Custom Duty Calculator
            </RippleLink>
          </div>
        </section>
      )}

      <Contact />
    </div>
  );
}
