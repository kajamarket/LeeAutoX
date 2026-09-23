import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ImportDutyCalculator from '../components/ImportDutyCalculator';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Calendar, User, Clock, ArrowLeft, MessageSquare, ChevronRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Contact from '../components/Contact';
import { cleanPathname } from '../utils/path';

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
    title: 'Importing cars from Canada to Nigeria: full guide',
    author: 'LeeAutoX Logistics Desk',
    readTime: '18 min read',
    date: 'September 2026',
    category: 'Logistics',
    summary: 'The definitive 2026 blueprint detailing ocean shipping, containerization, customs clearance, required documentation, and landed costs when importing cars from Canada to Nigeria.',
    paragraphs: [
      '### Quick answer box\nImporting a vehicle from Canada to Nigeria takes an average of 8 to 12 weeks total: 1 to 2 weeks for dealer auction procurement and Canadian inland transport, 5 to 8 weeks for ocean transit from Halifax or Montreal to Lagos ports (Apapa or Tin Can Island) or Port Harcourt, and 2 to 4 weeks for terminal customs clearance. Standard containerized ocean freight costs approximately C$2,500 to C$3,500 door-to-port per vehicle (reducing when sharing a 40ft container across multiple cars). Statutory Nigerian customs clearance averages approximately 42% to 44% of the vehicle’s CIF value (Cost, Insurance, and Freight), with 43% serving as the reliable working benchmark at the official customs exchange rate (~₦1,400–₦1,450/USD). Form M must be registered with a Nigerian commercial bank prior to vessel departure to avoid severe terminal delays.',
      '> **Key takeaways:**\n- **Transit Times:** 5 to 8 weeks port-to-port ocean freight; 2 to 4 weeks port customs clearance in Lagos.\n- **Departure & Arrival Ports:** Ocean departures sail out of Montreal and Halifax; arrivals discharge at Lagos (Apapa Port or Tin Can Island Port) or Port Harcourt.\n- **Shipping Mode:** Marine container shipping is the industry standard on this route due to restricted RoRo capacity out of Canadian ports.\n- **Freight Cost Range:** Approximately C$2,500 to C$3,500 door-to-port per vehicle in containerized transport (cheaper per car in shared 40ft containers).\n- **Customs Valuation Rate:** Statutory clearing costs average ~43% of CIF value, assessed using the Nigeria Customs official exchange rate (~₦1,400–₦1,450/USD).\n- **Vehicle Age Ceiling:** Under current Nigerian import regulations, passenger vehicles are generally capped at 12 years from manufacture (2014+ for 2026 imports).\n- **Crucial Rule:** Form M must be initiated through a Nigerian commercial bank BEFORE the car sails from Canada to prevent impoundment or terminal demurrage.',
      'Importing a motor vehicle from Canada into Nigeria involves complex maritime logistics, rigorous export filing with the Canada Border Services Agency (CBSA), and precise tariff classification under the Nigeria Customs Service (NCS) Common External Tariff. Navigating this corridor without verified data exposes buyers to costly demurrage, unbudgeted port storage tariffs, and paperwork rejections.',
      'This operational guide provides an authoritative roadmap from Canadian wholesale auction bidding to driving your cleared vehicle out of the port gates in Lagos or Port Harcourt.',
      '## Understanding the 12-Year Vehicle Import Age Limit',
      'Under current Nigerian import regulations, passenger vehicles imported into the country are generally capped at 12 years from the date of manufacture. For import transactions in 2026, motor vehicles manufactured in 2013 or earlier are ineligible for standard commercial import clearance.',
      'Attempting to import an over-age vehicle risks severe customs seizure, denial of Form M approval, or prohibitive penalty levies. To establish model year compliance before bidding on Canadian dealer lots, inspect the 10th character of the 17-digit Vehicle Identification Number (VIN):',
      '- **E:** 2014\n- **F:** 2015\n- **G:** 2016\n- **H:** 2017\n- **J:** 2018\n- **K:** 2019\n- **L:** 2020\n- **M:** 2021\n- **N:** 2022\n- **P:** 2023\n- **R:** 2024\n- **S:** 2025\n- **T:** 2026',
      'Additionally, vehicles carrying a "Certificate of Destruction" or "Non-Repairable" title brand cannot be exported from Canada under CBSA regulations. Always verify title designations before bidding.',
      '## Step 1: Sourcing Through Canadian Dealer-Only Auto Auctions',
      'The highest concentration of clean-title and light-repair salvage inventory in Canada is found across wholesale automotive exchanges: Copart Canada (Cookstown, Bowmanville), Impact Auto Auctions (Oshawa, Stoney Creek, London), and ADESA wholesale dealer auctions in the Greater Toronto Area.',
      'Accessing these dealer platforms requires a licensed commercial automotive brokerage. Buying through unregulated middle-tier classifieds leaves foreign buyers vulnerable to disguised mechanical faults, undisclosed flood damage, or tampered odometers. Partnering with a licensed Canadian corporation (Corporation No: 1761065-3) guarantees broker pricing and legitimate ownership transfer.',
      'Before placing bids, review our [Copart pre-purchase 150-point inspection checklist](/guides/vehicle-inspection-checklist/) and read our [how to buy clean-title and salvage cars on Copart](/blog/how-to-buy-clean-title-salvage-copart/) guide.',
      '## Step 2: Physical Yard Inspection in Ontario and Title Verification',
      'Digital photos rarely tell the complete story of a used vehicle. Auction photos frequently disguise frame rust, salt corrosion from Canadian winter roads, missing catalytic converters, or deployed SRS airbag modules.',
      'LeeAutoX operates from a physical logistics depot at 109 Slan Ave, Scarborough, Ontario. Our mobile inspection technicians inspect auction lots throughout Ontario to conduct hands-on inspections: checking engine compression, scanning OBD2 control units for active diagnostic trouble codes (DTCs), measuring paint depth, and verifying that the provincial vehicle ownership permit (green slip) is free of bank liens.',
      'For salvage vehicles, our mechanics provide an itemized repair estimate so you know the exact restoration budget required prior to export.',
      '## Step 3: Marine Container Shipping vs RoRo from Canada',
      'Once acquired, vehicles are transported via bonded flatbed to staging terminals in Montreal or Halifax—the primary container export hubs on Canada’s Atlantic coast.',
      'While Roll-on/Roll-off (RoRo) exists in international maritime trade, **container shipping is the standard method used on the Canada-to-Nigeria route due to limited RoRo capacity from Canadian ports**. Containerized shipping provides superior cargo protection, zero risk of in-transit pilferage (batteries, navigation screens, spare tires), and allows consolidation of multiple vehicles or spare auto parts.',
      'A dedicated 20ft container carries one vehicle, while a 40ft high-cube container safely accommodates two to four vehicles using heavy-duty timber blocking and nylon wheel harnesses. Sharing a 40ft container across multiple vehicles significantly reduces the per-vehicle freight cost.',
      'Freight charges from Canadian ports to Nigeria run approximately **C$2,500 to C$3,500 door-to-port per vehicle**. Ocean transit from Montreal or Halifax to Lagos ports takes **5 to 8 weeks port-to-port**. For an in-depth breakdown of carrier costs, read our [complete shipping cost from Canada to Nigeria breakdown](/guides/shipping-cost-canada-to-nigeria/) and our guide to [RoRo vs container shipping from Canada to Nigeria](/guides/roro-vs-container-shipping-canada-to-nigeria/).',
      '## Step 4: Mandatory Import Documentation Checklist',
      'To ensure legitimate customs clearance and avoid exorbitant terminal demurrage, importers must prepare seven mandatory regulatory documents:',
      '- **1. Form M (CBN Pre-Import Permit):** **CRITICAL:** Form M must be opened through an authorized Nigerian commercial bank on the CBN Trade Monitoring System (TRMS) **BEFORE the vessel departs Canada**. Failure to open Form M prior to vessel departure is the single most common cause of multi-week port delays and massive customs penalty surcharges.\n- **2. Combined Duty Assessment (CDA):** Generated by the Nigeria Customs Service following electronic VIN declaration and valuation assessment.\n- **3. Original Ocean Bill of Lading (BOL):** Issued by the ocean carrier (e.g., Grimaldi, Maersk, MSC) confirming vessel name, container number, vehicle chassis VIN, and consignee identity.\n- **4. Canadian Vehicle Title / Ownership Certificate:** The provincial vehicle registration document stamped with CBSA export clearance certification.\n- **5. Commercial Invoice and Packing List:** Itemizing the purchase price, vehicle specifications, seller credentials, and marine shipping manifest.\n- **6. Pre-Shipment Inspection Report (CCVO):** Combined Certificate of Value and Origin validating vehicle authenticity.\n- **7. SONCAP Certificate:** Standards Organisation of Nigeria Conformity Assessment Programme documentation confirming regulatory product compliance.',
      '## Step 5: Customs Clearance at Lagos Ports & Fee Structure',
      'Upon container berthing at Lagos (Apapa Port or Tin Can Island Port) or Port Harcourt, terminal clearance typically spans **2 to 4 weeks**, subject to terminal congestion and customs physical examination scheduling.',
      'Statutory clearing costs in Nigeria are calculated as a percentage of the vehicle’s assessed **CIF value (Cost + Insurance + Freight)**. An average of current clearing schedules confirms that total statutory charges (import duty + National Automotive Council levy + VAT + standard port surcharges) average **approximately 42% to 44% of the vehicle CIF value (use 43% as a reliable working midpoint)**.',
      'Importantly, Nigeria Customs calculates CIF valuation in Naira using its own **official customs exchange rate (currently ~₦1,400 to ₦1,450 per US$1)**, which operates independently of commercial interbank or parallel market rates. (Note: duty levies and customs exchange rates adjust periodically per federal circulars).',
      'For transparent calculation examples, compute your vehicle’s exact landing charges on our [Nigeria car import duty calculator](/nigeria/import-duty-calculator/), or read the full fee itemization in our [shipping cost breakdown](/guides/shipping-cost-canada-to-nigeria/).',
      'For local port operations and gate delivery in Lagos, consult our [Lagos port clearing and delivery center](/nigeria/lagos/).',
      '## Step 6: Post-Port Mechanical Preparation & Nationwide Delivery',
      'Salt air exposure, long Atlantic voyages, and weeks in container transit mean imported vehicles require immediate post-clearance servicing before extended road use.',
      'Through our automotive partner in Lagos, [Lee Auto Lagos](/lee-auto/), every imported vehicle undergoes fluid flushing, synthetic oil replenishment, 12V battery deep conditioning, brake pad service, and thorough chassis degreasing to remove maritime salt. Vehicles are then handed over at our Lagos hub (5 Pepple Street, Ikeja) or loaded onto insured interstate car haulers for delivery to Abuja, Port Harcourt, Ibadan, or Enugu.',
      '## Frequently Asked Questions',
      '### How long does it take to ship a car from Canada to Nigeria?\nFrom auction purchase to picking up your cleared vehicle in Lagos, the total timeline averages 8 to 12 weeks: 1 to 2 weeks for auction bidding, title processing, and inland transport to Montreal or Halifax; 5 to 8 weeks for ocean transit; and 2 to 4 weeks for customs clearance at Lagos ports (Apapa or Tin Can Island). Peak terminal congestion can slightly extend clearance times.',
      '### What does it cost to ship a car from Canada to Nigeria?\nShipping a vehicle from Canada to Nigeria involves two primary cost components: ocean freight and destination customs clearance. Door-to-port container freight averages C$2,500 to C$3,500 per vehicle (cheaper per car when consolidating in a shared 40ft container). Nigerian statutory customs clearance averages approximately 42% to 44% of the vehicle’s CIF value (calculated at ~₦1,400–₦1,450/USD customs exchange rate), plus terminal handling and clearing agent fees. For example, a vehicle with a $5,000 CIF value carries approximately ₦3.06M in statutory customs clearance at current rates.',
      '### Why must Form M be opened before the car leaves Canada?\nNigeria Customs regulations mandate that Form M be registered through a Nigerian commercial bank prior to vessel departure. If cargo arrives in Lagos without a pre-validated Form M, the consignment cannot obtain terminal delivery orders, triggering severe customs demurrage, manual penalty assessments, and weeks of port congestion.',
      '### Can I finance my vehicle import with installment payments?\nYes. LeeAutoX provides structured milestone financing: an initial 50% commitment deposit to win the car at auction and secure it in Ontario, 25% upon container loading and ocean bill of lading issuance, and the final 25% upon arrival in Nigeria prior to gate release. Review our [car sourcing installment payment plans](/services/installment-plans/) for full terms.'
    ]
  },
  '/guides/shipping-cost-canada-to-nigeria/': {
    title: 'Cost to Ship a Car from Canada to Nigeria (2026 Breakdown)',
    author: 'LeeAutoX Logistics & Finance Desk',
    readTime: '14 min read',
    date: 'September 2026',
    category: 'Costs & Shipping',
    summary: 'A complete, transparent cost breakdown for shipping and importing vehicles from Canada to Nigeria: C$2,500–C$3,500 container freight, 43% CIF statutory clearing rates, exchange rate realities, and worked examples.',
    paragraphs: [
      '### Quick answer box\nShipping a car from Canada to Nigeria in 2026 costs between C$2,500 and C$3,500 door-to-port for containerized freight, plus destination customs clearance in Nigeria that averages approximately 42% to 44% of the vehicle’s CIF value (Cost, Insurance, and Freight). Under current Nigeria Customs Service rules, 43% serves as the working midpoint for statutory duties. Assessed at the official customs exchange rate (~₦1,400–₦1,450/USD), a mid-size sedan with a $5,000 CIF value carries approximately ₦3.06M in statutory clearing charges. Total landed cost combines vehicle auction price, container freight in CAD, and statutory customs duties in Naira.',
      '> **Key takeaways:**\n- **Container Freight Rate:** C$2,500 to C$3,500 door-to-port per vehicle (from Montreal/Halifax to Lagos/Port Harcourt); significantly lower per unit when sharing a 40ft container.\n- **Statutory Clearing Rate:** ~43% of CIF value (combining 20% basic duty, 15% NAC levy, 4% FOB levy, 7.5% VAT, and statutory port surcharges).\n- **Customs Valuation Rate:** Officially benchmarked by Nigeria Customs at approximately ₦1,400–₦1,450 per US$1—distinct from commercial interbank or parallel market rates.\n- **Worked Example Sedan ($5,000 CIF):** Total clearing cost ~₦3.06M statutory duty + ~C$2,800 freight.\n- **Worked Example SUV ($12,000 CIF):** Total clearing cost ~₦7.35M statutory duty + ~C$3,300 freight.\n- **Rate Notice:** Customs exchange rates and fiscal tariffs adjust periodically; figures shown represent current working market benchmarks.',
      'Importing a car from Canada to Nigeria requires a clear understanding of the mathematical relationship between Canadian dollar freight expenses and Nigerian Naira statutory clearing obligations. Prospective importers who budget using flat estimates frequently suffer from unbudgeted port costs or unexpected terminal demurrage.',
      'This technical guide provides an exhaustive financial breakdown for 2026: explaining container freight economics, decomposing the Nigeria Customs 43% CIF benchmark, displaying worked example calculations for sedans and SUVs, and detailing how to avoid avoidable port charges.',
      '## 1. Canadian Inland Logistics & Ocean Freight Rates (CAD)',
      'The initial phase of your investment takes place in Canadian Dollars (CAD) and covers inland towing from Ontario auction lots, CBSA export declaration processing, and containerized ocean freight across the Atlantic.',
      'Container shipping is the industry standard on the Canada-to-Nigeria corridor due to restricted RoRo carrier schedules departing Canadian Atlantic ports. Current door-to-port freight rates from Canada to Lagos (Apapa or Tin Can Island) or Port Harcourt are:',
      '- **Consolidated 40ft High-Cube Container (Shared Space):** **C$2,500 to C$2,800 per vehicle**. In this model, three or four passenger vehicles share a single 40ft container, securely lashed and blocked with industrial nylon straps and timber framing. Sharing container space reduces ocean freight expenses by 20% to 30% per vehicle without sacrificing cargo security.\n- **Dedicated 20ft Ocean Container (Exclusive):** **C$3,200 to C$3,600 per vehicle**. Recommended for high-value luxury sports sedans, full-size executive SUVs (e.g., Lexus LX600, Range Rover Autobiography), or shipments accompanied by heavy pallets of spare engines and mechanical tools.\n- **Inland Flatbed Towing (Ontario):** **C$150 to C$350** from auction yards across the Greater Toronto Area (Copart Cookstown, Impact Auto Oshawa) to our staging depot at 109 Slan Ave, Scarborough.\n- **CBSA Export Processing & Terminal Staging:** Included in LeeAutoX door-to-port quotes.',
      'To understand why containerization offers superior protection against port pilferage compared to open car decks, read our technical [RoRo vs container shipping from Canada to Nigeria](/guides/roro-vs-container-shipping-canada-to-nigeria/) guide.',
      '## 2. Nigerian Customs Clearing & The 43% CIF Formula',
      'When your shipping container discharges at Lagos or Port Harcourt, clearance takes approximately 2 to 4 weeks. Customs clearing charges are not arbitrary; they are assessed against the vehicle’s **CIF (Cost + Insurance + Freight) value in US Dollars** as calculated under the Nigeria Customs Service electronic VIN valuation database.',
      'Based on an average of current clearing data from leading Nigerian freight forwarding institutions and customs clearing agencies, the total statutory clearance cost averages **approximately 42% to 44% of the vehicle CIF value**. We recommend using **43%** as a reliable single working benchmark.',
      '### Breakdown of Statutory Clearing Components:',
      '- **Basic Import Duty:** 20% of assessed CIF value\n- **National Automotive Council (NAC) Levy:** 15% of assessed CIF value\n- **FOB Port Levy:** 4% applied to the freight value\n- **Value Added Tax (VAT):** 7.5% calculated on the duty subtotal\n- **Terminal Handling & Shipping Line Surcharges:** Standard terminal operator storage, crane handling, and shipping line container release fees',
      '### The Customs Valuation Exchange Rate Distinction',
      'A vital factor in computing landing costs is the foreign exchange rate. Nigeria Customs Service uses its own **official customs valuation exchange rate (currently ~₦1,400 to ₦1,450 per US$1)** to calculate CIF duties on the Single Goods Declaration (SGD). This official customs valuation rate is set by the Central Bank of Nigeria trade portal and does not track parallel black-market or daily retail Bureau de Change rates. Importers should always note that customs exchange rates and duty tariffs are subject to periodic review by fiscal authorities.',
      '## 3. Transparent Calculation Logic & Worked Example Table',
      'To ensure complete transparency, here is the exact mathematical formula used to establish statutory clearing liability:',
      '**Statutory Customs Duty = Vehicle CIF Value (USD) × Customs Exchange Rate (₦/USD) × 0.43**',
      'The table below illustrates side-by-side landing costs for a typical mid-size sedan versus a full-size luxury SUV at current working figures (using ₦1,425/USD customs FX rate):',
      '| Cost Component | Mid-Size Sedan (e.g., 2020 Toyota Camry) | Full-Size SUV (e.g., 2021 Lexus RX350 / Highlander) |\n|---|---|---|\n| Vehicle Auction / CIF Value | US$5,000 (~C$6,800) | US$12,000 (~C$16,300) |\n| Ocean Container Freight (door-to-port) | C$2,800 (~US$2,050) | C$3,300 (~US$2,420) |\n| Customs Exchange Rate (Valuation) | ₦1,425 / US$1 | ₦1,425 / US$1 |\n| Total Assessed CIF in Naira | $5,000 × ₦1,425 = ₦7,125,000 | $12,000 × ₦1,425 = ₦17,100,000 |\n| Statutory Customs Duty (@ 43% CIF) | ₦7,125,000 × 0.43 = **₦3,063,750** | ₦17,100,000 × 0.43 = **₦7,353,000** |\n| Terminal Handling & Clearing Agent Ops | ~₦450,000 | ~₦650,000 |\n| Total Estimated Landed Clearing Cost | **~₦3,513,750** | **~₦8,003,000** |\n| Total Vehicle Investment (Landed) | Vehicle (C$6,800) + Freight (C$2,800) + Clearing (~₦3.51M) | Vehicle (C$16,300) + Freight (C$3,300) + Clearing (~₦8.00M) |',
      '*Note: Duty rates and customs exchange rates fluctuate periodically based on federal circulars. These figures represent current market estimates based on prevailing tariffs.*',
      'Want to calculate landed costs for your specific vehicle make, year, and model in real-time? Open our [interactive Nigeria car import duty calculator](/nigeria/import-duty-calculator/).',
      '## 4. How to Prevent Port Demurrage and Unexpected Surcharges',
      'Terminal demurrage and shipping line detention fees are the primary causes of budget overruns at Lagos ports. Container terminals (APM Terminals Apapa, PTML, TICT) offer limited free storage days (typically 3 to 5 days) after vessel discharge, following which demurrage scales exponentially from ₦30,000 to over ₦70,000 per container per day.',
      'Protect your budget with these three operational safeguards:',
      '- **1. Open Form M Before Vessel Departure:** **Mandatory:** Form M must be registered through an authorized commercial bank in Nigeria before the container departs Canadian waters. Arriving in Nigeria without a registered Form M causes multi-week container holds.\n- **2. Verify VIN on Bill of Lading:** Ensure the chassis number on the bill of lading matches your Canadian ownership title exactly down to every alphanumeric character.\n- **3. Pre-Clear at Destination:** Our dedicated clearing desk at [Lagos Port Clearing & Delivery](/nigeria/lagos/) begins customs manifest processing while the ocean vessel is still in transit, allowing for swift terminal release.',
      '## 5. Pay in Milestones with Naira Financing',
      'To help importers manage cash flow without taking high-interest commercial bank loans, LeeAutoX offers a 3-stage milestone installment structure. Pay a 50% commitment downpayment in Naira to win the car at auction, 25% upon container loading in Scarborough, and the remaining 25% upon arrival in Nigeria. Review our [car sourcing installment payment plans](/services/installment-plans/) to apply.',
      '## Request a Personalized Landed Cost Quote',
      'Do you have an exact vehicle in mind on Copart, Impact Auto, or a Canadian dealership? Contact our team directly on WhatsApp or submit your specifications for an itemized door-to-port quote in CAD and a customs clearing assessment in Naira.',
      'For a complete step-by-step roadmap of the entire import cycle from auction bidding to physical handover, read our [complete guide on importing cars from Canada to Nigeria](/guides/import-car-canada-to-nigeria/).'
    ]
  },
  '/guides/roro-vs-container-shipping-canada-to-nigeria/': {
    title: 'RoRo vs Container Shipping from Canada to Nigeria: Complete Comparison',
    author: 'LeeAutoX Maritime Logistics Desk',
    readTime: '13 min read',
    date: 'September 2026',
    category: 'Maritime Shipping',
    summary: 'A direct technical comparison of Roll-on/Roll-off (RoRo) and container shipping from Canada to Nigeria: security, pilferage risks, spare parts allowances, costs, and Canadian port availability.',
    paragraphs: [
      '### Quick answer box\nWhen shipping cars from Canada to Nigeria, container shipping is the industry standard and most reliable method due to limited RoRo carrier capacity sailing from Canadian Atlantic ports (Halifax and Montreal). Containerized shipping provides complete cargo enclosure with tamper-evident steel bolt seals, eliminating the rampant pilferage risk found on open RoRo car decks. Furthermore, container shipping allows buyers to ship non-running salvage vehicles and pack extra spare engines or body panels—both strictly prohibited on RoRo vessels. Ocean transit for both modes averages 5 to 8 weeks port-to-port to Lagos (Apapa/Tin Can Island) or Port Harcourt.',
      '> **Key takeaways:**\n- **Route Standard:** Marine container shipping is the primary, standard shipping method from Canada to Nigeria because Canadian RoRo departures are infrequent.\n- **Ocean Transit Time:** 5 to 8 weeks port-to-port from Montreal or Halifax to Lagos (Apapa or Tin Can Island) or Port Harcourt.\n- **Security & Pilferage:** Containers are secured with numbered steel bolt seals; RoRo vehicles remain unlocked on open multi-level decks with high theft risks.\n- **Personal Items & Parts:** RoRo strictly prohibits any loose cargo or spare parts; containers allow packing extra engines, gearboxes, panels, and personal effects.\n- **Vehicle Condition:** RoRo strictly mandates running, self-propelled vehicles; containers safely transport salvage, non-runners, and rebuildable auction units.\n- **Cost Efficiency:** Sharing a 40ft high-cube container across multiple cars brings per-vehicle freight costs down to C$2,500–C$2,800 door-to-port.',
      'One of the first critical decisions an auto importer must make when buying vehicles in Canada is choosing between Roll-on/Roll-off (RoRo) and containerized marine transport. While both methods move vehicles across the Atlantic, their operational dynamics, security profiles, and availability out of Canadian ports differ dramatically.',
      'This comparative guide analyzes both shipping mechanisms so you can choose the optimal logistics strategy for your vehicle import.',
      '## 1. What is Roll-on/Roll-off (RoRo) Shipping?',
      'Roll-on/Roll-off vessels are specialized multi-deck cargo ships functioning like massive floating parking garages. Vehicles are driven directly onto the vessel via built-in hydraulic ramps at the departure port and driven off upon arrival at the destination terminal (such as PTML terminal in Lagos).',
      'While RoRo is widely used from select US East Coast ports, **RoRo capacity departing Canadian ports (Montreal and Halifax) is severely limited**. Canadian export volumes to West Africa are overwhelmingly handled through container lines (such as MSC, Maersk, and Hapag-Lloyd) operating frequent, scheduled weekly container services.',
      '## 2. What is Containerized Auto Shipping?',
      'In container shipping, vehicles are transported inside heavy-gauge corrugated steel marine containers (20-foot standard or 40-foot high-cube units). Vehicles are driven or winched inside, securely blocked with heavy structural timber, and strapped to the floor deck using high-tensile nylon wheel harnesses.',
      'Once loaded, the container doors are closed and sealed with a heavy-duty numbered steel bolt seal. The seal number is recorded on the ocean Bill of Lading and cannot be opened until customs inspection at Apapa Port or Tin Can Island Port in Lagos.',
      'LeeAutoX operates a consolidation hub in Scarborough, Ontario, where our certified rigging crew consolidates up to four vehicles into a single 40ft container, dramatically lowering the freight cost per vehicle.',
      '## 3. Side-by-Side Comparison: RoRo vs Container Shipping',
      'The table below compares the critical operational factors between RoRo and containerized vehicle shipping from Canada to Nigeria:',
      '| Feature / Factor | Roll-on/Roll-off (RoRo) | Marine Container Shipping (Standard) |\n|---|---|---|\n| **Canadian Port Availability** | Very Limited (infrequent departures from Halifax) | **High Availability** (weekly scheduled departures from Montreal & Halifax) |\n| **Ocean Transit Time** | 5 to 8 weeks port-to-port | **5 to 8 weeks port-to-port** |\n| **Pilferage & Theft Security** | **High Risk:** Keys stay in ignition; open access on decks; high incidence of stolen batteries, side mirrors, multimedia screens, and spare tires | **Maximum Security:** Tamper-evident steel bolt seal; completely enclosed in steel; zero access by port dockers in transit |\n| **Spare Parts & Personal Items** | **Strictly Forbidden:** Carriers inspect interiors and will seize cargo or reject the car at the dock | **Permitted:** Ample space to pack replacement engines, transmissions, bumpers, suspension kits, or cargo |\n| **Vehicle Operational State** | **Must be 100% Running:** Engine, transmission, and brakes must function; non-runners rejected | **Accepts Any Condition:** Clean titles, repairable salvage, flood, or non-runners loaded via forklift/winch |\n| **Freight Cost per Vehicle** | ~C$2,400 – C$2,900 (when available) | **C$2,500 – C$2,800** (shared 40ft container) / C$3,200 – C$3,600 (dedicated 20ft) |\n| **Discharge Terminals in Lagos** | PTML Terminal (Tin Can) | **Apapa Port (APM Terminals) & Tin Can Island** |\n| **Weather & Salt Exposure** | Exposed to marine spray and dock elements during loading | **100% Protected** against Atlantic marine salt spray and humidity |',
      '## 4. The Cargo Security & Pilferage Factor',
      'For Nigerian buyers, security is often the deciding factor. RoRo vessels require vehicles to remain operational and unlocked throughout transit. Port handlers, dockworkers, and vessel crews have physical access to vehicle interiors during loading, Atlantic passage, and terminal maneuvering.',
      'As a result, RoRo consignments historically suffer from high rates of pilferage: stolen catalytic converters, factory navigation head units, digital dashboards, spare tires, jack sets, and side mirrors. In contrast, **container shipping provides an airtight chain of custody**. Once sealed at our Scarborough depot, the container remains locked until your licensed clearing agent breaks the bolt seal in the presence of Nigeria Customs officers.',
      '## 5. Shipping Spare Parts and Multiple Consignments',
      'If you are purchasing a light salvage vehicle from Copart or Impact Auto, you will often want to buy replacement parts (OEM fenders, headlights, radiators, control arms) in Canada to avoid high prices in Lagos.',
      'Under international maritime regulations, **RoRo carriers strictly prohibit loose cargo inside vehicles**. If personal goods or spare parts are detected inside a RoRo car, shipping lines will reject the vehicle at the gate or confiscate the items at the terminal.',
      'Container shipping completely eliminates this restriction. In a consolidated container, importers can pack spare parts, engine blocks, replacement doors, and personal cargo safely alongside their vehicle, saving thousands of dollars in separate air cargo fees.',
      '## 6. Sourcing Non-Running Salvage Vehicles',
      'Many of the best auction deals on Canadian dealer lots carry mechanical defects, dead batteries, or light collision damage that temporarily prevents them from starting. RoRo vessels strictly refuse any vehicle that cannot drive onto the vessel ramps under its own mechanical power.',
      'With container shipping, our Scarborough rigging team uses heavy-duty winches, dollies, and forklifts to carefully position and secure non-running vehicles inside the container. This allows importers to capitalize on deeply discounted auction salvage units that RoRo buyers cannot touch.',
      'For guidance on evaluating auction titles and bidding on repairable units, review our guide on [how to buy clean-title and salvage cars on Copart](/blog/how-to-buy-clean-title-salvage-copart/).',
      '## 7. Ocean Freight Costs and Transit Times',
      'Ocean transit times between Canadian East Coast ports (Halifax, Montreal) and Nigerian ports (Lagos Apapa, Tin Can, Port Harcourt) range between **5 and 8 weeks port-to-port**.',
      'While RoRo occasionally seems marginally cheaper on a base ocean freight quote, the frequent loss of stolen components and lack of Canadian port availability makes container consolidation far more cost-effective. Sharing a 40ft container with other vetted vehicles brings your door-to-port freight cost down to **C$2,500 to C$2,800 per vehicle**.',
      'To review itemized landing costs, customs valuation, and statutory clearing duties (~43% of CIF), consult our [complete shipping cost breakdown](/guides/shipping-cost-canada-to-nigeria/) and run our [Nigeria car import duty calculator](/nigeria/import-duty-calculator/).',
      '## Summary: Why LeeAutoX Standardizes on Containerization',
      'Because of superior cargo security, weekly vessel availability from Canadian ports, the ability to pack spare parts, and compatibility with salvage auction vehicles, **LeeAutoX utilizes containerized shipping as our core freight standard from Canada to Nigeria**.',
      'If you are ready to source a clean or repairable vehicle from Canadian auctions, contact our logistics desk. We will evaluate auction listings, inspect the car in person, load it in a secure container, and clear it safely through Lagos ports.',
      'For complete end-to-end guidance through the full import pipeline, read our [complete guide on importing cars from Canada to Nigeria](/guides/import-car-canada-to-nigeria/).'
    ]
  },
  '/guides/why-import-cars-from-canada/': {
    title: 'Why Import Vehicles From Canada? Complete 2026 Quality & Cost Guide',
    author: 'LeeAutoX Automotive Procurement & Quality Desk',
    readTime: '14 min read',
    date: 'September 2026',
    category: 'Procurement & Quality',
    summary: 'Discover why sourcing used vehicles from Canada provides superior mechanical reliability, strict MTO safety standards, transparent Carfax tracking, advanced road brine protection, and favorable currency exchange rates compared to other import markets.',
    paragraphs: [
      '### Quick answer box\nImporting used vehicles from Canada gives international buyers from Nigeria, Ghana, and West Africa distinct mechanical and economic advantages over unregulated markets. Vehicles in Ontario and other Canadian provinces must undergo rigorous Ministry of Transportation (MTO) Safety Standard inspections by certified technicians before ownership transfer. Additionally, modern Canadian road maintenance employs liquid anti-icing brines and corrosion inhibitors rather than raw rock salt, while proactive Canadian vehicle owners routinely apply undercarriage rust-proofing (Krown, Rust Check). Combined with transparent Carfax Canada/UVIP title logging, favorable Canadian Dollar (CAD) exchange rates, and licensed dealer-only wholesale auction access, Canadian vehicle imports represent the gold standard in value and mechanical integrity.',
      '> **Key takeaways:**\n- **MTO Safety Standards:** Canadian vehicles require exhaustive provincial safety certification covering structural frame, suspension, steering, and braking systems.\n- **Modern Salt Management:** Canadian transit departments have transitioned to liquid anti-icing brines with corrosion inhibitors; routine annual oil-based rust treatments keep vehicle undercarriages clean and rust-free.\n- **Zero Mileage Fraud:** Carfax Canada and provincial Used Vehicle Information Packages (UVIP) record odometer readings at every annual registration, emissions check, and maintenance event, eliminating rollback fraud.\n- **CAD Currency Advantage:** Buying auction inventory priced in Canadian Dollars (CAD) delivers superior purchasing power compared to high US Dollar (USD) valuation.\n- **Wholesale Auction Access:** Buyers gain access to premium dealer-only auctions across Copart Canada, Impact Auto Auctions (IAAI Canada), and Manheim wholesale rings.\n- **Reliable Container Shipping:** Direct scheduled marine container departures sail weekly out of Montreal and Halifax directly to Lagos (Apapa/Tin Can) and Tema in 5 to 8 weeks.\n- **Dual Corporate Trust:** LeeAutoX is an incorporated Canadian corporation (Corporation No: 1761065-3) in Scarborough, Ontario, with a fully staffed consultation and handover office in Ikeja, Lagos.',
      'For decades, auto importers in West Africa looked predominantly toward US coastal auction yards for used vehicles. However, a growing number of discerning buyers, fleet managers, and retail dealerships are turning their focus to Canada.',
      'This comprehensive guide breaks down the technical, financial, and legal reasons why Canadian vehicles offer unmatched reliability and value for auto importers.',
      '## 1. Rigorous Ministry of Transportation (MTO) Safety Certifications',
      'In Ontario—Canada\'s primary automotive hub—a vehicle cannot be legally registered or transferred without passing an exhaustive Ministry of Transportation (MTO) Safety Standard Certificate (SSC) inspection.',
      'Unlike unregulated regions where cars are passed with cosmetic checks, Ontario licensed mechanics must put the vehicle on a hydraulic hoist and test every critical mechanical and safety system against strict provincial standards:',
      '- **Braking Systems:** Minimum brake pad lining thickness, rotor runout limits, hydraulic line integrity, and ABS sensor operation.',
      '- **Steering & Suspension:** Ball joints, tie-rod ends, control arm bushings, strut assemblies, and power steering rack seals must show zero hazardous play.',
      '- **Structural Frame Integrity:** Hoist inspection of subframe rails, floor pans, rocker panels, and cross-members to guarantee the vehicle has not suffered catastrophic frame rot or unibody twisting.',
      '- **Lighting, Tires, & Restraints:** All factory airbags, seatbelt pre-tensioners, tire tread depths, and illumination systems must operate according to OEM specifications.',
      'When you procure a vehicle in Canada through LeeAutoX, you receive a vehicle vetted against these high regulatory standards.',
      '## 2. Winter Road Salt: The Myth vs Reality of Modern Canadian Maintenance',
      'A common misconception among first-time importers is that Canadian winter weather automatically leaves vehicles severely corroded. In reality, modern automotive manufacturing and Canadian winter road maintenance have evolved dramatically:',
      '- **Liquid Anti-Icing Brine Solutions:** Canadian municipal and provincial transport ministries have largely replaced coarse, abrasive rock salt with modern liquid anti-icing brines (such as calcium magnesium acetate and corrosion-inhibited salt brines). These solutions are applied before snowfall, minimizing abrasive splashing against vehicle bodies.',
      '- **Factory Galvanized Zinc Coatings:** Vehicles manufactured over the last 15 years feature double-sided galvanized steel sheet metal and electrostatic e-coat primers applied by automakers, preventing rust from penetrating bare steel.',
      '- **Annual Oil-Based Rust Protection:** A large percentage of Canadian car owners have their vehicles treated annually with specialized creeping oil rust-proofing (such as Krown Rust Control or Rust Check). These formulations displace water, penetrate hidden crevices, and seal the chassis against humidity and oxidation.',
      'At LeeAutoX, our mobile inspection technicians put every auction vehicle on a lift or inspect the undercarriage with high-intensity diagnostic mirrors to verify clean, solid floorboards and subframes before placing bids.',
      '## 3. Uncompromised Title Transparency & Carfax Canada Records',
      'Odometer tampering and undisclosed flood or collision salvage represent the greatest risks in foreign vehicle purchasing. The Canadian regulatory framework virtually eliminates these risks through centralized provincial data tracking.',
      'In Ontario, every private and commercial sale requires a Used Vehicle Information Package (UVIP) issued by the Ministry of Transportation. Furthermore, **Carfax Canada** integrates provincial police collision logs, certified service centers, insurance company appraisal claims, and registration renewals.',
      'Every time a vehicle enters an authorized garage for an oil change, tire rotation, or safety inspection, its exact odometer reading is recorded in the permanent digital registry. Importers can cross-verify the vehicle\'s current mileage with historical records dating back to its original pre-delivery inspection.',
      '## 4. The Canadian Dollar (CAD) Financial Advantage',
      'For international buyers funding transactions from Naira (NGN), Ghanaian Cedis (GHS), or British Pounds (GBP), purchasing vehicles priced in Canadian Dollars (CAD) provides a significant economic edge over US Dollar (USD) transactions.',
      'Historically, the Canadian Dollar trades at a 25% to 35% discount against the US Dollar. For example, a wholesale vehicle selling for C$10,000 in Ontario translates to approximately US$7,300. This currency valuation differential allows buyers to secure newer, lower-mileage vehicles for the exact same budget.',
      'To calculate your exact landed cost including clearing duty, visit our [Nigeria car import duty calculator](/nigeria/import-duty-calculator/) or consult our [complete shipping cost breakdown](/guides/shipping-cost-canada-to-nigeria/).',
      '## 5. Wholesale Access to Canada\'s Premier Auction Networks',
      'Through LeeAutoX\'s licensed corporate dealership credentials, importers gain direct access to wholesale dealer-only auction platforms across Canada:',
      '- **Copart Canada:** Cookstown, Bowmanville, London, and Montreal yards offering late-model insurance fleet units, clean titles, and repairable salvage vehicles.',
      '- **Impact Auto Auctions (IAAI Canada):** Stoney Creek, Oshawa, and Hamilton locations specializing in lightly damaged, run-and-drive insurance recoveries.',
      '- **Manheim Canada:** Exclusive dealer-only auctions featuring off-lease corporate fleets, bank repossessions, and certified dealer trade-ins.',
      'Learn more about our proxy bidding protocols in our [auction bidding service guide](/services/auction-bidding/) and review our [Copart pre-purchase inspection checklist](/guides/vehicle-inspection-checklist/).',
      '## 6. Marine Shipping & Direct Atlantic Transit to West Africa',
      'Canada\'s Atlantic ports—Halifax, Nova Scotia, and Montreal, Quebec—feature direct maritime shipping lanes to West Africa. LeeAutoX standardizes on containerized marine freight, loading vehicles into heavy-gauge steel containers with timber blocking and nylon wheel harnesses.',
      'Ocean transit from Montreal or Halifax to Lagos (Apapa Port or Tin Can Island) or Tema Port in Ghana averages **5 to 8 weeks port-to-port**. Containers are locked with numbered steel bolt seals, ensuring that your vehicle, spare parts, and accessories arrive completely protected from marine spray and dockside pilferage.',
      'For a detailed comparison of shipping methods, read our comprehensive [RoRo vs container shipping guide](/guides/roro-vs-container-shipping-canada-to-nigeria/).',
      '## 7. Dual Corporate Accountability: Canada and Nigeria',
      'One of the greatest fears for auto importers is dealing with anonymous online brokers. LeeAutoX bridges this gap with verifiable physical corporate operations in both Canada and Nigeria:',
      '- **Canadian Logistics Hub:** Incorporated in Ontario as LeeAutoX Inc. (Corporation No: 1761065-3), our depot is situated at **109 Slan Ave, Scarborough, ON M1G 3B7**, handling vehicle consolidation, flatbed transport, and export compliance with the Canada Border Services Agency (CBSA).',
      '- **Nigerian Handover Office:** Our verified liaison office is located at **5 Pepple Street, Computer Village, Ikeja, Lagos**, providing client consultation, payment receipts, customs document verification, and physical vehicle handover.',
      'We also offer flexible financing through our [Naira milestone installment plans](/services/installment-plans/), allowing buyers to secure auction deals with an initial 50% commitment downpayment.',
      '## Summary: Sourcing With Confidence Through LeeAutoX',
      'When you import a vehicle from Canada with LeeAutoX, you benefit from strict MTO safety standards, verified Carfax histories, modern rust protection, CAD currency savings, and direct containerized ocean freight.',
      'To begin your procurement journey or request a custom vehicle quote, contact our logistics desk today.',
      'For complete end-to-end guidance, read our [complete guide on importing cars from Canada to Nigeria](/guides/import-car-canada-to-nigeria/) or check out our [tokunbo buyers guide](/guides/tokunbo-buyers-guide/).'
    ]
  },
  '/guides/why-import-vehicles-from-canada/': {
    title: 'Why Import Vehicles From Canada? Complete 2026 Quality & Cost Guide',
    author: 'LeeAutoX Automotive Procurement & Quality Desk',
    readTime: '14 min read',
    date: 'September 2026',
    category: 'Procurement & Quality',
    summary: 'Discover why sourcing used vehicles from Canada provides superior mechanical reliability, strict MTO safety standards, transparent Carfax tracking, advanced road brine protection, and favorable currency exchange rates compared to other import markets.',
    paragraphs: [
      '### Quick answer box\nImporting used vehicles from Canada gives international buyers from Nigeria, Ghana, and West Africa distinct mechanical and economic advantages over unregulated markets. Vehicles in Ontario and other Canadian provinces must undergo rigorous Ministry of Transportation (MTO) Safety Standard inspections by certified technicians before ownership transfer. Additionally, modern Canadian road maintenance employs liquid anti-icing brines and corrosion inhibitors rather than raw rock salt, while proactive Canadian vehicle owners routinely apply undercarriage rust-proofing (Krown, Rust Check). Combined with transparent Carfax Canada/UVIP title logging, favorable Canadian Dollar (CAD) exchange rates, and licensed dealer-only wholesale auction access, Canadian vehicle imports represent the gold standard in value and mechanical integrity.',
      '> **Key takeaways:**\n- **MTO Safety Standards:** Canadian vehicles require exhaustive provincial safety certification covering structural frame, suspension, steering, and braking systems.\n- **Modern Salt Management:** Canadian transit departments have transitioned to liquid anti-icing brines with corrosion inhibitors; routine annual oil-based rust treatments keep vehicle undercarriages clean and rust-free.\n- **Zero Mileage Fraud:** Carfax Canada and provincial Used Vehicle Information Packages (UVIP) record odometer readings at every annual registration, emissions check, and maintenance event, eliminating rollback fraud.\n- **CAD Currency Advantage:** Buying auction inventory priced in Canadian Dollars (CAD) delivers superior purchasing power compared to high US Dollar (USD) valuation.\n- **Wholesale Auction Access:** Buyers gain access to premium dealer-only auctions across Copart Canada, Impact Auto Auctions (IAAI Canada), and Manheim wholesale rings.\n- **Reliable Container Shipping:** Direct scheduled marine container departures sail weekly out of Montreal and Halifax directly to Lagos (Apapa/Tin Can) and Tema in 5 to 8 weeks.\n- **Dual Corporate Trust:** LeeAutoX is an incorporated Canadian corporation (Corporation No: 1761065-3) in Scarborough, Ontario, with a fully staffed consultation and handover office in Ikeja, Lagos.',
      'For decades, auto importers in West Africa looked predominantly toward US coastal auction yards for used vehicles. However, a growing number of discerning buyers, fleet managers, and retail dealerships are turning their focus to Canada.',
      'This comprehensive guide breaks down the technical, financial, and legal reasons why Canadian vehicles offer unmatched reliability and value for auto importers.',
      '## 1. Rigorous Ministry of Transportation (MTO) Safety Certifications',
      'In Ontario—Canada\'s primary automotive hub—a vehicle cannot be legally registered or transferred without passing an exhaustive Ministry of Transportation (MTO) Safety Standard Certificate (SSC) inspection.',
      'Unlike unregulated regions where cars are passed with cosmetic checks, Ontario licensed mechanics must put the vehicle on a hydraulic hoist and test every critical mechanical and safety system against strict provincial standards:',
      '- **Braking Systems:** Minimum brake pad lining thickness, rotor runout limits, hydraulic line integrity, and ABS sensor operation.',
      '- **Steering & Suspension:** Ball joints, tie-rod ends, control arm bushings, strut assemblies, and power steering rack seals must show zero hazardous play.',
      '- **Structural Frame Integrity:** Hoist inspection of subframe rails, floor pans, rocker panels, and cross-members to guarantee the vehicle has not suffered catastrophic frame rot or unibody twisting.',
      '- **Lighting, Tires, & Restraints:** All factory airbags, seatbelt pre-tensioners, tire tread depths, and illumination systems must operate according to OEM specifications.',
      'When you procure a vehicle in Canada through LeeAutoX, you receive a vehicle vetted against these high regulatory standards.',
      '## 2. Winter Road Salt: The Myth vs Reality of Modern Canadian Maintenance',
      'A common misconception among first-time importers is that Canadian winter weather automatically leaves vehicles severely corroded. In reality, modern automotive manufacturing and Canadian winter road maintenance have evolved dramatically:',
      '- **Liquid Anti-Icing Brine Solutions:** Canadian municipal and provincial transport ministries have largely replaced coarse, abrasive rock salt with modern liquid anti-icing brines (such as calcium magnesium acetate and corrosion-inhibited salt brines). These solutions are applied before snowfall, minimizing abrasive splashing against vehicle bodies.',
      '- **Factory Galvanized Zinc Coatings:** Vehicles manufactured over the last 15 years feature double-sided galvanized steel sheet metal and electrostatic e-coat primers applied by automakers, preventing rust from penetrating bare steel.',
      '- **Annual Oil-Based Rust Protection:** A large percentage of Canadian car owners have their vehicles treated annually with specialized creeping oil rust-proofing (such as Krown Rust Control or Rust Check). These formulations displace water, penetrate hidden crevices, and seal the chassis against humidity and oxidation.',
      'At LeeAutoX, our mobile inspection technicians put every auction vehicle on a lift or inspect the undercarriage with high-intensity diagnostic mirrors to verify clean, solid floorboards and subframes before placing bids.',
      '## 3. Uncompromised Title Transparency & Carfax Canada Records',
      'Odometer tampering and undisclosed flood or collision salvage represent the greatest risks in foreign vehicle purchasing. The Canadian regulatory framework virtually eliminates these risks through centralized provincial data tracking.',
      'In Ontario, every private and commercial sale requires a Used Vehicle Information Package (UVIP) issued by the Ministry of Transportation. Furthermore, **Carfax Canada** integrates provincial police collision logs, certified service centers, insurance company appraisal claims, and registration renewals.',
      'Every time a vehicle enters an authorized garage for an oil change, tire rotation, or safety inspection, its exact odometer reading is recorded in the permanent digital registry. Importers can cross-verify the vehicle\'s current mileage with historical records dating back to its original pre-delivery inspection.',
      '## 4. The Canadian Dollar (CAD) Financial Advantage',
      'For international buyers funding transactions from Naira (NGN), Ghanaian Cedis (GHS), or British Pounds (GBP), purchasing vehicles priced in Canadian Dollars (CAD) provides a significant economic edge over US Dollar (USD) transactions.',
      'Historically, the Canadian Dollar trades at a 25% to 35% discount against the US Dollar. For example, a wholesale vehicle selling for C$10,000 in Ontario translates to approximately US$7,300. This currency valuation differential allows buyers to secure newer, lower-mileage vehicles for the exact same budget.',
      'To calculate your exact landed cost including clearing duty, visit our [Nigeria car import duty calculator](/nigeria/import-duty-calculator/) or consult our [complete shipping cost breakdown](/guides/shipping-cost-canada-to-nigeria/).',
      '## 5. Wholesale Access to Canada\'s Premier Auction Networks',
      'Through LeeAutoX\'s licensed corporate dealership credentials, importers gain direct access to wholesale dealer-only auction platforms across Canada:',
      '- **Copart Canada:** Cookstown, Bowmanville, London, and Montreal yards offering late-model insurance fleet units, clean titles, and repairable salvage vehicles.',
      '- **Impact Auto Auctions (IAAI Canada):** Stoney Creek, Oshawa, and Hamilton locations specializing in lightly damaged, run-and-drive insurance recoveries.',
      '- **Manheim Canada:** Exclusive dealer-only auctions featuring off-lease corporate fleets, bank repossessions, and certified dealer trade-ins.',
      'Learn more about our proxy bidding protocols in our [auction bidding service guide](/services/auction-bidding/) and review our [Copart pre-purchase inspection checklist](/guides/vehicle-inspection-checklist/).',
      '## 6. Marine Shipping & Direct Atlantic Transit to West Africa',
      'Canada\'s Atlantic ports—Halifax, Nova Scotia, and Montreal, Quebec—feature direct maritime shipping lanes to West Africa. LeeAutoX standardizes on containerized marine freight, loading vehicles into heavy-gauge steel containers with timber blocking and nylon wheel harnesses.',
      'Ocean transit from Montreal or Halifax to Lagos (Apapa Port or Tin Can Island) or Tema Port in Ghana averages **5 to 8 weeks port-to-port**. Containers are locked with numbered steel bolt seals, ensuring that your vehicle, spare parts, and accessories arrive completely protected from marine spray and dockside pilferage.',
      'For a detailed comparison of shipping methods, read our comprehensive [RoRo vs container shipping guide](/guides/roro-vs-container-shipping-canada-to-nigeria/).',
      '## 7. Dual Corporate Accountability: Canada and Nigeria',
      'One of the greatest fears for auto importers is dealing with anonymous online brokers. LeeAutoX bridges this gap with verifiable physical corporate operations in both Canada and Nigeria:',
      '- **Canadian Logistics Hub:** Incorporated in Ontario as LeeAutoX Inc. (Corporation No: 1761065-3), our depot is situated at **109 Slan Ave, Scarborough, ON M1G 3B7**, handling vehicle consolidation, flatbed transport, and export compliance with the Canada Border Services Agency (CBSA).',
      '- **Nigerian Handover Office:** Our verified liaison office is located at **5 Pepple Street, Computer Village, Ikeja, Lagos**, providing client consultation, payment receipts, customs document verification, and physical vehicle handover.',
      'We also offer flexible financing through our [Naira milestone installment plans](/services/installment-plans/), allowing buyers to secure auction deals with an initial 50% commitment downpayment.',
      '## Summary: Sourcing With Confidence Through LeeAutoX',
      'When you import a vehicle from Canada with LeeAutoX, you benefit from strict MTO safety standards, verified Carfax histories, modern rust protection, CAD currency savings, and direct containerized ocean freight.',
      'To begin your procurement journey or request a custom vehicle quote, contact our logistics desk today.',
      'For complete end-to-end guidance, read our [complete guide on importing cars from Canada to Nigeria](/guides/import-car-canada-to-nigeria/) or check out our [tokunbo buyers guide](/guides/tokunbo-buyers-guide/).'
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

  // Render text containing markdown links [text](url) and bold **text**
  const renderParagraphText = (text: string) => {
    const parseBold = (subStr: string, keyPrefix: string): React.ReactNode[] => {
      const subParts: React.ReactNode[] = [];
      let subLastIndex = 0;
      let subMatch;
      const subBoldRegex = /\*\*([^*]+)\*\*/g;
      
      while ((subMatch = subBoldRegex.exec(subStr)) !== null) {
        const subMatchIndex = subMatch.index;
        if (subMatchIndex > subLastIndex) {
          subParts.push(subStr.substring(subLastIndex, subMatchIndex));
        }
        const boldText = subMatch[1];
        subParts.push(
          <strong key={`${keyPrefix}-b-${subMatchIndex}`} className="font-extrabold text-[#2B59FF]">
            {boldText}
          </strong>
        );
        subLastIndex = subBoldRegex.lastIndex;
      }
      if (subLastIndex < subStr.length) {
        subParts.push(subStr.substring(subLastIndex));
      }
      return subParts;
    };

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        const plainText = text.substring(lastIndex, matchIndex);
        parts.push(...parseBold(plainText, `p-${matchIndex}`));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      
      const key = `l-${matchIndex}`;
      if (linkUrl.startsWith('/') && !linkUrl.startsWith('//')) {
        parts.push(
          <Link key={key} to={linkUrl} className="text-[#2B59FF] font-semibold underline hover:text-[#1a41cc] transition-colors">
            {linkText}
          </Link>
        );
      } else {
        parts.push(
          <a key={key} href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-[#2B59FF] font-semibold underline hover:text-[#1a41cc] transition-colors">
            {linkText}
          </a>
        );
      }
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(...parseBold(text.substring(lastIndex), 'p-end'));
    }
    return parts.length > 0 ? parts : text;
  };

  // Standardize trailing slash
  let cleanPath = cleanPathname(pathname);
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
                    <h3 className={`font-extrabold text-lg uppercase tracking-tight mb-3 line-clamp-2 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-950'
                    }`}>
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
              if (p.startsWith('### Quick answer box')) {
                return (
                  <div key={index} className={`p-6 border-l-4 border-[#2B59FF] my-6 rounded-r ${theme === 'dark' ? 'bg-zinc-900/90 text-zinc-200' : 'bg-blue-50/70 text-slate-800'}`}>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2B59FF] block mb-2">QUICK ANSWER</span>
                    <p className="text-sm md:text-base leading-relaxed">{renderParagraphText(p.replace('### Quick answer box\n', ''))}</p>
                  </div>
                );
              }
              if (p.startsWith('> **Key takeaways:**')) {
                const items = p.replace('> **Key takeaways:**\n', '').split('\n').filter(Boolean);
                return (
                  <aside key={index} aria-label="summary" className={`p-6 border my-6 rounded ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2B59FF] block mb-3">KEY TAKEAWAYS</span>
                    <ul className="space-y-2 text-xs md:text-sm">
                      {items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#2B59FF] font-bold">•</span>
                          <span>{renderParagraphText(it.replace('- ', ''))}</span>
                        </li>
                      ))}
                    </ul>
                  </aside>
                );
              }
              if (p.startsWith('## ')) {
                return (
                  <h2 key={index} className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {p.replace('## ', '')}
                  </h2>
                );
              }
              if (p.startsWith('### ')) {
                const parts = p.split('\n');
                return (
                  <div key={index} className="my-4">
                    <h3 className={`text-xl font-bold uppercase mt-8 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {parts[0].replace('### ', '')}
                    </h3>
                    {parts.slice(1).map((subP, subI) => (
                      <p key={subI} className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                        {renderParagraphText(subP)}
                      </p>
                    ))}
                  </div>
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
              if (p.startsWith('|')) {
                const rows = p.split('\n').filter(r => r.trim().startsWith('|'));
                if (rows.length >= 2) {
                  const parseCells = (rowStr: string) => 
                    rowStr.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
                  const headers = parseCells(rows[0]);
                  const dataRows = rows.slice(2).map(parseCells);

                  return (
                    <div key={index} className="overflow-x-auto my-6 rounded border border-zinc-700/30">
                      <table className="w-full text-left text-xs md:text-sm border-collapse">
                        <thead>
                          <tr className={theme === 'dark' ? 'bg-zinc-900 border-b border-zinc-800 text-white' : 'bg-slate-100 border-b border-slate-300 text-slate-900'}>
                            {headers.map((h, hi) => (
                              <th key={hi} className="p-3.5 font-bold uppercase tracking-wide text-xs">
                                {renderParagraphText(h)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                          {dataRows.map((dr, ri) => (
                            <tr key={ri} className={theme === 'dark' ? 'hover:bg-zinc-900/60 text-zinc-300' : 'hover:bg-slate-50 text-slate-800'}>
                              {dr.map((c, ci) => (
                                <td key={ci} className="p-3.5 align-top">
                                  {renderParagraphText(c)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
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
          <div className="mt-16 border-t pt-10">
            <WhatsAppCTA 
              message={`Hello LeeAutoX! I am reviewing your technical guide on "${guideData?.title || 'Vehicle Importing'}" and would like to ask some questions.`}
              title="Have questions about this guide?"
              subtitle="Connect directly with our logistics authors for a live consultation."
            />
          </div>

        </div>
      </section>

      <Contact />
    </div>
  );
}
