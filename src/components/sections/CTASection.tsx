
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const CTASection = () => {
  return (
    <section id="get-started" className="cta premium-gradient text-white py-24 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-shadow">Ready to Take Control of Your Reputation?</h2>
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-premium-silver">
          Start with a free reputation scan and get your first threat report within 24 hours.
        </p>
        <div className="space-y-6">
          <Button asChild size="lg" className="bg-white text-premium-black px-12 py-7 text-lg font-bold rounded-md shadow-lg hover:bg-premium-silver hover:shadow-xl transition-all duration-300">
            <Link to="/scan">Scan My Name Now</Link>
          </Button>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-green-400" />
              <span>Free initial scan</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-5 w-5 text-green-400" />
              <span>24/7 monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
