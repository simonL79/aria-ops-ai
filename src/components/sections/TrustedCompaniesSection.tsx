
import React from 'react';
import { Facebook, Instagram, Linkedin, X, Youtube } from 'lucide-react';

const TrustedCompaniesSection = () => {
  const socialPlatforms = [
    { name: "Facebook", Icon: Facebook },
    { name: "Instagram", Icon: Instagram },
    { name: "LinkedIn", Icon: Linkedin },
    { name: "X (Twitter)", Icon: X },
    { name: "YouTube", Icon: Youtube }
  ];

  return (
    <section className="py-16 bg-black border-t border-gray-700">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 lg:gap-20">
          {socialPlatforms.map((platform, index) => (
            <div key={index} className="text-gray-400 opacity-60 hover:opacity-100 transition-opacity">
              <platform.Icon size={48} className="mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompaniesSection;
