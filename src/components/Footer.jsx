import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Cpu, Twitter, Youtube, Facebook, Send, CheckCircle, Loader2 } from 'lucide-react';

const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/Oracle', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/oracle', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://www.youtube.com/oracle', label: 'YouTube' },
    { icon: Facebook, href: 'https://www.facebook.com/Oracle', label: 'Facebook' },
    { icon: Github, href: 'https://github.com/oracle', label: 'GitHub' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    setStatus('sending');

    // Using Web3Forms - a free form submission service
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_KEY', // User needs to get their own key from web3forms.com
          subject: `Oracle Endpoint Contact: ${formData.name}`,
          from_name: formData.name,
          email: formData.email,
          message: formData.message,
          to: 'support@oracle-endpoint.dev' // Replace with actual support email
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      // Fallback: Open email client
      const mailtoLink = `mailto:support@oracle-endpoint.dev?subject=Oracle Endpoint Inquiry from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`;
      window.location.href = mailtoLink;
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer id="contact" className="pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-4xl font-bold mb-6">Let's build the future <br /> of infrastructure.</h2>
            <p className="text-zinc-500 mb-8 max-w-sm">
              Ready to skip the server setup? Get in touch or start your integration today.
            </p>
            <div className="flex gap-3 flex-wrap mb-8">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full glass flex items-center justify-center hover:text-oracle-blue hover:border-oracle-blue/50 transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            
            {/* Direct contact info */}
            <div className="space-y-2 text-sm text-zinc-500">
              <p><Mail size={14} className="inline mr-2" />support@oracle-endpoint.dev</p>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border-white/10">
            <h3 className="text-lg font-bold mb-4">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-oracle-blue transition-colors" 
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-oracle-blue transition-colors" 
                />
              </div>
              <textarea 
                placeholder="Your message..." 
                rows={4} 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-oracle-blue transition-colors resize-none"
              ></textarea>
              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 bg-oracle-blue text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'sending' && <Loader2 size={18} className="animate-spin" />}
                {status === 'success' && <CheckCircle size={18} />}
                {status === 'idle' && <Send size={18} />}
                {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Cpu className="text-oracle-blue w-6 h-6" />
            <span className="text-lg font-bold tracking-tighter">ORACLE ENDPOINT</span>
          </div>
          <p className="text-zinc-600 text-sm">
            © 2023 Oracle Endpoint. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 text-zinc-500 text-sm">
            <a href="/docs" className="hover:text-white transition-colors">Docs</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>

      {/* Background glow decorator */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-oracle-purple/10 blur-[120px] rounded-full"></div>
    </footer>
  );
};

export default Footer;
