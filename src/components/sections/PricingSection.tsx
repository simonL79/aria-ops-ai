
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Private",
      subtitle: "Professional plan",
      features: ["Confidential Care", "Contact us"],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Executive",
      subtitle: "Professional plan",
      features: ["Confidential Care", "Contact us"],
      buttonText: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      subtitle: "Professional plan", 
      features: ["Confidential Care", "Contact us"],
      buttonText: "Get Started",
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-16 text-center">
          Pricing
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-gray-900 p-8 rounded-lg border ${
                plan.popular ? 'border-amber-500' : 'border-gray-700'
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-light mb-2 text-center">{plan.name}</h3>
              <p className="text-gray-400 text-center mb-8">{plan.subtitle}</p>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild 
                className={`w-full py-3 ${
                  plan.popular 
                    ? 'bg-amber-500 hover:bg-amber-600 text-black' 
                    : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
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
