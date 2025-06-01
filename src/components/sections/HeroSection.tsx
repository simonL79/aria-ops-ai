
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="hero bg-background text-foreground py-32 relative overflow-hidden min-h-screen flex items-center">
      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight text-foreground">
              Elevate Your
              <br />
              Online Reputation
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed text-muted-foreground">
              Safeguard your brand, enhance your presence,
              <br />
              and transform your image with our comprehensive solutions.
            </p>

            <Button 
              asChild 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium rounded-lg"
            >
              <Link to="/scan">
                Request a Demo
              </Link>
            </Button>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src="/lovable-uploads/de814ec7-bdd9-4243-a0ea-06396aa78b51.png" 
                alt="Professional executive portrait"
                className="w-full max-w-md lg:max-w-lg rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
