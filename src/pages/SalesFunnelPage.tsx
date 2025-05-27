
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Shield, Search, FileText, Users, AlertTriangle, Eye, TrendingUp, Clock, Star } from "lucide-react";
import ScanRequestForm from "@/components/salesFunnel/ScanRequestForm";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";

const SalesFunnelPage = () => {
  const { isAuthenticated } = useAuth();

  // If authenticated, show admin dashboard walkthrough
  if (isAuthenticated) {
    return <AdminDashboardWelcome />;
  }

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
            <a href="/about" className="text-sm font-medium hover:text-primary">About</a>
            <a href="/blog" className="text-sm font-medium hover:text-primary">Blog</a>
            <a href="/admin/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">Admin Login</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Reputation Is Being Shaped Online.
          </h1>
          <h2 className="text-xl md:text-2xl mb-8 text-blue-100 font-light">
            We'll tell you how — before it becomes a problem.
          </h2>
          <p className="text-lg md:text-xl mb-10 text-blue-200 max-w-3xl mx-auto">
            A.R.I.A™ is a real-time digital intelligence system that scans the internet for risks to your brand, employees, and public image — and delivers actionable, private insights. No dashboards. No training. Just answers.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-900 px-12 py-6 text-lg font-bold rounded-lg shadow-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
            <Link to="#scan-form" className="flex items-center">
              <Search className="mr-3 h-6 w-6" />
              🔎 Run a Reputation Scan
            </Link>
          </Button>
        </div>
      </section>

      {/* Top 3 USPs */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">No Dashboards. No Guesswork.</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">We do the scanning. We deliver the insight. You stay protected.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Brand, Employee, & Influencer Risk in One System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">From founders to new hires — see what the internet sees before it matters.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">GDPR-Compliant. Legal-Ready. Board-Approved.</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get reports you can share with executives, lawyers, or PR.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem → Solution Story */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">The internet never forgets. But it never warns you either.</h2>
          <div className="text-lg text-gray-700 space-y-6 mb-10">
            <p>One tweet. One Reddit thread. One headline about your employee — and your brand could be trending for all the wrong reasons.</p>
            <p className="font-semibold text-blue-900">That's why we built A.R.I.A™:</p>
            <p>A real-time monitoring service that uses AI to scan 20+ platforms, detect risk to your reputation, and privately deliver what matters — before it explodes.</p>
          </div>
        </div>
      </section>

      {/* How A.R.I.A™ Works */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How A.R.I.A™ Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Setup</h3>
              <p className="text-gray-600">You tell us what (or who) to watch — or we'll scan passively to find threats you didn't know about.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Monitor</h3>
              <p className="text-gray-600">Our AI scans news, social, Reddit, forums, and Google — 24/7.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Report</h3>
              <p className="text-gray-600">You receive a clean, board-ready PDF report with any critical risks flagged.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Act</h3>
              <p className="text-gray-600">You act confidently — with insight, evidence, and time to prepare.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Deliver */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What We Deliver</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <FileText className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Risk Reports</h3>
              <p className="text-gray-600 text-sm">With threat levels, source links, sentiment scoring</p>
            </Card>
            <Card className="p-6">
              <AlertTriangle className="h-8 w-8 text-red-600 mb-3" />
              <h3 className="font-semibold mb-2">Real-Time Alerts</h3>
              <p className="text-gray-600 text-sm">By email or Slack</p>
            </Card>
            <Card className="p-6">
              <Users className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Employee Risk Scores</h3>
              <p className="text-gray-600 text-sm">Before you promote or hire</p>
            </Card>
            <Card className="p-6">
              <Shield className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Full Compliance Stack</h3>
              <p className="text-gray-600 text-sm">GDPR, DPIA, DSR, breach tracking</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="p-8 shadow-lg">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl italic text-gray-700 mb-6">
              "A.R.I.A™ found a Reddit post about one of our senior hires before the media did. That gave us three days to act. I won't run a PR campaign without it again."
            </blockquote>
            <cite className="font-semibold text-blue-900">— Partner, UK Crisis Comms Agency</cite>
          </Card>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Plans Built for Agencies, Brands & Legal Teams</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 shadow-lg">
              <CardHeader>
                <Badge className="w-fit mb-2">Starter</Badge>
                <CardTitle className="text-2xl">Small Teams</CardTitle>
                <p className="text-gray-600">Early stage companies</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" />1 scan/month</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" />50 employees</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" />Basic reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 shadow-lg border-2 border-blue-600">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-blue-600">Pro</Badge>
                <CardTitle className="text-2xl">Legal & PR Agencies</CardTitle>
                <p className="text-gray-600">Professional teams</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" />4 scans/month</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" />Real-time alerts</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" />200 employees</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 shadow-lg">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-purple-600">Enterprise</Badge>
                <CardTitle className="text-2xl">Brands & Executives</CardTitle>
                <p className="text-gray-600">Large organizations</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" />Unlimited scans</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" />Slack alerts</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-600 mr-2" />Custom reports</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-900 text-white py-16 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Scan Your Reputation. Today.</h2>
          <p className="text-xl mb-8 text-blue-200">No setup. No software. Just intelligence you can use.</p>
          <div className="space-y-4">
            <Button asChild size="lg" className="bg-white text-blue-900 px-12 py-6 text-lg font-bold rounded-lg shadow-lg hover:bg-blue-50">
              <Link to="#scan-form">
                🎯 Request My Scan
              </Link>
            </Button>
            <p className="text-blue-200">📩 Prefer email? <a href="mailto:simon@ariaops.co.uk" className="underline">simon@ariaops.co.uk</a></p>
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
