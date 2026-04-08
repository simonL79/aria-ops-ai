
import React from 'react';
import { Shield, Clock, Brain, Lock, Users, Trophy, Briefcase, Crown } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const TrustSection = () => {
  const { ref, visible } = useScrollReveal(0.1);

  const sectors = [
    { icon: Trophy, label: 'Athletes & Sports Figures' },
    { icon: Briefcase, label: 'Founders & Executives' },
    { icon: Crown, label: 'Public Figures & Media' },
    { icon: Users, label: 'Family Offices & UHNW' },
  ];

  const outcomes = [
    { metric: '94%', desc: 'Negative content suppressed within 72 hours', detail: 'Entertainment — UK public figure' },
    { metric: '£2.1M', desc: 'Estimated brand value protected', detail: 'Finance — Series B founder' },
    { metric: '12hrs', desc: 'Average crisis response activation', detail: 'Sports — Premier League athlete' },
  ];

  const methodology = [
    { icon: Brain, title: 'AI Signal Monitoring', desc: 'Continuous scanning across 200+ sources including search, social, press, and dark web.' },
    { icon: Shield, title: 'Threat Classification', desc: 'Automated severity scoring with human analyst verification on all flagged content.' },
    { icon: Clock, title: 'Rapid Response', desc: 'Critical threats actioned within 4 hours. Strategic responses deployed within 24.' },
    { icon: Lock, title: 'Private Onboarding', desc: 'NDA-protected intake. Encrypted communications. No public client lists.' },
  ];

  return (
    <section className="py-24 bg-black" id="trust">
      <div ref={ref} className="container mx-auto px-6">
        {/* Discreet Client Sectors */}
        <div className={`text-center mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by the <span className="text-primary">Most Visible</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
            We work with individuals and organisations where reputation is existential — not optional.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {sectors.map((sector, i) => (
              <div key={i} className="glass-card p-6 flex flex-col items-center gap-3 text-center">
                <sector.icon className="w-8 h-8 text-primary" />
                <span className="text-sm text-muted-foreground">{sector.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anonymised Outcomes */}
        <div className={`mb-20 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="text-2xl font-bold text-white text-center mb-10">Anonymised Outcomes</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {outcomes.map((o, i) => (
              <div key={i} className="glass-card p-8 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{o.metric}</div>
                <p className="text-white text-sm mb-3">{o.desc}</p>
                <p className="text-xs text-muted-foreground italic">{o.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className={`transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h3 className="text-2xl font-bold text-white text-center mb-10">How We Operate</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {methodology.map((m, i) => (
              <div key={i} className="glass-card p-6">
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <m.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-white font-semibold mb-2">{m.title}</h4>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
