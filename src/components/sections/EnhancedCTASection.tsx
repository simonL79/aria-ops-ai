
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from 'lucide-react';

const EnhancedCTASection = () => {
  return (
    <section id="enhanced-cta" className="py-24 text-center bg-gradient-to-r from-premium-black to-premium-darkGray text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-shadow">Take Control of Your Online Reputation Today</h2>
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-white">
          Don't let others define your digital presence. Get ahead of potential threats and take charge of your narrative.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Request Your Scan</h3>
            <p className="text-white mb-4">Get a comprehensive analysis of your current online presence.</p>
            <Button asChild variant="outline" className="mt-auto border-white text-white hover:bg-white hover:text-premium-darkGray">
              <Link to="/scan">Start Here</Link>
            </Button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Review Your Report</h3>
            <p className="text-white mb-4">Understand your risks and opportunities with our detailed analysis.</p>
            <Button asChild variant="outline" className="mt-auto border-white text-white hover:bg-white hover:text-premium-darkGray">
              <Link to="/resources">Learn More</Link>
            </Button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Take Action</h3>
            <p className="text-white mb-4">Implement our recommendations or let us handle it for you.</p>
            <Button asChild variant="outline" className="mt-auto border-white text-white hover:bg-white hover:text-premium-darkGray">
              <Link to="/pricing">View Plans</Link>
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <Button asChild size="lg" className="bg-white text-premium-black px-12 py-7 text-lg font-bold rounded-md shadow-lg hover:bg-gray-200 hover:shadow-xl transition-all duration-300">
            <Link to="/scan" className="flex items-center">
              Get Your Free Reputation Scan <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <p className="text-sm text-white mt-4">
            No credit card required. Get your initial report within 24 hours.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-green-400" />
              <span className="text-white">Free initial scan</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-green-400" />
              <span className="text-white">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-green-400" />
              <span className="text-white">24/7 monitoring</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-green-400" />
              <span className="text-white">Expert recommendations</span>
            </div>
          </div>
          
          <div className="inline-block mt-8">
            <Button asChild variant="link" className="text-white hover:text-gray-200">
              <Link to="/calendar" className="flex items-center">
                Or schedule a 1-on-1 consultation <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedCTASection;
