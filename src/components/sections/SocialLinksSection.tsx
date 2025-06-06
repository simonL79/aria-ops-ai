
import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const SocialLinksSection = () => {
  return (
    <section className="bg-black py-8">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-white text-lg mb-2">Trusted Across Social Platforms</p>
        </div>
        <div className="flex justify-center items-center space-x-8">
          <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <Facebook className="h-8 w-8" />
          </div>
          <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <Instagram className="h-8 w-8" />
          </div>
          <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <Linkedin className="h-8 w-8" />
          </div>
          <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <Youtube className="h-8 w-8" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialLinksSection;
