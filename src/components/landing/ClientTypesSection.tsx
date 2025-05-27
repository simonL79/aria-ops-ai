
import React from 'react';
import { Card } from "@/components/ui/card";

const ClientTypesSection = () => {
  const clientTypes = [
    {
      emoji: "🚀",
      title: "Executives",
      description: "Founders, CEOs, and public leaders"
    },
    {
      emoji: "🎙",
      title: "Creators",
      description: "Influencers and professionals"
    },
    {
      emoji: "🏢",
      title: "Organizations",
      description: "Brands, agencies, and legal teams"
    },
    {
      emoji: "🧑‍💼",
      title: "Individuals",
      description: "Private people with reputational vulnerabilities"
    }
  ];

  return (
    <section className="py-16 px-6 bg-blue-50">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">💡 Who We Help</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientTypes.map((client, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-4xl mb-4">{client.emoji}</div>
              <h3 className="font-semibold mb-2">{client.title}</h3>
              <p className="text-gray-600">{client.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientTypesSection;
