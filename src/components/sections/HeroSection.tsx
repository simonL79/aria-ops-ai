
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="hero bg-black text-white py-32 relative overflow-hidden min-h-screen flex items-center">
      <div className="container mx-auto px-6 text-center relative z-10 w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight">
            Elevate Your
            <br />
            Online Reputation
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed text-gray-300">
            Safeguard your brand, enhance your presence,
            <br />
            and transform your image with our comprehensive solutions.
          </p>

          <Button 
            asChild 
            size="lg" 
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-medium rounded-lg"
          >
            <Link to="/scan">
              Request a Demo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
