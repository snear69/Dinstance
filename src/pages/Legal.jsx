import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Scale, ArrowLeft } from 'lucide-react';

const LegalLayout = ({ title, icon: Icon, children }) => {
  return (
    <div className="min-h-screen bg-oracle-dark text-white pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-oracle-blue transition-colors mb-12">
          <ArrowLeft size={18} /> Back to Home
        </a>
        
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-oracle-blue/10 rounded-2xl text-oracle-blue">
            <Icon size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black">{title}</h1>
        </div>

        <div className="glass p-8 md:p-12 rounded-3xl border-white/5 prose prose-invert prose-zinc max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export const TermsPage = () => (
  <LegalLayout title="Terms of Service" icon={Scale}>
    <section className="space-y-6 text-zinc-400">
      <p>Last Updated: May 2023</p>
      <h2 className="text-white text-xl font-bold">1. Agreement to Terms</h2>
      <p>By accessing or using Oracle Endpoint, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
      
      <h2 className="text-white text-xl font-bold">2. Use of License</h2>
      <p>We grant you a non-exclusive, non-transferable license to use the Oracle Endpoint infrastructure according to your purchased plan. "Buy Once, Deploy Forever" refers to the lifetime access of the version purchased.</p>
      
      <h2 className="text-white text-xl font-bold">3. API Usage</h2>
      <p>You are responsible for all activity that occurs under your API tokens. You must maintain the security of your tokens and immediately notify us of any unauthorized use.</p>
      
      <h2 className="text-white text-xl font-bold">4. Restrictions</h2>
      <p>You may not use Oracle Endpoint for any illegal activities, including but not limited to DDoS attacks, distribution of malware, or unauthorized data scraping.</p>
    </section>
  </LegalLayout>
);

export const PrivacyPage = () => (
  <LegalLayout title="Privacy Policy" icon={Shield}>
    <section className="space-y-6 text-zinc-400">
      <p>Last Updated: May 2023</p>
      <h2 className="text-white text-xl font-bold">1. Data Collection</h2>
      <p>We collect minimal data necessary to provide our services, including your email address for account management and transaction receipts.</p>
      
      <h2 className="text-white text-xl font-bold">2. Usage Data</h2>
      <p>We monitor API call volumes and error rates to ensure infrastructure health and SLA compliance. We do not inspect the contents of your data payloads.</p>
      
      <h2 className="text-white text-xl font-bold">3. Third-Party Services</h2>
      <p>Payments are processed securely via Paystack. We do not store your credit card details on our servers.</p>
      
      <h2 className="text-white text-xl font-bold">4. Security</h2>
      <p>We implement industry-standard AES-256 encryption and TLS 1.3 for all data transfers within our infrastructure.</p>
    </section>
  </LegalLayout>
);

export const DocsPage = () => (
  <LegalLayout title="Documentation" icon={FileText}>
    <section className="space-y-8 text-zinc-400">
      <div>
        <h2 className="text-white text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-4">Integrate Oracle Endpoint into your application in less than 5 minutes.</p>
        <div className="bg-black/50 p-6 rounded-xl font-mono text-sm text-oracle-blue border border-white/5">
          <pre>{`npm install @oracle/sdk\n\nconst oracle = require('@oracle/sdk');\noracle.init({ token: 'YOUR_TOKEN' });`}</pre>
        </div>
      </div>

      <div>
        <h2 className="text-white text-xl font-bold mb-4">Core Concepts</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Endpoints:</strong> Managed URLs that host your application logic.</li>
          <li><strong>Provisioning:</strong> Automatic server setup and deployment.</li>
          <li><strong>Tokens:</strong> Secure keys used for API authentication.</li>
          <li><strong>SLA:</strong> 99.99% uptime guarantee for all enterprise users.</li>
        </ul>
      </div>

      <div className="p-6 bg-oracle-blue/5 border border-oracle-blue/20 rounded-2xl">
        <h3 className="text-oracle-blue font-bold mb-2 text-sm uppercase">Notice</h3>
        <p className="text-xs italic">Full technical documentation including advanced routing and container orchestration is sent to your email upon purchase of the Pro or Enterprise plan.</p>
      </div>
    </section>
  </LegalLayout>
);
