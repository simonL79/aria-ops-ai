
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your message. We\'ll get back to you soon!');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-[#0A0B0D]/95 backdrop-blur">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-3">
              <ArrowLeft className="h-5 w-5" />
              <img 
                src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
                alt="A.R.I.A Logo" 
                className="h-12 w-auto"
              />
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-black">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Get In Touch With <span className="text-amber-400">A.R.I.A™</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to protect your digital reputation? Contact our experts for a confidential consultation and personalized risk assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-[#1A1B1E] border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-400">Request Assessment</CardTitle>
                <p className="text-gray-300">Fill out the form below and we'll get back to you within 24 hours.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
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
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                      placeholder="your.email@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                      placeholder="Tell us about your reputation management needs..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-500 text-black font-semibold py-3"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-[#1A1B1E] border-gray-800 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Mail className="h-8 w-8 text-amber-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Email</h3>
                    <p className="text-gray-300">Simon@ariaops.co.uk</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1A1B1E] border-gray-800 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <MapPin className="h-8 w-8 text-amber-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Location</h3>
                    <p className="text-gray-300">United Kingdom</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-amber-600/10 to-transparent border-amber-600/20 p-8">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Why Choose A.R.I.A™?</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                    <span>Enterprise-grade reputation intelligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                    <span>24/7 monitoring and crisis prevention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                    <span>Confidential and secure service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                    <span>Trusted by professionals across industries</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800/50">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-400">
            &copy; 2025 A.R.I.A™ — Advanced Reputation Intelligence & Analysis. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
