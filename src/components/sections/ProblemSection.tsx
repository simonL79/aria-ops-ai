
import React from 'react';
import { Bug, Scale, Search } from 'lucide-react';

const ProblemSection = () => {
  return (
    <section className="problem bg-gray-100 py-24 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-premium-black">One Post Can Wreck Everything</h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-16 text-premium-gray">
          Whether it's a tweet, a review, or a hit piece — your name online shapes your future. Most people discover the damage when it's too late.
          <span className="block mt-2 font-semibold text-premium-darkGray">A.R.I.A™ changes that.</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="premium-card p-8 rounded-xl transform hover:-translate-y-1">
            <div className="bg-red-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Bug className="h-8 w-8 text-premium-silver" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-premium-darkGray">Viral Complaints</h3>
            <p className="text-premium-gray">Flagged & suppressed before they can spread</p>
          </div>
          <div className="premium-card p-8 rounded-xl transform hover:-translate-y-1">
            <div className="bg-blue-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Scale className="h-8 w-8 text-premium-silver" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-premium-darkGray">Legal Threats</h3>
            <p className="text-premium-gray">Monitored & classified to reduce risk</p>
          </div>
          <div className="premium-card p-8 rounded-xl transform hover:-translate-y-1">
            <div className="bg-green-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Search className="h-8 w-8 text-premium-silver" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-premium-darkGray">Google Results</h3>
            <p className="text-premium-gray">Buried & replaced with positive content</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
