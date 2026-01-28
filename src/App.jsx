import React, { useEffect, useState } from 'react';
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

function App() {
  const [deliveryData, setDeliveryData] = useState({ isOpen: false, planName: '', email: '' });

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
    return () => lenis.destroy();
  }, []);

  const handleFulfillment = (planName, email) => {
    setDeliveryData({ isOpen: true, planName, email });
  };

  return (
    <div className="relative min-h-screen">
      <Scene />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Integration />
        <Testimonials />
        <Pricing onFulfillment={handleFulfillment} />
        <FAQ />
        <CTA />
        <Guidelines />
      </main>
      <Footer />
      
      <DeliveryModal 
        isOpen={deliveryData.isOpen} 
        onClose={() => setDeliveryData({ ...deliveryData, isOpen: false })}
        planName={deliveryData.planName}
        email={deliveryData.email}
      />
    </div>
  );
}

export default App;
