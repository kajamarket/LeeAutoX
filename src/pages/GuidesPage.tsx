import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ImportDutyCalculator from '../components/ImportDutyCalculator';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Calendar, User, Clock, ArrowLeft, MessageSquare, ChevronRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

// Detailed Guide Content Map to serve real content
const GUIDES_CONTENT: Record<string, {
  title: string;
  author: string;
  readTime: string;
  date: string;
  category: string;
  summary: string;
  paragraphs: string[];
}> = {
  '/guides/import-car-canada-to-nigeria/': {
    title: 'Ultimate Guide to Importing Cars from Canada to Nigeria',
    author: 'LeeAutoX Logistics Desk',
    readTime: '15 min read',
    date: 'June 18, 2026',
    category: 'Logistics',
    summary: 'The comprehensive blueprint detailing Air Freight and Ocean shipping to Nigeria from Canada (CN), including car imports, customs clearance, and container shipping rates.',
    paragraphs: [
      'Importing a car, personal effects, or commercial cargo from Canada to Nigeria requires navigating a highly complex international logistics pipeline. To ensure a professional masterclass that outperforms standard, opaque cargo services, we have put together this industry-leading guide covering air cargo deliveries, marine containerization, customs clearing protocols, and local pre-sale preparation.',
      '## Air Freight vs. Ocean Shipping to Nigeria from Canada',
      'When planning how to export to Nigeria from Canada, you must choose between two main logistics pipelines depending on your shipment weight, budget, and urgency:',
      '### 1. Air Freight from Canada to Nigeria (CN)',
      'For high-value items, critical automotive spare parts, documentation, or express electronics, our Air Freight from Canada to Nigeria (CN) represents the ultimate premium option. Standard transit times for air cargo shipments typically range between 7 to 10 working days to land at Murtala Muhammed International Airport (LOS) in Lagos. This fast cargo service to Nigeria from Canada guarantees absolute cargo security, automated flight tracking, and full customs handling with door-to-door delivery options.',
      '### 2. Ocean Shipping from Canada to Nigeria',
      'For cars, heavy machinery, SUVs, and high-volume commercial inventories, Ocean shipping From Canada to Nigeria is the most practical and cost-effective channel. Standard ocean transit from Canadian ports (typically Montreal, Halifax, or Vancouver) to Lagos ports (PTML, Tin Can Island, or Apapa) takes between 28 to 42 days. Importers benefit from secure containerization, protecting vehicles and heavy freight from corrosive marine salt spray and transit scratches.',
      '## How to Import Cars from Canada to Nigeria: Step-by-Step Masterclass',
      'If you are looking at shipping cars to Nigeria from Canada, navigating the procurement and delivery pipeline successfully requires following a highly structured five-phase protocol:',
      '### Phase 1: Direct Auction Sourcing and VIN History Audits',
      'The import process starts with licensed broker access to premier dealer-only Canadian auto auctions, including Copart Cookstown, Impact Auto Auctions, and ADESA Toronto. Prior to placing any bids, it is imperative to run a meticulous historical audit via Carfax to verify the vehicle’s chassis VIN, protecting you from collision-damaged salvage, frame fatigue, and odometer rollback scams.',
      '### Phase 2: Local Flatbed Hauling and Scarborough Consolidation',
      'Once a vehicle is won, our local inland flatbed carrier transports the unit directly to our secure consolidation lot in Scarborough, Ontario. To optimize your container shipping rates, we specialize in high-cube container splicing, safely packing and strapping up to four vehicles inside a single 40ft steel cargo container using heavy-duty industrial nylon straps and bracing blocks.',
      '### Phase 3: Ocean Marine Freight Transit & Tracking',
      'The loaded container is transferred to the terminal in Montreal or Halifax, where it is loaded onto an ocean liner. Importers are issued an official 11-digit ocean container Bill of Lading (BoL) to trace the marine vessel position in real-time as it crosses the Atlantic Ocean toward West Africa.',
      '### Phase 4: Nigeria Port Customs Clearance and Valuation',
      'Upon container discharge at Lagos PTML, Tin Can, or Apapa ports, our customs clearing specialists submit the vehicle chassis VIN for official valuation. Estimating your total custom clearing and duty landing fees is simplified using our interactive [Nigeria Custom Car Import Duty Calculator](/nigeria/import-duty-calculator/), which calculates exact tariff duties in Naira based on NCS valuation guidelines. We settle all customs obligations legally and issue an official Single Goods Declaration (SGD) form and bank e-receipts, safeguarding your car from FOU highway checkpoints.',
      '### Phase 5: Lagos Arrival & Specialized Prep Service',
      'After clearing, vehicles are transferred out of the chaotic port environment. For professional car dealers, fleet operators, and buyers demanding perfect turnkey condition on showroom arrival, we coordinate with our dealer-facing vehicle servicing and prep partner, [Lee Auto Lagos](/lee-auto/). While LeeAutoX handles the complex sourcing, containerization, and marine shipping logistics, the Lee Auto Lagos team executes detailed 150-point diagnostic scans, fluid services, cosmetic paint correction, marine grime wash, and custom NCS clearance verifications.',
      '## Cargo Shipping to Nigeria from Canada: Rates, Timing, and Pricing',
      'Our general cargo service to Nigeria from Canada is fully structured around volume, weight, and item type. Whether you are shipping personal luggage, household machinery, or a fleet of commercial trucks, our logistics desk coordinates volume carrier discounts. We offer a highly reliable alternative to standard cargo agents, backed by a fully registered Canadian corporation (No: 1761065-3) and dedicated Lagos clearing hubs.',
      'To provide absolute security for your capital, we also offer a unique 50-25-25 Naira installment payment plan for qualified vehicle pre-orders, protecting your liquid cash flow. Contact our support team via WhatsApp today to request current container shipping quotes or book air cargo space!'
    ]
  },
  '/guides/tokunbo-buyers-guide/': {
    title: 'Tokunbo Cars Complete Buyers Guide 2026',
    author: 'Chief Auto Procurement & Inspection Officer',
    readTime: '15 min read',
    date: 'June 24, 2026',
    category: 'Inspection & Buying',
    summary: 'The ultimate tokunbo buyers guide for 2026. Avoid costly scams, verify actual mileage, detect hidden flood damage, check auction history, and learn how to source direct from North America.',
    paragraphs: [
      'Buying a foreign-used vehicle, popularly known as a "Tokunbo" car in Nigeria, represents a major financial milestone for individuals, families, and businesses alike. Navigating the vibrant but highly unregulated local dealership lots, such as Berger in Lagos, requires deep market wisdom and technical vigilance. Without a structured protocol, buyers face the risk of purchasing cars with rolled-back odometers, hidden frame collision repairs, or severe corrosion. This complete, publish-ready 2026 Tokunbo Buyers Guide equips you with the exact strategies and step-by-step inspection checklists to secure a premium vehicle without overpaying or getting scammed.',
      '## Demystifying the Tokunbo Phenomenon: What It Means and Why It Rules',
      'The word "Tokunbo" is derived from the Yoruba language, literally translating to "born across the sea" or "imported from overseas." In the Nigerian automotive context, it represents high-quality foreign-used vehicles imported from wealthy Western nations—principally Canada and the United States—which have never been registered, driven, or worn down on Nigerian roads. This distinguishes them from "locally used" cars, which have navigated demanding local terrains, inconsistent fuel qualities, and substandard mechanics.',
      'Nigerians overwhelmingly prefer tokunbo cars over local alternatives or brand-new options for several key reasons. Brand-new vehicles (zero mileage) are prohibitively expensive for the middle class due to high excise taxes and severe Naira-to-Dollar exchange rate variations. Conversely, locally-used cars often carry a burden of deferred maintenance and wear-and-tear that degrades their lifespan. A Tokunbo car provides the ideal sweet spot: it represents a vehicle driven on well-maintained foreign highways, maintained with high-grade synthetic lubricants, and subject to strict annual emission and safety standards. When you buy a tokunbo car, you are buying a vehicle with a high percentage of its factory lifecycle intact, ready to serve you reliably for many years.',
      '## Comprehensive Tokunbo Car Inspection Checklist: Step-by-Step Security',
      'Buying a tokunbo vehicle in Nigeria shouldn\'t be a game of chance. By executing a meticulous physical inspection, you can protect your capital. When you are on the ground inspecting a vehicle, adhere strictly to these four core inspectable areas:',
      '### 1. Spotting Odometer Fraud and Verifying True Mileage',
      'Tampering with the odometer (mileage rollback) is one of the most common frauds encountered on Nigerian car lots. Unscrupulous dealers routinely utilize digital diagnostic tools to reprogram instrument clusters, artificially turning a heavily driven 180,000-mile highway workhorse into a highly attractive, premium 72,000-mile vehicle. To uncover odometer fraud, you must look for physical wear indicators that do not match the low mileage on the dashboard:',
      '- Check the rubber brake pedal pad and the accelerator pedal. If they are worn down to the bare metal, the vehicle has likely covered far more than 100,000 miles, regardless of what the odometer reads.',
      '- Inspect the leather wrapper on the steering wheel, the gear shift lever, and the outer bolsters of the driver\'s seat. High-friction areas show physical cracking, peeling, and discoloration under heavy usage.',
      '- Cross-examine the physical wear on the door panel armrests and power window buttons. If they are loose or heavily scratched, it is a clear sign of high duty cycles.',
      '- Always request a Carfax history report or use the vehicle\'s 17-digit VIN to search the original auction history records. Compare the mileage registered at the time of the North American auction sale with the current dashboard reading. Any discrepancy is an immediate red flag.',
      '### 2. Detecting Hidden Flood Damage and Marine Salvage',
      'Many salvage vehicles that have been submerged in severe North American hurricanes or localized flash floods are cosmetically detailed, dried out, and exported to West Africa as "clean title" tokunbo cars. Flood-damaged vehicles carry highly unstable electronic control units (ECUs), corroded wiring harnesses, and mold colonies hidden deep within the ventilation systems. To detect water damage, use your senses:',
      '- Sniff the interior thoroughly. Enter the vehicle, close all doors and windows, and wait for a few minutes. A persistent, musty, damp, or mildew-like smell is a strong indicator of prior water intrusion. Be highly suspicious if the dealer has sprayed heavy artificial deodorizer to mask interior smells.',
      '- Pull back the flexible rubber seals along the door jams, trunk lid, and firewall. Check for pockets of fine silt, dried mud, or tiny river sand deposits. These are impossible to clean fully during cosmetic detailing.',
      '- Peer under the dashboard and check the metal bracket screws holding the ECU, steering column, or pedals. If they show premature, flaky orange rust, the interior has been submerged.',
      '- Inspect the electrical wiring connectors under the front passenger seats. Look for a fine green powdery corrosion on the copper pins, which causes intermittent airbag and ABS warning lights.',
      '### 3. Spotting Snow Belt Corrosion (Salt Damage)',
      'Vehicles sourced out of snowy Canadian provinces (like Ontario or Quebec) or the northern US states navigate road surfaces treated with corrosive salt and calcium chloride during the winter. While modern vehicles feature zinc-coated steel, prolonged salt exposure leads to severe rust damage on structural elements. When conducting a tokunbo car inspection, crawl underneath to verify:',
      '- Inspect the structural subframe rails and engine cradle. Surface rust is normal, but deep, flaky rust that bubbles or causes the metal to disintegrate under thumb pressure compromises structural integrity.',
      '- Check the exhaust system pipes, mufflers, and catalytic converter welds. Corroded exhausts leak toxic fumes and are expensive to replace in Nigeria.',
      '- Look at the suspension coil springs, control arms, and brake calipers. If they are heavily encrusted in rust, the suspension will ride stiffly, and bolts may seize during future maintenance.',
      '### 4. Reading Frame and Structure Welds (Accident History)',
      'Many tokunbo cars have prior front-end or rear-end collision histories that were poorly repaired in local workshops prior to export or upon arrival. To verify structural integrity:',
      '- Open the engine hood and inspect the inner fender aprons and radiator core support. Look for irregular welding seams, ripples in the sheet metal, or non-factory paint finishes that suggest a structural replacement.',
      '- Check the alignment of all exterior body panel gaps (hood-to-fender, doors-to-pillar, trunk-to-quarter panel). Standard factory gaps are perfectly uniform. Uneven gaps suggest prior panel pulling and frame misalignment.',
      '- Run your fingers along the factory spot welds inside the door jams and around the engine bay. They should be perfectly round, uniform, and smooth. Rough, hand-cranked welds indicate major structural repairs.',
      '## Best Tokunbo Car Brands & Models in Nigeria for 2026',
      'When planning to buy tokunbo car Nigeria, choosing a vehicle with readily available spare parts, local mechanic familiarity, and excellent resale value is essential. Based on rigorous long-term performance data in Nigerian conditions, these three brands stand out:',
      '### 1. Toyota (The Uncontested King of Resale Value)',
      'Toyota remains the ultimate brand choice for Nigerian drivers. Their engines are highly tolerant of varying local fuel octane ratings, and their mechanical simplicity makes them easy for any local mechanic to service.',
      '- **Toyota Corolla (2010 - 2020)**: Renowned for its fuel economy, robust suspension, and indestructible engine. A perfect choice for daily commuting, fleet services, and ride-hailing platforms.',
      '- **Toyota Camry (2012 - 2018)**: Known locally as "Muscle" or "Spider," it provides a spacious, highly comfortable cabin, strong air conditioning, and a premium look.',
      '- **Toyota RAV4 and Highlander (2010 - 2018)**: Perfect crossover SUVs designed to handle flooded streets and rugged Nigerian potholes with high ground clearance.',
      '### 2. Lexus (Affordable Luxury and Prestige)',
      'Lexus combines the unmatched mechanical reliability of Toyota with premium luxury features, making it the most desired upscale car brand in Nigeria.',
      '- **Lexus RX350 (2010 - 2018)**: The ultimate luxury SUV in Nigeria. Its robust V6 engine, smooth ride quality, and luxurious interior layout make it a status symbol that is exceptionally reliable.',
      '- **Lexus ES350 (2010 - 2017)**: A highly comfortable premium sedan sharing major drivetrain components with the Toyota Camry, ensuring cheap and easy maintenance.',
      '### 3. Honda (The Performance & Styling Alternative)',
      'Honda appeals to drivers seeking responsive handling, modern technology, and sleek, aggressive styling lines.',
      '- **Honda Accord (2013 - 2018)**: Known for its sporty driving dynamics, spacious cabin, and excellent fuel efficiency. It is important to stick to recommended transmission fluids to ensure longevity.',
      '- **Honda CR-V (2012 - 2016)**: A practical, reliable compact SUV offering superb cabin utility, high safety ratings, and standard luxury amenities.',
      '## Tokunbo Prices in Nigeria: Realistic Budgeting for 2026',
      'Automotive prices in Nigeria fluctuate based on foreign exchange rates, clearing customs duty assessments, and shipping line charges. To assist your planning, here are realistic price ranges for clean, foreign-used Tokunbo vehicles in the Nigerian market for 2026:',
      '- **Toyota Corolla (2014 - 2017)**: ₦12,000,000 to ₦16,000,000',
      '- **Toyota Camry (2012 - 2015)**: ₦11,000,000 to ₦15,000,000',
      '- **Lexus RX350 (2010 - 2013)**: ₦15,000,000 to ₦19,000,000',
      '- **Lexus ES350 (2013 - 2015)**: ₦14,000,000 to ₦18,000,000',
      '- **Honda Accord (2013 - 2015)**: ₦10,000,000 to ₦13,500,000',
      '## Customs and Import Duty Considerations',
      'Understanding the import duty structure is a critical aspect of your tokunbo cars budget. The Nigeria Customs Service (NCS) utilizes the Common External Tariff (CET) and standard VIN valuations to calculate duty levies. Importing a car without proper clearing documentation exposes you to the risk of vehicle seizure at customs checkpoints.',
      'The custom valuation is based on the vehicle\'s Year, Make, Model, and engine size. Passenger vehicles are subject to a 20% import duty rate, plus additional surcharges. Navigating this complex process independently is highly risky, which is why working with a verified logistics partner like LeeAutoX is essential to ensure legitimate clearing and the issuance of a genuine Customs Single Goods Declaration (SGD) form.',
      '## Sourcing Direct: How LeeAutoX Sourcing Outranks Thin Market Alternatives',
      'Why settle for pre-selected, overpriced, or potentially tampered vehicles on local lots when you can source a custom vehicle directly from North American wholesale auto auctions? Sourcing through LeeAutoX gives you full control over the procurement pipeline:',
      '- **Direct Auction Access**: We give you direct, wholesale broker access to premier North American auto auctions, including Copart Cookstown, Impact Auto Auctions, and ADESA Toronto. You can bid on clean title, salvage, or lease vehicles in real-time.',
      '- **On-Site Scarborough Consolidation**: Once won, your vehicle is hauled to our Scarborough, Ontario depot. Here, our professional riggers strap, block, and load the vehicles inside secure 40ft high-cube sea containers, maximizing safety and minimizing shipping costs per vehicle.',
      '- **Lagos Port Clearing**: We handle the entire marine shipping pipeline from Canadian terminals to Lagos PTML or Tin Can Island ports. Our local logistics specialists execute the customs declarations, VIN valuations, and secure your gate pass seamlessly.',
      '- **Naira Payment Options**: We offer a unique 50-25-25 Naira installment structure, allowing you to pay your commitment deposit in Naira, lock down your auction win, and spread logistics payments over ocean transit periods.',
      '## Frequently Asked Questions (FAQ)',
      '- **1. What does the term "Tokunbo" actually mean?**\n"Tokunbo" is a Yoruba word meaning "born across the sea" or "imported from overseas." In the Nigerian car market, it refers specifically to foreign-used vehicles imported directly from Europe, Canada, or the USA that have never been registered, driven, or worn down locally in Nigeria.',
      '- **2. Why should I buy a Tokunbo car instead of a locally-used car?**\nTokunbo vehicles are sourced from developed nations with strict vehicle inspection regimes, high fuel qualities, and superior road networks. Locally-used cars in Nigeria are often driven on rugged terrains and maintained with generic oils, resulting in hidden mechanical fatigue.',
      '- **3. How can I verify that a Tokunbo car has a clean title and genuine mileage?**\nAlways request the 17-character VIN (Vehicle Identification Number) from the dealer. Run this VIN through a reputable vehicle history portal like Carfax to view detailed historical damage records, odometer readings at past inspections, and original auction photos.',
      '- **4. Does LeeAutoX help me buy cars directly from Copart Canada?**\nYes! LeeAutoX provides direct broker access to licensed dealer-only auctions in Ontario and North America. We handle the physical inspects, local transport, Scarborough containerization, Atlantic shipping, and complete Lagos clearing. Contact our team via WhatsApp to start your custom import journey!'
    ]
  },
  '/guides/vehicle-clearing-process-nigeria/': {
    title: 'Vehicle Port Clearance Guide at Lagos Apapa Ports',
    author: 'Apapa Operations Manager',
    readTime: '10 min read',
    date: 'May 12, 2026',
    category: 'Port Operations',
    summary: 'An step-by-step walk-through of the 11 customs and terminal checkpoints, from shipping line releases to terminal gate passes.',
    paragraphs: [
      'Clearing a car at Lagos ports requires executing a multi-agency sequence. Here is the exact checkpoint flow from container landing to exit gate.',
      'Checkpoint 1: Bill of Lading & Delivery Order. We exchange the original marine cargo documents with the shipping line to secure the Delivery Order (DO). Checkpoint 2: VIN Assessment. We upload the vehicle chassis VIN to the Nigeria Single Window Trade Portal for valuation.',
      'Checkpoint 3: Customs Duty Payment. The system generates an assessment voucher. We execute the duty payment at a designated custom commercial bank, issuing an official e-receipt. Checkpoint 4: Terminal Examination. Custom officers physically open the container to inspect chassis marks, verifying it matches the documentation.',
      'Checkpoint 5: Release and Gate Pass. Once custom inspectors approve, the cargo is released. We settle shipping line storage rent, terminal demurrage fees, and secure the Gate Pass for container departure.'
    ]
  },
  '/guides/car-auction-guide-usa-canada/': {
    title: 'Bidding on Copart & IAAI from Africa',
    author: 'Licensed Broker Team',
    readTime: '11 min read',
    date: 'April 30, 2026',
    category: 'Auction Guide',
    summary: 'Master biding on dealer-only salvage portals without paying astronomical local broker commissions. Bidding limits and title brands explained.',
    paragraphs: [
      'North American auto auctions like Copart and IAAI host over 300,000 salvage and clean title vehicles weekly. However, accessing dealer-only auctions normally requires a registered commercial auto brokerage license. LeeAutoX operates as your licensed proxy.',
      'Understanding Title Brands: Before bidding, understand the difference between Clean, Salvage, and Certificate of Destruction titles. Clean titles require minimal repairs and can be cleared for export easily. Salvage titles require certified reconstruction, while Certificate of Destruction titles CANNOT be registered or exported.',
      'Auction Fee Structures: The bid amount is NOT the final price. Copart applies Buyer Fees, Gate Fees, and Internet Bidding Fees which can add up to 15% on top of the hammer price. Our system calculates these fees prior to bidding to prevent budgetary surprises.'
    ]
  },
  '/guides/financing-naira/': {
    title: 'Car Import Installment Financing in Naira',
    author: 'Advisory Panel',
    readTime: '7 min read',
    date: 'June 02, 2026',
    category: 'Finance',
    summary: 'A detailed manual on how to lock your auction win with a minimal deposit, and spread shipping and duty clearing payments over 45 days.',
    paragraphs: [
      'Traditional auto loans in Nigeria carry high double-digit interest rates. LeeAutoX offers a flexible Naira installment structure to assist importers.',
      'How the Installment Framework Works: 1. You put down a 50% commitment downpayment in Naira. This funds the vehicle\'s direct auction purchase and secures it at the GTA yard. 2. 25% is paid upon container loading in Scarborough. 3. The remaining 25% balance is settled when the vessel berths in Lagos, prior to port customs release.',
      'Benefits: 0% interest and structured payments protect your cash flow, allowing you to manage liquid capital effectively during the shipping period.'
    ]
  },
  '/guides/financing-cedis/': {
    title: 'Pre-Order Car Financing in Ghanaian Cedis',
    author: 'Ghana Finance Hub',
    readTime: '7 min read',
    date: 'June 01, 2026',
    category: 'Finance',
    summary: 'Learn about our Ghana milestone installment plans. Pay in Cedis through local banking channels with 0% interest rate.',
    paragraphs: [
      'Importing to Ghana is now simplified with our localized Cedi payment pipeline. Avoid high US Dollar conversion rates by settling installments directly in GHS through our accredited Ghanaian accounts.',
      'We match your payments to specific container logistics milestones: Sourcing, loading, Tema port arrival, and clearing. This ensures that every Cedi you spend is mapped directly to visible, verifiable physical actions.'
    ]
  },
  '/guides/vehicle-inspection-checklist/': {
    title: 'Copart Pre-Purchase 150-Point Inspection Checklist',
    author: 'On-site Inspector',
    readTime: '10 min read',
    date: 'March 15, 2026',
    category: 'Inspection',
    summary: 'Our technical blueprint. Print or use this lot diagnostics guide covering frame checks, fluid diagnostics, and engine computer codes.',
    paragraphs: [
      'Buying a vehicle from an online image can lead to massive repair bills. Here is our physical 150-point inspection check-list used at every Ontario auction yard.',
      'Mechanical Audits: Pull the engine dipstick and check for milky froth (indicates a blown head gasket). Open the radiator cap to verify coolant is free of oil. Electrical Checks: Plug an OBD2 diagnostic scanner into the port. Scan for pending fault codes (ABS, SRS, Transmission) that might have been cleared temporarily. Frame Inspection: Check the inner fender welds and core supports for hammer marks or non-factory welds.'
    ]
  },
  '/guides/vehicle-verification-nigeria/': {
    title: 'Chassis VIN and Custom Verification Guide Nigeria',
    author: 'Compliance Desk',
    readTime: '8 min read',
    date: 'February 22, 2026',
    category: 'Compliance',
    summary: 'How to verify if your customs duty papers are genuine. Keep yourself safe from highway police impounds and customs seizures.',
    paragraphs: [
      'In Nigeria, driving a vehicle with falsified customs clearing papers is a criminal offense that can result in immediate impoundment by the Customs Federal Operations Unit (FOU).',
      'How to Verify: Take your Single Goods Declaration (SGD) customs paper and locate the C-Number. Visit any Customs office or use their public trade portal. Enter the C-Number and Chassis VIN to verify if the assessment was executed, paid, and released at the port. LeeAutoX provides certified custom e-receipts for every single car we clear.'
    ]
  }
};

export default function GuidesPage() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  // Render text containing markdown links [text](url)
  const renderParagraphText = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      
      if (linkUrl.startsWith('/') && !linkUrl.startsWith('//')) {
        parts.push(
          <Link key={matchIndex} to={linkUrl} className="text-[#2B59FF] font-semibold underline hover:text-[#1a41cc] transition-colors">
            {linkText}
          </Link>
        );
      } else {
        parts.push(
          <a key={matchIndex} href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-[#2B59FF] font-semibold underline hover:text-[#1a41cc] transition-colors">
            {linkText}
          </a>
        );
      }
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  // Standardize trailing slash
  let cleanPath = pathname;
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  const isMainHub = cleanPath === '/guides/';
  const guideData = GUIDES_CONTENT[cleanPath];

  // WhatsApp custom coordination link
  const whatsappMsg = encodeURIComponent(
    `Hello LeeAutoX! I am reviewing your technical guide on "${guideData?.title || 'Vehicle Importing'}" and would like to ask some questions.`
  );
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${whatsappMsg}`;

  // If viewing the main Hub list
  if (isMainHub) {
    const mainData = SEO_DATA['/guides/'];
    return (
      <div className="min-h-screen bg-background text-foreground">
        <PageHeader 
          title={mainData.heading} 
          subtitle={mainData.description} 
          breadcrumbs={mainData.breadcrumbs} 
        />

        {/* Guides List Grid */}
        <section className={`py-16 px-6 md:px-12 ${
          theme === 'dark' ? 'bg-zinc-950' : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(GUIDES_CONTENT).map(([route, content]) => (
                <div 
                  key={route}
                  className={`p-6 border flex flex-col justify-between transition-all duration-300 hover:border-[#2B59FF]/50 hover:shadow-2xl ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#2B59FF] uppercase font-mono block mb-3">
                      {content.category}
                    </span>
                    <h3 className="font-extrabold text-lg uppercase tracking-tight mb-3 line-clamp-2">
                      {content.title}
                    </h3>
                    <p className={`text-xs mb-6 line-clamp-3 leading-relaxed ${
                      theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
                    }`}>
                      {content.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-800/10 pt-4">
                    <span className="text-[10px] font-mono text-zinc-500">
                      {content.readTime}
                    </span>
                    <Link 
                      to={route}
                      className="text-xs font-extrabold text-[#2B59FF] uppercase tracking-wider flex items-center gap-1 hover:underline"
                    >
                      Read Guide
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // If viewing a specific Guide details
  if (!guideData) {
    // 404 guide fallback
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <h2 className="text-3xl font-black uppercase mb-4">Guide Not Found</h2>
        <Link to="/guides/" className="px-6 py-3 bg-[#2B59FF] text-white font-bold uppercase text-xs tracking-wider">
          Return to Guides Hub
        </Link>
      </div>
    );
  }

  const seoData = SEO_DATA[cleanPath] || SEO_DATA['/guides/'];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={guideData.title} 
        subtitle={`Written by ${guideData.author} | ${guideData.date}`} 
        breadcrumbs={seoData.breadcrumbs} 
      />

      <section className={`py-16 px-6 md:px-12 ${
        theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'
      }`}>
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/guides/" 
            className="inline-flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-wider text-[#2B59FF] hover:underline"
          >
            <ArrowLeft size={14} />
            Back to Guides Hub
          </Link>

          {/* Guide Meta Details */}
          <div className="flex flex-wrap items-center gap-6 mb-10 text-xs font-mono text-zinc-500 border-b pb-6 border-zinc-800/10">
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-[#2B59FF]" />
              <span>{guideData.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#2B59FF]" />
              <span>{guideData.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#2B59FF]" />
              <span>{guideData.readTime}</span>
            </div>
            <span className="bg-[#2B59FF]/10 text-[#2B59FF] px-2 py-1 uppercase text-[9px] font-bold font-mono">
              {guideData.category}
            </span>
          </div>

          {/* Guide Article Body */}
          <div className="prose prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed font-sans">
            {guideData.paragraphs.map((p, index) => {
              if (p.startsWith('## ')) {
                return (
                  <h2 key={index} className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {p.replace('## ', '')}
                  </h2>
                );
              }
              if (p.startsWith('### ')) {
                return (
                  <h3 key={index} className={`text-xl font-bold uppercase mt-8 mb-3 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {p.replace('### ', '')}
                  </h3>
                );
              }
              if (p.startsWith('- ')) {
                return (
                  <ul key={index} className={`list-disc list-inside pl-4 space-y-2 my-4 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                    {p.split('\n').map((li, i) => (
                      <li key={i} className="leading-relaxed">{renderParagraphText(li.replace('- ', ''))}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                  {renderParagraphText(p)}
                </p>
              );
            })}
          </div>

          {/* Dynamic Duty Calculator Mount */}
          {cleanPath.includes('duty-calculator') && (
            <div className="mt-12 border-t pt-12">
              <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-6 font-mono">
                INTERACTIVE WIDGET
              </span>
              <ImportDutyCalculator />
            </div>
          )}

          {/* Related Actions */}
          <div className="mt-16 border-t pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-bold text-lg uppercase mb-1">Have questions about this guide?</h4>
              <p className="text-xs text-zinc-500">Connect directly with our logistics authors for a live consultation.</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#2B59FF] hover:bg-[#1a41cc] text-white font-bold uppercase text-xs tracking-wider flex items-center gap-2"
            >
              <MessageSquare size={14} />
              Inquire via WhatsApp
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
