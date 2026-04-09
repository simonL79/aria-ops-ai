
import React, { useState } from 'react';
import { Star, Shield } from 'lucide-react';
import { useScrollReveal, useCountUp } from '@/hooks/useScrollReveal';

const TestimonialsSection = () => {
  const { ref: statsRef, visible: statsVisible } = useScrollReveal(0.3);
  const { ref: cardsRef, visible: cardsVisible } = useScrollReveal(0.1);

  const threats = useCountUp(500, 2000, statsVisible);
  const retention = useCountUp(98, 1800, statsVisible);
  const [liveCount] = useState(() => Math.floor(Math.random() * 50) + 120);
  const liveThreat = useCountUp(liveCount, 2500, statsVisible);

  const testimonials = [
    {
      text: "This intelligence platform helped us identify and neutralize a coordinated attack before it reached mainstream media. I don't know what we would have done without them.",
      role: "Chief Marketing Officer — Media & Entertainment",
      rating: 5
    },
    {
      text: "The speed of their analysis and speed of response is unmatched. They don't just monitor – they predict and prevent. Incredible for our adviser team safety.",
      role: "Managing Partner — Financial Services",
      rating: 5
    },
    {
      text: "After a competitor launched a smear campaign against our brand, A.R.I.A detected it within hours and gave us a clear counter-strategy. Worth every penny.",
      role: "CEO — Private Capital",
      rating: 5
    },
    {
      text: "We were getting buried by fake reviews. A.R.I.A mapped the attack network and helped us get them removed across three platforms in under a week.",
      role: "Director of Communications — Technology",
      rating: 5
    },
    {
      text: "As a public figure, my online reputation is everything. A.R.I.A gives me peace of mind with 24/7 monitoring and instant alerts when something surfaces.",
      role: "Founder & Investor — Venture Capital",
      rating: 5
    }
  ];

  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">What Our Clients Say</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Trusted by executives, founders, and public figures to protect what matters most — their reputation.
        </p>

        {/* Animated Stats bar */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-14">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">{threats}+</p>
            <p className="text-muted-foreground text-sm mt-1">Threats Neutralized</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">{retention}%</p>
            <p className="text-muted-foreground text-sm mt-1">Client Retention</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">24/7</p>
            <p className="text-muted-foreground text-sm mt-1">Active Monitoring</p>
          </div>
          <div className="text-center relative">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-[10px] font-semibold uppercase tracking-wider">Live</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-primary">{liveThreat}</p>
            <p className="text-muted-foreground text-sm mt-1">Threats Detected Today</p>
          </div>
        </div>
        
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass-card p-8 text-white transition-all duration-700 ${
                cardsVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: cardsVisible ? `${index * 120}ms` : '0ms' }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mr-4">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  <p className="text-muted-foreground/50 text-xs mt-0.5">Identity Protected</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
