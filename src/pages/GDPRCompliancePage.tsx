
import React from 'react';
import StickyHeader from '@/components/layout/StickyHeader';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Shield, UserPlus, Eye, FileText, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GDPRCompliancePage = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-premium-silver/20">
      {/* Sticky Navigation */}
      <StickyHeader isScrolled={true} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-premium-black">A.R.I.A™ GDPR Compliance</h1>
          </div>
          
          <p className="text-gray-600 mb-8">Last updated: {currentDate}</p>
          
          <Tabs defaultValue="overview" className="mb-12">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="data-processing">Data Processing</TabsTrigger>
              <TabsTrigger value="user-rights">User Rights</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="ai-accountability">AI Accountability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">GDPR Compliance Overview</h2>
                  <p className="mb-4">
                    A.R.I.A™ (AI Reputation Intelligence Agent) is designed with privacy and data protection at its core. 
                    We are committed to full compliance with the General Data Protection Regulation (GDPR) of the European Union.
                  </p>
                  <p className="mb-4">
                    This document outlines our approach to GDPR compliance and explains how we protect your data while providing 
                    our reputation monitoring and intelligence services.
                  </p>
                  <div className="flex justify-center mt-8">
                    <Button 
                      variant="deliver" 
                      size="lg" 
                      className="flex items-center gap-2"
                      onClick={() => window.open('/privacy-policy', '_blank')}
                    >
                      <FileText className="h-5 w-5" />
                      View Full Privacy Policy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data-processing" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Lawful Basis for Data Processing</h2>
                  <p className="mb-4">
                    GDPR requires that any system processing personal data must have a legal basis under Article 6. 
                    A.R.I.A™ operates under:
                  </p>
                  
                  <div className="p-4 bg-blue-50 rounded-lg mb-6">
                    <h3 className="font-bold text-lg mb-2">Legitimate Interest (Art. 6(1)(f))</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Monitoring public data (news, forums, social) for reputational risks</li>
                      <li>Providing B2B services like media alerts or reputation analysis</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg mb-6">
                    <h3 className="font-bold text-lg mb-2">Consent (Art. 6(1)(a))</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Onboarding clients and running scans on their name/brand</li>
                      <li>Storing analysis or personal insights long-term</li>
                    </ul>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">Data Minimization & Purpose Limitation</h3>
                  <p className="mb-4">
                    A.R.I.A™ adheres to GDPR principles by:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li>Only pulling publicly available content (e.g., news articles, public social media posts)</li>
                    <li>Extracting only relevant entities and sentiment, not private attributes</li>
                    <li>Using data solely for reputation monitoring & protection</li>
                    <li>Avoiding scanning of private platforms or password-protected forums</li>
                    <li>Storing only summaries or URLs rather than entire articles long-term</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="user-rights" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Transparency & User Rights</h2>
                  <p className="mb-4">
                    Under GDPR, individuals have specific rights regarding their personal data:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="h-5 w-5 text-blue-600" />
                        <h3 className="font-bold text-lg">Right to Be Informed</h3>
                      </div>
                      <p>
                        Users have the right to know when their data is being collected and how it will be used.
                        A.R.I.A™ provides clear notification through our privacy policy.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <h3 className="font-bold text-lg">Right to Access</h3>
                      </div>
                      <p>
                        Users can request a copy of all data we hold about them at any time
                        through our Subject Access Request form.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Check className="h-5 w-5 text-amber-600" />
                        <h3 className="font-bold text-lg">Right to Rectification</h3>
                      </div>
                      <p>
                        If users believe the data we hold is inaccurate, they can request
                        corrections through our data management portal.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-5 w-5 text-red-600" />
                        <h3 className="font-bold text-lg">Right to Erasure</h3>
                      </div>
                      <p>
                        Also known as the "right to be forgotten" - users can request deletion
                        of their personal data from our systems.
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-4">How A.R.I.A™ Supports These Rights</h3>
                  <ul className="list-disc pl-6 space-y-3 mb-8">
                    <li>Clear privacy policy detailing what data is collected and why</li>
                    <li>Simple data request form for subject access requests</li>
                    <li>Opt-out mechanism for individuals who don't wish to be monitored</li>
                    <li>Data deletion process that removes personal data upon request</li>
                  </ul>
                  
                  <div className="flex justify-center mt-8">
                    <Button 
                      variant="deliver" 
                      onClick={() => navigate('/request-data-access')}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-5 w-5" />
                      Request Data Access
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Data Security & Hosting</h2>
                  <p className="mb-4">
                    GDPR requires strong technical and organizational safeguards for personal data.
                    A.R.I.A™ implements comprehensive security measures:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Data Storage</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Hosting in EU or GDPR-compliant regions</li>
                        <li>Supabase instances in Frankfurt or AWS in EU-West</li>
                        <li>Data residency guarantees for EU clients</li>
                      </ul>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Access Controls</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Role-based access control system</li>
                        <li>Row-level security policies in Supabase</li>
                        <li>Strict permission management for admins</li>
                      </ul>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Encryption</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>All personal data encrypted at rest</li>
                        <li>TLS/SSL encryption for data in transit</li>
                        <li>Secure API keys management</li>
                      </ul>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Auditing</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Comprehensive audit logs for all admin actions</li>
                        <li>User access logging and review</li>
                        <li>Regular security assessments</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-4">Data Processing Agreements</h3>
                  <p className="mb-6">
                    We maintain Data Processing Agreements (DPAs) with all of our subprocessors and can
                    provide clients with our standard DPA upon request to ensure GDPR compliance
                    throughout our data processing chain.
                  </p>
                  
                  <div className="flex justify-center mt-8">
                    <Button 
                      variant="deliver"
                      onClick={() => window.open('/dpa-request', '_blank')}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-5 w-5" />
                      Request Data Processing Agreement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai-accountability" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">AI/ML Accountability</h2>
                  <p className="mb-6">
                    A.R.I.A™ utilizes artificial intelligence and machine learning to analyze reputation data.
                    Under GDPR and emerging AI regulations, we ensure:
                  </p>
                  
                  <div className="space-y-6 mb-8">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Explainability</h3>
                      <p className="mb-2">
                        Our AI systems provide clear explanations for all classifications and risk assessments.
                        When content is flagged as potentially harmful to reputation, the system explains:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Specific risk factors identified</li>
                        <li>Classification criteria used</li>
                        <li>Confidence level of the assessment</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Human Oversight</h3>
                      <p className="mb-2">
                        A.R.I.A™ does not make fully automated decisions without human review:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>All high-risk classifications require human verification</li>
                        <li>Clients can review and override AI assessments</li>
                        <li>Regular auditing of AI decisions to prevent bias</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Data Limitations</h3>
                      <p className="mb-2">
                        We carefully limit the types of data processed by our AI systems:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>No processing of special category data (race, religion, health, etc.) unless explicitly necessary and with appropriate safeguards</li>
                        <li>No biometric data processing</li>
                        <li>No children's data processing</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-3">AI Ethics Framework</h3>
                  <p className="mb-6">
                    A.R.I.A™ operates under a comprehensive AI Ethics Framework that ensures our
                    technology is used responsibly and in compliance with both current regulations
                    and emerging standards for ethical AI.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="mb-12">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">GDPR Compliance Statement</h2>
              <p className="mb-4">
                A.R.I.A™ is committed to fully complying with the General Data Protection Regulation (GDPR).
                We respect the privacy rights of all individuals whose data we process and have implemented
                comprehensive technical and organizational measures to protect personal data.
              </p>
              <p>
                Our Data Protection Officer can be contacted at dpo@ariaops.co.uk for any GDPR-related
                inquiries or concerns.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GDPRCompliancePage;
