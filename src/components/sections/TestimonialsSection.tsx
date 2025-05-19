
import React from 'react';

const TestimonialsSection = () => {
  return (
    <section className="testimonials bg-gray-100 py-24 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-premium-black">Real Recovery. Real People.</h2>
        <p className="text-lg md:text-xl mb-16 max-w-xl mx-auto text-premium-gray">
          We've helped founders, influencers, and businesses clear their name and reclaim their future.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="premium-card p-8 rounded-xl">
            <div className="mb-6">
              <svg className="w-10 h-10 text-premium-silver mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="mb-6 text-premium-gray italic">"ARIA helped bury 3 negative articles that haunted my business for years."</p>
            <strong className="text-premium-darkGray font-medium">– Former Tech CEO</strong>
          </div>
          <div className="premium-card p-8 rounded-xl">
            <div className="mb-6">
              <svg className="w-10 h-10 text-premium-silver mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="mb-6 text-premium-gray italic">"I got a call from a law firm. A.R.I.A™ flagged it before Google did."</p>
            <strong className="text-premium-darkGray font-medium">– Influencer, UK</strong>
          </div>
          <div className="premium-card p-8 rounded-xl">
            <div className="mb-6">
              <svg className="w-10 h-10 text-premium-silver mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="mb-6 text-premium-gray italic">"This is the digital PR assistant I didn't know I needed."</p>
            <strong className="text-premium-darkGray font-medium">– Private Client</strong>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
