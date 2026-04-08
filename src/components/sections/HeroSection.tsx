
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from '../ui/logo';

const useTypewriter = (text: string, speed = 45, delay = 600) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
};

const HeroSection = () => {
  const { displayed, done } = useTypewriter(
    'AI Reputation Intelligence That Detects Risk Before It Escalates',
    40,
    800
  );

  const scrollToThreatScore = () => {
    const el = document.getElementById('threat-score');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-950 to-black text-foreground min-h-screen flex items-center overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/3 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 relative z-10 w-full py-20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="flex justify-center mb-6">
            <Logo variant="light" size="10x" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight text-white min-h-[2.4em]">
            {displayed.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {i > 0 && ' '}
                {['Intelligence', 'Risk'].includes(word) ? (
                  <span className="text-primary">{word}</span>
                ) : (
                  <span>{word}</span>
                )}
              </React.Fragment>
            ))}
            {!done && <span className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 animate-pulse align-text-bottom" />}
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            ARIA Ops combines AI signal monitoring, predictive threat analysis, and strategic human response systems to protect reputations in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={scrollToThreatScore}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-medium rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300"
            >
              Get Free Threat Score
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-white hover:bg-white/5 px-10 py-6 text-lg font-medium rounded-xl transition-all duration-300"
            >
              <Link to="/scan">
                Book Private Consultation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
