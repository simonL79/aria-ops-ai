
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Award, MapPin, Mail, Globe } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">A.R.I.A.™</span>
            </a>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium hover:text-primary">Home</a>
            <a href="/about" className="text-sm font-medium hover:text-primary">About</a>
            <a href="/blog" className="text-sm font-medium hover:text-primary">Blog</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">About A.R.I.A™</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light">
            Automated Reputation Intelligence & Analysis
          </p>
          <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto">
            In today's digital world, reputation moves at the speed of a headline. 
            A.R.I.A™ helps individuals and organizations understand their online presence 
            and take action before small issues become serious problems.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Our Mission</h2>
          <div className="text-lg text-gray-700 leading-relaxed space-y-6">
            <p>
              We believe that everyone deserves to know what's being said about them online, and to have 
              the tools to protect and build their digital reputation.
            </p>
            <p>
              A.R.I.A™ combines cutting-edge AI technology with human intelligence to provide 
              real-time monitoring, threat detection, and actionable insights that help you stay 
              ahead of potential crises.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-xl">Real-Time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Monitor online mentions across 20+ platforms</li>
                  <li>• 24/7 AI-powered scanning</li>
                  <li>• Early threat detection</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-xl">Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Analyze sentiment and threat levels</li>
                  <li>• Employee and brand risk scoring</li>
                  <li>• Predictive risk modeling</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Award className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-xl">Actionable Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Board-ready reports</li>
                  <li>• Legal briefings</li>
                  <li>• Strategic recommendations</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <MapPin className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle className="text-xl">Compliance & Privacy</CardTitle>
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
        </div>
      </section>
      
      {/* Founder Section */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Founded by Simon Lindsay</h2>
          <div className="space-y-6 text-lg text-gray-700">
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
          
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact Simon</h3>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                <a href="mailto:simon@ariaops.co.uk" className="text-blue-600 hover:underline">
                  simon@ariaops.co.uk
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-gray-700">United Kingdom</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why ARIA Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Why A.R.I.A™?</h2>
          <div className="space-y-6 text-lg text-gray-700">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Protect Your Reputation?</h2>
          <p className="text-xl mb-8 text-blue-200">Let's start with a comprehensive scan of your digital presence.</p>
          <Button asChild size="lg" className="bg-white text-blue-900 px-12 py-6 text-lg font-bold rounded-lg shadow-lg hover:bg-blue-50">
            <a href="/#scan-form">
              🎯 Request Your Scan
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              🔐 GDPR Compliant
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              📊 Used by Agencies & Enterprises
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              🛡 Built in the UK
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
