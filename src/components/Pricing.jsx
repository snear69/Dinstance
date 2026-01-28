import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Wallet, Building2, Smartphone, Globe, Shield, Sparkles } from 'lucide-react';
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
    priceNGN: 480 * 1600,
    description: "Perfect for lightweight production endpoints.",
    features: ["Standard API Access", "Managed Endpoint", "30 Days Evaluation Env", "Standard Email Support", "OAuth2 Core Security"],
    color: "from-zinc-500 to-zinc-800"
  },
  {
    name: "Pro",
    priceUSD: 650,
    priceNGN: 650 * 1600,
    description: "Engineered for high-traffic scaling teams.",
    features: ["Unlimited Scaling Nodes", "Priority Technical Support", "Unlimited API Endpoints", "Advanced HSM Security", "Full Documentation Access", "CI/CD Webhook Integration"],
    color: "from-oracle-blue to-blue-700",
    popular: true
  },
  {
    name: "Enterprise",
    priceUSD: 900,
    priceNGN: 900 * 1600,
    description: "Dedicated infrastructure for massive scale.",
    features: ["Dedicated Bare-Metal Cluster", "24/7 Priority Hotline", "SLA: 99.99% Guaranteed", "Custom Network Topologies", "White-label API Provisioning", "Advanced Data Sovereignty"],
    color: "from-oracle-purple to-purple-900"
  }
];

const Pricing = ({ onFulfillment }) => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-oracle-blue/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            One-Time Investment
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter text-white">Choose Your <span className="text-oracle-blue">Tier</span></h2>
          <p className="text-zinc-500 max-w-lg mx-auto mb-10">Deploy logic once. Own the version forever. No subscriptions, just pure infrastructure.</p>
          
          {/* Payment Methods */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl mx-auto">
            {paymentMethods.map((method, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-950/50 rounded-xl border border-white/5 text-[10px] font-bold text-zinc-400"
              >
                <method.icon size={14} className="text-oracle-blue" />
                <span className="uppercase tracking-tighter">{method.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative p-8 md:p-10 rounded-[2.5rem] glass border-white/5 flex flex-col group transition-all duration-500 ${plan.popular ? 'border-oracle-blue/50 bg-oracle-blue/5 shadow-[0_0_50px_rgba(0,186,255,0.1)] scale-105 z-10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-linear-to-r from-oracle-blue to-blue-600 text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <Sparkles size={12} /> Most Advanced
                </div>
              )}
              
              <div className="mb-10 text-white">
                <h3 className="text-xl md:text-3xl font-black mb-4 tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-black">${plan.priceUSD}</span>
                  <span className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">Permanent</span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-12 grow">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4 font-mono">Core Deliverables</p>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3 text-sm">
                    <div className="mt-1">
                      <Check size={14} className="text-oracle-blue" />
                    </div>
                    <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase text-[11px] font-bold tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <PaystackCheckout 
                  amount={plan.priceNGN} 
                  planName={plan.name} 
                  popular={plan.popular} 
                  onSuccess={(email) => onFulfillment && onFulfillment(plan.name, email)}
                />
                
                <p className="text-center text-[9px] font-black uppercase tracking-tighter text-zinc-700 mt-4 leading-none">
                  Encrypted Transaction Protocol Enabled
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global SLA notice */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-8 glass rounded-3xl border-white/5 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left text-white"
        >
          <div className="w-16 h-16 rounded-2xl bg-oracle-blue/10 flex items-center justify-center text-oracle-blue shrink-0">
            <Shield size={32} />
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Infrastructure Guarantee</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Every node deployed via Oracle Endpoint is protected by our global redundancy matrix. 
              We offer a minimum 99.9% uptime for all versions regardless of tier.
            </p>
          </div>
          <Link to="/docs" className="px-6 py-3 glass rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors shrink-0">
            Full SLA
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
