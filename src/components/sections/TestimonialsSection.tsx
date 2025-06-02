
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      title: "STARTUP FOUNDER & CEO",
      quote: "ARIA's intelligence platform helped us identify and neutralize a coordinated attack before it reached mainstream media. Their proactive approach saved our Series A funding round.",
      initials: "SC",
      rating: 5
    },
    {
      name: "Michael Rodriguez", 
      title: "MANAGING PARTNER, HEALTHCARE",
      quote: "The speed of their analysis and speed of response is unmatched. They don't just monitor - they predict and prevent. Essential for any serious organization.",
      initials: "MR",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-white">
            What Our Clients Say
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-900 p-8 rounded-lg border border-gray-700 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              
              <blockquote className="text-lg text-gray-300 leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-14 h-14 bg-orange-500 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">{testimonial.initials}</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm uppercase tracking-wide">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
