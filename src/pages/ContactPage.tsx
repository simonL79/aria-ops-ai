
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Contact A.R.I.A™</h1>
            <p className="text-xl text-gray-300 text-center mb-12">
              Get in touch with our reputation intelligence experts
            </p>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Mail className="h-6 w-6 text-orange-500" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                    <p className="text-gray-300">simon@ariaops.co.uk</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  <Phone className="h-6 w-6 text-orange-500" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-300">Available upon request</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  <MapPin className="h-6 w-6 text-orange-500" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Locations</h3>
                    <p className="text-gray-300">United Kingdom</p>
                    <p className="text-gray-300">New York</p>
                    <p className="text-gray-300">Los Angeles</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="Tell us about your needs..."
                    />
                  </div>
                  
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ContactPage;
