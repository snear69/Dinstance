import React from 'react';
import { motion } from 'framer-motion';

// Partner logos (using placeholder names - these would be replaced with actual SVGs/images)
const partners = [
  { name: "AWS", color: "#FF9900" },
  { name: "Google Cloud", color: "#4285F4" },
  { name: "Microsoft Azure", color: "#0078D4" },
  { name: "Cloudflare", color: "#F38020" },
  { name: "Vercel", color: "#000000" },
  { name: "MongoDB", color: "#47A248" },
  { name: "Redis", color: "#DC382D" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Docker", color: "#2496ED" },
  { name: "Kubernetes", color: "#326CE5" },
  { name: "GitHub", color: "#181717" },
  { name: "Stripe", color: "#635BFF" },
];

const PartnerLogo = ({ name, color }) => (
  <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-white/10 shrink-0 hover:bg-white/10 hover:border-oracle-blue/30 transition-all duration-300 group">
    <div 
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
      style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
    >
      {name.charAt(0)}
    </div>
    <span className="text-zinc-400 group-hover:text-white transition-colors text-sm font-medium whitespace-nowrap">
      {name}
    </span>
  </div>
);

const Partners = () => {
  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-16 overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">
            Trusted Infrastructure Partners
          </p>
          <h3 className="text-white text-xl font-bold">
            Powering the world's best teams
          </h3>
        </motion.div>
      </div>

      {/* Scrolling Partner Logos - First Row (Left to Right) */}
      <div className="relative mb-4">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-oracle-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-oracle-dark to-transparent z-10 pointer-events-none" />
        
        <motion.div 
          className="flex gap-4"
          animate={{
            x: [0, -50 * partners.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedPartners.map((partner, idx) => (
            <PartnerLogo key={`row1-${idx}`} {...partner} />
          ))}
        </motion.div>
      </div>

      {/* Second Row (Right to Left) */}
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-oracle-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-oracle-dark to-transparent z-10 pointer-events-none" />
        
        <motion.div 
          className="flex gap-4"
          animate={{
            x: [-50 * partners.length, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {duplicatedPartners.reverse().map((partner, idx) => (
            <PartnerLogo key={`row2-${idx}`} {...partner} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
