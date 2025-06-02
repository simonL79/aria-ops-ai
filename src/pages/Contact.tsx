
import React, { useState } from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PublicLayout>
        <div className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Contact A.R.I.A™</h1>
                <p className="text-xl text-gray-300">
                  Get in touch with our reputation intelligence experts
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                          Company/Organization
                        </label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                          placeholder="Your company name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                          placeholder="What can we help you with?"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 min-h-[120px]"
                          placeholder="Tell us more about your needs..."
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-8">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-2xl text-white">Get in Touch</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-orange-500 mt-1" />
                        <div>
                          <h3 className="font-semibold text-white">Email</h3>
                          <p className="text-gray-300">Simon@ariaops.co.uk</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-orange-500 mt-1" />
                        <div>
                          <h3 className="font-semibold text-white">Location</h3>
                          <p className="text-gray-300">London, United Kingdom</p>
                          <p className="text-sm text-gray-400">Global operations</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <Clock className="h-6 w-6 text-orange-500 mt-1" />
                        <div>
                          <h3 className="font-semibold text-white">Response Time</h3>
                          <p className="text-gray-300">24 hours for general inquiries</p>
                          <p className="text-gray-300">2 hours for urgent matters</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-white">Emergency Response</h3>
                      <p className="text-gray-300 mb-4">
                        Facing an immediate reputation crisis? Our emergency response team 
                        is available 24/7 for urgent situations.
                      </p>
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        Emergency Contact
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    </div>
  );
};

export default Contact;
