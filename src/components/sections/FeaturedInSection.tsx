
import React from 'react';

const brands = ['BBC', 'Forbes', 'Bloomberg', 'Financial Times', 'TechCrunch', 'Reuters', 'The Guardian'];

const FeaturedInSection = () => {
  return (
    <section className="py-6 bg-background border-y border-border/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="text-center text-muted-foreground/40 text-xs uppercase tracking-[0.3em] mb-4">
          As Featured In
        </p>
      </div>
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={i}
              className="mx-10 text-muted-foreground/30 text-lg md:text-xl font-semibold uppercase tracking-[0.2em] select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedInSection;
