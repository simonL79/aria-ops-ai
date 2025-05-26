
import React from 'react';
import { Shield, Zap, Users, Eye } from 'lucide-react';

const NOCFeaturesSection = () => {
  const features = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Realtime Threat NOC",
      description: "A mission-style control center to manage threats like a pro."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Augmented Triage",
      description: "Our smart assistant generates summaries, playbooks, and next steps."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Case Threading",
      description: "Group related threats across platforms into centralized investigations."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Operator Console",
      description: "Assign, prioritize, resolve — all from a unified dashboard."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-premium-black">
            Your Reputation Operations Center
          </h2>
          <p className="text-xl text-premium-gray max-w-3xl mx-auto">
            Professional-grade threat intelligence tools built for rapid response and centralized command.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-premium-black text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-premium-black">
                {feature.title}
              </h3>
              <p className="text-premium-gray">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NOCFeaturesSection;
