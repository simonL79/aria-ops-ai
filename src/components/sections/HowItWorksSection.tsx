
import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const STEPS = [
  {
    n: '01',
    title: 'AI Monitoring',
    body: 'ARIA continuously scans the surfaces that shape your reputation — search, news, social, forums and the dark web — for any mention of your name, brand or legal exposure.',
  },
  {
    n: '02',
    title: 'Analyse & Score',
    body: 'Mentions and disputes are AI-scored for severity, category and urgency — instantly, with evidence-grade documentation behind every signal.',
  },
  {
    n: '03',
    title: 'Suppress & Repair',
    body: 'We push down damaging links, position authoritative content, and notify you in real time as the narrative is restored.',
  },
  {
    n: '04',
    title: 'Legal Response',
    body: 'When a threat crosses into legal exposure, ARIA Legal Shield™ prepares evidence packs, letters and solicitor-ready case files.',
  },
];

const HowItWorksSection = () => {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section id="how-it-works" className="py-28 md:py-36 bg-background">
      <div
        ref={ref}
        className={`container mx-auto px-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">
            The system
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4 leading-tight">
            How A.R.I.A™ defends you
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {STEPS.map((step, index) => (
            <div
              key={step.n}
              className={`glass-card p-8 h-full hover:border-primary/30 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: visible ? `${index * 120}ms` : '0ms' }}
            >
              <span className="font-display text-4xl font-semibold text-primary/30">{step.n}</span>
              <h3 className="font-display text-xl font-semibold mt-4 mb-3 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
