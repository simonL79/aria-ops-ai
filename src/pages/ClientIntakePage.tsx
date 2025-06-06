
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Building, User, AlertTriangle } from 'lucide-react';

const ClientIntakePage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    brand_or_alias: '',
    industry: '',
    company_size: '',
    threat_description: '',
    concern_areas: [] as string[],
    risk_tolerance: '',
    urgency_level: '',
    budget_range: '',
    preferred_contact_method: 'email',
    additional_information: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConcernAreaChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      concern_areas: checked 
        ? [...prev.concern_areas, area]
        : prev.concern_areas.filter(item => item !== area)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.full_name || !formData.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Submit to Supabase with correct field mapping
      const { error } = await supabase
        .from('client_intake_submissions')
        .insert([{
          full_name: formData.full_name,
          email: formData.email,
          brand_or_alias: formData.brand_or_alias,
          concern_areas: formData.concern_areas, // This is already an array
          risk_tolerance: formData.risk_tolerance,
          urgency_level: formData.urgency_level,
          additional_information: formData.additional_information,
          consent_to_process: true, // Required field
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Submission error:', error);
        toast.error('Failed to submit intake form. Please try again.');
        return;
      }

      toast.success('Intake form submitted successfully! We will contact you within 24 hours.');
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        brand_or_alias: '',
        industry: '',
        company_size: '',
        threat_description: '',
        concern_areas: [],
        risk_tolerance: '',
        urgency_level: '',
        budget_range: '',
        preferred_contact_method: 'email',
        additional_information: ''
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-corporate-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Client Intake Form</h1>
          <p className="text-corporate-lightGray">
            Secure consultation request for A.R.I.A™ reputation protection services
          </p>
        </div>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-corporate-accent" />
              Confidential Client Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name" className="text-white">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="bg-corporate-darkTertiary border-corporate-border text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-corporate-darkTertiary border-corporate-border text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand_or_alias" className="text-white">Brand/Company Name</Label>
                  <Input
                    id="brand_or_alias"
                    value={formData.brand_or_alias}
                    onChange={(e) => handleInputChange('brand_or_alias', e.target.value)}
                    className="bg-corporate-darkTertiary border-corporate-border text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-corporate-darkTertiary border-corporate-border text-white"
                  />
                </div>
              </div>

              {/* Threat Description */}
              <div>
                <Label htmlFor="threat_description" className="text-white">Threat Description</Label>
                <Textarea
                  id="threat_description"
                  value={formData.threat_description}
                  onChange={(e) => handleInputChange('threat_description', e.target.value)}
                  className="bg-corporate-darkTertiary border-corporate-border text-white"
                  placeholder="Describe the reputation threat or concern..."
                  rows={4}
                />
              </div>

              {/* Concern Areas */}
              <div>
                <Label className="text-white mb-3 block">Areas of Concern</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Social Media',
                    'Search Results',
                    'News Coverage',
                    'Employee Issues',
                    'Customer Reviews',
                    'Legal Issues'
                  ].map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={formData.concern_areas.includes(area)}
                        onCheckedChange={(checked) => handleConcernAreaChange(area, !!checked)}
                      />
                      <Label htmlFor={area} className="text-corporate-lightGray text-sm">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk and Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Risk Tolerance</Label>
                  <Select value={formData.risk_tolerance} onValueChange={(value) => handleInputChange('risk_tolerance', value)}>
                    <SelectTrigger className="bg-corporate-darkTertiary border-corporate-border text-white">
                      <SelectValue placeholder="Select risk tolerance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Conservative approach</SelectItem>
                      <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                      <SelectItem value="high">High - Aggressive approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Urgency Level</Label>
                  <Select value={formData.urgency_level} onValueChange={(value) => handleInputChange('urgency_level', value)}>
                    <SelectTrigger className="bg-corporate-darkTertiary border-corporate-border text-white">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Within 30 days</SelectItem>
                      <SelectItem value="medium">Medium - Within 7 days</SelectItem>
                      <SelectItem value="high">High - Within 24 hours</SelectItem>
                      <SelectItem value="critical">Critical - Immediate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <Label htmlFor="additional_information" className="text-white">Additional Information</Label>
                <Textarea
                  id="additional_information"
                  value={formData.additional_information}
                  onChange={(e) => handleInputChange('additional_information', e.target.value)}
                  className="bg-corporate-darkTertiary border-corporate-border text-white"
                  placeholder="Any additional information or special requirements..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-corporate-accent hover:bg-corporate-accentDark text-black font-semibold"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Confidential Intake Form'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientIntakePage;
