
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StickyHeader from '@/components/layout/StickyHeader';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield, FileText, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const DPARequestPage = () => {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.companyName || !formData.contactName || !formData.email) {
      toast.error("Please complete all required fields");
      return;
    }
    
    // In a real implementation, this would send the request to the backend
    // For now, we'll just simulate a successful submission
    toast.success("DPA request submitted successfully", {
      description: "We'll send the Data Processing Agreement to your email shortly."
    });
    
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-premium-silver/20">
      {/* Sticky Navigation */}
      <StickyHeader isScrolled={true} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-premium-black">Request Data Processing Agreement</h1>
          </div>
          
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => navigate('/gdpr-compliance')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to GDPR Compliance
          </Button>
          
          {!formSubmitted ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="h-5 w-5 text-green-600" />
                  <p className="text-muted-foreground">
                    Request our standard Data Processing Agreement (DPA) that outlines our GDPR compliance measures.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName" 
                      placeholder="Acme Corporation"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      name="contactName" 
                      placeholder="John Smith"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      We'll send the DPA to this email address
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information (Optional)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Any specific requirements or questions about our DPA"
                      className="min-h-[100px]"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="deliver" 
                    className="w-full"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Request DPA Document
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Request Submitted</h2>
                <p className="mb-6">
                  Thank you for requesting our Data Processing Agreement. We'll send it to your email address shortly.
                </p>
                <p className="mb-8 text-muted-foreground">
                  If you don't receive the DPA within 24 hours, please check your spam folder or contact us at legal@ariaops.co.uk
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-2">About Our Data Processing Agreement</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Our standard DPA includes:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mb-4">
              <li>Details of data processing activities</li>
              <li>Security measures implemented</li>
              <li>Data subject rights procedures</li>
              <li>Breach notification processes</li>
              <li>Sub-processor management</li>
              <li>Transfer mechanism for international data flows</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              For custom DPA requirements, please include details in the message field above.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DPARequestPage;
