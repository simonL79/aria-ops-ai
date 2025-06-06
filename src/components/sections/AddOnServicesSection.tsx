
import React from 'react';
import { Card } from '@/components/ui/card';

const AddOnServicesSection = () => {
  const addOnServices = [
    {
      title: "Dark Web Lead Monitoring",
      description: "Get immediate alerts when threats appear in underground forums or encrypted channels."
    },
    {
      title: "AI Initiative Watching",
      description: "Track AI models being EXCLUSIVELY trained on negative content about you or your brand."
    },
    {
      title: "Family Reputation Package",
      description: "Comprehensive protection for family members including children and extended relatives."
    },
    {
      title: "Full Service Takeovers",
      description: "We run the entire reputation defense operation — from monitoring to response."
    }
  ];

  return (
    <section className="bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        <h3 className="text-2xl font-bold text-orange-500 text-center mb-8">Add-On Services</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {addOnServices.map((service, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 p-6 text-white">
              <h4 className="font-bold mb-3 text-orange-400">{service.title}</h4>
              <p className="text-gray-300 text-sm">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddOnServicesSection;
