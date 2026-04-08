
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-background text-foreground py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Contact A.R.I.A™</h1>
            <p className="text-xl text-muted-foreground text-center mb-12">
              Get in touch with our reputation intelligence experts
            </p>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Email Us</h3>
                    <p className="text-muted-foreground">simon@ariaops.co.uk</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Call Us</h3>
                    <p className="text-muted-foreground">Available upon request</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Locations</h3>
                    <p className="text-muted-foreground">United Kingdom</p>
                    <p className="text-muted-foreground">New York</p>
                    <p className="text-muted-foreground">Los Angeles</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Send us a message</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Subject</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Message</label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                      placeholder="Tell us about your needs..."
                    />
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3">
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
