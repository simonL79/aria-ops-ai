
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Linkedin, Globe, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import PublicLayout from '@/components/layout/PublicLayout';

const BiographyPage = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-premium-black">About Simon Lindsay</h1>
            <p className="text-premium-gray mt-2">
              Founder of A.R.I.A™ — the AI Reputation Intelligence Agent
            </p>
          </div>

          <div className="grid gap-8">
            <Card className="premium-card overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-premium-silver">
                <CardTitle className="text-premium-black">Simon Lindsay</CardTitle>
                <CardDescription className="text-premium-gray">Entrepreneur and Digital Reputation Expert</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80" 
                      alt="Simon Lindsay" 
                      className="w-48 h-48 rounded-full object-cover border border-premium-silver shadow-md"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <p className="leading-7 mb-4 text-premium-gray">
                      Simon Lindsay is the founder of <strong className="text-premium-black">A.R.I.A™</strong> — the AI Reputation Intelligence Agent.
                    </p>
                    <p className="leading-7 mb-4 text-premium-gray">
                      Simon's professional journey began in the personal care industry, where he founded <strong className="text-premium-black">KSL Hair</strong>, 
                      one of the UK's fastest-growing hair restoration clinics. With high-profile clients and a strong social 
                      media presence, the business saw rapid success — but also intense public scrutiny when challenges arose.
                    </p>
                    <p className="leading-7 text-premium-gray">
                      After facing reputation-damaging press and business fallout, Simon realized that the tools to protect 
                      digital identity didn't exist — until now.
                    </p>
                  </div>
                </div>

                <Separator className="my-6 bg-premium-silver" />

                <div>
                  <p className="leading-7 mb-4 text-premium-gray">
                    <strong className="text-premium-black">A.R.I.A™</strong> is his answer: an autonomous digital agent that detects threats, classifies risk, 
                    and helps users respond before damage occurs.
                  </p>
                  <p className="leading-7 mb-4 text-premium-gray">
                    Simon now helps others control their narrative, protect their future, and rebuild trust — 
                    using technology powered by real-world experience.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-md my-6 border border-premium-silver">
                  <blockquote className="italic text-lg text-premium-darkGray">
                    "Reputation is the currency of modern credibility. <strong>A.R.I.A™</strong> protects yours."
                  </blockquote>
                  <p className="text-right mt-2 text-premium-gray">— Simon Lindsay</p>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader className="bg-gray-50 border-b border-premium-silver">
                <CardTitle className="text-premium-black">Contact</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                  <div className="flex items-center gap-2 text-premium-gray">
                    <MapPin className="h-4 w-4" />
                    <span>Based in the UK, available worldwide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-premium-gray" />
                    <a href="https://www.ariaops.co.uk" className="text-premium-darkGray hover:text-premium-black hover:underline" target="_blank" rel="noopener noreferrer">
                      www.ariaops.co.uk
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-premium-gray" />
                    <a href="mailto:simon@ariaops.co.uk" className="text-premium-darkGray hover:text-premium-black hover:underline">
                      simon@ariaops.co.uk
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default BiographyPage;
