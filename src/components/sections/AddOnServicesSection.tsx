
import React, { useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const AddOnServiceCard = ({ service, index, visible }: { service: { title: string; description: string }; index: number; visible: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: visible ? `${index * 120}ms` : '0ms', transformStyle: 'preserve-3d' }}
    >
      <Card className="bg-gray-800/60 backdrop-blur-md border border-gray-700/50 p-6 text-white hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] transition-all duration-500 h-full">
        <h4 className="font-bold mb-3 text-orange-400">{service.title}</h4>
        <p className="text-gray-300 text-sm">{service.description}</p>
      </Card>
    </div>
  );
};

const AddOnServicesSection = () => {
  const { ref, visible } = useScrollReveal(0.15);

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
      <div ref={ref} className="container mx-auto px-6">
        <h3 className={`text-2xl font-bold text-orange-500 text-center mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Add-On Services</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {addOnServices.map((service, index) => (
            <AddOnServiceCard key={index} service={service} index={index} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AddOnServicesSection;
