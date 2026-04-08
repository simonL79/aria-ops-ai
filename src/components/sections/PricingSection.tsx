
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const PricingSection = () => {
  const { ref, visible } = useScrollReveal(0.1);

  const plans = [
    {
      name: "Individual",
      price: "£97",
      period: "/month",
      description: "Personal reputation monitoring",
      features: [
        "Personal reputation monitoring",
        "Basic threat detection",
        "Monthly reports",
        "Email support",
        "Social media monitoring",
        "Search engine tracking"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "PRO",
      price: "£297",
      period: "/month",
      description: "Executive protection suite",
      features: [
        "Executive protection suite",
        "Advanced threat intelligence",
        "Real-time alerts",
        "Crisis response team",
        "Weekly reports",
        "Priority support",
        "Dark web monitoring",
        "Proactive content strategy"
      ],
      buttonText: "Most Popular",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Full organization coverage",
      features: [
        "Full organization coverage",
        "Custom threat models",
        "Dedicated account manager",
        "API access",
        "Daily reports",
        "24/7 support",
        "Multi-entity monitoring",
        "Advanced analytics dashboard"
      ],
      buttonText: "Contact Sales",
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
                plan.popular ? 'border-2 border-orange-500' : 'border-gray-800'
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-4 text-orange-500">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <p className="text-gray-300 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
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
