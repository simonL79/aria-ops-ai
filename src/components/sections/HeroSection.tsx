
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from '@/components/ui/logo';

const HeroSection = () => {
  return (
    <section className="hero bg-gradient-to-r from-corporate-dark to-corporate-darkSecondary text-white py-8 sm:py-12 lg:py-16 relative overflow-hidden min-h-[80vh] sm:min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000')] bg-cover bg-center opacity-5"></div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
          <Logo variant="light" size="lg" className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl aria-logo" />
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-sm sm:text-lg md:text-xl mb-3 sm:mb-4 text-corporate-accent font-medium px-4">
              Your Reputation Is Being Shaped Online
            </p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-shadow-lg px-4 corporate-heading">
              Monitor. Analyze. <span className="text-corporate-accent">Command.</span>
            </h1>
          </div>
        </div>
        
        <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed text-corporate-lightGray text-center px-4">
          ARIA is your real-time Reputation NOC — a centralized threat intelligence hub built for rapid digital risk response.
        </p>
        
        <div className="flex justify-center w-full px-4">
          <Button asChild size="lg" className="w-full sm:w-auto sm:max-w-md corporate-button px-6 sm:px-8 py-4 sm:py-7 text-base sm:text-lg font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 amber-glow">
            <Link to="/scan" className="flex items-center justify-center gap-2">
              Enter Command Center <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
