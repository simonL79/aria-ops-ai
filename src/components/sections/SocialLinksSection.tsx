
import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const socialLinks = [
  { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const SocialLinksSection = () => {
  const { ref, visible } = useScrollReveal(0.3);

  return (
    <section className="bg-black py-8">
      <div ref={ref} className={`container mx-auto px-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="text-center mb-6">
          <p className="text-white text-lg mb-2">Trusted Across Social Platforms</p>
        </div>
        <div className="flex justify-center items-center space-x-8">
          {socialLinks.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:scale-110"
            >
              <Icon className="h-8 w-8" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialLinksSection;
