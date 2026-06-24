import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import WhyChooseUs from '../components/WhyChooseUs';
import Services from '../components/Services';
import Fleet from '../components/Fleet';
import VehicleCatalogue from '../components/VehicleCatalogue';
import AutoStore from '../components/AutoStore';
import Process from '../components/Process';
import DeliveriesTimeline from '../components/DeliveriesTimeline';
import Testimonials from '../components/Testimonials';
import InstagramFeed from '../components/InstagramFeed';
import FAQ from '../components/FAQ';
import MapWhatsApp from '../components/MapWhatsApp';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <WhyChooseUs />
      <Services />
      <Fleet />
      <VehicleCatalogue />
      <AutoStore />
      <Process />
      <DeliveriesTimeline />
      <Testimonials />
      <InstagramFeed />
      <FAQ />
      <MapWhatsApp />
      <Contact />
    </>
  );
}
