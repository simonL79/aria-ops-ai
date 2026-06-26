
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import heroHeader from '@/assets/aria-hero-header.png';

const useLayoutReady = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const prepare = async () => {
      // Wait for all web fonts to load so the headline reserve renders at its final metrics.
      if ('fonts' in document && document.fonts) {
        try { await document.fonts.ready; } catch { /* ignore unsupported */ }
      }
      // Wait for the next paint to ensure the invisible headline has laid out.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) setReady(true);
        });
      });
    };
    prepare();
    return () => { cancelled = true; };
  }, []);

  return ready;
};

const useTypewriter = (text: string, speed = 45, delay = 600) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ready = useLayoutReady();

  useEffect(() => {
    if (!ready) return;
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
  }, [text, speed, delay, ready]);

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
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
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
        <div className="grid grid-cols-3 gap-px bg-muted/40">
          {/* Threat Score */}
          <div className="p-5 bg-card text-center space-y-2">
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Threat Score</div>
            <div className="text-3xl font-light text-primary">12</div>
            <div className="text-[10px] text-green-400/70">▼ Low Risk</div>
          </div>
          {/* Signals */}
          <div className="p-5 bg-card text-center space-y-2 border-x border-border">
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Signals Monitored</div>
            <div className="text-3xl font-light text-foreground">2,847</div>
            <div className="text-[10px] text-muted-foreground">across 14 platforms</div>
          </div>
          {/* Risk Level */}
          <div className="p-5 bg-card text-center space-y-2">
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Risk Level</div>
            <div className="text-3xl font-light text-green-400">Stable</div>
            <div className="text-[10px] text-muted-foreground">no escalation detected</div>
          </div>
        </div>

        {/* Scanning bar */}
        <div className="relative h-1 bg-muted/40 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-[scanline-bar_3s_ease-in-out_infinite]" />
        </div>

        {/* Status footer */}
        <div className="px-4 py-2.5 bg-muted/30 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground tracking-wide">Real-time monitoring active</span>
          <span className="text-[10px] text-muted-foreground">Last scan: 4s ago</span>
        </div>
      </div>
    </div>
  );
};

const HERO_HEADLINE = 'AI Reputation & Legal Intelligence That Detects Risk Before It Escalates';

const renderHeadlineWords = (text: string) =>
  text.split(' ').map((word, i) => (
    <React.Fragment key={i}>
      {i > 0 && ' '}
      {['Reputation', 'Legal', 'Intelligence', 'Risk'].includes(word.replace(/[^a-zA-Z]/g, '')) ? (
        <span className="text-primary">{word}</span>
      ) : (
        <span>{word}</span>
      )}
    </React.Fragment>
  ));

const HeroSection = () => {
  const { displayed, done } = useTypewriter(HERO_HEADLINE, 40, 250);

  const scrollToThreatScore = () => {
    const el = document.getElementById('threat-score');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-b from-background via-background to-secondary/40 text-foreground min-h-screen flex items-center overflow-hidden">
      {/* Grid overlay — faint gold lattice */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `linear-gradient(hsl(258 90% 66% / 0.35) 1px, transparent 1px), linear-gradient(90deg, hsl(258 90% 66% / 0.35) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)'
      }} />

      {/* Champagne ambient light */}
      <div className="absolute top-1/3 left-1/4 w-[36rem] h-[36rem] bg-primary/[0.10] rounded-full blur-[160px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-[hsl(199_92%_60%/0.08)] rounded-full blur-[140px]" />



      <div className="container mx-auto px-6 relative z-10 w-full py-20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          {/* Hero header image */}
          <div className="flex justify-center mb-6">
            <img
              src={heroHeader}
              alt="A.R.I.A — AI Reputation Intelligence Agent reputation operations command center"
              className="w-full max-w-3xl h-auto rounded-xl shadow-2xl"
              loading="eager"
            />
          </div>

          {/*
            CLS lock: an invisible copy of the final headline reserves the full
            wrapped height at every breakpoint, while the typed text overlays it.
            This prevents the h1 (and the blinking cursor) from shifting as
            characters appear, which was the main CLS offender.
          */}
          <h1 className="relative text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight text-foreground">
            <span aria-hidden="true" className="invisible block">
              {renderHeadlineWords(HERO_HEADLINE)}
            </span>
            <span className="absolute inset-0 block">
              {renderHeadlineWords(displayed)}
              {!done && (
                <span
                  aria-hidden="true"
                  className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 align-text-bottom animate-pulse"
                />
              )}
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            ARIA Ops combines AI signal monitoring, predictive threat analysis, and solicitor-ready legal defence to protect reputations and resolve disputes in real time.
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
              className="border-border text-foreground hover:bg-muted/40 px-10 py-6 text-lg font-medium rounded-xl transition-all duration-300"
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
