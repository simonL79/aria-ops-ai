import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

// Hero LCP image. Stable, pre-optimized variants live in /public/hero so the
// exact URLs can be preloaded from index.html (imagetools hashes prevent that).
const commandCentre = '/hero/command-centre-1280.jpg';
const commandCentreAvif =
  '/hero/command-centre-640.avif 640w, /hero/command-centre-1280.avif 1280w, /hero/command-centre-1920.avif 1920w';
const commandCentreWebp =
  '/hero/command-centre-640.webp 640w, /hero/command-centre-1280.webp 1280w, /hero/command-centre-1920.webp 1920w';

/*
  ARIA — The Digital Protection Platform
  Cinematic command-centre hero. One statement. One CTA.

  Headline alternates (easy swap):
   - "Control the narrative before someone else does."
   - "Your digital identity is now your greatest asset."
*/
const HEADLINE = 'Protect what the world believes about you.';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background text-foreground">
      {/* Cinematic full-bleed backdrop */}
      <picture>
        <source type="image/avif" srcSet={commandCentreAvif} sizes="100vw" />
        <source type="image/webp" srcSet={commandCentreWebp} sizes="100vw" />
        <img
          src={commandCentre}
          alt="ARIA digital intelligence command centre — analyst monitoring a global threat map"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1088}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>


      {/* Charcoal cinematic grade — legibility + depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />

      {/* Drifting intelligence motes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[
          { t: '22%', l: '58%', d: '0s', s: 3 },
          { t: '40%', l: '72%', d: '2s', s: 2 },
          { t: '64%', l: '64%', d: '4s', s: 4 },
          { t: '52%', l: '82%', d: '1s', s: 2 },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-primary/60 blur-[1px] animate-drift"
            style={{ top: p.t, left: p.l, width: p.s, height: p.s, animationDelay: p.d }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 w-full py-28">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/90">
              The Digital Protection Platform
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.04] text-foreground text-shadow-lg">
            {HEADLINE}
          </h1>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl">
            Protect your identity, reputation, legal position and digital footprint
            from a single AI-powered intelligence platform.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-9 py-6 text-base font-medium rounded-xl hover:shadow-[0_0_40px_hsl(var(--primary)/0.35)] transition-all duration-300"
            >
              <Link to="/scan">Request a confidential assessment</Link>
            </Button>

            <Link
              to="/services/legal-shield"
              className="group text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Explore ARIA Legal Shield
              <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
