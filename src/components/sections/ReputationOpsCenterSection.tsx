
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Map, Shield, Users, Zap, Eye } from 'lucide-react';

const ReputationOpsCenterSection = () => {
  const features = [
    {
      icon: <Activity className="h-5 w-5" />,
      text: "Live threat feed"
    },
    {
      icon: <Map className="h-5 w-5" />,
      text: "Heatmaps and filters"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      text: "Case thread management"
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: "Analyst coordination tools"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      text: "Playbook automation"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-premium-darkGray to-premium-black text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 rounded-full p-4">
              <Eye className="h-12 w-12" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Reputation Ops Center
          </h2>
          
          <p className="text-xl mb-8 text-white/90">
            ARIA doesn't just send alerts. It gives you a fully operational Command Center:
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-blue-400">
                  {feature.icon}
                </div>
                <span className="text-white">{feature.text}</span>
              </div>
            ))}
          </div>
          
          <p className="text-lg mb-8 text-white/80 italic">
            It's like having your own digital Langley — without the complexity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-premium-black px-8 py-3 text-lg font-semibold rounded-md shadow-lg hover:bg-gray-200">
              <Link to="/dashboard" className="flex items-center gap-2">
                Access Command Center <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-premium-black px-8 py-3">
              <Link to="/scan">
                Request Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReputationOpsCenterSection;
