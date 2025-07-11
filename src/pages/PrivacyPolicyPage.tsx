
import React from 'react';
import StickyHeader from '@/components/layout/StickyHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
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
        <div className="max-w-4xl mx-auto prose prose-slate">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy for A.R.I.A™</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/gdpr-compliance')}
            >
              <Shield className="h-4 w-4" />
              GDPR Compliance
            </Button>
          </div>
          
          <p className="text-gray-600 mb-8">Last updated: {currentDate}</p>
          
          <p>
            This Privacy Policy outlines how we collect, use, and protect your information when you visit www.ariaops.co.uk and use A.R.I.A™ (AI Reputation Intelligence Agent), our reputation monitoring platform.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Who We Are</h2>
          <p>
            This website is operated by A.R.I.A™, a brand founded by Simon Lindsay. We are committed to protecting your privacy and maintaining your trust.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. What Information We Collect</h2>
          <p>
            We may collect the following types of personal data:
          </p>
          <ul className="list-disc pl-6">
            <li>Name and contact information (email, phone)</li>
            <li>Keywords or brand names you request to monitor</li>
            <li>IP address and browser data</li>
            <li>Communication data (emails, messages)</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul className="list-disc pl-6">
            <li>Deliver threat monitoring and reporting services</li>
            <li>Notify you of mentions or risks</li>
            <li>Contact you about new features or updates</li>
            <li>Maintain security and comply with legal obligations</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal data to third parties.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">4. How We Store and Protect Data</h2>
          <p>
            Your data is stored securely using encrypted tools and limited-access systems. We retain it only as long as necessary for the purposes stated.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Rights Under GDPR</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-6">
            <li>Access your data</li>
            <li>Correct inaccuracies</li>
            <li>Request deletion</li>
            <li>Withdraw consent</li>
            <li>Lodge complaints with the ICO</li>
          </ul>
          <p>
            To make a data request, email: privacy@ariaops.co.uk or use our <a href="/request-data-access" className="text-blue-600 hover:underline">data request form</a>.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-3">GDPR Compliance</h3>
            <p className="mb-4">
              A.R.I.A™ is fully compliant with the General Data Protection Regulation (GDPR).
              We process data under the following legal bases:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Legitimate Interest - for monitoring publicly available information</li>
              <li>Consent - for client onboarding and personalized services</li>
            </ul>
            <p className="mb-2">
              For more detailed information about our GDPR compliance measures, please visit our dedicated
              GDPR Compliance page.
            </p>
            <div className="mt-4">
              <Button 
                variant="deliver" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate('/gdpr-compliance')}
              >
                <FileText className="h-4 w-4" />
                View GDPR Details
              </Button>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">6. Cookies</h2>
          <p>
            This site uses cookies to improve your experience and analyze traffic. You can manage cookie preferences via your browser settings.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">7. Third-Party Tools</h2>
          <p>
            We may use tools like Google Analytics or OpenAI APIs. These third-party services may collect anonymized usage data under their own privacy policies.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy occasionally. Revisions will be posted here with a new effective date.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact</h2>
          <p>
            If you have questions about our privacy practices, please email: privacy@ariaops.co.uk
          </p>
          <p>
            For GDPR-specific inquiries, contact our Data Protection Officer at: dpo@ariaops.co.uk
          </p>
          
          <div className="mt-12 pt-6 border-t border-gray-200">
            <Button 
              variant="deliver" 
              onClick={() => navigate('/request-data-access')}
              className="flex items-center gap-2"
            >
              <FileText className="h-5 w-5" />
              Submit Data Request
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
