
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Shield, CreditCard, Loader2 } from 'lucide-react';
import Logo from '@/components/ui/logo';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PaymentPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePaymentClick = async (planName: string, price: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planName, price }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Unable to process payment', {
        description: 'Please try again later or contact support.'
      });
    } finally {
      setIsLoading(false);
    }
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Choose Your Plan</h1>
            <p className="text-xl text-premium-gray">
              Select the monitoring plan that best fits your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Basic Plan */}
            <Card className="border-2 border-premium-silver">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-premium-black" />
                  <span>Basic Monitoring</span>
                </CardTitle>
                <CardDescription>For individuals getting started</CardDescription>
                <div className="text-3xl font-bold">£97/month</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">This includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Basic mention monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Weekly reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Email alerts</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePaymentClick("Basic Monitoring Plan", "£97.00")} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Subscribe to Basic"
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* PRO Plan */}
            <Card className="border-2 border-orange-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-premium-black" />
                  <span>PRO Monitoring</span>
                </CardTitle>
                <CardDescription>For professionals and small businesses</CardDescription>
                <div className="text-3xl font-bold">£297/month</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">This includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>24/7 comprehensive monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>AI-powered threat scoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Real-time alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Monthly detailed reports</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePaymentClick("PRO Monitoring Plan", "£297.00")} 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Subscribe to PRO"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-premium-gray mb-4">
              Secure payment processing by Stripe. Your payment information is encrypted and secure.
            </p>
            <p className="text-sm text-premium-gray mb-4">
              Have questions? <Link to="/contact-sales" className="text-premium-black underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentPage;
