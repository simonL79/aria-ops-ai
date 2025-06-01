
import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Laura M.",
      title: "ENTREPRENEUR, HOSPITALITY",
      quote: "Real impact on our business reputation and growth.",
      image: "/lovable-uploads/25cdb440-ad52-4fdf-a3a0-24ef40720b24.png"
    },
    {
      name: "Andrew R.",
      title: "STRATEGIC CONSULTANT, HEALTHCARE",
      quote: "Exceptional service and measurable results for our brand.",
      image: "/lovable-uploads/25cdb440-ad52-4fdf-a3a0-24ef40720b24.png"
    },
    {
      name: "Sarah W.",
      title: "DIRECTOR OF GROWTH, STARTUPS",
      quote: "Transformed our online presence completely.",
      image: "/lovable-uploads/25cdb440-ad52-4fdf-a3a0-24ef40720b24.png"
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8">
            Real Stories,
            <br />
            Real Results
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Learn from our success stories. Our clients have experienced remarkable transformations in their online reputation and business growth.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-900 p-8 rounded-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-700 rounded-full mr-4 overflow-hidden">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm uppercase tracking-wide">{testimonial.title}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
