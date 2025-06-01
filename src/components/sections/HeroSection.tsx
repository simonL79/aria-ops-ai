
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Eye, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from '@/components/ui/logo';

const HeroSection = () => {
  return (
    <section className="hero bg-corporate-dark text-white py-12 sm:py-16 lg:py-24 relative overflow-hidden min-h-screen flex items-center">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-corporate-dark via-corporate-darkSecondary to-corporate-darkTertiary opacity-95"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-corporate-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-corporate-accent/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
          
          {/* Logo and Brand */}
          <div className="mb-8 sm:mb-12">
            <Logo variant="light" size="xl" className="mb-6 aria-logo" />
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-corporate-accent/10 border border-corporate-accent/20 mb-6">
              <Shield className="w-4 h-4 mr-2 text-corporate-accent" />
              <span className="text-corporate-accent font-medium text-sm">AI-Powered Reputation Defense</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight corporate-heading">
            Your Digital Reputation
            <br />
            <span className="text-corporate-accent bg-gradient-to-r from-corporate-accent to-yellow-400 bg-clip-text text-transparent">
              Under Command
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-12 max-w-4xl leading-relaxed text-corporate-lightGray">
            ARIA™ is your real-time Reputation NOC — a centralized threat intelligence hub built for rapid digital risk response.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full">
            <div className="flex items-center justify-center md:justify-start space-x-3 p-4 rounded-lg bg-corporate-darkTertiary/50 border border-corporate-border">
              <Eye className="w-6 h-6 text-corporate-accent flex-shrink-0" />
              <span className="text-white font-medium">24/7 Monitoring</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 p-4 rounded-lg bg-corporate-darkTertiary/50 border border-corporate-border">
              <Zap className="w-6 h-6 text-corporate-accent flex-shrink-0" />
              <span className="text-white font-medium">Instant Alerts</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 p-4 rounded-lg bg-corporate-darkTertiary/50 border border-corporate-border">
              <Shield className="w-6 h-6 text-corporate-accent flex-shrink-0" />
              <span className="text-white font-medium">Threat Mitigation</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
            <Button asChild size="lg" className="corporate-button px-8 sm:px-12 py-4 sm:py-6 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 amber-glow">
              <Link to="/scan" className="flex items-center justify-center gap-3">
                Enter Command Center 
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 sm:px-12 py-4 sm:py-6 text-lg font-semibold rounded-lg border-2 border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black transition-all duration-300"
              asChild
            >
              <Link to="/how-it-works">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-corporate-border w-full max-w-4xl">
            <p className="text-corporate-lightGray text-sm mb-4">Trusted by founders, influencers, and enterprises worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-corporate-lightGray text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>UK Built</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
