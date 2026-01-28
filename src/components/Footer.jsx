import React, { useState } from 'react';
import { Mail, Cpu, Send, CheckCircle, Loader2, Phone, Globe, ExternalLink } from 'lucide-react';

const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const footerLinks = {
    "Resources For": [
      { name: "Careers", href: "https://www.oracle.com/careers/" },
      { name: "Developers", href: "https://developer.oracle.com/" },
      { name: "Investors", href: "https://investor.oracle.com/" },
      { name: "Partners", href: "https://www.oracle.com/partner/" },
      { name: "Researchers", href: "https://labs.oracle.com/" },
      { name: "Students and Educators", href: "https://academy.oracle.com/" },
    ],
    "Why Oracle": [
      { name: "Analyst Reports", href: "https://www.oracle.com/corporate/analyst-reports/" },
      { name: "Best Cloud-based ERP", href: "https://www.oracle.com/erp/" },
      { name: "Cloud Economics", href: "https://www.oracle.com/cloud/economics/" },
      { name: "Social Impact", href: "https://www.oracle.com/social-impact/" },
      { name: "Security Practices", href: "https://www.oracle.com/security/" },
    ],
    "Learn": [
      { name: "What is a Sovereign Cloud?", href: "https://www.oracle.com/cloud/sovereign-cloud/what-is-sovereign-cloud/" },
      { name: "What is Zero Trust Security?", href: "https://www.oracle.com/security/what-is-zero-trust/" },
      { name: "How AI is Transforming Finance", href: "https://www.oracle.com/artificial-intelligence/ai-in-finance/" },
      { name: "What is a Vector Database?", href: "https://www.oracle.com/database/vector-database/" },
      { name: "What is Multicloud?", href: "https://www.oracle.com/cloud/multicloud/" },
      { name: "What are AI Agents?", href: "https://www.oracle.com/artificial-intelligence/ai-agents/" },
    ],
    "News and Events": [
      { name: "News", href: "https://www.oracle.com/news/" },
      { name: "Oracle AI World", href: "https://www.oracle.com/cloudworld/" },
      { name: "Oracle Health Summit", href: "https://www.oracle.com/health/summit/" },
      { name: "JavaOne", href: "https://www.oracle.com/javaone/" },
      { name: "Search All Events", href: "https://www.oracle.com/events/" },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    setStatus('sending');
    
    const mailtoLink = `mailto:support@oracle-endpoint.dev?subject=Oracle Endpoint Inquiry from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`;
    window.location.href = mailtoLink;
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <footer id="contact" className="pt-20 border-t border-white/5 relative overflow-hidden bg-black/30">
      <div className="container mx-auto px-6">
        
        {/* Contact Form Section - FIRST */}
        <div className="grid md:grid-cols-2 gap-12 pb-16">
          <div>
            <h2 className="text-3xl font-bold mb-4">Let's build the future of infrastructure.</h2>
            <p className="text-zinc-500 mb-6 max-w-sm">
              Ready to skip the server setup? Get in touch or start your integration today.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mb-8">
              <a href="https://twitter.com/Oracle" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-oracle-blue/20 transition-colors text-zinc-400 hover:text-oracle-blue">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/oracle" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-oracle-blue/20 transition-colors text-zinc-400 hover:text-oracle-blue">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.facebook.com/Oracle" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-oracle-blue/20 transition-colors text-zinc-400 hover:text-oracle-blue">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.youtube.com/oracle" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-oracle-blue/20 transition-colors text-zinc-400 hover:text-oracle-blue">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://github.com/oracle" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-oracle-blue/20 transition-colors text-zinc-400 hover:text-oracle-blue">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>

            {/* Direct contact */}
            <div className="space-y-2 text-sm text-zinc-500">
              <a href="tel:+34916036188" className="flex items-center gap-2 hover:text-oracle-blue transition-colors">
                <Phone size={14} />
                <span>ES Sales: +34 91 603 6188</span>
              </a>
              <a href="tel:+18006330738" className="flex items-center gap-2 hover:text-oracle-blue transition-colors">
                <Phone size={14} />
                <span>US Sales: +1.800.633.0738</span>
              </a>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border-white/10">
            <h3 className="text-lg font-bold mb-4">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-oracle-blue transition-colors text-sm" 
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-oracle-blue transition-colors text-sm" 
                />
              </div>
              <textarea 
                placeholder="Your message..." 
                rows={3} 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-oracle-blue transition-colors resize-none text-sm"
              ></textarea>
              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3 bg-oracle-blue text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                {status === 'sending' && <Loader2 size={16} className="animate-spin" />}
                {status === 'success' && <CheckCircle size={16} />}
                {status === 'idle' && <Send size={16} />}
                {status === 'sending' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Resource Links Grid - BELOW CONTACT */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-16 border-t border-white/5">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-bold text-sm mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 text-sm hover:text-oracle-blue transition-colors flex items-center gap-1 group"
                    >
                      {link.name}
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Additional Links Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.oracle.com/corporate/contact/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 text-sm hover:text-oracle-blue transition-colors flex items-center gap-1 group">
                  <Globe size={12} /> How can we help?
                </a>
              </li>
              <li>
                <a href="https://go.oracle.com/subscriptions" target="_blank" rel="noopener noreferrer" className="text-zinc-500 text-sm hover:text-oracle-blue transition-colors flex items-center gap-1 group">
                  <Mail size={12} /> Subscribe to emails
                </a>
              </li>
              <li>
                <a href="https://secure.ethicspoint.com/domain/media/en/gui/31053/index.html" target="_blank" rel="noopener noreferrer" className="text-zinc-500 text-sm hover:text-oracle-blue transition-colors">
                  Integrity Helpline
                </a>
              </li>
              <li>
                <a href="https://www.oracle.com/corporate/accessibility/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 text-sm hover:text-oracle-blue transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="text-oracle-blue w-5 h-5" />
            <span className="font-bold tracking-tighter">ORACLE ENDPOINT</span>
          </div>
          <p className="text-zinc-600 text-xs">
            © 2023 Oracle Endpoint. All rights reserved.
          </p>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-oracle-purple/5 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-oracle-blue/5 blur-[120px] rounded-full"></div>
    </footer>
  );
};

export default Footer;
