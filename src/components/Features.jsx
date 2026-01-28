import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Repeat } from 'lucide-react';

const features = [
  {
    title: "Zero Hosting Deployment",
    description: "Auto-provisioned cloud space for code testing and deployment without server management.",
    icon: Zap,
    color: "text-yellow-400"
  },
  {
    title: "Dynamic API Tokens",
    description: "Generate and manage secure tokens in real-time, linked directly to your application stack.",
    icon: Shield,
    color: "text-oracle-blue"
  },
  {
    title: "Seamless Configuration",
    description: "Easily integrate through JSON or YAML setup with our automated configuration delivery.",
    icon: Repeat,
    color: "text-oracle-purple"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Infrastructure</h2>
          <div className="w-20 h-1 bg-linear-to-r from-oracle-blue to-oracle-purple mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="p-8 glass rounded-2xl hover:bg-white/10 transition-colors group border-white/5 hover:border-oracle-blue/30"
            >
              <div className={`w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
