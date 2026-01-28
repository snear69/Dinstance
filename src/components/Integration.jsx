import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Lock } from 'lucide-react';

const Integration = () => {
  const codeSnippetPreview = `{
  "auth_token": "oracle_••••••••••••",
  "endpoint_url": "api.oracle-endpoint.dev/v1/...",
  "config": {
    "env": "••••••••",
    "region": "••••••••",
    "scaling": "••••"
  }
}`;

  const fullCodeSnippet = `// Full documentation available after purchase
// Includes:
// - Complete API Reference
// - SDK Integration Guides  
// - Webhook Configuration
// - Security Best Practices
// - Rate Limiting Details
// - Error Handling Patterns`;

  return (
    <section id="api" className="py-24 bg-white/2">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Designed for Developers</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Oracle Endpoint's RESTful architecture ensures that integration is straightforward. 
              Deploy sandbox environments, configure webhooks, and manage OAuth2 security with a single token.
            </p>
            <ul className="space-y-4 mb-10">
              {["OAuth2 Authentication", "CI/CD Pipeline Webhooks", "Sandbox Environments"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-oracle-blue"></div>
                  {item}
                </li>
              ))}
            </ul>
            <a href="#pricing" className="flex items-center gap-2 text-oracle-blue font-bold hover:underline">
              <Lock size={18} /> Unlock Full Documentation <ExternalLink size={18} />
            </a>
            <p className="text-zinc-600 text-xs mt-2 italic">Complete API docs available with any plan purchase</p>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="p-1 rounded-2xl bg-linear-to-br from-oracle-blue/30 via-transparent to-oracle-purple/30"
            >
              <div className="bg-zinc-950 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono ml-2">oracle_config.json</span>
                  <div className="ml-auto flex items-center gap-1 text-amber-500/80 text-[10px]">
                    <Lock size={10} /> PREVIEW
                  </div>
                </div>
                <div className="p-6 font-mono text-sm overflow-x-auto relative">
                  <pre className="text-oracle-blue/70">
                    {codeSnippetPreview}
                  </pre>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                </div>
                <div className="p-4 bg-zinc-900/50 border-t border-white/5">
                  <pre className="text-zinc-600 text-[10px] font-mono">
                    {fullCodeSnippet}
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
