import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import Scene from './components/Scene';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Integration from './components/Integration';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Guidelines from './components/Guidelines';
import Footer from './components/Footer';
import DeliveryModal from './components/DeliveryModal';
import LoadingScreen from './components/LoadingScreen';
import { DocsPage, TermsPage, PrivacyPage } from './pages/Legal';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HomePage = ({ onFulfillment }) => (
  <main>
    <Hero />
    <Stats />
    <Features />
    <HowItWorks />
    <Integration />
    <Testimonials />
    <Pricing onFulfillment={onFulfillment} />
    <FAQ />
    <CTA />
    <Guidelines />
  </main>
);

function App() {
  const [deliveryData, setDeliveryData] = useState({ isOpen: false, planName: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    // Simulate loading finished after the LoadingScreen component handles its own progress
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      lenis.destroy();
      clearTimeout(timer);
    };
  }, []);

  const handleFulfillment = (planName, email) => {
    setDeliveryData({ isOpen: true, planName, email });
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <LoadingScreen />
      <div className={`relative min-h-screen ${loading ? 'overflow-hidden max-h-screen' : ''}`}>
        <Scene />
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage onFulfillment={handleFulfillment} />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>

        <Footer />
        
        <DeliveryModal 
          isOpen={deliveryData.isOpen} 
          onClose={() => setDeliveryData({ ...deliveryData, isOpen: false })}
          planName={deliveryData.planName}
          email={deliveryData.email}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
