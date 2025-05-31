
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

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
      <PublicHeader showBackButton={true} />

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
            <Card className="bg-[#1A1B1E] border-gray-800 hover:border-amber-600/50 transition-colors">
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
                    className="w-full bg-amber-600 hover:bg-amber-500 text-black font-semibold py-3 transform hover:scale-105 transition-all duration-200"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-[#1A1B1E] border-gray-800 p-8 hover:border-amber-600/50 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <Mail className="h-8 w-8 text-amber-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Email</h3>
                    <p className="text-gray-300">contact@aria-intelligence.com</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1A1B1E] border-gray-800 p-8 hover:border-amber-600/50 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <Phone className="h-8 w-8 text-amber-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Phone</h3>
                    <p className="text-gray-300">Available upon request</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1A1B1E] border-gray-800 p-8 hover:border-amber-600/50 transition-colors">
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

              {/* Testimonial Card */}
              <Card className="bg-[#1A1B1E] border-gray-800 p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-4 italic">
                  "A.R.I.A's intelligence platform helped us identify and neutralize a coordinated attack before it reached mainstream media. Essential for any serious organization."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-white">Sarah Chen</p>
                    <p className="text-sm text-gray-400">Chief Communications Officer</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};

export default ContactPage;
