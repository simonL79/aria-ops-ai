
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Shield, CreditCard, Loader2, Menu, X } from 'lucide-react';
import Logo from '@/components/ui/logo';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PaymentPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <header className="py-4 sm:py-6 bg-white border-b border-premium-silver shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
            <div className="hidden md:flex gap-4 lg:gap-6">
              <Link to="/" className="text-premium-gray hover:text-premium-black transition-colors text-sm lg:text-base">Home</Link>
              <Link to="/about" className="text-premium-gray hover:text-premium-black transition-colors text-sm lg:text-base">About</Link>
              <Link to="/pricing" className="text-premium-gray hover:text-premium-black transition-colors text-sm lg:text-base">Pricing</Link>
            </div>
            <Button asChild variant="default" className="hidden sm:block bg-premium-black hover:bg-premium-black/90">
              <Link to="/scan">Get Started</Link>
            </Button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col space-y-3">
                <Link to="/" className="text-premium-gray hover:text-premium-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link to="/about" className="text-premium-gray hover:text-premium-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                <Link to="/pricing" className="text-premium-gray hover:text-premium-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                <Button asChild variant="default" className="bg-premium-black hover:bg-premium-black/90 w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/scan">Get Started</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="py-8 sm:py-12 container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">Choose Your Plan</h1>
            <p className="text-lg sm:text-xl text-premium-gray">
              Select the monitoring plan that best fits your needs.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 mb-6 sm:mb-8">
            {/* Basic Plan */}
            <Card className="border-2 border-premium-silver">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-premium-black" />
                  <span>Basic Monitoring</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">For individuals getting started</CardDescription>
                <div className="text-2xl sm:text-3xl font-bold">£97/month</div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pb-4">
                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">This includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Basic mention monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Weekly reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Email alerts</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button 
                  onClick={() => handlePaymentClick("Basic Monitoring Plan", "£97.00")} 
                  className="w-full text-sm sm:text-base"
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
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader className="pb-4 pt-6 sm:pt-8">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-premium-black" />
                  <span>PRO Monitoring</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">For professionals and small businesses</CardDescription>
                <div className="text-2xl sm:text-3xl font-bold">£297/month</div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pb-4">
                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">This includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">24/7 comprehensive monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">AI-powered threat scoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Real-time alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Monthly detailed reports</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button 
                  onClick={() => handlePaymentClick("PRO Monitoring Plan", "£297.00")} 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-sm sm:text-base"
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
          
          <div className="text-center px-4">
            <p className="text-xs sm:text-sm text-premium-gray mb-3 sm:mb-4">
              Secure payment processing by Stripe. Your payment information is encrypted and secure.
            </p>
            <p className="text-xs sm:text-sm text-premium-gray mb-4">
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
