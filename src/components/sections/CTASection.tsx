
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import CinematicImage from '@/components/ui/CinematicImage';

const CTASection = () => {
  return (
    <section id="cta-section" data-section="cta" className="py-28 md:py-36 bg-background relative overflow-hidden">
      {/* Cinematic CTA backdrop */}
      <img
        src={ctaBg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1920}
        height={1088}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/80" />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-primary/80">
            Begin in confidence
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.05]">
            Detect threats. Build cases.<br />
            <span className="text-primary">Before they escalate.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Request a private consultation with our intelligence and legal preparation team. Every engagement begins with absolute discretion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-medium rounded-xl hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-300"
            >
              <Link to="/scan">Start Free Reputation Scan</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 px-10 py-6 text-lg font-medium rounded-xl transition-all duration-300"
            >
              <Link to="/services/legal-shield">Open ARIA Legal Shield</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Response within 24 hours · NDA available on request
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
