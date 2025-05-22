
import React from 'react';

const TestimonialCard = ({ quote, author, role, imageUrl }: { 
  quote: string; 
  author: string; 
  role: string; 
  imageUrl: string;
}) => (
  <div className="premium-card p-8 rounded-xl flex flex-col h-full">
    <div className="mb-6">
      <svg className="w-10 h-10 text-premium-darkGray mx-auto" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>
    <p className="mb-6 text-premium-darkGray italic flex-grow">{quote}</p>
    <div className="flex items-center mt-auto">
      {imageUrl && (
        <div className="mr-3">
          <img src={imageUrl} alt={author} className="w-10 h-10 rounded-full object-cover" />
        </div>
      )}
      <div>
        <strong className="text-premium-black font-medium block">{author}</strong>
        {role && <span className="text-sm text-premium-darkGray">{role}</span>}
      </div>
    </div>
  </div>
);

const EnhancedTestimonialsSection = () => {
  const testimonials = [
    {
      quote: "A.R.I.A was able to find negative articles about me that I didn't even know existed. Within 3 months, none of them appeared in the first 3 pages of Google.",
      author: "James K.",
      role: "CEO, Technology Startup",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256"
    },
    {
      quote: "After a competitor launched a smear campaign, A.R.I.A detected it within hours and helped us craft the perfect response. The crisis was contained before it could spread.",
      author: "Sarah W.",
      role: "Marketing Director",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256"
    },
    {
      quote: "As a public figure, I need to know what's being said about me online. A.R.I.A doesn't just tell me—it helps me do something about it.",
      author: "Michael R.",
      role: "Professional Speaker",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256"
    },
    {
      quote: "The Dark Web monitoring alerted me to a data breach affecting my personal information before it was public. That alone was worth the investment.",
      author: "Priya T.",
      role: "Financial Advisor",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256"
    }
  ];

  return (
    <section className="testimonials py-24 text-center bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-premium-black">Success Stories</h2>
        <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto text-premium-darkGray">
          Join hundreds of individuals and businesses who've taken control of their online reputation.
        </p>
        
        <div className="flex justify-center mb-16">
          <div className="flex space-x-4">
            <div className="bg-premium-silver/20 px-4 py-2 rounded-full flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-sm font-medium text-premium-darkGray">500+ Clients Protected</span>
            </div>
            <div className="bg-premium-silver/20 px-4 py-2 rounded-full flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-sm font-medium text-premium-darkGray">97% Success Rate</span>
            </div>
            <div className="bg-premium-silver/20 px-4 py-2 rounded-full flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-sm font-medium text-premium-darkGray">4.9/5 Client Rating</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              imageUrl={testimonial.imageUrl}
            />
          ))}
        </div>
        
        <div className="mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
              <span className="ml-2 text-premium-black font-medium">4.9 out of 5</span>
            </div>
            <p className="text-premium-darkGray text-center">Based on 127 verified client reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedTestimonialsSection;
