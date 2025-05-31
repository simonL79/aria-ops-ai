
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

const ContactFormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: 'general',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your inquiry. Our sales team will contact you within 24 hours!');
    setFormData({ name: '', email: '', company: '', phone: '', inquiryType: 'general', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      <PublicHeader showBackButton={true} backButtonText="Back to Services" backButtonPath="/pricing" />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <MessageCircle className="h-16 w-16 text-amber-400" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Contact <span className="text-amber-400">Sales</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to protect your reputation with A.R.I.A™? Let's discuss your specific needs and create a tailored solution for your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Sales Form */}
            <div className="lg:col-span-2">
              <Card className="bg-[#1A1B1E] border-gray-800 hover:border-amber-600/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl text-amber-400">Get Started Today</CardTitle>
                  <p className="text-gray-300">Tell us about your needs and we'll create a custom solution.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Business Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                          Company *
                        </label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                          className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                          placeholder="Your company name"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                          placeholder="+44 20 1234 5678"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-300 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full bg-[#0A0B0D] border border-gray-700 text-white rounded-md px-3 py-2 focus:border-amber-600 focus:outline-none"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="enterprise">Enterprise Solution</option>
                        <option value="crisis">Crisis Management</option>
                        <option value="monitoring">Reputation Monitoring</option>
                        <option value="compliance">Compliance & Legal</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Tell us about your needs *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                        placeholder="Describe your reputation management challenges, goals, and any specific requirements..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-500 text-black font-semibold py-3 transform hover:scale-105 transition-all duration-200"
                    >
                      Get Custom Quote <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sales Information */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-amber-600/10 to-transparent border-amber-600/20 p-6">
                <h3 className="text-xl font-bold text-amber-400 mb-4">What to Expect</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Response within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Free consultation call</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Custom solution proposal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>No obligation quote</span>
                  </li>
                </ul>
              </Card>

              <Card className="bg-[#1A1B1E] border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Enterprise Features</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 24/7 monitoring across all platforms</li>
                  <li>• Real-time crisis alerts</li>
                  <li>• Executive dashboard & reports</li>
                  <li>• Dedicated account manager</li>
                  <li>• Custom integration options</li>
                  <li>• Compliance & legal support</li>
                </ul>
              </Card>

              <Card className="bg-[#1A1B1E] border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-3">Need immediate help?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  For urgent reputation threats, contact our emergency response team.
                </p>
                <Button variant="outline" className="w-full border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black">
                  Emergency Support
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};

export default ContactFormPage;
