import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Sparkles, Zap } from 'lucide-react';

const Hero = () => {
  // Animated words
  const words = ["Deploy", "Scale", "Secure", "Integrate"];
  const [currentWord, setCurrentWord] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-oracle-blue rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-3 h-3 bg-oracle-purple rounded-full"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-1 h-1 bg-oracle-blue rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-oracle-blue/30 bg-oracle-blue/10 text-oracle-blue text-xs font-bold mb-8 uppercase tracking-widest"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>v2.0 Deploy Ready</span>
          <Zap size={14} />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-black mb-6 leading-tight"
        >
          <span className="text-white">Empower Your Code.</span>
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-oracle-blue to-oracle-purple glow-blue">
            Oracle Endpoint
          </span>
        </motion.h1>

        {/* Animated Word Rotator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="text-zinc-500 text-xl">One platform to</span>
          <div className="relative h-8 w-32 overflow-hidden">
            {words.map((word, idx) => (
              <motion.span
                key={word}
                className="absolute inset-0 text-xl font-bold text-oracle-blue flex items-center justify-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ 
                  y: currentWord === idx ? 0 : -30, 
                  opacity: currentWord === idx ? 1 : 0 
                }}
                transition={{ duration: 0.5 }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <span className="text-zinc-500 text-xl">everything.</span>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Skip the servers. Get instant API endpoints, dynamic tokens, and enterprise-grade 
          infrastructure—all with a single integration.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#pricing" className="px-8 py-4 bg-oracle-blue text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors group">
            Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#api" className="px-8 py-4 glass text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
            View API Docs
          </a>
        </motion.div>

        {/* Floating tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {["Node.js", "Python", "Go", "Rust", "TypeScript", "Java"].map((tech, idx) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + idx * 0.1 }}
              className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-zinc-500"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-[1px] h-16 bg-linear-to-b from-oracle-blue to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
