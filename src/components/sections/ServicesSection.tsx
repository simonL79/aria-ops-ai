
import React, { useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Swords, Fingerprint, Search, Brain, Scale, ArrowRight } from 'lucide-react';
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
      <Card className="glass-card p-8 text-foreground hover:border-primary/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
            <service.icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${service.category === 'Legal Response' ? 'bg-blue-500/15 text-blue-400' : 'bg-primary/15 text-primary'}`}>
              {service.category}
            </span>
            <h3 className="text-xl font-bold mt-1">{service.title}</h3>
          </div>
        </div>

        <ul className="text-muted-foreground space-y-2 mb-6 flex-1">
          {service.capabilities.map((cap: string, idx: number) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <span className="text-primary mt-1">·</span>
              {cap}
            </li>
          ))}
        </ul>

        <Link
          to={service.href}
          className="group/btn mt-auto inline-flex items-center justify-center gap-2 w-full rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary font-medium px-5 py-3 transition-all duration-300"
        >
          Explore {service.title}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Link>
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
      category: "AI Monitoring",
      href: "/reputation-threat-score",
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
      category: "AI Monitoring",
      href: "/crisis-reputation-management",
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
      category: "AI Monitoring",
      href: "/services/online-impersonation-uk",
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
      category: "AI Monitoring",
      href: "/ai-search-visibility",
      capabilities: [
        "Defensive ranking strategy",
        "Reputation-safe visibility",
        "Authority content layering",
        "Long-term search resilience",
      ],
    },
    {
      icon: Brain,
      title: "AI Reputation Readiness",
      category: "AI Monitoring",
      href: "/ai-reputation-readiness",
      capabilities: [
        "What ChatGPT, Gemini & Perplexity say about you",
        "LLM interpretation & trust signal audit",
        "Agent-recommendation likelihood scoring",
        "Structured presence for the agentic web",
      ],
    },
    {
      icon: Scale,
      title: "Legal Defence & Compliance",
      category: "Legal Response",
      href: "/legal-defence-compliance",
      capabilities: [
        "GDPR takedowns & right-to-erasure enforcement",
        "Cease & desist automation with evidence pack",
        "Defamation case preparation & counsel hand-off",
        "SOC II / ISO 27001-aligned audit trail",
      ],
    },
  ];

  return (
    <section className="bg-gradient-to-b from-background via-background to-background py-24 relative" id="services">
      <div ref={ref} className="container mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Intelligence-Grade <span className="text-primary">Protection</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Six integrated defence layers powered by A.R.I.A™ — built for high-profile individuals, brands, and organisations that cannot afford reputational exposure. Select any layer below to explore it in detail.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
