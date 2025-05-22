
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Logo from '@/components/ui/logo';
import Footer from '@/components/layout/Footer';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <header className="py-6 bg-white border-b border-premium-silver shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/" className="text-premium-gray hover:text-premium-black transition-colors">Home</Link>
              <Link to="/about" className="text-premium-gray hover:text-premium-black transition-colors">About</Link>
              <Link to="/biography" className="text-premium-gray hover:text-premium-black transition-colors">Biography</Link>
            </div>
            <Button asChild variant="default" className="bg-premium-black hover:bg-premium-black/90">
              <Link to="/scan">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="py-12 container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-green-200 mb-8">
            <CardHeader className="text-center pb-2">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-3xl">Thank You!</CardTitle>
              <CardDescription className="text-xl mt-2">Your scan request has been submitted successfully.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-lg">
                Thank you for requesting a free reputation scan with A.R.I.A™. Your submission has been received!
              </p>
              <p>
                We've sent a confirmation email with details about what to expect next.
              </p>
              <div className="bg-gray-50 p-4 rounded-md mt-6">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <p>Our team will analyze your online presence and you'll receive your free reputation scan report within 24 hours.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4 pt-4">
              <Button asChild variant="default">
                <Link to="/">Back to Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/scan">Request Another Scan</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ThankYouPage;
