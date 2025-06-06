
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "This intelligence platform helped us identify and neutralize a coordinated attack before it reached mainstream media. I don't know what we would have done without them.",
      author: "Sarah Chen",
      role: "Chief Marketing Officer",
      rating: 5
    },
    {
      text: "The speed of their analysis and speed of response is unmatched. They don't just monitor – they predict and prevent. Incredible for our adviser team safety.",
      author: "Michael Rodriguez",
      role: "Managing Partner",
      rating: 5
    }
  ];

  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-12">What Our Clients Say</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800 p-8 text-white">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
