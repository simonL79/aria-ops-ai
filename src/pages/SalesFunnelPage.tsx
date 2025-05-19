
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const SalesFunnelPage = () => {
  return (
    <div className="min-h-screen">
      {/* SECTION 1: HERO / HEADLINE */}
      <section className="hero bg-black text-white text-center py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Reputation Is Under Surveillance</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto">
            A.R.I.A™ monitors, protects, and restores your digital reputation — using artificial intelligence built from real-world experience.
          </p>
          <Button asChild className="bg-white text-black px-8 py-4 text-lg font-semibold rounded shadow hover:bg-gray-200">
            <a href="#get-started">Start Your Reputation Scan</a>
          </Button>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section className="problem bg-gray-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">One Post Can Wreck Everything</h2>
          <p className="text-lg max-w-2xl mx-auto mb-10">
            Whether it's a tweet, a review, or a hit piece — your name online shapes your future. Most people discover the damage when it's too late.
            A.R.I.A™ changes that.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-4"><strong>🧨 Viral Complaints</strong><br />Flagged & suppressed</div>
            <div className="p-4"><strong>⚖️ Legal Threats</strong><br />Monitored & classified</div>
            <div className="p-4"><strong>🔎 Google Results</strong><br />Buried & replaced</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="how-it-works py-20 text-center bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">How A.R.I.A™ Defends You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">1. Scan & Detect</h3>
              <p>A.R.I.A™ searches the web — news, social, forums — for any mention of your name or brand.</p>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">2. Analyze & Score</h3>
              <p>Mentions are AI-scored for severity, category, and urgency — instantly.</p>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">3. Suppress & Repair</h3>
              <p>We push down damaging links, publish optimized content, and notify you in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SOCIAL PROOF */}
      <section className="testimonials bg-gray-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Real Recovery. Real People.</h2>
          <p className="text-lg mb-12 max-w-xl mx-auto">
            We've helped founders, influencers, and businesses clear their name and reclaim their future.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded shadow">
              <p className="mb-2">"ARIA helped bury 3 negative articles that haunted my business for years."</p>
              <strong>– Former Tech CEO</strong>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <p className="mb-2">"I got a call from a law firm. A.R.I.A™ flagged it before Google did."</p>
              <strong>– Influencer, UK</strong>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <p className="mb-2">"This is the digital PR assistant I didn't know I needed."</p>
              <strong>– Private Client</strong>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <section id="get-started" className="cta bg-black text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Reputation?</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Start with a free reputation scan and get your first threat report within 24 hours.
          </p>
          <Button asChild className="bg-white text-black px-10 py-4 text-lg font-bold rounded hover:bg-gray-200">
            <Link to="/dashboard">Scan My Name Now</Link>
          </Button>
        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center text-sm">
        <p>&copy; 2025 A.R.I.A™ — AI Reputation Intelligence Agent</p>
        <p>Built with integrity by Simon Lindsay | <Link to="/about" className="underline">About</Link> | <Link to="/home" className="underline">Home</Link></p>
      </footer>
    </div>
  );
};

export default SalesFunnelPage;
