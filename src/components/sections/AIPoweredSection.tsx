
import React from 'react';

const AIPoweredSection = () => {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight">
              Powered by AI,
              <br />
              Delivered by Experts
            </h2>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-amber-500 text-sm">SENTIMENT SCORE (1-10)</span>
                <span className="text-white text-2xl font-bold">5/6</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Positive</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-white">74%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Neutral</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full w-1/4"></div>
                  </div>
                  <span className="text-white">21%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Negative</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full w-1/12"></div>
                  </div>
                  <span className="text-white">5%</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-amber-500 text-xs mb-2">TREND ANALYSIS</div>
                <svg className="w-full h-12" viewBox="0 0 200 50">
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    points="0,40 40,30 80,20 120,25 160,15 200,10"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="w-80 h-80 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4"></div>
                <div className="text-gray-400">Professional headshot placeholder</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIPoweredSection;
