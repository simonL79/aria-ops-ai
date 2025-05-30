import React from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const PricingPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Simple, Transparent Pricing</h1>
              <p className="text-xl text-gray-300">
                Choose the plan that's right for your reputation monitoring needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Basic Monitoring</CardTitle>
                  <CardDescription className="text-gray-300">For individuals getting started</CardDescription>
                  <div className="text-3xl font-bold text-white">£29/mo</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">Basic mention monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">Weekly reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">Email alerts</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <Link to="/payment">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="bg-gray-800 border-orange-500 border-2 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">PRO Monitoring</CardTitle>
                  <CardDescription className="text-gray-300">For professionals and small businesses</CardDescription>
                  <div className="text-3xl font-bold text-white">£97/mo</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">24/7 comprehensive monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">AI-powered threat scoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">Real-time alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">Monthly detailed reports</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <Link to="/payment">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Enterprise</CardTitle>
                  <CardDescription className="text-gray-300">For large organizations</CardDescription>
                  <div className="text-3xl font-bold text-white">Custom</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">Everything in PRO</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">Custom integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">Dedicated support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-gray-300">Custom reporting</span>
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Link to="/contact-sales">Contact Sales</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PricingPage;
