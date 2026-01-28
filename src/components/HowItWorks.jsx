import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Server, Code2, Workflow, CloudCog, Database, Lock } from 'lucide-react';

const steps = [
  {
    icon: Code2,
    title: "Write Your Code",
    description: "Develop your application logic in any language or framework you prefer.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: CloudCog,
    title: "Configure Endpoint",
    description: "Set up your API configuration using our simple JSON/YAML templates.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Server,
    title: "Deploy Instantly",
    description: "Push your code to our managed infrastructure with zero server management.",
    color: "from-oracle-blue to-blue-500"
  },
  {
    icon: Database,
    title: "Scale Automatically",
    description: "Your endpoints scale dynamically based on traffic demands.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Lock,
    title: "Secure by Default",
    description: "OAuth2 tokens and TLS encryption protect every request.",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Workflow,
    title: "Integrate Anywhere",
    description: "Connect with CI/CD pipelines, webhooks, and third-party services.",
    color: "from-oracle-purple to-violet-500"
  }
];

const HowItWorks = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section ref={containerRef} className="py-24 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              How It Works
            </motion.h2>
            <p className="text-zinc-500 max-w-xl">
              From code to production in minutes. Here's how Oracle Endpoint simplifies your workflow.
            </p>
          </div>
          <div className="text-zinc-600 text-sm flex items-center gap-2">
            <span>Scroll to explore</span>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <motion.div 
        style={{ x }}
        className="flex gap-8 pl-6"
      >
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative min-w-[300px] md:min-w-[380px] p-8 glass rounded-3xl border-white/5 group hover:border-oracle-blue/30 transition-all flex-shrink-0"
          >
            {/* Step number */}
            <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-linear-to-br ${step.color} text-white font-black text-lg flex items-center justify-center shadow-lg`}>
              {idx + 1}
            </div>
            
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${step.color} bg-opacity-10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
              <step.icon size={32} />
            </div>
            
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {step.description}
            </p>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className="absolute top-1/2 -right-4 w-8 h-px bg-linear-to-r from-white/20 to-transparent"></div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HowItWorks;
