import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ThemeToggle from './components/ThemeToggle';
import WhatsAppFloat from './components/WhatsAppFloat';
import SEOHelmet from './components/SEOHelmet';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { InventoryProvider } from './context/InventoryContext';

// Import Page components
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import TestimonialsPage from './pages/TestimonialsPage';
import GeoPage from './pages/GeoPage';
import VehiclesPage from './pages/VehiclesPage';
import InventoryPage from './pages/InventoryPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import ServicesPage from './pages/ServicesPage';
import GuidesPage from './pages/GuidesPage';
import BlogPage from './pages/BlogPage';
import LeeAutoPage from './pages/LeeAutoPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import AdminBackend from './pages/AdminBackend';
import AuctionSearchPage from './pages/AuctionSearchPage';
import AuctionLotPage from './pages/AuctionLotPage';

// Scroll Restoration Helper Component
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' as any
    });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InventoryProvider>
          <ReviewsProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
              {/* Dynamic Runtime SEO Meta and Schema Manager */}
              <SEOHelmet />
              
              {/* Scroll Restoration across transitions */}
              <ScrollToTopOnNavigate />

              {/* Persistent Shared Header Nav */}
              <Navbar />

              <main>
                <Routes>
                  {/* Primary Pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/about/" element={<AboutPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/how-it-works/" element={<HowItWorksPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/faq/" element={<FAQPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/contact/" element={<ContactPage />} />
                  <Route path="/testimonials" element={<TestimonialsPage />} />
                  <Route path="/testimonials/" element={<TestimonialsPage />} />

                  {/* Inventory & Vehicle Detail Routes */}
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/inventory/" element={<InventoryPage />} />
                  <Route path="/cars-for-sale" element={<InventoryPage />} />
                  <Route path="/cars-for-sale/" element={<InventoryPage />} />
                  <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
                  <Route path="/vehicle/:id/" element={<VehicleDetailPage />} />
                  <Route path="/car/:id" element={<VehicleDetailPage />} />
                  <Route path="/car/:id/" element={<VehicleDetailPage />} />

                  {/* Live Copart & IAAI Auction Search & Lot Routes */}
                  <Route path="/auction-search" element={<AuctionSearchPage />} />
                  <Route path="/auction-search/" element={<AuctionSearchPage />} />
                  <Route path="/auction-search.html" element={<AuctionSearchPage />} />
                  <Route path="/auction-lot" element={<AuctionLotPage />} />
                  <Route path="/auction-lot/" element={<AuctionLotPage />} />
                  <Route path="/auction-lot.html" element={<AuctionLotPage />} />

                  {/* CHANGE 6 — Vehicle Catalogue Admin Portal */}
                  <Route path="/bkend" element={<AdminBackend />} />
                  <Route path="/bkend/" element={<AdminBackend />} />

                  {/* Shareable Client Review Submission Route */}
                  <Route path="/review" element={<SubmitReviewPage />} />
                  <Route path="/review/" element={<SubmitReviewPage />} />

                  {/* Administrator Reviews & Export Portal */}
                  <Route path="/admin/reviews" element={<AdminReviewsPage />} />
                  <Route path="/admin/reviews/" element={<AdminReviewsPage />} />

                  {/* Lee Auto Lagos Subsidiary Page */}
                  <Route path="/lee-auto" element={<LeeAutoPage />} />
                  <Route path="/lee-auto/" element={<LeeAutoPage />} />

                  {/* Sourcing Location Hubs */}
                  <Route path="/nigeria" element={<GeoPage />} />
                  <Route path="/nigeria/" element={<GeoPage />} />
                  <Route path="/nigeria/:region" element={<GeoPage />} />
                  <Route path="/nigeria/:region/" element={<GeoPage />} />

                  <Route path="/ghana" element={<GeoPage />} />
                  <Route path="/ghana/" element={<GeoPage />} />
                  <Route path="/ghana/:region" element={<GeoPage />} />
                  <Route path="/ghana/:region/" element={<GeoPage />} />

                  <Route path="/canada" element={<GeoPage />} />
                  <Route path="/canada/" element={<GeoPage />} />
                  <Route path="/canada/:region" element={<GeoPage />} />
                  <Route path="/canada/:region/" element={<GeoPage />} />

                  {/* Sourced Fleet and Catalogue Pages */}
                  <Route path="/vehicles" element={<VehiclesPage />} />
                  <Route path="/vehicles/" element={<VehiclesPage />} />
                  <Route path="/vehicles/:category" element={<VehiclesPage />} />
                  <Route path="/vehicles/:category/" element={<VehiclesPage />} />

                  {/* Sourcing and Splicing Logistics Services */}
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/" element={<ServicesPage />} />
                  <Route path="/services/:subservice" element={<ServicesPage />} />
                  <Route path="/services/:subservice/" element={<ServicesPage />} />

                  {/* Technical Importing Guides */}
                  <Route path="/guides/nigeria-import-duty-calculator" element={<Navigate to="/nigeria/import-duty-calculator/" replace />} />
                  <Route path="/guides/nigeria-import-duty-calculator/" element={<Navigate to="/nigeria/import-duty-calculator/" replace />} />
                  <Route path="/guides" element={<GuidesPage />} />
                  <Route path="/guides/" element={<GuidesPage />} />
                  <Route path="/guides/:slug" element={<GuidesPage />} />
                  <Route path="/guides/:slug/" element={<GuidesPage />} />

                  {/* Sourcing Insights and Blog Posts */}
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPage />} />
                  <Route path="/blog/:slug/" element={<BlogPage />} />

                  {/* Catch-all Redirect Fallback to Home */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>

              {/* Persistent Shared Footer */}
              <Footer />

              {/* Global Floaters */}
              <ScrollToTop />
              <WhatsAppFloat />
              <ThemeToggle />
            </div>
          </Router>
        </ReviewsProvider>
      </InventoryProvider>
    </AuthProvider>
  </ThemeProvider>
);
}
