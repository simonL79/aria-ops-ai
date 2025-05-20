import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ProblemSection from '@/components/home/ProblemSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import PlatformsSection from '@/components/home/PlatformsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import GDPRWalkthrough from "@/components/gdpr/GDPRWalkthrough";

const HomePage = () => {
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header and Navigation */}
      <header className="bg-premium-black text-white py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            A.R.I.A™
          </a>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="/about" className="hover:text-gray-300">
                  About
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-gray-300">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/auth/sign-in" className="hover:text-gray-300">
                  Sign In
                </a>
              </li>
              <li>
                <a
                  href="/auth/sign-up"
                  className="bg-premium-yellow text-premium-black py-2 px-4 rounded hover:bg-yellow-400"
                >
                  Get Started
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Problem Statement */}
      <ProblemSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* GDPR Compliance Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">GDPR Compliance & Data Protection</h2>
          <GDPRWalkthrough />
        </div>
      </section>
      
      {/* Platforms */}
      <PlatformsSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* CTA */}
      <CTASection />
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} A.R.I.A™. All rights reserved.
          </p>
          <nav className="mt-4">
            <ul className="flex justify-center space-x-6">
              <li>
                <a href="/privacy-policy" className="text-gray-500 hover:text-gray-700">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/disclaimer" className="text-gray-500 hover:text-gray-700">
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-500 hover:text-gray-700">
                  Terms of Service
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
