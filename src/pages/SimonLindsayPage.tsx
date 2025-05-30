
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Linkedin, Globe, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Helmet } from 'react-helmet-async';

const SimonLindsayPage = () => {
  const simonLindseySchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Simon Lindsay",
    "url": "https://www.ariaops.co.uk/simon-lindsay",
    "jobTitle": "Founder & CEO",
    "worksFor": {
      "@type": "Organization",
      "name": "A.R.I.A™"
    },
    "sameAs": [
      "https://www.linkedin.com/in/simon-lindsay",
      "https://medium.com/@simon-lindsay"
    ]
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      <Helmet>
        <title>Simon Lindsay – Founder of A.R.I.A™ | AI Reputation Intelligence</title>
        <meta name="description" content="Simon Lindsay is the creator of A.R.I.A™, an AI-powered platform protecting digital reputations for influencers, founders, and public figures." />
        <script type="application/ld+json">
          {JSON.stringify(simonLindseySchema)}
        </script>
      </Helmet>
      
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">A.R.I.A™</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-4">About Simon Lindsay</h1>
            <p className="text-xl text-gray-300">
              Founder of A.R.I.A™ — the AI Reputation Intelligence Agent
            </p>
          </div>

          <div className="grid gap-8">
            <Card className="bg-[#111214] border-gray-800">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white text-2xl">Simon Lindsay</CardTitle>
                <CardDescription className="text-gray-400 text-lg">Entrepreneur and Digital Reputation Expert</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3 flex justify-center">
                    <Avatar className="w-48 h-48 border border-gray-700 shadow-lg">
                      <AvatarImage 
                        src="/lovable-uploads/f716bb9a-039b-4df0-b832-d0b61c2d220d.png"
                        alt="Simon Lindsay"
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/200x200?text=SL";
                        }}
                      />
                      <AvatarFallback className="text-4xl bg-gray-800 text-white">SL</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="md:w-2/3">
                    <p className="leading-7 mb-4 text-gray-300">
                      Simon Lindsay is the founder of <strong className="text-amber-400">A.R.I.A™</strong> — the AI Reputation Intelligence Agent.
                    </p>
                    <p className="leading-7 mb-4 text-gray-300">
                      Simon's professional journey began in the personal care industry, where he founded <strong className="text-white">KSL Hair</strong>, 
                      one of the UK's fastest-growing hair restoration clinics. With high-profile clients and a strong social 
                      media presence, the business saw rapid success — but also intense public scrutiny when challenges arose.
                    </p>
                    <p className="leading-7 text-gray-300">
                      After facing reputation-damaging press and business fallout, Simon realized that the tools to protect 
                      digital identity didn't exist — until now.
                    </p>
                  </div>
                </div>

                <Separator className="my-6 bg-gray-800" />

                <div>
                  <p className="leading-7 mb-4 text-gray-300">
                    <strong className="text-amber-400">A.R.I.A™</strong> is his answer: an autonomous digital agent that detects threats, classifies risk, 
                    and helps users respond before damage occurs.
                  </p>
                  <p className="leading-7 mb-4 text-gray-300">
                    Simon now helps others control their narrative, protect their future, and rebuild trust — 
                    using technology powered by real-world experience.
                  </p>
                </div>

                <div className="bg-[#1A1B1E] p-6 rounded-lg border border-gray-700">
                  <blockquote className="italic text-lg text-gray-300">
                    "Reputation is the currency of modern credibility. <strong className="text-amber-400">A.R.I.A™</strong> protects yours."
                  </blockquote>
                  <p className="text-right mt-2 text-gray-400">— Simon Lindsay</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#111214] border-gray-800">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white">Contact</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>Based in the UK, available worldwide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a href="https://www.ariaops.co.uk" className="text-amber-400 hover:text-amber-300 hover:underline" target="_blank" rel="noopener noreferrer">
                      www.ariaops.co.uk
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href="mailto:simon@ariaops.co.uk" className="text-amber-400 hover:text-amber-300 hover:underline">
                      simon@ariaops.co.uk
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800/50 mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 A.R.I.A™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimonLindsayPage;
