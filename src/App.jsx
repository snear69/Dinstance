import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

// Context Providers (Trigger Redeploy)
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Components
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

// Pages
import { DocsPage, TermsPage, PrivacyPage } from './pages/Legal';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AdminPage from './pages/Admin/AdminPage';
import DocumentationPage from './pages/Downloads/DownloadsPage';

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


// Layout wrapper for pages that need navbar/footer
const MainLayout = ({ children }) => {
  const location = useLocation();
  const hideNavFooter = ['/login', '/signup', '/dashboard', '/downloads', '/oracle-admin'].includes(location.pathname);
  
  return (
    <>
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
    </>
  );
};

function AppContent() {
  const navigate = useNavigate();
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
    
    // Redirect to downloads page after a short delay for direct purchases
    setTimeout(() => {
      navigate('/downloads');
    }, 3000);
  };

  useEffect(() => {
    localStorage.setItem('oracle_cart', JSON.stringify(cart));
  }, [cart]);

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

    return () => {
      lenis.destroy();
    };
  }, []);

  const location = useLocation();
  const isAdminPage = location.pathname === '/oracle-admin';

  return (
    <>
      <ScrollToTop />
      {!isAdminPage && <LoadingScreen />}
      
      <div className="relative min-h-screen bg-oracle-dark">
        {!isAdminPage && <Scene />}
        
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage onFulfillment={handleFulfillment} cart={cart} updateCart={updateCart} />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/downloads" element={<DocumentationPage />} />
            <Route path="/oracle-admin" element={<AdminPage />} />
          </Routes>
        </MainLayout>

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
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
