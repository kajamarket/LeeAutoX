import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import WhyChooseUs from './components/WhyChooseUs';
import Services from './components/Services';
import Fleet from './components/Fleet';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import MapWhatsApp from './components/MapWhatsApp';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <WhyChooseUs />
        <Services />
        <Fleet />
        <Process />
        <Testimonials />
        <FAQ />
        <MapWhatsApp />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

