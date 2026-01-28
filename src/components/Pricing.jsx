import React from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Wallet, Building2, Smartphone, Globe, Shield } from 'lucide-react';
import PaystackCheckout from './PaystackCheckout';

const paymentMethods = [
  { name: 'Cards', icon: CreditCard },
  { name: 'Bank', icon: Building2 },
  { name: 'USSD', icon: Smartphone },
  { name: 'Transfer', icon: Wallet },
  { name: 'Mobile Money', icon: Globe },
  { name: 'Crypto', icon: Shield },
];

const plans = [
  {
    name: "Starter",
    priceUSD: 480,
    priceNGN: 480 * 1600, // ~768,000 NGN
    description: "Basic integration for small projects",
    features: ["API Access", "Single Endpoint", "30 Days Sandbox", "Email Support"],
    color: "from-zinc-500 to-zinc-700"
  },
  {
    name: "Pro",
    priceUSD: 650,
    priceNGN: 650 * 1600, // ~1,040,000 NGN
    description: "Full automation for growing teams",
    features: ["Full Automation", "Priority Support", "Unlimited Endpoints", "Advanced Security", "Full Documentation Access"],
    color: "from-oracle-blue to-blue-600",
    popular: true
  },
  {
    name: "Enterprise",
    priceUSD: 900,
    priceNGN: 900 * 1600, // ~1,440,000 NGN
    description: "Custom scale for large enterprises",
    features: ["Dedicated Environment", "Custom Scaling", "24/7 Phone Support", "SLA Guarantee", "White-label Options"],
    color: "from-oracle-purple to-purple-800"
  }
];

const Pricing = ({ onFulfillment }) => {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Transparent Pricing</h2>
          <p className="text-zinc-400 mb-8">One-time payment. Lifetime deployment.</p>
          
          {/* Payment Methods */}
          <div className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
            {paymentMethods.map((method, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs text-zinc-400">
                <method.icon size={14} />
                <span>{method.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-8 rounded-3xl glass border-white/5 flex flex-col ${plan.popular ? 'border-oracle-blue/50 scale-105 z-10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-oracle-blue text-black text-xs font-black rounded-full uppercase">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black">${plan.priceUSD}</span>
                  <span className="text-zinc-500 text-sm">/one-time</span>
                </div>
                <p className="text-zinc-500 text-sm leading-tight italic">"Buy Once, Deploy Forever"</p>
              </div>

              <div className="space-y-4 mb-10 grow">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3 text-sm">
                    <Check size={16} className="text-oracle-blue" />
                    <span className="text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>

              <PaystackCheckout 
                amount={plan.priceNGN} 
                planName={plan.name} 
                popular={plan.popular} 
                onSuccess={(email) => onFulfillment && onFulfillment(plan.name, email)}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center text-zinc-500 text-sm">
          <p>Secure payments processed via multiple channels. All major cards and banks accepted.</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
