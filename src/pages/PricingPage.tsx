
import React from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const PricingPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
              <p className="text-xl text-gray-600">
                Choose the plan that's right for your reputation monitoring needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Basic Monitoring</CardTitle>
                  <CardDescription>For individuals getting started</CardDescription>
                  <div className="text-3xl font-bold">£29/mo</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Basic mention monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Weekly reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Email alerts</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-2 border-blue-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <CardHeader>
                  <CardTitle>PRO Monitoring</CardTitle>
                  <CardDescription>For professionals and small businesses</CardDescription>
                  <div className="text-3xl font-bold">£97/mo</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>24/7 comprehensive monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>AI-powered threat scoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Real-time alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Monthly detailed reports</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For large organizations</CardDescription>
                  <div className="text-3xl font-bold">Custom</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Everything in PRO</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Dedicated support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Custom reporting</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Contact Sales
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
