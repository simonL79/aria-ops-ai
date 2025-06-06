
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyEmail: '',
    company: '',
    phoneNumber: '',
    details: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Get a comprehensive assessment of your digital risk profile. Our experts will identify vulnerabilities and provide a strategic roadmap.
            </h2>
          </div>

          <Card className="bg-gray-900 border-gray-800 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Full Name</label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Company Email</label>
                <Input
                  name="companyEmail"
                  type="email"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  placeholder="your.email@company.com"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Company</label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Phone Number</label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Brief Details</label>
                <Textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Briefly describe your needs or concerns..."
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 resize-none"
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
              >
                Request Risk Assessment
              </Button>

              <p className="text-gray-400 text-xs text-center">
                * Information stays confidential
              </p>
            </form>
          </Card>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">© 2025 A.R.I.A — All Reputation Rights Reserved</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
