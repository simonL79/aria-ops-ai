
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Shield, CreditCard } from 'lucide-react';
import Logo from '@/components/ui/logo';
import Footer from '@/components/layout/Footer';

const PaymentPage = () => {
  const handlePaymentClick = (planName: string, price: string) => {
    // This will be connected to Stripe later
    console.log(`Selected plan: ${planName}, Price: ${price}`);
    alert(`You've selected the ${planName} plan. Stripe integration will be connected later.`);
  };

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
              <Link to="/pricing" className="text-premium-gray hover:text-premium-black transition-colors">Pricing</Link>
            </div>
            <Button asChild variant="default" className="bg-premium-black hover:bg-premium-black/90">
              <Link to="/scan">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="py-12 container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Secure Payment</h1>
            <p className="text-xl text-premium-gray">
              Complete your purchase to start protecting your online reputation today.
            </p>
          </div>

          <Card className="mb-8 border-2 border-premium-silver">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-premium-black" />
                <span>Your Selected Plan</span>
              </CardTitle>
              <CardDescription>Please review your order details before proceeding to payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <span className="font-medium">PRO Monitoring Plan</span>
                <span className="font-bold">£97.00</span>
              </div>
              <div>
                <h3 className="font-medium mb-2">This includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>24/7 scanning of the internet (Google, Reddit, news, social)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>AI-powered threat scoring (what's serious, what's not)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Monthly reports with guidance on what to do</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-premium-gray">Your subscription will begin immediately after successful payment.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handlePaymentClick("PRO Monitoring", "£97.00")} 
                className="w-full"
              >
                Proceed to Payment
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center">
            <p className="text-sm text-premium-gray mb-4">
              Secure payment processing by Stripe. Your payment information is encrypted and secure.
            </p>
            <p className="text-sm text-premium-gray mb-4">
              Have questions? <Link to="/about" className="text-premium-black underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentPage;
