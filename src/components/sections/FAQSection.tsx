
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const faqs = [
  {
    question: "What is A.R.I.A™?",
    answer: "A.R.I.A™ (Adaptive Reputation Intelligence & Analysis) is an AI-powered reputation defence system that monitors, protects, and repairs your digital presence across the web — from search engines and social media to forums, news outlets, and the dark web."
  },
  {
    question: "How fast do you respond to threats?",
    answer: "Our AI monitoring runs 24/7. Critical threats trigger instant alerts, and our response team can begin suppression and counter-narrative deployment within hours — not days."
  },
  {
    question: "Is my data confidential?",
    answer: "Absolutely. We operate under strict NDA protocols, GDPR-compliant data handling, and enterprise-grade encryption. Your identity and case details are never shared or stored beyond what's required for your protection."
  },
  {
    question: "What platforms do you monitor?",
    answer: "A.R.I.A™ scans Google, Bing, social media (X, Facebook, Instagram, LinkedIn, TikTok, Reddit), news sites, review platforms, forums, paste sites, and dark web marketplaces — in multiple languages."
  },
  {
    question: "How does pricing work?",
    answer: "We offer tailored plans based on the scope of monitoring and response you need. Every engagement starts with a confidential assessment — contact us to discuss your situation and we'll recommend the right tier."
  }
];

const FAQSection = () => {
  const { ref, visible } = useScrollReveal(0.1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-black">
      <div ref={ref} className={`container mx-auto px-6 max-w-3xl transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center text-white">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-800 rounded-lg overflow-hidden transition-colors hover:border-orange-500/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left text-white font-medium text-lg"
              >
                {faq.question}
                <ChevronDown
                  className={`h-5 w-5 text-orange-500 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-5 text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
