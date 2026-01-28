import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "James Mitchell",
    role: "VP of Engineering",
    company: "Stripe",
    companyLogo: "https://logo.clearbit.com/stripe.com",
    content: "Oracle Endpoint reduced our deployment time by 80%. The API integration was seamless and their documentation is top-notch. We've scaled to handle 10x our original traffic.",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Staff Software Engineer",
    company: "Shopify",
    companyLogo: "https://logo.clearbit.com/shopify.com",
    content: "Finally, a platform that understands developers. The token management and sandbox environments are exactly what we needed for our microservices architecture.",
    rating: 5
  },
  {
    name: "Sarah Williams",
    role: "CTO & Co-founder",
    company: "Vercel",
    companyLogo: "https://logo.clearbit.com/vercel.com",
    content: "As a fast-moving startup, we couldn't afford complex infrastructure overhead. Oracle Endpoint gave us enterprise-grade deployment at a fraction of the cost and time.",
    rating: 5
  },
  {
    name: "Michael Torres",
    role: "Principal Architect",
    company: "Twilio",
    companyLogo: "https://logo.clearbit.com/twilio.com",
    content: "The webhook configuration and CI/CD integration saved our team countless hours. Oracle Endpoint is now a critical part of our development pipeline.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white/1 overflow-hidden">
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

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <motion.div 
            className="flex gap-6 pb-4"
            drag="x"
            dragConstraints={{ left: -600, right: 0 }}
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[350px] md:min-w-[400px] p-8 glass rounded-2xl border-white/5 relative flex-shrink-0"
              >
                <Quote className="absolute top-6 right-6 text-oracle-blue/20" size={40} />
                
                <div className="flex items-center gap-3 mb-6">
                  <img 
                    src={testimonial.companyLogo} 
                    alt={testimonial.company}
                    className="w-10 h-10 rounded-lg bg-white p-1"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <div>
                    <p className="font-bold text-white text-sm">{testimonial.company}</p>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={10} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-zinc-300 mb-6 leading-relaxed text-sm italic">
                  "{testimonial.content}"
                </p>
                
                <div className="pt-4 border-t border-white/10">
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-zinc-500 text-xs">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Scroll hint */}
          <div className="absolute right-0 top-0 bottom-4 w-24 bg-linear-to-l from-oracle-dark to-transparent pointer-events-none"></div>
        </div>

        {/* Company logos ticker */}
        <div className="mt-16 overflow-hidden">
          <motion.div 
            className="flex gap-12 items-center"
            animate={{ x: [0, -500] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...testimonials, ...testimonials].map((t, idx) => (
              <img 
                key={idx}
                src={t.companyLogo} 
                alt={t.company}
                className="h-8 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
