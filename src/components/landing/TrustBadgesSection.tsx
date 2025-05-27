
import React from 'react';
import { Shield, TrendingUp, Eye } from "lucide-react";

const TrustBadgesSection = () => {
  const badges = [
    {
      icon: Shield,
      text: "🔐 GDPR Compliant"
    },
    {
      icon: TrendingUp,
      text: "📊 Used by Agencies & Enterprises"
    },
    {
      icon: Eye,
      text: "🧠 Human + AI Verified"
    },
    {
      icon: Shield,
      text: "🛡 Built in the UK"
    }
  ];

  return (
    <section className="py-8 px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div key={index} className="flex items-center">
                <IconComponent className="h-5 w-5 mr-2" />
                {badge.text}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;
