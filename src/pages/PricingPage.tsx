
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const plans = [
    {
      name: "Individual",
      price: "£2,500",
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
      name: "Executive",
      price: "£7,500",
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
    <PublicLayout>
      <div className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
            <p className="text-xl text-gray-300 text-center mb-12">
              Choose the protection level that's right for you
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div 
                  key={index}
                  className={`bg-gray-900 rounded-lg p-8 relative ${
                    plan.popular ? 'border-2 border-orange-500' : 'border border-gray-800'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-orange-500 mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
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
                  
                  <Link to="/contact">
                    <button 
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        plan.popular 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                          : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-300 mb-4">
                Need a custom solution? We offer bespoke packages for unique requirements.
              </p>
              <Link to="/contact">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PricingPage;
