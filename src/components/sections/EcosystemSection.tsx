import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fingerprint, Scale, Eye, Siren, ArrowUpRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/*
  The ARIA Ecosystem — one connected protection system.
  A central "Digital Protection" core with four orbiting domains, resting on
  the Intelligence Engine base. Pseudo-3D depth via layered transforms.
  Hover expands a node; click navigates to the matching page.
  Reduced-motion friendly: orbit drift is decorative only.
*/

interface Node {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
  href: string;
  // position around the core (percentage offsets)
  pos: string;
}

const NODES: Node[] = [
  {
    id: 'identity',
    icon: Fingerprint,
    title: 'Identity Protection',
    blurb: 'Guard who you are across search, social and synthetic content.',
    href: '/executive-reputation-protection',
    pos: 'top-0 left-1/2 -translate-x-1/2',
  },
  {
    id: 'reputation',
    icon: Eye,
    title: 'Reputation Intelligence',
    blurb: 'See every surface shaping how the world perceives you.',
    href: '/reputation-threat-score',
    pos: 'top-1/2 right-0 -translate-y-1/2',
  },
  {
    id: 'legal',
    icon: Scale,
    title: 'Legal Protection',
    blurb: 'Turn evidence into action with solicitor-ready response.',
    href: '/services/legal-shield',
    pos: 'bottom-0 left-1/2 -translate-x-1/2',
  },
  {
    id: 'crisis',
    icon: Siren,
    title: 'Crisis Response',
    blurb: 'Move fast when a narrative threatens to escalate.',
    href: '/crisis-reputation-management',
    pos: 'top-1/2 left-0 -translate-y-1/2',
  },
];

const EcosystemSection = () => {
  const { ref, visible } = useScrollReveal(0.1);
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="bg-background py-28 md:py-36 relative overflow-hidden" id="ecosystem">
      <div ref={ref} className="container mx-auto px-6">
        <div
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">
            One connected system
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-4 leading-tight">
            The ARIA ecosystem
          </h2>
          <p className="text-muted-foreground text-lg mt-5 leading-relaxed">
            Not a list of services — a single intelligence engine powering four
            domains of protection. Explore how each connects to the core.
          </p>
        </div>

        {/* Constellation */}
        <div
          className={`relative mx-auto aspect-square max-w-[560px] transition-all duration-1000 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* connecting rings */}
          <div className="absolute inset-[12%] rounded-full border border-primary/10" />
          <div className="absolute inset-[26%] rounded-full border border-primary/10" />

          {/* SVG filaments core -> nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" aria-hidden="true">
            <line x1="50" y1="50" x2="50" y2="8" stroke="hsl(var(--primary))" strokeOpacity="0.25" strokeWidth="0.4" />
            <line x1="50" y1="50" x2="92" y2="50" stroke="hsl(var(--primary))" strokeOpacity="0.25" strokeWidth="0.4" />
            <line x1="50" y1="50" x2="50" y2="92" stroke="hsl(var(--primary))" strokeOpacity="0.25" strokeWidth="0.4" />
            <line x1="50" y1="50" x2="8" y2="50" stroke="hsl(var(--primary))" strokeOpacity="0.25" strokeWidth="0.4" />
          </svg>

          {/* Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative flex h-32 w-32 md:h-40 md:w-40 flex-col items-center justify-center rounded-full bg-card/90 border border-primary/30 backdrop-blur-xl shadow-[0_0_60px_hsl(var(--primary)/0.25)]">
              <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping [animation-duration:4s]" />
              <span className="font-display text-lg md:text-xl font-semibold text-foreground">A.R.I.A™</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-primary/80 mt-1">Intelligence Engine</span>
            </div>
          </div>

          {/* Nodes */}
          {NODES.map((node) => (
            <Link
              key={node.id}
              to={node.href}
              onMouseEnter={() => setActive(node.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(node.id)}
              onBlur={() => setActive(null)}
              className={`group absolute ${node.pos} z-20 w-44 -m-2 outline-none`}
            >
              <div
                className={`glass-card flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 ${
                  active === node.id
                    ? 'border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.3)] -translate-y-1'
                    : 'hover:border-primary/30'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                  <node.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-display text-sm font-semibold text-foreground">{node.title}</span>
                <p
                  className={`text-xs text-muted-foreground leading-snug overflow-hidden transition-all duration-300 ${
                    active === node.id ? 'max-h-20 mt-2 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {node.blurb}
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-medium text-primary transition-all duration-300 ${
                    active === node.id ? 'max-h-6 mt-2 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  Explore <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
