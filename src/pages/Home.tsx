import Hero from '../components/Hero';
import VehicleCatalogue from '../components/VehicleCatalogue';
import AuctionPreview from '../components/AuctionPreview';
import Marquee from '../components/Marquee';
import WhyChooseUs from '../components/WhyChooseUs';
import WhyCanada from '../components/WhyCanada';
import Services from '../components/Services';
import Fleet from '../components/Fleet';
import AutoStore from '../components/AutoStore';
import Process from '../components/Process';
import LatestArticles from '../components/LatestArticles';
import DeliveriesTimeline from '../components/DeliveriesTimeline';
import Testimonials from '../components/Testimonials';
import InstagramFeed from '../components/InstagramFeed';
import FAQ from '../components/FAQ';
import MapWhatsApp from '../components/MapWhatsApp';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      {/* SECTION 1: Cars for Sale — On Ground in Lagos Nigeria */}
      <VehicleCatalogue />

      {/* SECTION 2: North American Sourcing & Live Copart/IAA Lot Search (relocated above Copart section) */}
      <Hero />

      {/* SECTION 3: Browse Auction Listings (Copart · IAA) */}
      <AuctionPreview />

      <Marquee />
      <WhyChooseUs />
      
      {/* Accessible to Search Bots and Crawlers, Hidden Visually from Frontpage Visitors */}
      <div className="sr-only" aria-hidden="false">
        <WhyCanada />
      </div>

      <Services />
      <Fleet />
      <AutoStore />
      <Process />
      
      {/* Latest Automotive & Shipping Guides (Light Mode by default) */}
      <LatestArticles />
      
      <DeliveriesTimeline />
      <Testimonials />
      <InstagramFeed />
      <FAQ />
      <MapWhatsApp />
      <Contact />
    </>
  );
}
