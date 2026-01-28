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
    <section className="py-24 bg-white/1 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter"
          >
            Trusted by <span className="text-oracle-blue">Industry Leaders</span>
          </motion.h2>
          <p className="text-zinc-500 text-sm md:text-base uppercase font-bold tracking-widest">Engineering teams at top companies rely on Oracle Endpoint</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -5 }}
              className="p-8 glass rounded-3xl border-white/5 relative hover:border-oracle-blue/30 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 text-oracle-blue/10" size={32} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-oracle-blue fill-oracle-blue" />
                ))}
              </div>

              <p className="text-zinc-300 mb-8 leading-relaxed text-sm md:text-base italic">
                "{testimonial.content}"
              </p>
              
              <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-oracle-blue/20 to-oracle-purple/20 flex items-center justify-center font-black text-xs text-white">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{testimonial.name}</p>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company Logos - Wrapped for mobile */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale invert">
          <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic">Stripe</span>
          <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic">Shopify</span>
          <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic">Vercel</span>
          <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic">Twilio</span>
          <span className="text-lg md:text-2xl font-black tracking-tighter uppercase italic">Notion</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
