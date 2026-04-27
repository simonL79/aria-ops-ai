
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const PricingSection = () => {
  const { ref, visible } = useScrollReveal(0.1);

  const plans = [
    {
      name: "Basic",
      price: "£29",
      period: "/month",
      description: "Essential reputation monitoring",
      features: [
        "Personal reputation monitoring",
        "Basic threat detection",
        "Monthly reports",
        "Email support"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Individual",
      price: "£97",
      period: "/month",
      description: "Personal reputation monitoring",
      features: [
        "Personal reputation monitoring",
        "Advanced threat detection",
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
      price: "£397",
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
    }
  ];

  const enterprisePlan = {
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
    buttonText: "Contact Sales"
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-950 to-black">
      <div ref={ref} className={`container mx-auto px-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">
          Pricing
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`glass-card p-8 transition-colors hover:border-primary/30 ${
                plan.popular ? 'border-2 !border-primary' : ''
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-4 text-primary">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-card-foreground mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild 
                className={`w-full py-3 ${
                  plan.popular 
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border'
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
