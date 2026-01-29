import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Wallet, Building2, Smartphone, Globe, Shield, Sparkles, Download } from 'lucide-react';
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
    name: "Zero Free",
    priceUSD: 0.5,
    priceNGN: 0.5 * 1600,
    description: "Limited-time promo tier. Test the waters risk-free.",
    features: ["Basic API Access", "Single Endpoint", "7 Days Trial Env", "Community Support", "Standard Security"],
    color: "from-emerald-500 to-teal-800",
    promo: true
  },
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative p-6 md:p-8 rounded-[2rem] glass border-white/5 flex flex-col group transition-all duration-500 ${plan.popular ? 'border-oracle-blue/50 bg-oracle-blue/5 shadow-[0_0_50px_rgba(0,186,255,0.1)] scale-105 z-10' : ''} ${plan.promo ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_50px_rgba(16,185,129,0.15)]' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-linear-to-r from-oracle-blue to-blue-600 text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <Sparkles size={12} /> Most Advanced
                </div>
              )}
              {plan.promo && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-linear-to-r from-emerald-500 to-teal-500 text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2 animate-pulse">
                  <Sparkles size={12} /> Limited Promo
                </div>
              )}
              
              <div className="mb-10 text-white">
                <h3 className="text-xl md:text-3xl font-black mb-4 tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl md:text-5xl font-black">${plan.priceUSD}</span>
                  <span className="text-zinc-600 font-bold uppercase text-[9px] sm:text-[10px] tracking-widest">One-Off Lifetime</span>
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

        {/* Delivery Guarantee Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 rounded-[2.5rem] bg-linear-to-br from-white/5 to-transparent border border-white/10">
            <div>
              <h4 className="text-2xl md:text-3xl font-black mb-6 text-white uppercase tracking-tighter">Instant Delivery Protocol</h4>
              <p className="text-zinc-500 mb-8 leading-relaxed">Upon successful transaction, our automated provisioning system immediately generates and transmits your unique deployment package.</p>
              
              <div className="space-y-4">
                {[
                  "Unique API Master Token (AES-256 Encrypted)",
                  "Official SLA Certificate of Ownership",
                  "SDK Integration Bundle (.ZIP Package)",
                  "Private Endpoint Documentation Access",
                  "Verified Deployment Receipt & Hash"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-oracle-blue/20 flex items-center justify-center">
                      <Check size={12} className="text-oracle-blue" />
                    </div>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-oracle-blue/20 blur-[80px] rounded-full group-hover:bg-oracle-blue/30 transition-all"></div>
              <div className="relative bg-zinc-950 p-6 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-oracle-blue/10 flex items-center justify-center">
                    <Download className="text-oracle-blue" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-none mb-1">Package Ready</p>
                    <p className="text-xs text-white font-mono">oracle_bundle_v4.zip</p>
                  </div>
                </div>
                <div className="space-y-3 opacity-50">
                  <div className="h-2 bg-white/5 rounded-full w-full"></div>
                  <div className="h-2 bg-white/5 rounded-full w-3/4"></div>
                  <div className="h-2 bg-white/5 rounded-full w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global SLA notice */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 p-8 glass rounded-3xl border-white/5 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left text-white"
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
