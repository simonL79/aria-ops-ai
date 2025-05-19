
import React from 'react';
import { Search, Twitter, Facebook, Linkedin, MessageSquare, Youtube, Star, Shield, Database } from 'lucide-react';

const PlatformsSection = () => {
  return (
    <section id="platforms" className="platforms-section bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-premium-darkGray text-center">Platforms We Monitor</h3>
        <p className="text-lg mb-12 max-w-4xl mx-auto text-center text-premium-gray">
          A.R.I.A™ scans across the most critical online platforms where threats to your name or brand can appear.
          From trending social posts to obscure forum threads, we cover the full threat landscape in real time.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-10">
          {/* Platform Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
            <div className="shrink-0 bg-gray-50 rounded-full p-3">
              <Search className="h-8 w-8 text-premium-silver" />
            </div>
            <div>
              <h4 className="font-bold text-premium-darkGray mb-2">Google Search</h4>
              <p className="text-premium-gray text-sm">Negative articles, blog posts, defamation</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
            <div className="shrink-0 bg-gray-50 rounded-full p-3">
              <Twitter className="h-8 w-8 text-premium-silver" />
            </div>
            <div>
              <h4 className="font-bold text-premium-darkGray mb-2">X (Twitter)</h4>
              <p className="text-premium-gray text-sm">Real-time mentions, viral complaints</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
            <div className="shrink-0 bg-gray-50 rounded-full p-3">
              <MessageSquare className="h-8 w-8 text-premium-silver" />
            </div>
            <div>
              <h4 className="font-bold text-premium-darkGray mb-2">TikTok</h4>
              <p className="text-premium-gray text-sm">Trending videos, viral content</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
            <div className="shrink-0 bg-gray-50 rounded-full p-3">
              <Facebook className="h-8 w-8 text-premium-silver" />
            </div>
            <div>
              <h4 className="font-bold text-premium-darkGray mb-2">Facebook</h4>
              <p className="text-premium-gray text-sm">Public posts, groups, page mentions</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
            <div className="shrink-0 bg-gray-50 rounded-full p-3">
              <Linkedin className="h-8 w-8 text-premium-silver" />
            </div>
            <div>
              <h4 className="font-bold text-premium-darkGray mb-2">LinkedIn</h4>
              <p className="text-premium-gray text-sm">Professional content, industry posts</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
            <div className="shrink-0 bg-gray-50 rounded-full p-3">
              <MessageSquare className="h-8 w-8 text-premium-silver" />
            </div>
            <div>
              <h4 className="font-bold text-premium-darkGray mb-2">Reddit & Forums</h4>
              <p className="text-premium-gray text-sm">Viral threads, coordinated attacks</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
            <div className="shrink-0 bg-gray-50 rounded-full p-3">
              <MessageSquare className="h-8 w-8 text-premium-silver" />
            </div>
            <div>
              <h4 className="font-bold text-premium-darkGray mb-2">News Sites</h4>
              <p className="text-premium-gray text-sm">Online publications and press coverage</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
            <div className="shrink-0 bg-gray-50 rounded-full p-3">
              <Youtube className="h-8 w-8 text-premium-silver" />
            </div>
            <div>
              <h4 className="font-bold text-premium-darkGray mb-2">YouTube & Podcasts</h4>
              <p className="text-premium-gray text-sm">Mentions in videos and spoken content</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
            <div className="shrink-0 bg-gray-50 rounded-full p-3">
              <Star className="h-8 w-8 text-premium-silver" />
            </div>
            <div>
              <h4 className="font-bold text-premium-darkGray mb-2">Review Sites</h4>
              <p className="text-premium-gray text-sm">Trustpilot, Glassdoor, Yelp, Google Reviews</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
            <div className="shrink-0 bg-gray-50 rounded-full p-3">
              <Shield className="h-8 w-8 text-premium-silver" />
            </div>
            <div>
              <h4 className="font-bold text-premium-darkGray mb-2">Dark Web & Pastebins</h4>
              <p className="text-premium-gray text-sm">Data leaks and impersonation risks (optional module)</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center bg-premium-black rounded-lg p-8 text-white shadow-xl">
          <h4 className="text-xl font-bold mb-4">
            "If your name appears, A.R.I.A™ knows about it."
          </h4>
          <p className="text-premium-silver">
            All mentions are AI-classified for tone, intent, and threat level — giving you clarity, not chaos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;
