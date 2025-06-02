
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="hero bg-black text-foreground py-20 relative overflow-hidden min-h-screen flex items-center">
      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-foreground">
              Elevate Your <span className="text-primary">Digital</span>
              <br />
              Reputation
            </h1>
            
            <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Enterprise-grade reputation intelligence and crisis prevention.
              <br />
              Powered by AI, delivered by experts who understand the stakes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                asChild 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium rounded-lg"
              >
                <Link to="/scan">
                  Request Assessment
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline"
                size="lg" 
                className="border-border text-foreground hover:bg-muted px-8 py-4 text-lg font-medium rounded-lg"
              >
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>

            <div className="space-y-4 text-center lg:text-left">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <span className="text-sm text-muted-foreground">Rated Excellent on Trustpilot</span>
              </div>
              <div className="flex items-center gap-1 justify-center lg:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">4.9 out of 5 (142 reviews)</span>
              </div>
              
              <div className="flex items-center gap-2 mt-4 justify-center lg:justify-start">
                <span className="text-sm text-muted-foreground">ISO certification compliant</span>
              </div>
              <div className="flex items-center gap-1 justify-center lg:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">5.0 stars from our existing customers</span>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 inline-flex items-center gap-2 mx-auto lg:mx-0">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground">Trusted by Fortune 500 companies</span>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src="/lovable-uploads/de814ec7-bdd9-4243-a0ea-06396aa78b51.png" 
                alt="Professional executive portrait"
                className="w-full max-w-md lg:max-w-lg rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-lg p-4 shadow-lg">
                <div className="text-sm text-muted-foreground mb-1">Threat Level</div>
                <div className="text-2xl font-bold text-primary">SECURE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
