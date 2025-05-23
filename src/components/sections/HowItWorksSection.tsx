
import React from 'react';

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 text-center bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black">How A.R.I.A™ Defends You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl">1</div>
            <div className="border-2 border-gray-300 p-8 rounded-xl h-full shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Scan & Detect</h3>
              <p className="text-gray-600">A.R.I.A™ searches the web — news, social, forums — for any mention of your name or brand.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl">2</div>
            <div className="border-2 border-gray-300 p-8 rounded-xl h-full shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Analyze & Score</h3>
              <p className="text-gray-600">Mentions are AI-scored for severity, category, and urgency — instantly.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl">3</div>
            <div className="border-2 border-gray-300 p-8 rounded-xl h-full shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Suppress & Repair</h3>
              <p className="text-gray-600">We push down damaging links, publish optimized content, and notify you in real-time.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
