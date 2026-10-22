import Hero from '../components/Hero';
import VehicleCatalogue from '../components/VehicleCatalogue';
import AuctionPreview from '../components/AuctionPreview';
import Marquee from '../components/Marquee';
import WhatWeDo from '../components/WhatWeDo';
import AutoStore from '../components/AutoStore';
import WhyChooseUs from '../components/WhyChooseUs';
import WhyCanada from '../components/WhyCanada';
import DeliveriesTimeline from '../components/DeliveriesTimeline';
import Testimonials from '../components/Testimonials';
import InstagramFeed from '../components/InstagramFeed';
import LatestArticles from '../components/LatestArticles';
import FAQ from '../components/FAQ';
import MapWhatsApp from '../components/MapWhatsApp';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      {/* SECTION 1: Cars for Sale — On Ground in Lagos Nigeria */}
      <VehicleCatalogue />

      {/* SECTION 2: North American Sourcing & Live Copart/IAA Lot Search */}
      <Hero />

      {/* SECTION 3: Live Auction Cars (Copart · IAA) */}
      <AuctionPreview />

      <Marquee />
      
      {/* Accessible to Search Bots and Crawlers, Hidden Visually from Frontpage Visitors */}
      <div className="sr-only" aria-hidden="false">
        <WhyCanada />
      </div>

      {/* SECTION 5: What We Do (Merged What We Offer & What We Source + How It Works Steps) */}
      <WhatWeDo />

      {/* SECTION 6: Parts & Tools (Moved directly after What We Do) */}
      <AutoStore />

      {/* SECTION 7: Why Choose Us (Moved directly above Verified Deliveries) */}
      <WhyChooseUs />

      {/* SECTION 8: Verified Deliveries */}
      <DeliveriesTimeline />

      {/* SECTION 9: Testimonials */}
      <Testimonials />

      {/* SECTION 10: FAQ */}
      <FAQ />

      {/* SECTION 11: Map & WhatsApp */}
      <MapWhatsApp />

      {/* SECTION 12: Contact */}
      <Contact />

      {/* SECTION 13: Instagram Window (Moved directly above Insights) */}
      <InstagramFeed />

      {/* SECTION 14: Insights / Latest Articles (Very last content section, directly above footer) */}
      <LatestArticles />
    </>
  );
}
