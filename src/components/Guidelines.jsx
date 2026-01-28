import React from 'react';
import { motion } from 'framer-motion';
import { Info, ShieldAlert, Users } from 'lucide-react';

const Guidelines = () => {
  const rules = [
    {
      title: "API Safe Usage",
      text: "Ensure all endpoints are protected by OAuth2. Rate limiting is applied by default to protect infrastructure health.",
      icon: ShieldAlert
    },
    {
      title: "Token Management",
      text: "Never expose your integration tokens in client-side code. Use environment variables for secure server-side storage.",
      icon: Info
    },
    {
      title: "Collaboration",
      text: "Team members can be added to projects with specific permission tiers. Revoke access instantly if a member leaves.",
      icon: Users
    }
  ];

  return (
    <section id="guidelines" className="py-24 bg-white/1">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Usage Guidelines</h2>
          <p className="text-zinc-500">Best practices for maintaining a secure and efficient integration.</p>
        </div>

        <div className="space-y-6">
          {rules.map((rule, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 glass rounded-2xl flex gap-6 items-start"
            >
              <div className="p-3 bg-oracle-blue/10 rounded-xl text-oracle-blue">
                <rule.icon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{rule.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {rule.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Guidelines;
