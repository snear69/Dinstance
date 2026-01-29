import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Download, FileCode, ShieldCheck, Zap, Copy } from 'lucide-react';

const DocumentationPackage = ({ planName, email }) => {
  const [activeTab, setActiveTab] = useState('provisioning');

  const tabs = {
    provisioning: {
      title: "Provisioning",
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-oracle-blue/5 rounded-xl border border-oracle-blue/20">
            <h4 className="text-oracle-blue font-bold text-sm uppercase mb-2">Endpoint Status: ACTIVE</h4>
            <p className="text-zinc-400 text-xs font-mono">ID: ORCL-SEC-9920-X</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <div>
                <p className="text-zinc-500 text-[10px] uppercase">Primary Endpoint</p>
                <p className="text-zinc-200 font-mono text-xs">api.oracle-endpoint.dev/v1/live</p>
              </div>
              <button className="text-oracle-blue hover:text-white transition-colors"><Copy size={16} /></button>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <div>
                <p className="text-zinc-500 text-[10px] uppercase">Master Token</p>
                <p className="text-zinc-200 font-mono text-xs">sk_oracle_live_••••••••••••••••</p>
              </div>
              <button className="text-oracle-blue hover:text-white transition-colors"><Copy size={16} /></button>
            </div>
          </div>
        </div>
      )
    },
    technical: {
      title: "Technical Scope",
      icon: FileCode,
      content: (
        <div className="space-y-4">
          <p className="text-zinc-400 text-sm leading-relaxed">
            Your {planName} environment is configured with the following integration scope:
          </p>
          <div className="font-mono text-[11px] bg-black/50 p-4 rounded-xl border border-white/5 overflow-x-auto">
            <pre className="text-emerald-400">{`// Oracle Node Integration
const oracle = require('@oracle/sdk');

oracle.init({
  token: process.env.ORACLE_TOKEN,
  mode: 'production',
  sandbox: false
});

// Auto-scaling enabled for ${planName}
oracle.setScaling({
  minNodes: ${planName === 'Enterprise' ? 10 : 2},
  maxNodes: ${planName === 'Enterprise' ? 100 : 20},
  throughput: 'unlimited'
});`}</pre>
          </div>
        </div>
      )
    },
    security: {
      title: "Security & SLA",
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-xs text-zinc-400 leading-relaxed">
          <div className="flex gap-3">
            <ShieldCheck className="text-oracle-blue shrink-0" size={18} />
            <p>AES-256 Bit Encryption applied to all payload transfers. TLS 1.3 tunnel mandatory.</p>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="text-oracle-blue shrink-0" size={18} />
            <p>99.99% Uptime SLA guaranteed for {planName} tier infrastructure.</p>
          </div>
          <div className="mt-6 p-3 bg-white/5 rounded-lg italic">
            "This document serves as your official proof of delivery and deployment entitlement."
          </div>
        </div>
      )
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      <div className="flex border-b border-white/10 bg-black/20">
        {Object.entries(tabs).map(([id, tab]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${activeTab === id ? 'text-oracle-blue' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.title}</span>
            {activeTab === id && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-oracle-blue" />
            )}
          </button>
        ))}
      </div>
      
      <div className="p-8 overflow-y-auto grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs[activeTab].content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-white/10 bg-white/5 flex gap-4">
        <button 
          onClick={() => {
            // Trigger actual download from the public folder
            const link = document.createElement('a');
            link.href = '/oracle_bundle.zip'; // Assumes file exists in public/
            link.download = 'oracle_bundle.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert("Starting download of Oracle SDK Bundle. Please check your downloads folder.");
          }}
          className="flex-1 py-3 bg-oracle-blue text-black text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"
        >
          <Download size={16} /> DOWNLOAD PACK (.ZIP)
        </button>
        <button 
          onClick={async () => {
            alert(`Re-sending documentation bundle to ${email}...`);
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (backendUrl) {
              try {
                await fetch(`${backendUrl}/api/webhook/paystack`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    event: 'charge.success', 
                    data: { customer: { email }, metadata: { plan: planName } } 
                  })
                });
                alert("Success! Check your inbox.");
              } catch {
                alert("Fulfillment server is busy. Your documentation is still available for manual download below.");
              }
            } else {
              alert("Fulfillment server not configured. Please use manual download.");
            }
          }}
          className="flex-1 py-3 glass text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
        >
          RESEND TO {email.toUpperCase()}
        </button>
      </div>
    </div>
  );
};

const DeliveryModal = ({ onClose, planName, email }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-oracle-blue/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.1)]"
      >
        <div className="p-8 pb-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-oracle-blue/10 to-transparent">
          <div>
            <div className="flex items-center gap-2 text-oracle-blue mb-2">
              <CheckCircle size={24} />
              <span className="font-black tracking-tighter text-xl italic uppercase">Thank You for your Purchase</span>
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Deployment Package & Instructions Sent to: <span className="text-white">{email}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500">
            <X size={24} />
          </button>
        </div>

        {/* Highlighted Instruction Note */}
        <div className="px-8 py-3 bg-emerald-500/10 border-b border-white/5 flex items-center gap-3">
          <Zap size={14} className="text-emerald-500" />
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Action Required: Check your inbox (and spam) for setup documentation</p>
        </div>

        <DocumentationPackage planName={planName} email={email} />
        
        <div className="p-4 bg-black text-center border-t border-white/5">
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">Oracle Endpoint Protocol v4.0.2 - Official Receipt</p>
        </div>
      </motion.div>
    </div>
  );
};

export default DeliveryModal;
