
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Zap, Target } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: "Basic Protection",
      price: "£299",
      period: "/month",
      description: "Essential reputation monitoring for individuals",
      features: [
        "24/7 Digital Monitoring",
        "Basic Threat Detection",
        "Monthly Reports",
        "Email Alerts",
        "Social Media Scanning"
      ],
      icon: Shield,
      popular: false
    },
    {
      name: "Professional Shield",
      price: "£599",
      period: "/month",
      description: "Advanced protection for professionals and small businesses",
      features: [
        "Everything in Basic",
        "Real-time Threat Response",
        "Advanced AI Analysis",
        "Weekly Reports",
        "Priority Support",
        "Brand Monitoring",
        "SEO Protection"
      ],
      icon: Target,
      popular: true
    },
    {
      name: "Enterprise Fortress",
      price: "£1,299",
      period: "/month",
      description: "Complete protection suite for large organizations",
      features: [
        "Everything in Professional",
        "Custom Response Plans",
        "Dedicated Account Manager",
        "Daily Reports",
        "Crisis Management",
        "Legal Support Network",
        "Executive Protection",
        "Multi-entity Monitoring"
      ],
      icon: Zap,
      popular: false
    }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your Protection Level
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive reputation protection tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <Card key={index} className={`bg-gray-800 border-gray-700 relative ${plan.popular ? 'ring-2 ring-orange-500' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <IconComponent className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-white">
                      {plan.price}
                      <span className="text-lg text-gray-400">{plan.period}</span>
                    </div>
                    <p className="text-gray-300">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                      } text-white`}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              Need a custom solution? Contact us for enterprise pricing.
            </p>
            <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PricingPage;
