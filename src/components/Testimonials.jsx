import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "James Mitchell",
    role: "VP of Engineering",
    company: "Stripe",
    content: "Oracle Endpoint reduced our deployment time by 80%. The API integration was seamless and their documentation is top-notch.",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Staff Software Engineer",
    company: "Shopify",
    content: "Finally, a platform that understands developers. The token management and sandbox environments are exactly what we needed.",
    rating: 5
  },
  {
    name: "Sarah Williams",
    role: "CTO & Co-founder",
    company: "Vercel",
    content: "Enterprise-grade deployment at a fraction of the cost and time. Oracle Endpoint is now essential to our workflow.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white/1">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Trusted by Industry Leaders
          </motion.h2>
          <p className="text-zinc-500">Engineering teams at top companies rely on Oracle Endpoint</p>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="p-8 glass rounded-2xl border-white/5 relative hover:border-oracle-blue/20 transition-colors"
            >
              <Quote className="absolute top-6 right-6 text-oracle-blue/10" size={32} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="text-zinc-300 mb-8 leading-relaxed text-sm">
                "{testimonial.content}"
              </p>
              
              <div className="pt-6 border-t border-white/10">
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-zinc-500 text-xs">{testimonial.role}, {testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company Logos */}
        <div className="mt-16 flex justify-center items-center gap-12 opacity-40">
          <span className="text-2xl font-bold tracking-tight">Stripe</span>
          <span className="text-2xl font-bold tracking-tight">Shopify</span>
          <span className="text-2xl font-bold tracking-tight">Vercel</span>
          <span className="text-2xl font-bold tracking-tight">Twilio</span>
          <span className="text-2xl font-bold tracking-tight">Notion</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
