
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CTASection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: ''
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
    setFormData({ fullName: '', email: '', company: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground">
            Ready to Secure Your Reputation?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Get a comprehensive assessment of your digital risk profile. Our experts will 
            identify vulnerabilities and provide a strategic roadmap.
          </p>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full p-4 text-lg rounded-lg border-border bg-background"
                  required
                />
              </div>
              
              <div>
                <Input
                  type="email"
                  placeholder="Corporate Email *"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-4 text-lg rounded-lg border-border bg-background"
                  required
                />
              </div>
              
              <div>
                <Input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full p-4 text-lg rounded-lg border-border bg-background"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium rounded-lg"
              >
                Get Assessment →
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground mt-4">
              * Response within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
