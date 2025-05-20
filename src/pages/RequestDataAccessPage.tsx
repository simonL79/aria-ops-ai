
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StickyHeader from '@/components/layout/StickyHeader';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Send, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

const RequestDataAccessPage = () => {
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [requestType, setRequestType] = useState<string>('access');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    identifiers: '',
    details: '',
    consent: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, consent: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.consent) {
      toast.error("Please complete all required fields");
      return;
    }
    
    // In a real implementation, this would send the request to the backend
    // For now, we'll just simulate a successful submission
    toast.success("Request submitted successfully", {
      description: "We've received your request and will process it within 30 days."
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
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-premium-black">GDPR Data Request</h1>
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
                <p className="mb-6 text-muted-foreground">
                  Use this form to submit a request regarding your personal data under GDPR. We will respond to your request within 30 days.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Request Type</h3>
                    <RadioGroup 
                      value={requestType} 
                      onValueChange={setRequestType} 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="access" id="access" />
                        <Label htmlFor="access" className="font-medium">
                          Data Access (SAR)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="delete" id="delete" />
                        <Label htmlFor="delete" className="font-medium">
                          Data Deletion
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="rectify" id="rectify" />
                        <Label htmlFor="rectify" className="font-medium">
                          Data Correction
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="restrict" id="restrict" />
                        <Label htmlFor="restrict" className="font-medium">
                          Restrict Processing
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName" 
                      placeholder="John Smith"
                      value={formData.fullName}
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="identifiers">Identifiers (Optional)</Label>
                    <Input
                      id="identifiers"
                      name="identifiers"
                      placeholder="Social media handles, business names, etc."
                      value={formData.identifiers}
                      onChange={handleChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Any identifiers that may help us locate your data (e.g. Twitter handle, company name)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="details">Request Details</Label>
                    <Textarea
                      id="details"
                      name="details"
                      placeholder="Please provide any additional details about your request"
                      className="min-h-[100px]"
                      value={formData.details}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex items-start space-x-2 pt-4">
                    <Checkbox 
                      id="consent" 
                      checked={formData.consent}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="consent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I confirm that I am making this request about my own personal data *
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        We need to verify identity before processing requests to protect privacy.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="deliver" 
                    className="w-full"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit GDPR Request
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
                  Thank you for submitting your request. We have received it and will process it within 30 days as required by GDPR regulations.
                </p>
                <p className="mb-8 text-muted-foreground">
                  A confirmation email has been sent to your email address with your request reference number.
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
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Your information is handled in accordance with our Privacy Policy.</p>
            <p className="mt-2">For urgent inquiries, please contact dpo@ariaops.co.uk</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RequestDataAccessPage;
