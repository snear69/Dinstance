import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Lock, Terminal, Shield, Zap, Globe } from 'lucide-react';

const Integration = () => {
  const codeSnippetPreview = `{
  "auth_token": "oracle_••••••••••••",
  "endpoint_url": "api.oracle-endpoint.dev/v1/...",
  "config": {
    "env": "production",
    "region": "us-east-1",
    "scaling": "auto"
  }
}`;

  const features = [
    { icon: Shield, title: "Zero Trust", text: "Multi-layer security protocols." },
    { icon: Zap, title: "Edge Logic", text: "Execute at the nearest node." },
    { icon: Globe, title: "Any Scale", text: "From 1 to 10M+ requests." },
  ];

  return (
    <section id="api" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-oracle-blue/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-oracle-blue/10 border border-oracle-blue/20 text-oracle-blue text-xs font-bold mb-6">
                <Terminal size={14} /> REST API Reference
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Built for the <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-oracle-blue to-white">Next Generation.</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-lg">
                Stop worrying about server provisioning. Our API allows you to deploy 
                enterprise-ready endpoints with a single JSON configuration.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {features.map((f, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-oracle-blue">
                      <f.icon size={20} />
                    </div>
                    <h4 className="font-bold text-sm text-white">{f.title}</h4>
                    <p className="text-zinc-500 text-xs">{f.text}</p>
                  </div>
                ))}
              </div>

              <a href="#pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-oracle-blue font-bold hover:bg-oracle-blue/10 transition-all group">
                <Lock size={16} /> Unlock API Specs <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateY: -10 }}
              whileInView={{ scale: 1, opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-1 rounded-3xl bg-linear-to-br from-oracle-blue/30 via-transparent to-oracle-purple/30 perspective-[1000px]"
            >
              {/* Glow effects */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-oracle-blue/20 blur-[60px] rounded-full" />
              
              <div className="bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative z-10">
                <div className="flex items-center gap-2 px-6 py-4 bg-zinc-900 border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono ml-4 tracking-wider">production_deploy.json</span>
                  <div className="ml-auto">
                    <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-tighter">
                      Gated Access
                    </div>
                  </div>
                </div>
                <div className="p-8 font-mono text-sm relative group">
                  <pre className="text-oracle-blue/80 leading-relaxed">
                    {codeSnippetPreview}
                  </pre>
                  
                  {/* Blur overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent flex items-end justify-center pb-8 px-8">
                    <div className="text-center">
                      <p className="text-zinc-500 text-xs mb-4 max-w-[200px]">Unlock more than <span className="text-white">50+ API endpoints</span> and configuration schemas.</p>
                      <button className="text-xs font-bold text-white py-2 px-4 rounded-lg bg-oracle-blue/10 border border-oracle-blue/20 hover:bg-oracle-blue/20 transition-colors uppercase tracking-widest">
                        Show More
                      </button>
                    </div>
                  </div>
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
