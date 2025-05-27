
import React from 'react';
import { Button } from "@/components/ui/button";

interface FinalCTASectionProps {
  onScrollToForm: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const FinalCTASection = ({ onScrollToForm }: FinalCTASectionProps) => {
  return (
    <section className="bg-blue-900 text-white py-16 px-6 text-center">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">✉️ Ready to Stay Ahead of the Story?</h2>
        <div className="mb-8">
          <p className="text-xl mb-2">Your name shouldn't be left unguarded.</p>
          <p className="text-xl mb-2">Your past shouldn't define your future.</p>
          <p className="text-xl font-bold">Your story shouldn't be written without you.</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <Button asChild size="lg" className="bg-white text-blue-900 px-12 py-6 text-lg font-bold rounded-lg shadow-lg hover:bg-blue-50">
            <a href="#scan-form" onClick={onScrollToForm}>
              🔍 Request Your Private Scan
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
