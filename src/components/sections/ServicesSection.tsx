
import React, { useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Swords, Fingerprint, Search } from 'lucide-react';
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
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
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
      style={{ transitionDelay: visible ? `${index * 120}ms` : '0ms', transformStyle: 'preserve-3d' }}
    >
      <Card className="glass-card p-8 text-white hover:border-primary/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 h-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
            <service.icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">{service.title}</h3>
        </div>
        
        <ul className="text-muted-foreground space-y-2">
          {service.capabilities.map((cap: string, idx: number) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <span className="text-primary mt-1">·</span>
              {cap}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

const ServicesSection = () => {
  const { ref, visible } = useScrollReveal(0.1);

  const services = [
    {
      icon: Shield,
      title: "AI Threat Detection",
      capabilities: [
        "Emerging narrative risk identification",
        "Hostile content discovery & tracking",
        "Search vulnerability analysis",
        "Sentiment volatility monitoring",
      ],
    },
    {
      icon: Swords,
      title: "Narrative Defense",
      capabilities: [
        "Strategic response architecture",
        "Content counterweight deployment",
        "Press balancing & correction",
        "Social narrative repositioning",
      ],
    },
    {
      icon: Fingerprint,
      title: "Identity Protection",
      capabilities: [
        "Impersonation scanning & alerts",
        "Profile cloning risk assessment",
        "Synthetic content detection",
        "Misinformation containment",
      ],
    },
    {
      icon: Search,
      title: "Search Positioning",
      capabilities: [
        "Defensive ranking strategy",
        "Reputation-safe visibility",
        "Authority content layering",
        "Long-term search resilience",
      ],
    },
  ];

  return (
    <section className="bg-gradient-to-b from-black via-gray-950 to-black py-24 relative" id="services">
      <div ref={ref} className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Intelligence-Grade <span className="text-primary">Protection</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Four integrated defence layers powered by A.R.I.A™ — built for high-profile individuals, brands, and organisations that cannot afford reputational exposure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} visible={visible} />
          ))}
        </div>

        <div className={`text-center transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Link to="/scan">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              Request Risk Assessment
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
