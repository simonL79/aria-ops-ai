
import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';

const HomePage = () => {
  
  return (
    <PublicLayout>
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
        <section className="hero bg-gradient-to-r from-premium-black to-premium-darkGray text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000')] bg-cover bg-center opacity-5"></div>
          <div className="container mx-auto px-6 relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight text-shadow-lg text-center">
              Your Reputation Is Under <span className="text-premium-silver">Surveillance</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed text-gray-300 text-center">
              A.R.I.A™ monitors, protects, and restores your digital reputation — using artificial intelligence built from real-world experience.
            </p>
            <div className="flex justify-center">
              <Link to="/scan" className="bg-white text-premium-black px-8 py-3 text-lg font-semibold rounded-md shadow-lg hover:bg-premium-silver transition-all duration-300 hover:shadow-xl flex items-center gap-2">
                Start Your Reputation Scan
              </Link>
            </div>
          </div>
        </section>
        
        {/* Problem Statement */}
        <section className="problem bg-gray-100 py-24 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-premium-black">One Post Can Wreck Everything</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-16 text-premium-gray">
              Whether it's a tweet, a review, or a hit piece — your name online shapes your future. Most people discover the damage when it's too late.
              <span className="block mt-2 font-semibold text-premium-darkGray">A.R.I.A™ changes that.</span>
            </p>
          </div>
        </section>
        
        {/* How It Works */}
        <section id="how-it-works" className="how-it-works py-24 text-center bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-premium-black">How A.R.I.A™ Defends You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-premium-black text-white flex items-center justify-center font-bold text-xl">1</div>
                <div className="border-2 border-premium-lightSilver p-8 rounded-xl h-full shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-premium-darkGray">Scan & Detect</h3>
                  <p className="text-premium-gray">A.R.I.A™ searches the web — news, social, forums — for any mention of your name or brand.</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-premium-black text-white flex items-center justify-center font-bold text-xl">2</div>
                <div className="border-2 border-premium-lightSilver p-8 rounded-xl h-full shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-premium-darkGray">Analyze & Score</h3>
                  <p className="text-premium-gray">Mentions are AI-scored for severity, category, and urgency — instantly.</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-premium-black text-white flex items-center justify-center font-bold text-xl">3</div>
                <div className="border-2 border-premium-lightSilver p-8 rounded-xl h-full shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-premium-darkGray">Suppress & Repair</h3>
                  <p className="text-premium-gray">We push down damaging links, publish optimized content, and notify you in real-time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Platforms */}
        <section id="platforms" className="platforms-section bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-premium-darkGray text-center">Platforms We Monitor</h3>
            <p className="text-lg mb-12 max-w-4xl mx-auto text-center text-premium-gray">
              A.R.I.A™ scans across the most critical online platforms where threats to your name or brand can appear.
              From trending social posts to obscure forum threads, we cover the full threat landscape in real time.
            </p>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="testimonials bg-gray-100 py-24 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-premium-black">Real Recovery. Real People.</h2>
            <p className="text-lg md:text-xl mb-16 max-w-xl mx-auto text-premium-gray">
              We've helped founders, influencers, and businesses clear their name and reclaim their future.
            </p>
          </div>
        </section>
        
        {/* CTA */}
        <section id="get-started" className="cta premium-gradient text-white py-24 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-shadow">Ready to Take Control of Your Reputation?</h2>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-premium-silver">
              Start with a free reputation scan and get your first threat report within 24 hours.
            </p>
            <div className="space-y-6">
              <Link to="/scan" className="inline-block bg-white text-premium-black px-12 py-3 text-lg font-bold rounded-md shadow-lg hover:bg-premium-silver hover:shadow-xl transition-all duration-300">
                Scan My Name Now
              </Link>
            </div>
          </div>
        </section>
        
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
                <li>
                  <Link to="/gdpr-compliance" className="text-gray-500 hover:text-gray-700">
                    GDPR Compliance
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </div>
    </PublicLayout>
  );
};

export default HomePage;
