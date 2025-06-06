
import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  const services = [
    {
      icon: Shield,
      title: "Social Media Protection",
      description: "What We Do:",
      details: [
        "• Monitor & respond to negative Twitter mentions",
        "• Instagram brand protection & reputation",
        "• LinkedIn professional presence management",
        "• Facebook reputation crisis response"
      ],
      mission: "Why It Matters:",
      missionText: "Social media moves fast. Negative content spreads at light speed and can cause severe reputational damage within hours."
    },
    {
      icon: Eye,
      title: "Influence & Creator Shield",
      description: "What We Do:",
      details: [
        "• Monitor influencer mentions and collaborations",
        "• Proactive content against upcoming threats",
        "• Creator network relationship management",
        "• Digital footprint analysis and protection"
      ],
      mission: "Why It Matters:",
      missionText: "Influencers and creators shape public opinion and their followers can be mobilized to defend reputations when done right."
    },
    {
      icon: Users,
      title: "Executive Protection",
      description: "What We Do:",
      details: [
        "• High-level threat identification & suppression",
        "• Personal brand protection for executives",
        "• Crisis communication strategy development",
        "• Reputation recovery and reconstruction"
      ],
      mission: "Why It Matters:",
      missionText: "Executives need to maintain a threat-free environment. Whether it's pre-IPO due diligence or personal brand threats."
    }
  ];

  return (
    <section className="bg-black py-16" id="services">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Reputation Management Services – Powered by <span className="text-orange-500">A.R.I.A™</span>
          </h2>
          <p className="text-gray-300 max-w-4xl mx-auto">
            A.R.I.A™ isn't just for individuals, CEOs, or global brands. Reputation is personal — and everyone 
            deserves protection. Whether you're facing online abuse, negative press, or algorithmic bias, we've 
            built elite tools for every type of modern digital reality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800 p-8 text-white">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">{service.title}</h3>
              </div>
              
              <div className="mb-6">
                <h4 className="text-orange-500 font-semibold mb-2">{service.description}</h4>
                <ul className="text-gray-300 space-y-1">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="text-sm">{detail}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-orange-500 font-semibold mb-2">{service.mission}</h4>
                <p className="text-gray-300 text-sm">{service.missionText}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Get a comprehensive assessment of your digital risk profile. Our experts will identify 
            vulnerabilities and provide a strategic roadmap.
          </p>
          <Link to="/scan">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Request Risk Assessment
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
