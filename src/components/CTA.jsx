import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-oracle-blue/10 via-transparent to-oracle-purple/10"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oracle-blue/10 border border-oracle-blue/30 text-oracle-blue text-sm font-bold mb-8">
            <Sparkles size={16} />
            Limited Time Offer
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to Transform Your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-oracle-blue to-oracle-purple">
              Development Workflow?
            </span>
          </h2>
          
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of developers who have simplified their deployment process with Oracle Endpoint. Start building today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing" className="px-10 py-5 bg-oracle-blue text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors group text-lg">
              Get Started Now <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="px-10 py-5 glass text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-lg">
              Talk to Sales
            </a>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-oracle-blue/20 blur-[100px] rounded-full -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-oracle-purple/20 blur-[100px] rounded-full -translate-y-1/2"></div>
    </section>
  );
};

export default CTA;
