
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

const DashboardMockup = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16" style={{ perspective: '1200px' }}>
      <div
        className="glass-card p-0 overflow-hidden shadow-2xl"
        style={{ transform: 'rotateX(4deg)', transformOrigin: 'center bottom' }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            ARIA Threat Intelligence
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-400/80">LIVE</span>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-px bg-white/5">
          {/* Threat Score */}
          <div className="p-5 bg-black/20 text-center space-y-2">
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Threat Score</div>
            <div className="text-3xl font-light text-primary">12</div>
            <div className="text-[10px] text-green-400/70">▼ Low Risk</div>
          </div>
          {/* Signals */}
          <div className="p-5 bg-black/20 text-center space-y-2 border-x border-white/5">
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Signals Monitored</div>
            <div className="text-3xl font-light text-white">2,847</div>
            <div className="text-[10px] text-muted-foreground">across 14 platforms</div>
          </div>
          {/* Risk Level */}
          <div className="p-5 bg-black/20 text-center space-y-2">
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Risk Level</div>
            <div className="text-3xl font-light text-green-400">Stable</div>
            <div className="text-[10px] text-muted-foreground">no escalation detected</div>
          </div>
        </div>

        {/* Scanning bar */}
        <div className="relative h-1 bg-white/5 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-[scanline-bar_3s_ease-in-out_infinite]" />
        </div>

        {/* Status footer */}
        <div className="px-4 py-2.5 bg-white/[0.02] flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground tracking-wide">Real-time monitoring active</span>
          <span className="text-[10px] text-muted-foreground">Last scan: 4s ago</span>
        </div>
      </div>
    </div>
  );
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

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/3 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10 w-full py-20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          {/* Simple logo */}
          <div className="flex justify-center mb-6">
            <Logo variant="light" size="3xl" />
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

          {/* Dashboard mockup */}
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
