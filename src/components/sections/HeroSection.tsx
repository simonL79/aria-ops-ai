
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from '@/components/ui/logo';

const HeroSection = () => {
  return (
    <section className="hero bg-gradient-to-r from-premium-black to-premium-darkGray text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000')] bg-cover bg-center opacity-5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <Logo variant="light" size="xl" className="mb-6" />
          <div className="text-center">
            <p className="text-lg md:text-xl mb-4 text-blue-200 font-medium">
              Your Reputation Is Being Shaped Online
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight text-shadow-lg">
              Monitor. Analyze. <span className="text-white">Command.</span>
            </h1>
          </div>
        </div>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed text-white text-center">
          ARIA is your real-time Reputation NOC — a centralized threat intelligence hub built for rapid digital risk response.
        </p>
        <div className="flex justify-center w-full">
          <Button asChild size="lg" className="w-full max-w-md bg-white text-premium-black px-8 py-7 text-lg font-semibold rounded-md shadow-lg hover:bg-gray-200 transition-all duration-300 hover:shadow-xl mx-auto">
            <Link to="/scan" className="flex items-center justify-center gap-2">
              Enter Command Center <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
