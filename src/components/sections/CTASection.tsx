
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CTASection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phoneNumber: '',
    socialMedia: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would typically send to your backend
    console.log('Assessment request:', formData);
    toast.success("Assessment request submitted! We'll be in touch within 24 hours.");
    
    // Reset form
    setFormData({ fullName: '', email: '', company: '', phoneNumber: '', socialMedia: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="cta-section" data-section="cta" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-white">
            Ready to Secure Your Reputation?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Get a comprehensive assessment of your digital risk profile. Our experts will 
            identify vulnerabilities and provide a strategic roadmap.
          </p>

          <div className="max-w-md mx-auto space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-left mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-left mb-2">Corporate Email</label>
                <input 
                  type="email" 
                  placeholder="your.email@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-left mb-2">Company</label>
                <input 
                  type="text" 
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-left mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-left mb-2">Social Media</label>
                <input 
                  type="text" 
                  placeholder="@username or profile URL"
                  value={formData.socialMedia}
                  onChange={(e) => handleInputChange('socialMedia', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-lg font-medium rounded-lg mt-6 transition-colors"
              >
                Request Your Assessment →
              </button>
            </form>
            
            <p className="text-sm text-gray-400 mt-4">
              * Response within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
