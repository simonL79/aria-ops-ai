
import React from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <PublicLayout>
        <div className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">About A.R.I.A™</h1>
                <p className="text-xl text-gray-300">
                  Advanced Reputation Intelligence & Analysis
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <Shield className="h-12 w-12 text-orange-500 mb-4" />
                    <CardTitle className="text-white">Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      To provide enterprise-grade reputation intelligence and crisis prevention 
                      powered by AI, delivered by experts who understand the stakes.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <Target className="h-12 w-12 text-orange-500 mb-4" />
                    <CardTitle className="text-white">Our Vision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      A world where individuals and organizations can proactively protect 
                      their digital reputation before threats materialize.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-white">Why A.R.I.A™?</h2>
                <div className="space-y-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-orange-500">Advanced AI Technology</h3>
                      <p className="text-gray-300">
                        Our proprietary AI systems monitor, analyze, and predict reputation threats 
                        across the digital landscape in real-time.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-orange-500">Expert Human Intelligence</h3>
                      <p className="text-gray-300">
                        Combined with human expertise, our AI delivers actionable insights 
                        and strategic responses tailored to your unique situation.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-orange-500">Proactive Protection</h3>
                      <p className="text-gray-300">
                        Don't wait for a crisis. Our systems identify and neutralize threats 
                        before they can damage your reputation.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6 text-white">Ready to Protect Your Reputation?</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Get started with a comprehensive assessment of your digital risk profile.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Link to="/scan">Request Assessment</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    </div>
  );
};

export default AboutPage;
