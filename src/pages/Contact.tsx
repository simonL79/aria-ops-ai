
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Your message has been sent! We'll get back to you within 24 hours.");
      setIsSubmitting(false);
      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-[#0A0B0D]/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/37370275-bf62-4eab-b0e3-e184ce3fa142.png" 
              alt="A.R.I.A Logo" 
              className="h-16 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to protect your digital reputation? Our experts are standing by to provide 
              a confidential consultation and assessment of your current risk profile.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-[#1A1B1E] border-gray-800 p-8">
              <h2 className="text-2xl font-bold mb-6 text-amber-400">Request Assessment</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                    placeholder="john.smith@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <Input
                    id="company"
                    name="company"
                    className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    How can we help you?
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="bg-[#0A0B0D] border-gray-700 text-white placeholder-gray-400 focus:border-amber-600"
                    placeholder="Tell us about your reputation management needs, current challenges, or any specific concerns..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-black font-semibold py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  All communications are confidential and secure
                </p>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-[#1A1B1E] border-gray-800 p-8">
                <h2 className="text-2xl font-bold mb-6 text-amber-400">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-amber-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-300">contact@aria-ai.com</p>
                      <p className="text-sm text-gray-400">For general inquiries</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-amber-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Emergency Hotline</h3>
                      <p className="text-gray-300">+1 (555) ARIA-911</p>
                      <p className="text-sm text-gray-400">24/7 crisis response</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-amber-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Headquarters</h3>
                      <p className="text-gray-300">London, United Kingdom</p>
                      <p className="text-sm text-gray-400">Global operations center</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-amber-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Response Time</h3>
                      <p className="text-gray-300">Within 24 hours</p>
                      <p className="text-sm text-gray-400">Initial consultation</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1A1B1E] border-gray-800 p-8">
                <h3 className="text-xl font-bold mb-4 text-amber-400">Why Choose A.R.I.A™?</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                    <span>AI-powered threat detection and prevention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                    <span>24/7 monitoring across all digital channels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                    <span>Expert crisis management and response</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2"></div>
                    <span>Trusted by Fortune 500 companies</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
