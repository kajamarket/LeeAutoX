import { useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Phone, MessageSquare, Shield, Check } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import ImportDutyCalculator from '../components/ImportDutyCalculator';

export default function GeoPage() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  // Standardize trailing slash
  let cleanPath = pathname;
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

  if (isScarborough) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader 
          title="Car Auctions in Scarborough, Ontario | LeeAutoX Sourcing Hub" 
          subtitle="Direct, licensed wholesale sourcing from premier Ontario car auctions including Copart Cookstown, ADESA Toronto, and Impact Auto Auctions, direct to Lagos or Tema." 
          breadcrumbs={data.breadcrumbs} 
        />

        {/* Introduction Section */}
        <section className={`py-16 px-6 md:px-12 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3 font-mono">
              ONTARIO SOURCE TERMINAL
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-6 text-foreground">
              Sourcing Direct from Premier Car Auctions in Scarborough & Ontario
            </h2>
            <p className={`text-base leading-relaxed mb-6 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>
              When you are looking for a reliable, highly cost-effective way to buy a vehicle, sourcing directly from a <strong>car auction near Scarborough</strong> or the Greater Toronto Area (GTA) through LeeAutoX provides unparalleled transparency and value. Instead of buying pre-selected, potentially marked-up cars from local dealership lots, our licensed brokerage team gives you direct access to the largest wholesale and salvage dealer channels in Canada.
            </p>
            <p className={`text-base leading-relaxed mb-6 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>
              We operate a dedicated containerization and export strapping depot in Scarborough, Ontario, which serves as our central consolidation hub. Here, vehicles acquired from leading auction locations across Ontario are securely prepared, loaded, and cleared for ocean transit to West African ports. Sourcing a <strong>car auction Ontario</strong> wide has never been simpler, safer, or more economical.
            </p>
          </div>
        </section>

        {/* Auction Houses We Source From */}
        <section className={`py-16 px-6 md:px-12 border-t ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-12 text-center text-foreground">
              Premier Ontario Auction Houses We Source From
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold text-lg uppercase mb-3 text-[#2B59FF]">Copart Ontario (Cookstown)</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  One of the largest yards in eastern Canada, offering a massive inventory of clean title, lease returns, and insurance salvage vehicles. We handle complete on-site physical lot inspections prior to placing bids at <strong>Copart Ontario</strong>.
                </p>
              </div>
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold text-lg uppercase mb-3 text-[#2B59FF]">ADESA Toronto</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  A premier dealer-only wholesale auction house. <strong>ADESA Toronto</strong> features high-quality lease buybacks, fleet turn-ins, and high-spec SUVs that are normally inaccessible to standard buyers or local importers.
                </p>
              </div>
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold text-lg uppercase mb-3 text-[#2B59FF]">Impact Auto Auctions</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Canada's leading salvage vehicle auction network. Sourcing from Impact allows us to procure slight cosmetic-repairable vehicles at deep discounts, maximizing your budget on a <strong>buy car at auction Canada</strong> plan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How Sourcing Works Section */}
        <section className={`py-16 px-6 md:px-12 border-t ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-8 text-foreground">
              The LeeAutoX Auction-to-Port Sourcing Pipeline
            </h2>
            <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
              Our end-to-end process is engineered for complete transaction security, ensuring you know exactly where your vehicle is and how it is being handled at every milestone:
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-base uppercase text-foreground">Virtual Auction Access & Physical Appraisal</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>We grant you direct access to live auctions. Once a target vehicle is selected, our certified local staff can inspect the vehicle physically at the auction yard to verify mechanical states.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-base uppercase text-foreground">Inland Transit & Scarborough Consolidation</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>Once the bidding is won, the car is towed via our trusted flatbed network to our secure Scarborough consolidation yard to prepare for container loading.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-base uppercase text-foreground">Marine Containerization & Strapping</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>We optimize ocean freight by securing up to 4 vehicles inside a single 40ft high-cube sea container, utilizing heavy-duty steel chains and nylon strapping to prevent transit shifts.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm shrink-0">4</span>
                <div>
                  <h4 className="font-bold text-base uppercase text-foreground">Lagos/Tema Customs Clearing & Delivery</h4>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>We handle the export declaration, CBSA clearance, marine shipment, and direct custom port clearing at Apapa or Tema, delivering your car key-in-hand.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Types Available */}
        <section className={`py-16 px-6 md:px-12 border-t ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-8 text-center text-foreground">
              Vehicle Types Sourced from Ontario Auctions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <h4 className="font-bold uppercase mb-2 text-foreground">Luxury & Performance Sedans</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Premium sedans like Lexus ES350, Mercedes-Benz C-Class, and BMW 5-Series sourced from major leasing networks.</p>
              </div>
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <h4 className="font-bold uppercase mb-2 text-foreground">High-Ground Clearance SUVs</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Toyota Highlander, Lexus RX350, and Honda CR-V capable of handling rugged Nigerian road terrains and rainy season floods.</p>
              </div>
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <h4 className="font-bold uppercase mb-2 text-foreground">Commercial Vans & Pickups</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Ford F-150, Toyota Hilux, and commercial cargo vans for shipping/logistics companies in Lagos and West Africa.</p>
              </div>
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <h4 className="font-bold uppercase mb-2 text-foreground">Salvage & Rebuildables</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Vehicles with minor superficial collision histories, repairable locally at our Lagos workshop for massive cost savings.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Naira Pricing Context */}
        <section className={`py-16 px-6 md:px-12 border-t ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-6 text-foreground">
              Naira Landing Cost Estimates for 2026
            </h2>
            <p className={`text-sm mb-8 max-w-2xl mx-auto ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Below are approximate, realistic Naira pricing ranges for high-spec vehicles procured from Ontario auctions, shipped, and fully custom cleared to Lagos:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#2B59FF]">Toyota Corolla SE</span>
                <p className="text-2xl font-black mt-2 text-foreground">₦15,000,000</p>
                <p className="text-[10px] text-zinc-500 mt-1">Sourced from ADESA Toronto</p>
              </div>
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#2B59FF]">Lexus RX350 Premium</span>
                <p className="text-2xl font-black mt-2 text-foreground">₦18,500,000</p>
                <p className="text-[10px] text-zinc-500 mt-1">Sourced from Copart Ontario</p>
              </div>
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#2B59FF]">Toyota Highlander XLE</span>
                <p className="text-2xl font-black mt-2 text-foreground">₦22,000,000</p>
                <p className="text-[10px] text-zinc-500 mt-1">Sourced from ADESA Toronto</p>
              </div>
            </div>
          </div>
        </section>

        {/* Action / WhatsApp section */}
        <section className={`py-16 px-6 md:px-12 border-t text-center ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'}`}>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-black uppercase mb-4 text-foreground">Start Sourcing from Canadian Auctions Today</h3>
            <p className="text-xs text-zinc-500 mb-8 leading-relaxed">
              Why pay exorbitant local markups when you can secure a custom, verified car direct from Canada? Tap below to connect with our active Scarborough logistics representative.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#2B59FF] text-white hover:bg-[#1a41cc] transition-all font-bold tracking-wider uppercase text-sm shadow-[0_0_20px_rgba(43,89,255,0.3)]"
            >
              <MessageSquare size={18} />
              Inquire via WhatsApp (Scarborough Desk)
            </a>
          </div>
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
            <p className={`text-base leading-relaxed mb-6 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>
              Navigating the financial complexity of vehicle clearing at Nigerian ports requires professional precision. Our live <strong>Nigeria customs duty calculator</strong> utilizes the latest Nigeria Customs Service (NCS) Common External Tariff (CET) guidelines and official valuation metrics to determine realistic port landing costs. 
            </p>
            <p className={`text-base leading-relaxed mb-6 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>
              Rather than relying on risky verbal estimates, our interactive tool helps you compute exactly what is required to clear passenger sedans, high-ground SUVs, or commercial trucks at Apapa, Tin Can, or PTML terminals. Understand your liabilities, plan your acquisition budget, and import with absolute confidence.
            </p>

            <h2 className={`text-xl font-bold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              How is Customs Duty Calculated in Nigeria?
            </h2>
            <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
              Import clearing assessments in Nigeria are computed on a Cost, Insurance, and Freight (CIF) basis rather than the domestic purchase price (FOB) alone. The basic breakdown includes:
            </p>
            <ul className={`list-disc list-inside space-y-2 text-sm mb-8 pl-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
              <li><strong>Cost, Insurance, and Freight (CIF):</strong> The base value combining your vehicle's auction purchase price (FOB) and marine shipping freight from Canada/US.</li>
              <li><strong>Common External Tariff (CET) Duty:</strong> Typically set at 20% of the CIF value for passenger automobiles, or 10% for commercial vehicles and trucks.</li>
              <li><strong>Surcharge Levy:</strong> An additional 7% calculated directly on the CET Duty amount.</li>
              <li><strong>ECOWAS Trade Liberalization Scheme (ETLS):</strong> A regional integration levy set at 0.5% of the CIF value.</li>
              <li><strong>Value Added Tax (VAT):</strong> Calculated at 7.5% of the cumulative sum of CIF + CET Duty + Surcharge + ETLS.</li>
            </ul>
          </div>
        </section>

        {/* The Live Interactive Calculator */}
        <section className={`py-12 px-6 md:px-12 border-t border-b ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="max-w-4xl mx-auto">
            <ImportDutyCalculator />
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
          </div>
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
                {isCanada ? 'Greater Toronto Area, Ontario, Canada' : isGhana ? 'Tema Port Hub & Accra Office, Ghana' : 'Apapa Port Clearance Lot, Lagos, Nigeria'}
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
              className="flex items-center justify-center gap-3 p-5 bg-[#2B59FF] text-white hover:bg-[#1a41cc] transition-all font-bold tracking-wider uppercase text-sm shadow-[0_0_20px_rgba(43,89,255,0.3)] text-center"
            >
              <MessageSquare size={18} />
              Connect with {isCanada ? 'Toronto' : isGhana ? 'Accra' : 'Lagos'} Representative
            </a>

          </div>

        </div>
      </section>

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
    </div>
  );
}
