import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "50ms", label: "Avg Response" },
  { value: "10K+", label: "API Calls/sec" },
  { value: "180+", label: "Countries" },
];

const Stats = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-oracle-blue to-oracle-purple mb-2">
                {stat.value}
              </div>
              <div className="text-zinc-500 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
