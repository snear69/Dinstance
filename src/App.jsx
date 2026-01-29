import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import Partners from './components/Partners';
import { DocsPage, TermsPage, PrivacyPage } from './pages/Legal';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HomePage = ({ onFulfillment, cart, updateCart }) => (
  <main className="relative z-10">
    <Hero cart={cart} />
    <Stats />
    <Partners />
    <Features />
    <HowItWorks />
    <Integration />
    <Testimonials />
    <Pricing onFulfillment={onFulfillment} cart={cart} updateCart={updateCart} />
    <FAQ />
    <CTA />
    <Guidelines />
  </main>
);

function App() {
  const [deliveryData, setDeliveryData] = useState({ isOpen: false, planName: '', email: '' });
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('oracle_cart');
      return savedCart ? JSON.parse(savedCart) : { planName: '', email: '' };
    } catch {
      return { planName: '', email: '' };
    }
  });

  const updateCart = (data) => {
    setCart(prev => ({ ...prev, ...data }));
  };

  const handleFulfillment = (planName, email) => {
    console.log('APP_DEBUG: Fulfillment triggered for', email);
    setDeliveryData({ isOpen: true, planName, email });
    setCart({ planName: '', email: '' }); // Clear cart on success
    localStorage.removeItem('oracle_cart');
  };

  useEffect(() => {
    localStorage.setItem('oracle_cart', JSON.stringify(cart));
  }, [cart]);

  // Rest of useEffects...
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
    
    // Safety exit for loading screen - background timer
    const timer = setTimeout(() => {
      // Logic handled within LoadingScreen component
    }, 3000);

    return () => {
      lenis.destroy();
      clearTimeout(timer);
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <LoadingScreen />
      
      <div className="relative min-h-screen bg-oracle-dark">
        <Scene />
        <Navbar cart={cart} />
        
        <Routes>
          <Route path="/" element={<HomePage onFulfillment={handleFulfillment} cart={cart} updateCart={updateCart} />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>

        <Footer />
        
        <AnimatePresence>
          {deliveryData.isOpen && (
            <DeliveryModal 
              isOpen={deliveryData.isOpen} 
              onClose={() => setDeliveryData({ ...deliveryData, isOpen: false })}
              planName={deliveryData.planName}
              email={deliveryData.email}
            />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;
