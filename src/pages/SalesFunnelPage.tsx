
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Shield, Search, FileText, Users, AlertTriangle, Eye, TrendingUp, Clock, Star, Brain, Zap, Lock } from "lucide-react";
import ScanRequestForm from "@/components/salesFunnel/ScanRequestForm";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import Logo from "@/components/ui/logo";

const SalesFunnelPage = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, show admin dashboard walkthrough
  if (isAuthenticated) {
    return <AdminDashboardWelcome />;
  }

  // Handle smooth scroll to form
  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const formElement = document.getElementById('scan-form');
    if (formElement) {
      formElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center space-x-2">
              <Logo variant="default" size="sm" />
            </a>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/about" className="text-sm font-medium hover:text-primary">About</a>
            <a href="/blog" className="text-sm font-medium hover:text-primary">Blog</a>
            <a href="/simon-lindsay" className="text-sm font-medium hover:text-primary">Simon Lindsay</a>
            <a href="/admin/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">Admin Login</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              A.R.I.A™
            </h1>
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-blue-200">
              Adaptive Reputation Intelligence & Analysis
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Real-time protection for your name, your business, and your future.
            </p>
          </div>
          
          <div className="bg-blue-800 border-l-4 border-blue-400 p-6 mb-8 rounded-lg">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-center">
              🚨 Protect What Matters — Before It Breaks
            </h3>
            <p className="text-lg">
              You don't need to be famous to be at risk.<br />
              You just need someone to say the wrong thing — in the wrong place — at the wrong time.
            </p>
          </div>

          <Button asChild size="lg" className="bg-white text-blue-900 px-12 py-6 text-lg font-bold rounded-lg shadow-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
            <a href="#scan-form" onClick={scrollToForm} className="flex items-center">
              <Search className="mr-3 h-6 w-6" />
              🔍 Request Your Private Scan
            </a>
          </Button>
        </div>
      </section>

      {/* What A.R.I.A™ Does */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            A.R.I.A™ is the world's first fully-managed reputation intelligence system that:
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-center mb-3">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">Finds threats before you're aware</h3>
              </div>
              <p className="text-gray-600">Detects risks across the internet before they impact you</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center mb-3">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">Tracks across all platforms</h3>
              </div>
              <p className="text-gray-600">Forums, news, social media, and AI systems monitoring</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center mb-3">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">Human-readable reports</h3>
              </div>
              <p className="text-gray-600">No tools, no dashboards — just clear insights</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-orange-500">
              <div className="flex items-center mb-3">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">Prevents future crises</h3>
              </div>
              <p className="text-gray-600">Stops problems before they exist</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-500">
              <div className="flex items-center mb-3">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">Corrects false memories</h3>
              </div>
              <p className="text-gray-600">Fixes what search engines and AI models remember</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-indigo-500">
              <div className="flex items-center mb-3">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">Zero input scanning</h3>
              </div>
              <p className="text-gray-600">Finds everything — even what you didn't search for</p>
            </Card>
          </div>
        </div>
      </section>

      {/* What Can Damage Your Reputation */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            🔍 What Can Damage Your Reputation?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center bg-red-50 border-red-200">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Viral Reddit Threads</h3>
              <p className="text-gray-600">That go viral overnight</p>
            </Card>

            <Card className="p-6 text-center bg-orange-50 border-orange-200">
              <FileText className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Outdated Articles</h3>
              <p className="text-gray-600">That resurface at the worst time</p>
            </Card>

            <Card className="p-6 text-center bg-purple-50 border-purple-200">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">False AI Memories</h3>
              <p className="text-gray-600">ChatGPT and Google "remembering" wrong info</p>
            </Card>

            <Card className="p-6 text-center bg-blue-50 border-blue-200">
              <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Deepfake Content</h3>
              <p className="text-gray-600">Impersonation on social media</p>
            </Card>

            <Card className="p-6 text-center bg-yellow-50 border-yellow-200">
              <TrendingUp className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Internal Changes</h3>
              <p className="text-gray-600">Company shifts that hint at crisis</p>
            </Card>

            <Card className="p-6 text-center bg-green-50 border-green-200">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Timing Issues</h3>
              <p className="text-gray-600">Wrong message at the wrong moment</p>
            </Card>
          </div>
          
          <div className="text-center bg-gray-100 p-8 rounded-lg">
            <p className="text-xl font-bold text-gray-800 mb-2">Most people find out too late.</p>
            <p className="text-lg text-blue-600 font-semibold">A.R.I.A™ finds it first — and fixes it silently.</p>
          </div>
        </div>
      </section>

      {/* Who We Help */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">💡 Who We Help</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-semibold mb-2">Executives</h3>
              <p className="text-gray-600">Founders, CEOs, and public leaders</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🎙</div>
              <h3 className="font-semibold mb-2">Creators</h3>
              <p className="text-gray-600">Influencers and professionals</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="font-semibold mb-2">Organizations</h3>
              <p className="text-gray-600">Brands, agencies, and legal teams</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🧑‍💼</div>
              <h3 className="font-semibold mb-2">Individuals</h3>
              <p className="text-gray-600">Private people with reputational vulnerabilities</p>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">🛡 What You Get</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-l-4 border-l-blue-500">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">📄</div>
                <h3 className="text-xl font-bold">Weekly Intelligence Reports</h3>
              </div>
              <p className="text-gray-600">Summarized risks, shifts in sentiment, and clear next steps.</p>
            </Card>

            <Card className="p-8 border-l-4 border-l-red-500">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🚨</div>
                <h3 className="text-xl font-bold">Instant Alerts</h3>
              </div>
              <p className="text-gray-600">When something urgent emerges — we notify you directly.</p>
            </Card>

            <Card className="p-8 border-l-4 border-l-purple-500">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🧠</div>
                <h3 className="text-xl font-bold">Memory Overwrites</h3>
              </div>
              <p className="text-gray-600">We help correct what AI models and search engines "remember" about you.</p>
            </Card>

            <Card className="p-8 border-l-4 border-l-green-500">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🧬</div>
                <h3 className="text-xl font-bold">Pre-Crisis Forecasting</h3>
              </div>
              <p className="text-gray-600">Detect reputation risks before they happen, based on tone, behavior, and online chatter.</p>
            </Card>

            <Card className="p-8 border-l-4 border-l-orange-500">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">👁</div>
                <h3 className="text-xl font-bold">Zero Input Scanning</h3>
              </div>
              <p className="text-gray-600">No keywords needed. We look for everything — even what you didn't know to search for.</p>
            </Card>

            <Card className="p-8 border-l-4 border-l-indigo-500">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">🔒</div>
                <h3 className="text-xl font-bold">Private by Design</h3>
              </div>
              <p className="text-gray-600">GDPR-compliant, no public dashboards, enterprise-grade encryption.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">🔒 Private by Design</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">Fully GDPR-compliant</h3>
              </div>
              <p className="text-gray-600">Complete data protection compliance</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">No public dashboard, ever</h3>
              </div>
              <p className="text-gray-600">Your data stays completely private</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">Enterprise-grade encryption</h3>
              </div>
              <p className="text-gray-600">Bank-level security for all data</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="font-semibold">Verified secure operators</h3>
              </div>
              <p className="text-gray-600">Only trusted personnel handle your information</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">📬 How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Tell us who to protect</h3>
              <p className="text-gray-600">You specify what (or who) needs monitoring</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">We scan everything</h3>
              <p className="text-gray-600">Open internet + AI ecosystem monitoring</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">You receive reports</h3>
              <p className="text-gray-600">Private, actionable insights + urgent alerts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold mb-2">We fix it quietly</h3>
              <p className="text-gray-600">Prevention and resolution behind the scenes</p>
            </div>
          </div>

          <div className="text-center mt-12 bg-blue-50 p-8 rounded-lg">
            <p className="text-lg font-medium mb-2">No need to log in.</p>
            <p className="text-lg font-medium mb-2">No alerts unless it matters.</p>
            <p className="text-lg font-bold text-blue-600">We handle it all for you.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-900 text-white py-16 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">✉️ Ready to Stay Ahead of the Story?</h2>
          <div className="mb-8">
            <p className="text-xl mb-2">Your name shouldn't be left unguarded.</p>
            <p className="text-xl mb-2">Your past shouldn't define your future.</p>
            <p className="text-xl font-bold">Your story shouldn't be written without you.</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <Button asChild size="lg" className="bg-white text-blue-900 px-12 py-6 text-lg font-bold rounded-lg shadow-lg hover:bg-blue-50">
              <a href="#scan-form" onClick={scrollToForm}>
                🔍 Request Your Private Scan
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 px-6 bg-gray-50">
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
              <Eye className="h-5 w-5 mr-2" />
              🧠 Human + AI Verified
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              🛡 Built in the UK
            </div>
          </div>
        </div>
      </section>

      {/* Scan Request Form */}
      <ScanRequestForm />
    </div>
  );
};

export default SalesFunnelPage;
