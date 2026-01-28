import React from 'react';
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
    <section className="space-y-12 text-zinc-400">
      <div>
        <h2 className="text-white text-2xl font-bold mb-4">Infrastructure Overview</h2>
        <p className="mb-6 leading-relaxed">
          Oracle Endpoint provides a managed execution environment for modern applications. 
          By abstracting the underlying container orchestration, we allow developers to focus 
          entirely on logic while we handle global distribution and scaling.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-bold text-xs uppercase mb-2">Global Edge</h4>
            <p className="text-xs">Automatic routing to the nearest of 42 global points of presence.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-bold text-xs uppercase mb-2">Auto-Scale</h4>
            <p className="text-xs">Dynamic horizontal scaling from 1 to 10,000+ concurrent instances.</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-white text-2xl font-bold mb-6 italic tracking-tight">API Reference</h2>
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-oracle-blue font-bold text-sm tracking-widest uppercase">1. Authentication</h3>
            <p className="text-sm">Identify your requests using an API Key. All API requests must be made over HTTPS.</p>
            <div className="bg-black/80 p-5 rounded-2xl font-mono text-xs border border-white/5">
              <span className="text-zinc-500"># Header example</span><br/>
              <span className="text-white">Authorization: Bearer </span>
              <span className="text-oracle-blue">ORCLE_LIVE_TK_XXXXX</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-oracle-blue font-bold text-sm tracking-widest uppercase">2. Provisioning Endpoints</h3>
            <p className="text-sm">Create a new managed endpoint environment via a POST request.</p>
            <div className="bg-black/80 p-5 rounded-2xl font-mono text-xs border border-white/5">
              <span className="text-emerald-500">POST</span>
              <span className="text-white"> /v1/endpoints</span><br/>
              <span className="text-zinc-500 mt-2 block">{`{
  "name": "my-secure-api",
  "region": "us-east",
  "runtime": "nodejs:20"
}`}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-oracle-blue/5 border border-oracle-blue/20 rounded-4xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield size={80} />
        </div>
        <h3 className="text-oracle-blue font-black mb-4 text-xs uppercase tracking-[0.3em]">Compliance & Security</h3>
        <p className="text-sm italic mb-4">
          All endpoints are SOC2 Type II and HIPAA compliant by default. 
          Hardware Security Modules (HSM) manage all encryption keys.
        </p>
        <div className="flex gap-4">
          <span className="px-3 py-1 bg-oracle-blue/10 rounded-full text-[10px] font-bold text-oracle-blue">ISO 27001</span>
          <span className="px-3 py-1 bg-oracle-blue/10 rounded-full text-[10px] font-bold text-oracle-blue">SOC2</span>
          <span className="px-3 py-1 bg-oracle-blue/10 rounded-full text-[10px] font-bold text-oracle-blue">GDPR</span>
        </div>
      </div>
    </section>
  </LegalLayout>
);
