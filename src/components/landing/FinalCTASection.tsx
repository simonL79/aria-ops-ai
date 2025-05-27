
import React from 'react';
import { Button } from "@/components/ui/button";

interface FinalCTASectionProps {
  onScrollToForm: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const FinalCTASection = ({ onScrollToForm }: FinalCTASectionProps) => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <div className="inline-block p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
            Ready to Stay Ahead of the Story?
          </div>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Your Reputation Deserves Protection
        </h2>
        
        <div className="mb-12 space-y-4 text-xl">
          <div className="group hover:bg-white/5 rounded-lg p-4 transition-all duration-300">
            <p className="text-slate-200 group-hover:text-white transition-colors">Your name shouldn't be left unguarded.</p>
          </div>
          <div className="group hover:bg-white/5 rounded-lg p-4 transition-all duration-300">
            <p className="text-slate-200 group-hover:text-white transition-colors">Your past shouldn't define your future.</p>
          </div>
          <div className="group hover:bg-white/5 rounded-lg p-4 transition-all duration-300">
            <p className="font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Your story shouldn't be written without you.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <Button 
            asChild 
            size="lg" 
            className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-16 py-8 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 border border-white/20"
          >
            <a href="#scan-form" onClick={onScrollToForm} className="flex items-center">
              <div className="w-4 h-4 bg-white rounded-full mr-4 group-hover:animate-pulse"></div>
              Request Your Private Scan
            </a>
          </Button>
          
          <p className="text-sm text-slate-300 mt-6 opacity-75">
            Secure • Confidential • Professional
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
