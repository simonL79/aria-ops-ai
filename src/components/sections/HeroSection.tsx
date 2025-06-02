
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Star, Shield } from 'lucide-react';
import Logo from '../ui/logo';

const HeroSection = () => {
  return (
    <section className="hero bg-black text-foreground py-20 relative overflow-hidden min-h-screen flex items-center">
      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div className="space-y-8 text-center">
            <div className="flex justify-center mb-8">
              <Logo variant="light" size="10x" />
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-foreground">
              Elevate Your <span className="text-orange-500">Digital</span>
              <br />
              Reputation
            </h1>
            
            <p className="text-xl md:text-2xl leading-relaxed text-white max-w-2xl mx-auto">
              Enterprise-grade reputation intelligence and crisis prevention.
              <br />
              Powered by AI, delivered by experts who understand the stakes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-medium rounded-lg"
              >
                <Link to="/scan">
                  Request Assessment
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline"
                size="lg" 
                className="border-border text-white hover:bg-muted px-8 py-4 text-lg font-medium rounded-lg"
              >
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>

            <div className="space-y-4 text-center">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-sm text-white">Rated Excellent on Trustpilot</span>
              </div>
              <div className="flex items-center gap-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-green-500 text-green-500" />
                ))}
                <span className="ml-2 text-sm text-white">4.9 out of 5 (142 reviews)</span>
              </div>
              
              <div className="flex items-center gap-2 mt-4 justify-center">
                <span className="text-sm text-white">ISO certification compliant</span>
              </div>
              <div className="flex items-center gap-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-sky-400 text-sky-400" />
                ))}
                <span className="ml-2 text-sm text-white">5.0 stars from our existing customers</span>
              </div>
              
              <div className="flex items-center gap-2 mt-4 justify-center">
                <img 
                  src="/lovable-uploads/cf3113a6-304c-4988-ba15-a87157313c78.png" 
                  alt="Verified" 
                  className="h-5 w-5"
                />
                <span className="text-sm text-white">Social Media Verified</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="/lovable-uploads/de814ec7-bdd9-4243-a0ea-06396aa78b51.png" 
                alt="Professional executive portrait"
                className="w-full max-w-md lg:max-w-lg rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-6 left-6">
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-sm font-medium rounded-lg shadow-lg flex items-center gap-2"
                >
                  <Shield className="h-5 w-5" />
                  <div className="text-center">
                    <div className="text-lg font-bold">Trusted to Protect</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
