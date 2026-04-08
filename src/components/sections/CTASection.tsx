
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section id="cta-section" data-section="cta" className="py-24 bg-black relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Know Your Risk Before<br />
            <span className="text-primary">The World Does</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Request a private consultation with our intelligence team. Every engagement begins with absolute discretion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-medium rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300"
            >
              <Link to="/scan">Book Private Consultation</Link>
            </Button>

            <Button
              onClick={() => document.getElementById('threat-score')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              size="lg"
              className="border-border text-white hover:bg-white/5 px-10 py-6 text-lg font-medium rounded-xl transition-all duration-300"
            >
              Get Free Threat Score
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
