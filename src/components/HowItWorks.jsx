import React, { useRef, useEffect, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform vertical scroll to horizontal movement (only for desktop)
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-75%"]);

  if (isMobile) {
    return (
      <section className="py-24 px-6 bg-oracle-dark overflow-hidden">
        <div className="container mx-auto">
          <div className="mb-12">
            <div className="text-oracle-blue text-sm font-bold uppercase tracking-widest mb-2">
              The Process
            </div>
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-zinc-500">
              From code to production in minutes. A streamlined workflow for modern devs.
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-8 glass rounded-3xl border-white/5 flex flex-col items-start gap-6"
              >
                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center text-white shrink-0`}>
                  <step.icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                    <span className="text-xs font-black px-2 py-1 rounded bg-white/5 text-zinc-500">{idx + 1}</span>
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef} 
      className="relative h-[300vh]"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-oracle-blue text-sm font-bold uppercase tracking-widest mb-2"
              >
                The Process
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold mb-4 text-white"
              >
                How It Works
              </motion.h2>
              <p className="text-zinc-500 max-w-xl">
                From code to production in minutes. Scroll to explore our streamlined workflow.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-oracle-blue rounded-full"
                  style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                />
              </div>
              <span className="text-zinc-500 text-sm">Scroll</span>
            </div>
          </div>
        </div>

        <motion.div 
          style={{ x }}
          className="flex gap-8 pl-6 will-change-transform"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="relative min-w-[320px] md:min-w-[400px] p-8 glass rounded-3xl border-white/5 group hover:border-oracle-blue/30 transition-all flex-shrink-0"
            >
              <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-linear-to-br ${step.color} text-white font-black text-lg flex items-center justify-center shadow-lg`}>
                {idx + 1}
              </div>
              
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                <step.icon size={32} />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {step.description}
              </p>

              {idx < steps.length - 1 && (
                <div className="absolute top-1/2 -right-4 w-8 h-[2px] bg-linear-to-r from-white/30 to-transparent"></div>
              )}
            </motion.div>
          ))}
          <div className="min-w-[100px] flex-shrink-0"></div>
        </motion.div>

        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-oracle-dark to-transparent pointer-events-none z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-oracle-dark to-transparent pointer-events-none z-10"></div>
      </div>
    </section>
  );
};

export default HowItWorks;
