import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Phone, MessageSquare, Shield, Check, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import ImportDutyCalculator from '../components/ImportDutyCalculator';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Contact from '../components/Contact';
import { cleanPathname } from '../utils/path';

export default function GeoPage() {
  const { theme } = useTheme();
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
      <div className="min-h-screen bg-background">
        <PageHeader 
          title="Car auctions in Scarborough: Ontario sourcing hub" 
          subtitle="Direct, licensed wholesale sourcing from premier Ontario car auctions including Copart Cookstown, ADESA Toronto, and Impact Auto Auctions, direct to Lagos or Tema." 
          breadcrumbs={data.breadcrumbs} 
        />

        {/* Article Body Section */}
        <section className={`py-16 px-6 md:px-12 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3 font-mono">
              ONTARIO SOURCING TERMINAL
            </span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6 text-foreground">
              Car auctions in Scarborough: Ontario sourcing hub
            </h1>

            {/* Quick Answer Box */}
            <div className={`p-6 border-l-4 border-[#2B59FF] my-6 rounded-r ${theme === 'dark' ? 'bg-zinc-900/90 text-zinc-200' : 'bg-blue-50/70 text-slate-800'}`}>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2B59FF] block mb-2">QUICK ANSWER</span>
              <p className="text-sm md:text-base leading-relaxed">
                Car auctions in Scarborough and the Greater Toronto Area allow international buyers to acquire wholesale clean title and insurance salvage vehicles at trade pricing. Through a licensed broker like LeeAutoX, buyers access restricted auctions, receive physical lot inspections, and manage container loading from a local depot for export to West Africa.
              </p>
            </div>

            {/* Key Takeaways */}
            <aside aria-label="summary" className={`p-6 border my-6 rounded ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2B59FF] block mb-3">KEY TAKEAWAYS</span>
              <ul className="space-y-2 text-xs md:text-sm">
                <li className="flex items-start gap-2"><span className="text-[#2B59FF] font-bold">•</span><span>Access dealer-only auction platforms across Ontario without an independent commercial license.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#2B59FF] font-bold">•</span><span>On-site physical yard inspections identify hidden structural damage and diagnostic fault codes.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#2B59FF] font-bold">•</span><span>Centralized loading in Scarborough optimizes container packing and export paperwork.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#2B59FF] font-bold">•</span><span>LeeAutoX coordinates the entire pipeline from auction bidding to destination port clearance.</span></li>
              </ul>
            </aside>

            <div className="prose prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed font-sans mt-8">
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                The Greater Toronto Area serves as the central hub for Canada's wholesale automotive trade. Commercial dealers, insurance underwriters, and fleet leasing companies liquidate thousands of vehicles weekly through regional auction facilities. For buyers importing cars into Nigeria or Ghana, sourcing vehicles through Scarborough provides direct access to high-volume auctions while establishing a central point for consolidation, mechanical inspection, and ocean containerization.
              </p>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Understanding how local auctions operate, which facilities offer the best value, and how to inspect vehicles prior to bidding protects your capital and ensures that imported vehicles meet your mechanical expectations.
              </p>

              <h2 className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Major Ontario auction yards accessible from Scarborough
              </h2>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Three primary auction networks dominate the automotive wholesale sector in Southern Ontario:
              </p>
              <ul className={`list-disc list-inside pl-4 space-y-2 my-4 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                <li className="leading-relaxed"><strong>Copart Canada (Cookstown and Bowmanville):</strong> Copart operates large storage yards holding insurance claim units, financial repossessions, and clean-title fleet trade-ins. The Cookstown facility north of Toronto features an extensive inventory of late-model SUVs and light trucks with cosmetic or light repairable damage.</li>
                <li className="leading-relaxed"><strong>Impact Auto Auctions (Oshawa and Stoney Creek):</strong> Operating across Canada as part of IAA Holdings, Impact Auto specializes in insurance salvage and collision vehicles. Their facilities near Toronto provide steady inventory for rebuilders seeking deep purchase discounts.</li>
                <li className="leading-relaxed"><strong>ADESA Toronto (Milton):</strong> ADESA runs dealer-consignment and commercial wholesale auctions. Inventory primarily consists of off-lease passenger cars, government fleet turn-ins, and dealer trade-ins that carry clean titles and complete maintenance records.</li>
              </ul>

              <h2 className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Why physical lot inspection matters before bidding
              </h2>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Online bidding platforms provide photographs and basic vehicle descriptions, but digital listings cannot substitute for hands-on evaluation. Photographs routinely hide frame corrosion, structural misalignments, and fluid leaks that cost thousands of dollars to rectify after export.
              </p>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Before placing bids on auction inventory, our technicians visit regional yards to verify critical checkpoints. We inspect the engine oil and radiator coolant for contamination, scan the on-board diagnostics (OBD2) port for masked fault codes, confirm that all airbag modules are intact, and check undercarriage frame rails for collision straightening marks.
              </p>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Review our <a href="/guides/vehicle-inspection-checklist/" className="text-[#2B59FF] font-semibold underline hover:text-[#1a41cc] transition-colors">Copart pre-purchase 150-point inspection checklist</a> to examine the mechanical standards our team verifies on auction lots.
              </p>

              <h2 className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Container consolidation and export loading in Scarborough
              </h2>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Once a vehicle is won at auction, managing inland transport and marine loading efficiently keeps total costs under control.
              </p>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                LeeAutoX coordinates flatbed towing directly from the auction yard to our consolidation depot in Scarborough. At our facility, vehicles are prepared for ocean freight: batteries are safely disconnected, fluids checked, and export documentation cross-referenced against provincial vehicle ownership slips.
              </p>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                For containerized export, our loading crew packs up to four vehicles into a single 40-foot high-cube shipping container using heavy-duty tire straps and timber bracing. Multi-car consolidation splits ocean freight and terminal handling expenses among multiple vehicles, significantly lowering the per-unit landing cost compared to single-vehicle transport. From Scarborough, loaded containers travel by rail to container marine terminals in Montreal or Halifax for vessel loading.
              </p>

              <h2 className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Export documentation handled at the Ontario hub
              </h2>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Exporting a motor vehicle from Canada requires rigorous compliance with the Canada Border Services Agency (CBSA) export reporting regulations. Failing to complete mandatory documentation can lead to border delays, impoundment, or refusal of carrier loading.
              </p>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Our administrative staff verifies that provincial vehicle titles (ownership permits) are stamped for export, verifies that no outstanding liens or chattel mortgages remain on the vehicle identification number (VIN), and files the digital export declaration through the Canadian Export Reporting System (CERS). This administrative clearance ensures smooth handover to ocean carriers and compliance at destination ports.
              </p>

              <h2 className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Frequently asked questions
              </h2>

              <div className="my-4">
                <h3 className={`text-xl font-bold uppercase mt-8 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Can private individuals buy directly from dealer auctions in Ontario?
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                  Most wholesale auto auctions in Ontario require an active motor vehicle dealer license issued by the Ontario Motor Vehicle Industry Council (OMVIC). LeeAutoX holds the requisite licensing and acts as your authorized purchasing broker, allowing you to bid on dealer-only inventory without obtaining a commercial license.
                </p>
              </div>

              <div className="my-4">
                <h3 className={`text-xl font-bold uppercase mt-8 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  How quickly are vehicles moved from the auction yard after bidding?
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                  Auction yards charge daily storage fees starting 2 to 3 business days after the sale date. Our dispatch team arranges flatbed transport within 24 to 48 hours of auction settlement to eliminate storage surcharges.
                </p>
              </div>

              <div className="my-4">
                <h3 className={`text-xl font-bold uppercase mt-8 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  What vehicle title types are eligible for export?
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                  Clean-title, salvage-title, and rebuilt-title vehicles are eligible for export from Canada. However, vehicles with a "Non-Repairable" or "Certificate of Destruction" brand cannot be registered or exported. Our staff screens vehicle titles before bidding to prevent ineligible purchases.
                </p>
              </div>

              <div className="my-4">
                <h3 className={`text-xl font-bold uppercase mt-8 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  How can I start sourcing from Ontario auctions?
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
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
      <div className="min-h-screen bg-background">
        <PageHeader 
          title="Nigeria Customs Duty Calculator 2026" 
          subtitle="Calculate estimated customs duty, shipping freight, port levies, VAT, and total landing costs for vehicles imported into Nigeria ports (Apapa, PTML, Tin Can)." 
          breadcrumbs={data.breadcrumbs} 
        />

        {/* Introduction / High-Quality SEO Content */}
        <section className={`py-16 px-6 md:px-12 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3 font-mono">
              VALUATION PORTAL
            </span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6 text-foreground">
              Direct Nigeria Customs Duty Calculator & Landing Cost Estimator
            </h1>

            {/* Quick Answer Box */}
            <div className={`p-6 border-l-4 border-[#2B59FF] my-6 rounded-r ${theme === 'dark' ? 'bg-zinc-900/90 text-zinc-200' : 'bg-blue-50/70 text-slate-800'}`}>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2B59FF] block mb-2">QUICK ANSWER</span>
              <p className="text-sm md:text-base leading-relaxed">
                A Nigeria customs car duty calculator computes the total clearance taxes payable on imported vehicles based on their Cost, Insurance, and Freight (CIF) value. Tariffs include an import duty (20% for cars, 10% for commercial vehicles), a 7% port surcharge, a 0.5% ECOWAS Trade Liberalization Scheme levy, and 7.5% Value Added Tax. Use our interactive estimator below or consult LeeAutoX for official VIN valuation assessments.
              </p>
            </div>

            {/* Key Takeaways */}
            <aside aria-label="summary" className={`p-6 border my-6 rounded ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2B59FF] block mb-3">KEY TAKEAWAYS</span>
              <ul className="space-y-2 text-xs md:text-sm">
                <li className="flex items-start gap-2"><span className="text-[#2B59FF] font-bold">•</span><span>Nigeria customs tariffs are assessed on the CIF benchmark rather than the domestic purchase price alone.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#2B59FF] font-bold">•</span><span>Vehicle age depreciation allowances reduce assessed values for models over five and ten years old.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#2B59FF] font-bold">•</span><span>Clearing terminal storage and shipping demurrage begin accruing if documentation is not prepared early.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#2B59FF] font-bold">•</span><span>LeeAutoX calculates all line items in advance to prevent clearance delays at Lagos ports.</span></li>
              </ul>
            </aside>

            <div className="prose prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed font-sans mt-8">
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Navigating the financial complexity of vehicle clearing at Nigerian ports requires professional precision. Our live <strong>Nigeria customs duty calculator</strong> utilizes the latest Nigeria Customs Service (NCS) Common External Tariff (CET) guidelines and official valuation metrics to determine realistic port landing costs. 
              </p>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Rather than relying on risky verbal estimates, our interactive tool helps you compute exactly what is required to clear passenger sedans, high-ground SUVs, or commercial trucks at Apapa, Tin Can, or PTML terminals. Understand your liabilities, plan your acquisition budget, and import with absolute confidence.
              </p>

              <h2 className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Understanding the CIF calculation model
              </h2>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Under the Nigeria Customs Service Common External Tariff (CET) guidelines, clearing assessments are calculated on the Cost, Insurance, and Freight (CIF) value of the vehicle, not simply the auction invoice total. The CIF value is converted into Nigerian Naira using the official customs exchange rate published on the Nigeria Customs portal.
              </p>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                The standard statutory charges applied to vehicle imports include:
              </p>
              <ul className={`list-disc list-inside space-y-2 text-sm pl-4 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                <li><strong>Import Duty (CET):</strong> Assessed at 20% of the CIF value for passenger vehicles (cars, SUVs, passenger vans) and 10% for commercial trucks and buses.</li>
                <li><strong>Port Surcharge:</strong> Set at 7% calculated directly on the import duty amount.</li>
                <li><strong>ECOWAS Trade Liberalization Scheme (ETLS):</strong> A regional treaty levy of 0.5% applied to the CIF total.</li>
                <li><strong>Comprehensive Import Supervision Scheme (CISS):</strong> An inspection fee of 1% assessed on the Free on Board (FOB) value.</li>
                <li><strong>Value Added Tax (VAT):</strong> Calculated at 7.5% across the combined sum of CIF value, import duty, port surcharge, ETLS, and CISS.</li>
              </ul>

              <h2 className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Customs vehicle age depreciation rebates
              </h2>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                The Nigeria Customs Service recognizes standard annual depreciation when establishing the valuation benchmark for used vehicles. Models between 5 and 9 years old generally receive an automatic age rebate against the original base catalog value, while models 10 years or older receive up to a 40% valuation reduction. Vehicles manufactured more than 12 to 15 years prior to the date of arrival face import prohibitions or heavy penalties depending on the specific customs tariff band in effect.
              </p>
            </div>
          </div>
        </section>

        {/* The Live Interactive Calculator */}
        <section className={`py-12 px-6 md:px-12 border-t border-b ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="max-w-4xl mx-auto">
            {/* Context & Purpose Banner */}
            <div className={`p-6 border-l-4 border-[#2B59FF] mb-10 rounded-r ${
              theme === 'dark' ? 'bg-zinc-950/80 border-zinc-800' : 'bg-blue-50/80 border-blue-200'
            }`}>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2B59FF] block mb-2">
                CUSTOMS VALUATION OVERVIEW
              </span>
              <h3 className={`text-lg font-bold uppercase mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Calculate Your Total Cleared Landed Cost Before Bidding
              </h3>
              <p className={`text-xs md:text-sm leading-relaxed mb-3 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>
                This interactive tool estimates your full landing cost when importing a car from Canada to Nigeria. In Nigeria, customs duties are calculated on the <strong>Cost, Insurance, and Freight (CIF)</strong> value of the vehicle using statutory CET rates averaging <strong>~43% of CIF</strong>. 
              </p>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                <strong>Notice on Exchange Rates:</strong> Nigeria Customs Service computes duties using its own <strong>official customs valuation exchange rate (currently ~₦1,400–₦1,450/USD)</strong>, which is independent of commercial bank or parallel open-market rates. Customs exchange rates and fiscal tariffs fluctuate periodically per official circulars.
              </p>
              
              {/* Pillar Cross-Links */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-800/20 text-xs">
                <Link to="/guides/import-car-canada-to-nigeria/" className="text-[#2B59FF] font-semibold hover:underline">
                  ← Complete Canada to Nigeria Import Guide
                </Link>
                <span className="text-zinc-500">•</span>
                <Link to="/guides/shipping-cost-canada-to-nigeria/" className="text-[#2B59FF] font-semibold hover:underline">
                  Full Shipping Cost Breakdown
                </Link>
                <span className="text-zinc-500">•</span>
                <Link to="/guides/roro-vs-container-shipping-canada-to-nigeria/" className="text-[#2B59FF] font-semibold hover:underline">
                  RoRo vs Container Shipping
                </Link>
              </div>
            </div>

            <ImportDutyCalculator />

            {/* Worked Example Calculations Cards */}
            <div className="mt-14">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2B59FF] block mb-2">
                PRACTICAL BENCHMARKS
              </span>
              <h3 className={`text-xl font-extrabold uppercase tracking-tight mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Worked Clearing Examples (~43% CIF Benchmark)
              </h3>
              <p className={`text-xs md:text-sm mb-6 leading-relaxed ${
                theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
              }`}>
                Based on the standard formula: <code className="bg-[#2B59FF]/10 text-[#2B59FF] px-1.5 py-0.5 rounded font-mono font-bold">Duty = CIF (USD) × Customs FX (~₦1,425/$) × 0.43</code>. Here is how representative vehicles calculate under current working parameters:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Example 1 */}
                <div className={`p-5 border rounded ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <span className="text-[10px] font-bold uppercase text-[#2B59FF] font-mono block mb-1">
                    Mid-Size Sedan
                  </span>
                  <h4 className="font-extrabold text-sm mb-2 text-foreground">
                    2020 Toyota Camry
                  </h4>
                  <div className="space-y-1.5 text-xs text-zinc-400 font-mono">
                    <div className="flex justify-between">
                      <span>CIF Valuation:</span>
                      <strong className="text-foreground">$5,000 USD</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>CIF in Naira (@ ₦1,425):</span>
                      <strong className="text-foreground">₦7.13M</strong>
                    </div>
                    <div className="flex justify-between border-t pt-1.5 border-zinc-800">
                      <span>Statutory Duty (@ 43%):</span>
                      <strong className="text-[#2B59FF]">~₦3.06M</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Ocean Freight:</span>
                      <strong className="text-foreground">C$2,800</strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800/40">
                    Est. total clearing & port handling: ~₦3.51M.
                  </p>
                </div>

                {/* Example 2 */}
                <div className={`p-5 border rounded ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <span className="text-[10px] font-bold uppercase text-[#2B59FF] font-mono block mb-1">
                    Mid-Size SUV / Crossover
                  </span>
                  <h4 className="font-extrabold text-sm mb-2 text-foreground">
                    2021 Toyota RAV4 / Highlander
                  </h4>
                  <div className="space-y-1.5 text-xs text-zinc-400 font-mono">
                    <div className="flex justify-between">
                      <span>CIF Valuation:</span>
                      <strong className="text-foreground">$9,500 USD</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>CIF in Naira (@ ₦1,425):</span>
                      <strong className="text-foreground">₦13.54M</strong>
                    </div>
                    <div className="flex justify-between border-t pt-1.5 border-zinc-800">
                      <span>Statutory Duty (@ 43%):</span>
                      <strong className="text-[#2B59FF]">~₦5.82M</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Ocean Freight:</span>
                      <strong className="text-foreground">C$3,100</strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800/40">
                    Est. total clearing & port handling: ~₦6.42M.
                  </p>
                </div>

                {/* Example 3 */}
                <div className={`p-5 border rounded ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <span className="text-[10px] font-bold uppercase text-[#2B59FF] font-mono block mb-1">
                    Luxury Executive SUV
                  </span>
                  <h4 className="font-extrabold text-sm mb-2 text-foreground">
                    2021 Lexus RX350
                  </h4>
                  <div className="space-y-1.5 text-xs text-zinc-400 font-mono">
                    <div className="flex justify-between">
                      <span>CIF Valuation:</span>
                      <strong className="text-foreground">$14,000 USD</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>CIF in Naira (@ ₦1,425):</span>
                      <strong className="text-foreground">₦19.95M</strong>
                    </div>
                    <div className="flex justify-between border-t pt-1.5 border-zinc-800">
                      <span>Statutory Duty (@ 43%):</span>
                      <strong className="text-[#2B59FF]">~₦8.58M</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Ocean Freight:</span>
                      <strong className="text-foreground">C$3,300</strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800/40">
                    Est. total clearing & port handling: ~₦9.23M.
                  </p>
                </div>
              </div>

              {/* Resource Links Banner */}
              <div className={`mt-8 p-4 border rounded flex flex-col sm:flex-row justify-between items-center gap-4 ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
              }`}>
                <div className="text-xs">
                  <span className="font-bold text-foreground block">Looking for financing options?</span>
                  <span className="text-zinc-500">Pay 50% down at auction and spread shipping and clearing over milestones.</span>
                </div>
                <Link 
                  to="/services/installment-plans/"
                  className="px-4 py-2 bg-[#2B59FF] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#1a41cc] transition-colors shrink-0"
                >
                  Explore Installment Plans
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Instructions & Inputs Explanation */}
        <section className={`py-16 px-6 md:px-12 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl font-extrabold uppercase tracking-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Step-by-Step Instructions: How to Use the Customs Calculator
            </h2>
            <p className="text-sm leading-relaxed mb-8 text-zinc-500">
              Our tool is designed for ease of use. Follow these detailed instructions to check your vehicle's total cleared landing cost in less than 60 seconds:
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-base uppercase text-foreground">Select Your Vehicle Classification</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Choose between <strong>Sedan</strong>, <strong>SUV</strong>, <strong>Truck</strong>, or <strong>Luxury</strong>. This selector controls the base marine freight shipping costs and applies appropriate CET duty rates (commercial trucks get a lower 10% duty rate compared to passenger cars).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-base uppercase text-foreground">Input the Vehicle Year</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Select the manufacturing year of the vehicle. Our engine automatically applies the standard NCS age depreciation rebates. Vehicles older than 10 years enjoy a 40% duty discount, while vehicles between 5 to 10 years get a 20% duty discount.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-base uppercase text-foreground">Enter the FOB Purchase Value (in USD)</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Input the dollar price of the vehicle at the Canadian or American auto auction (Copart, ADESA, etc.). The calculator converts this to Naira using the prevailing commercial shipping exchange rates (currently pegged at ₦1,520/$).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm shrink-0">4</span>
                <div>
                  <h4 className="font-bold text-base uppercase text-foreground">Review and Verify with an Agent</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Once calculations are generated, click the <strong>"Connect with Clearing Officer"</strong> button to send a pre-filled, highly itemized report directly to our active Lagos port desk. Our customs agents will verify the current VIN valuation assessment in real-time.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Detailed Guidance from Article 4 */}
            <div className="prose prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed font-sans mt-16 border-t pt-12">
              <h2 className={`text-2xl font-extrabold uppercase mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Local port handling, terminal, and demurrage fees
              </h2>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                In addition to official customs tariffs, every vehicle discharged at Apapa, Tin Can Island, or PTML terminal incurs commercial terminal charges:
              </p>
              <ul className={`list-disc list-inside space-y-2 text-sm pl-4 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                <li><strong>Terminal Delivery Order (TDO) charge:</strong> Terminal operators (such as Grimaldi at PTML or APM Terminals at Apapa) charge cargo handling and forklift unstowing fees, typically ranging from ₦180,000 to ₦350,000 depending on vehicle dimensions.</li>
                <li><strong>Shipping line local administrative release:</strong> Carriers charge documentation fees before releasing the electronic delivery order.</li>
                <li><strong>Demurrage and storage penalties:</strong> Most terminal operators grant three to five business days of free storage following vessel discharge. If customs clearing is delayed beyond this window, daily storage charges accrue exponentially.</li>
              </ul>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Read our detailed <a href="/blog/shipping-car-canada-nigeria-complete-guide-2026/" className="text-[#2B59FF] font-semibold underline hover:text-[#1a41cc] transition-colors">shipping a car from Canada to Nigeria</a> guide for end-to-end transit timelines and port logistics insights.
              </p>

              <h2 className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                How the VIN valuation assessment system works
              </h2>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                The Nigeria Customs Service operates an electronic VIN valuation system that pulls factory build data, engine displacement, and historical valuation tables to establish minimum clearance benchmarks. Submitting an invoice below the VIN benchmark triggers valuation queries and penalty assessments.
              </p>
              <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                Our licensed clearing agents in Lagos review VIN listings before your cargo arrives, matching your vehicle against the live customs database to generate accurate Single Goods Declarations (SGD).
              </p>

              <h2 className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Frequently asked questions
              </h2>

              <div className="my-4">
                <h3 className={`text-xl font-bold uppercase mt-8 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Can I clear my vehicle myself without a licensed clearing agent?
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                  The Nigeria Customs Service requires cargo declarations to be filed by licensed customs clearing agents possessing operational Direct Trader Input (DTI) access. LeeAutoX operates with accredited clearing partners to process Single Goods Declarations and physical releases.
                </p>
              </div>

              <div className="my-4">
                <h3 className={`text-xl font-bold uppercase mt-8 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  How does the customs foreign exchange rate affect my final duty?
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                  Customs calculates duty in Nigerian Naira based on the foreign exchange rate assigned to the customs system on the date the assessment is generated. Fluctuations in the official rate directly adjust the Naira total payable.
                </p>
              </div>

              <div className="my-4">
                <h3 className={`text-xl font-bold uppercase mt-8 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  What documents are required to clear a vehicle at Lagos ports?
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                  You require the original Bill of Lading (or electronic sea waybill), the original commercial purchase invoice, export title documents from the origin country, and an assessment notice generated through the customs trade portal.
                </p>
              </div>

              <div className="my-4">
                <h3 className={`text-xl font-bold uppercase mt-8 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  How can I get an exact customs clearance quote for my vehicle?
                </h3>
                <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                  Submit your vehicle VIN, year, make, and purchase price to our Lagos port team via WhatsApp at +234 809 918 6162. We generate an itemized assessment covering customs duties, terminal fees, and shipping delivery orders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action / WhatsApp section */}
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t">
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
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={data.heading} 
        subtitle={data.description} 
        breadcrumbs={data.breadcrumbs} 
      />

      {/* Local Spotlight Section */}
      <section className={`py-16 px-6 md:px-12 ${
        theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3">
              REGIONAL OPERATING PROCEDURES
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-6">
              {localTitle}
            </h2>
            <p className={`text-sm leading-relaxed mb-8 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
              {localDesc} By establishing permanent direct desks in Toronto, Canada, alongside our core clearance hubs in Apapa (Lagos) and Tema (Ghana), LeeAutoX provides complete cross-border transaction protection.
            </p>

            <div className="space-y-4">
              {regionalSpecs.map((spec, index) => (
                <div key={index} className="flex gap-3 items-start text-xs md:text-sm">
                  <div className="w-5 h-5 bg-[#2B59FF]/10 border border-[#2B59FF]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-[#2B59FF]" />
                  </div>
                  <span className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}>
                    {spec}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Bento Grid */}
          <div className="grid grid-cols-1 gap-6">
            
            <div className={`p-8 border ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex gap-4 items-start mb-4">
                <MapPin className="text-[#2B59FF] shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg uppercase tracking-tight">Active Hub Address</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                    Fully staffed office location for document handovers and consultation.
                  </p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                {isCanada ? 'Greater Toronto Area, Ontario, Canada' : isGhana ? 'Tema Port Hub & Accra Office, Ghana' : CONTACT_INFO.addressNG}
              </p>
            </div>

            <div className={`p-8 border ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex gap-4 items-start mb-4">
                <Shield className="text-[#2B59FF] shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-lg uppercase tracking-tight font-sans">Authorized Representatives</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                    All pre-orders are contractually backed under Corporation No: 1761065-3.
                  </p>
                </div>
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                We encourage all clients to communicate with our certified logistics agents via our verified channels. Your payments are mapped directly to corresponding milestone events in real-time.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-black font-bold p-5 hover:brightness-110 transition-all cursor-pointer text-center text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(37,211,102,0.2)]"
            >
              <MessageCircle size={18} />
              <span>Connect with {isCanada ? 'Toronto' : isGhana ? 'Accra' : 'Lagos'} Representative</span>
            </a>

          </div>

        </div>
      </section>

      {/* Dedicated Lagos Port Operations Deep-Dive */}
      {isLagos && (
        <section className={`py-16 px-6 md:px-12 border-t ${
          theme === 'dark' ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3 font-mono">
                LAGOS MARITIME GATEWAYS
              </span>
              <h2 className={`text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Direct Port Clearance at Apapa & Tin Can Island Terminals
              </h2>
              <p className={`text-sm md:text-base leading-relaxed ${
                theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'
              }`}>
                Lagos handles over 80% of Nigeria's vehicle imports across two primary maritime complexes: <strong>Apapa Port</strong> (principally <strong>APM Terminals</strong>) and <strong>Tin Can Island Port</strong> (including <strong>TICT</strong> and <strong>PTML Terminal</strong>). Our dedicated on-ground clearance agents manage the entire terminal interface from cargo discharge to final gate exit.
              </p>
            </div>

            {/* Critical Form M Pre-Shipment Warning */}
            <div className={`p-6 border-l-4 border-rose-500 rounded-r ${
              theme === 'dark' ? 'bg-rose-950/20 border-zinc-800' : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-rose-500 block">
                  MANDATORY PRE-SHIPMENT REQUIREMENT
                </span>
                <h4 className={`font-bold text-base uppercase tracking-tight ${theme === 'dark' ? 'text-rose-400' : 'text-rose-900'}`}>
                  Form M Must Be Opened at a Nigerian Bank Before the Vehicle Ships
                </h4>
                <p className={`text-xs md:text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>
                  Nigeria Customs Service regulations strictly mandate that <strong>Form M be registered through an authorized commercial bank in Nigeria before the shipping container departs Canadian waters (Montreal or Halifax)</strong>. Arriving at Lagos ports without a pre-validated Form M is the <strong>single most common cause of multi-week port delays, severe terminal demurrage (₦30,000–₦70,000/day), and punitive manual inspection penalties</strong>. LeeAutoX assists you in assembling your proforma invoices early so Form M is active before container loading.
                </p>
              </div>
            </div>

            {/* Operational Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-mono uppercase font-bold text-[#2B59FF] tracking-wider block mb-1">
                  DISCHARGE TERMINALS
                </span>
                <h4 className="font-extrabold text-base mb-2 text-foreground">
                  APM Terminals & Tin Can
                </h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Direct cargo tracking at APM Terminals Apapa, Tin Can Island Container Terminal (TICT), and PTML. We process electronic delivery orders (EDO) directly with international shipping lines (Maersk, MSC, Hapag-Lloyd, Grimaldi).
                </p>
              </div>

              <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-mono uppercase font-bold text-[#2B59FF] tracking-wider block mb-1">
                  CLEARING TIMELINE
                </span>
                <h4 className="font-extrabold text-base mb-2 text-foreground">
                  2 to 4 Weeks from Discharge
                </h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Standard customs clearing in Lagos typically requires <strong>2 to 4 weeks once the vessel arrives and discharges</strong> cargo. Timelines depend on terminal crane congestion, customs server uptime, and document readiness.
                </p>
              </div>

              <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-mono uppercase font-bold text-[#2B59FF] tracking-wider block mb-1">
                  PHYSICAL INSPECTION
                </span>
                <h4 className="font-extrabold text-base mb-2 text-foreground">
                  NCS Joint Terminal Exam
                </h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Customs examination officers break the numbered container bolt seal during a joint physical exam. Inspectors verify chassis VIN stampings against the Single Goods Declaration (SGD), confirm engine integrity, and issue official gate passes.
                </p>
              </div>
            </div>

            {/* Essential Guides Cross-Links */}
            <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#2B59FF] mb-3">
                RECOMMENDED IMPORT GUIDES & TOOLS
              </h4>
              <p className={`text-xs md:text-sm mb-4 leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                Plan your vehicle import with full transparency using our dedicated guides and calculators:
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <Link to="/guides/import-car-canada-to-nigeria/" className="text-[#2B59FF] hover:underline">
                  Complete Canada to Nigeria Import Guide →
                </Link>
                <Link to="/guides/shipping-cost-canada-to-nigeria/" className="text-[#2B59FF] hover:underline">
                  Full 2026 Shipping Cost Breakdown →
                </Link>
                <Link to="/nigeria/import-duty-calculator/" className="text-[#2B59FF] hover:underline">
                  Nigeria Import Duty Calculator →
                </Link>
                <Link to="/services/installment-plans/" className="text-[#2B59FF] hover:underline">
                  Naira Milestone Installment Plans →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dedicated Ghana Tema Port Hub Section */}
      {isGhana && (
        <section className={`py-16 px-6 md:px-12 border-t ${
          theme === 'dark' ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3 font-mono">
                GHANA LOGISTICS GATEWAY
              </span>
              <h2 className={`text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Tema Port Vehicle Sourcing & Customs Clearance
              </h2>
              <p className={`text-sm md:text-base leading-relaxed ${
                theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'
              }`}>
                The <strong>Port of Tema</strong> (including the Golden Jubilee Terminal and modern MPS Terminal 3) is the primary maritime hub for Ghanaian auto buyers importing vehicles from North America. LeeAutoX provides seamless door-to-port and cleared-at-doorstep services across Greater Accra, Kumasi, and Takoradi.
              </p>
            </div>

            {/* Ghana Operational Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-mono uppercase font-bold text-[#2B59FF] tracking-wider block mb-1">
                  OCEAN TRANSIT
                </span>
                <h4 className="font-extrabold text-base mb-2 text-foreground">
                  5 to 8 Weeks Port-to-Port
                </h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Containerized vessels departing Canadian Atlantic ports (Halifax and Montreal) reach Tema port in 5 to 8 weeks. Steel containerization protects your vehicle against salt spray and eliminates pilferage during transit.
                </p>
              </div>

              <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-mono uppercase font-bold text-[#2B59FF] tracking-wider block mb-1">
                  LOCAL CURRENCY
                </span>
                <h4 className="font-extrabold text-base mb-2 text-foreground">
                  Milestone Payments in Cedis (GHS)
                </h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Avoid FX exchange friction by funding your vehicle pre-order through structured milestone payments in Ghanaian Cedis (GHS) directly to our registered partner accounts, mapped to auction acquisition, container loading, and port arrival.
                </p>
              </div>

              <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-mono uppercase font-bold text-[#2B59FF] tracking-wider block mb-1">
                  TEMA CLEARANCE
                </span>
                <h4 className="font-extrabold text-base mb-2 text-foreground">
                  GRA Customs Processing
                </h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Our accredited clearing partners interface with the Ghana Revenue Authority (GRA) Customs Division. Duty assessments are verified by engine displacement (cc) and age band before unstowing at Tema terminals.
                </p>
              </div>
            </div>

            {/* Ghana Contact & Inquiry Notice */}
            <div className={`p-6 border rounded flex flex-col md:flex-row justify-between items-center gap-6 ${
              theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
            }`}>
              <div className="space-y-1 text-xs">
                <span className="font-bold text-foreground block text-sm">Need a Tema Port Landing Assessment?</span>
                <span className="text-zinc-500">
                  Ghana inquiries and vehicle pre-orders are managed directly through our central logistics WhatsApp desk (+1 647 389-6162) with on-ground clearing liaisons in Tema.
                </span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] text-black font-bold uppercase tracking-wider text-xs rounded hover:brightness-110 transition-all shrink-0"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Sourcing Duty Calculator Link */}
      {isNigeria && !cleanPath.includes('calculator') && (
        <section className={`py-12 border-t text-center ${
          theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="max-w-3xl mx-auto px-6">
            <h3 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight mb-3">
              Check Landing Costs Instantly
            </h3>
            <p className={`text-xs md:text-sm mb-6 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
              Want to see the specific Custom Duty and clearing costs for a 2021 Hyundai Sonata or Toyota Prado? Open our dynamic Customs Duty Calculator.
            </p>
            <a
              href="/nigeria/import-duty-calculator/"
              className="inline-block px-8 py-3 bg-white text-black font-extrabold uppercase text-xs tracking-widest border border-black hover:bg-black hover:text-white transition-all"
            >
              Launch Nigeria Custom Duty Calculator
            </a>
          </div>
        </section>
      )}

      <Contact />
    </div>
  );
}
