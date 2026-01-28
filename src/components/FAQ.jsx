import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is Oracle Endpoint?",
    answer: "Oracle Endpoint is a cloud-based platform that allows developers to deploy, test, and integrate code without traditional hosting. We provide auto-provisioned endpoints, dynamic API tokens, and seamless configuration delivery."
  },
  {
    question: "How does the one-time payment work?",
    answer: "Unlike subscription models, you pay once and get lifetime access to your chosen tier. This includes all features, updates, and support as specified in your plan."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards (Visa, Mastercard), bank transfers, USSD, mobile money, and cryptocurrency through our secure payment processor."
  },
  {
    question: "How do I access the documentation after purchase?",
    answer: "Upon successful payment, you'll receive immediate access to the full API documentation, integration guides, and your deployment credentials via email."
  },
  {
    question: "Is there a trial or demo available?",
    answer: "We offer a 30-day sandbox environment with the Starter plan. For enterprise evaluations, please contact our team for a custom demo."
  },
  {
    question: "What kind of support do you provide?",
    answer: "Support varies by plan: Starter includes email support, Pro includes priority support with faster response times, and Enterprise includes 24/7 phone support with dedicated account management."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <section className="py-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-zinc-500">Everything you need to know about Oracle Endpoint</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="glass rounded-xl overflow-hidden border-white/5"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-white">{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-oracle-blue transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} 
                />
              </button>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-5"
                >
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
