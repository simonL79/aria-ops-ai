
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const PricingSection = () => {
  const { ref, visible } = useScrollReveal(0.1);

  const plans = [
    {
      name: "Private",
      subtitle: "For individuals",
      features: ["Confidential reputation scan", "Threat monitoring", "Priority email support"],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Executive",
      subtitle: "For founders & leaders",
      features: ["Everything in Private", "24/7 AI monitoring", "Crisis response team", "Dark web scanning"],
      buttonText: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      subtitle: "For organisations",
      features: ["Everything in Executive", "Multi-entity coverage", "Dedicated account manager", "Custom SLA"],
      buttonText: "Contact Us",
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div ref={ref} className={`container mx-auto px-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-4xl md:text-5xl font-light mb-16 text-center text-white">
          Pricing
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-gray-900/50 p-8 rounded-lg border transition-colors hover:border-orange-500/50 ${
                plan.popular ? 'border-orange-500' : 'border-gray-800'
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-light mb-2 text-center text-white">{plan.name}</h3>
              <p className="text-gray-400 text-center mb-8">{plan.subtitle}</p>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild 
                className={`w-full py-3 ${
                  plan.popular 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                }`}
              >
                <Link to="/contact">
                  {plan.buttonText}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
