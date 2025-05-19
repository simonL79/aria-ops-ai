
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Linkedin, Globe, ArrowLeft, Shield, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <header className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
            <Button asChild variant="ghost" className="flex items-center gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="py-12 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">About ARIA</h1>
            <p className="text-muted-foreground mt-2">
              AI Reputation Intelligence Agent - Your defense against digital threats
            </p>
          </div>

          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>What Is A.R.I.A™?</CardTitle>
                <CardDescription>Your digital bodyguard for online reputation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="leading-7 mb-4">
                  A.R.I.A™ stands for AI Reputation Intelligence Agent. It's like a digital bodyguard for your name online. 
                  While most people don't find out about negative content until it's too late, A.R.I.A™ finds it first.
                </p>
                <p className="leading-7">
                  A.R.I.A™ doesn't just monitor your reputation — it protects it, corrects it, and helps you control it.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How A.R.I.A™ Works</CardTitle>
                <CardDescription>Proactive reputation intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-3">
                      <Search className="h-6 w-6 text-premium-silver" />
                    </div>
                    <h3 className="font-semibold mb-2">24/7 Monitoring</h3>
                    <p className="text-sm text-muted-foreground">
                      Watches the entire internet — social media, Google, blogs, news, Reddit, reviews and more
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-3">
                      <Shield className="h-6 w-6 text-premium-silver" />
                    </div>
                    <h3 className="font-semibold mb-2">AI Classification</h3>
                    <p className="text-sm text-muted-foreground">
                      Uses AI to classify mentions as complaints, false statements, legally risky content and assigns threat levels
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-3">
                      <Bell className="h-6 w-6 text-premium-silver" />
                    </div>
                    <h3 className="font-semibold mb-2">Instant Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Alerts you instantly so you can act before negative content spreads
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-50 p-5 rounded-lg border">
                  <h3 className="font-semibold mb-3">Threat Level Classification</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 border-l-4 border-green-500 p-3">
                      <span className="font-medium text-green-700">Green</span>
                      <p className="text-sm text-green-600">Safe</p>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
                      <span className="font-medium text-yellow-700">Yellow</span>
                      <p className="text-sm text-yellow-600">Caution</p>
                    </div>
                    <div className="bg-red-50 border-l-4 border-red-500 p-3">
                      <span className="font-medium text-red-700">Red</span>
                      <p className="text-sm text-red-600">High Risk</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why A.R.I.A™ Is Powerful</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You find out before Google ruins your name</li>
                  <li>You control your story, not strangers</li>
                  <li>You get peace of mind, not panic</li>
                  <li>Helps push bad content down by creating smart content that ranks higher on Google</li>
                  <li>Puts you ahead of the problem — always</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Our Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 mb-4">
                  ARIA leverages cutting-edge technologies including:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Multi-agent AI analysis systems</li>
                  <li>Machine learning classification models</li>
                  <li>Natural language processing</li>
                  <li>Predictive analytics</li>
                  <li>Secure API integrations</li>
                  <li>Real-time monitoring networks</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href="mailto:simon@ariaops.co.uk" className="text-primary hover:underline">
                      simon@ariaops.co.uk
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href="https://www.ariaops.co.uk" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      www.ariaops.co.uk
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    <a href="https://www.linkedin.com/company/aria-security" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-10 text-center text-sm mt-16">
        <p>&copy; 2025 A.R.I.A™ — AI Reputation Intelligence Agent</p>
        <p><Link to="/biography" className="underline">Simon Lindsay</Link> | <Link to="/" className="underline">Home</Link> | <Link to="/pricing" className="underline">Pricing</Link></p>
      </footer>
    </div>
  );
};

export default AboutPage;
