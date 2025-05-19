
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from 'lucide-react';
import Logo from '@/components/ui/logo';

const SalesFunnelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* SECTION 1: HERO / HEADLINE */}
      <section className="hero bg-gradient-to-r from-premium-black to-premium-darkGray text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center justify-center mb-6">
            <Logo variant="light" size="10x" className="mb-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight text-shadow-lg text-center">
            Your Reputation Is Under <span className="text-premium-silver">Surveillance</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed text-gray-300 text-center">
            A.R.I.A™ monitors, protects, and restores your digital reputation — using artificial intelligence built from real-world experience.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="bg-white text-premium-black px-8 py-7 text-lg font-semibold rounded-md shadow-lg hover:bg-premium-silver transition-all duration-300 hover:shadow-xl">
              <a href="#get-started" className="flex items-center gap-2">
                Start Your Reputation Scan <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section className="problem bg-gray-100 py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-premium-black">One Post Can Wreck Everything</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-16 text-premium-gray">
            Whether it's a tweet, a review, or a hit piece — your name online shapes your future. Most people discover the damage when it's too late.
            <span className="block mt-2 font-semibold text-premium-darkGray">A.R.I.A™ changes that.</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="premium-card p-8 rounded-xl transform hover:-translate-y-1">
              <div className="bg-red-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center text-2xl">
                🧨
              </div>
              <h3 className="text-xl font-bold mb-3 text-premium-darkGray">Viral Complaints</h3>
              <p className="text-premium-gray">Flagged & suppressed before they can spread</p>
            </div>
            <div className="premium-card p-8 rounded-xl transform hover:-translate-y-1">
              <div className="bg-blue-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center text-2xl">
                ⚖️
              </div>
              <h3 className="text-xl font-bold mb-3 text-premium-darkGray">Legal Threats</h3>
              <p className="text-premium-gray">Monitored & classified to reduce risk</p>
            </div>
            <div className="premium-card p-8 rounded-xl transform hover:-translate-y-1">
              <div className="bg-green-50 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center text-2xl">
                🔎
              </div>
              <h3 className="text-xl font-bold mb-3 text-premium-darkGray">Google Results</h3>
              <p className="text-premium-gray">Buried & replaced with positive content</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="how-it-works py-24 text-center bg-white">
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

      {/* SECTION 4: SOCIAL PROOF */}
      <section className="testimonials bg-gray-100 py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-premium-black">Real Recovery. Real People.</h2>
          <p className="text-lg md:text-xl mb-16 max-w-xl mx-auto text-premium-gray">
            We've helped founders, influencers, and businesses clear their name and reclaim their future.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="premium-card p-8 rounded-xl">
              <div className="mb-6">
                <svg className="w-10 h-10 text-premium-silver mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="mb-6 text-premium-gray italic">"ARIA helped bury 3 negative articles that haunted my business for years."</p>
              <strong className="text-premium-darkGray font-medium">– Former Tech CEO</strong>
            </div>
            <div className="premium-card p-8 rounded-xl">
              <div className="mb-6">
                <svg className="w-10 h-10 text-premium-silver mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="mb-6 text-premium-gray italic">"I got a call from a law firm. A.R.I.A™ flagged it before Google did."</p>
              <strong className="text-premium-darkGray font-medium">– Influencer, UK</strong>
            </div>
            <div className="premium-card p-8 rounded-xl">
              <div className="mb-6">
                <svg className="w-10 h-10 text-premium-silver mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="mb-6 text-premium-gray italic">"This is the digital PR assistant I didn't know I needed."</p>
              <strong className="text-premium-darkGray font-medium">– Private Client</strong>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <section id="get-started" className="cta premium-gradient text-white py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-shadow">Ready to Take Control of Your Reputation?</h2>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-premium-silver">
            Start with a free reputation scan and get your first threat report within 24 hours.
          </p>
          <div className="space-y-6">
            <Button asChild size="lg" className="bg-white text-premium-black px-12 py-7 text-lg font-bold rounded-md shadow-lg hover:bg-premium-silver hover:shadow-xl transition-all duration-300">
              <Link to="/dashboard">Scan My Name Now</Link>
            </Button>
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-5 w-5 text-green-400" />
                <span>Free initial scan</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-5 w-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-5 w-5 text-green-400" />
                <span>24/7 monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <footer className="bg-premium-black text-premium-silver py-16 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <Logo variant="light" size="md" />
            </div>
            <div className="flex space-x-8">
              <Link to="/about" className="text-premium-silver hover:text-white transition-colors">About</Link>
              <Link to="/biography" className="text-premium-silver hover:text-white transition-colors">Simon Lindsay</Link>
              <Link to="/auth" className="text-premium-silver hover:text-white transition-colors">Login</Link>
            </div>
          </div>
          <div className="border-t border-premium-darkGray pt-8 mt-8">
            <p>&copy; 2025 A.R.I.A™ — AI Reputation Intelligence Agent</p>
            <p className="mt-2">Built with integrity by Simon Lindsay</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesFunnelPage;
