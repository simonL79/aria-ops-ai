
import React from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Award, MapPin } from 'lucide-react';

const AboutPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">About A.R.I.A™</h1>
            <p className="text-xl text-gray-600 mb-12 text-center">
              Automated Reputation Intelligence & Analysis
            </p>
            
            <div className="space-y-12">
              <section>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  In today's digital world, reputation moves at the speed of a headline. 
                  A.R.I.A™ helps individuals and organizations understand their online presence 
                  and take action before small issues become serious problems. We believe that 
                  everyone deserves to know what's being said about them online, and to have 
                  the tools to protect and build their digital reputation.
                </p>
              </section>
              
              <section>
                <h2 className="text-3xl font-bold mb-6">What We Do</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <CardHeader>
                      <Shield className="h-8 w-8 text-blue-600 mb-2" />
                      <CardTitle>Real-Time Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Monitor online mentions across 20+ platforms</li>
                        <li>• 24/7 AI-powered scanning</li>
                        <li>• Early threat detection</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-6">
                    <CardHeader>
                      <Users className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle>Risk Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Analyze sentiment and threat levels</li>
                        <li>• Employee and brand risk scoring</li>
                        <li>• Predictive risk modeling</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-6">
                    <CardHeader>
                      <Award className="h-8 w-8 text-purple-600 mb-2" />
                      <CardTitle>Actionable Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Board-ready reports</li>
                        <li>• Legal briefings</li>
                        <li>• Strategic recommendations</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-6">
                    <CardHeader>
                      <MapPin className="h-8 w-8 text-red-600 mb-2" />
                      <CardTitle>Compliance & Privacy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-700">
                        <li>• GDPR compliant</li>
                        <li>• Data protection by design</li>
                        <li>• UK-based infrastructure</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>
              
              <section className="bg-blue-50 p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Founded by Simon Lindsay</h2>
                <div className="space-y-4 text-lg text-gray-700">
                  <p>
                    A.R.I.A™ was founded by <strong>Simon Lindsay</strong>, a recognized expert in digital 
                    reputation management and AI-powered monitoring solutions with over a decade of experience 
                    in crisis communications and digital intelligence.
                  </p>
                  <p>
                    Simon's background spans crisis management, digital forensics, and AI development, 
                    making him uniquely positioned to understand both the technical challenges and 
                    real-world implications of online reputation threats.
                  </p>
                  <p>
                    Based in the UK, Simon has worked with agencies, legal teams, and enterprises 
                    to develop proactive reputation management strategies that protect brands and 
                    individuals before threats become crises.
                  </p>
                </div>
                
                <div className="mt-8 p-6 bg-white rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Contact Simon</h3>
                  <p className="text-gray-700">
                    📩 Email: <a href="mailto:simon@ariaops.co.uk" className="text-blue-600 underline">simon@ariaops.co.uk</a>
                  </p>
                  <p className="text-gray-700 mt-2">
                    🌍 Location: United Kingdom
                  </p>
                </div>
              </section>
              
              <section>
                <h2 className="text-3xl font-bold mb-6">Why A.R.I.A™?</h2>
                <div className="space-y-4 text-lg text-gray-700">
                  <p>
                    Traditional reputation monitoring is reactive — you find out about problems 
                    after they've already caused damage. A.R.I.A™ is different. We're proactive, 
                    intelligent, and designed to give you the time and information you need to 
                    protect what matters most.
                  </p>
                  <p>
                    Our AI doesn't just scan for mentions — it understands context, evaluates 
                    threat levels, and provides the kind of strategic intelligence that allows 
                    you to stay ahead of potential crises.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
