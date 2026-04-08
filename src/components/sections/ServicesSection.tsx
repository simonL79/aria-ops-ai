
import React, { useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const ServiceCard = ({ service, index, visible }: { service: any; index: number; visible: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: visible ? `${index * 150}ms` : '0ms', transformStyle: 'preserve-3d' }}
    >
      <Card className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 p-8 text-white hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 h-full">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
            <service.icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold">{service.title}</h3>
        </div>
        
        <div className="mb-6">
          <h4 className="text-orange-500 font-semibold mb-2">{service.description}</h4>
          <ul className="text-gray-300 space-y-1">
            {service.details.map((detail: string, idx: number) => (
              <li key={idx} className="text-sm">{detail}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-orange-500 font-semibold mb-2">{service.mission}</h4>
          <p className="text-gray-300 text-sm">{service.missionText}</p>
        </div>
      </Card>
    </div>
  );
};

const ServicesSection = () => {
  const { ref, visible } = useScrollReveal(0.1);

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
      <div ref={ref} className="container mx-auto px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
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
            <ServiceCard key={index} service={service} index={index} visible={visible} />
          ))}
        </div>

        <div className={`text-center transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
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
