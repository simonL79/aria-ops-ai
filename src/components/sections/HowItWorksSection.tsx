
import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const HowItWorksSection = () => {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section id="how-it-works" className="py-24 text-center bg-black">
      <div ref={ref} className={`container mx-auto px-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-white">How A.R.I.A™ Defends You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">1</div>
            <div className="glass-card p-8 h-full hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-white">Scan & Detect</h3>
              <p className="text-muted-foreground">A.R.I.A™ searches the web — news, social, forums — for any mention of your name or brand.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">2</div>
            <div className="glass-card p-8 h-full hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-white">Analyze & Score</h3>
              <p className="text-muted-foreground">Mentions are AI-scored for severity, category, and urgency — instantly.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">3</div>
            <div className="glass-card p-8 h-full hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-white">Suppress & Repair</h3>
              <p className="text-muted-foreground">We push down damaging links, publish optimized content, and notify you in real-time.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
