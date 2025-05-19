
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Linkedin, Globe, MapPin } from 'lucide-react';

const BiographyPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">About Simon Lindsay</h1>
          <p className="text-muted-foreground mt-2">
            Founder of A.R.I.A™ — the AI Reputation Intelligence Agent
          </p>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Simon Lindsay</CardTitle>
              <CardDescription>Entrepreneur and Digital Reputation Expert</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Photo</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <p className="leading-7 mb-4">
                    Simon Lindsay is the founder of <strong>A.R.I.A™</strong> — the AI Reputation Intelligence Agent.
                  </p>
                  <p className="leading-7 mb-4">
                    Simon's professional journey began in the personal care industry, where he founded <strong>KSL Hair</strong>, 
                    one of the UK's fastest-growing hair restoration clinics. With high-profile clients and a strong social 
                    media presence, the business saw rapid success — but also intense public scrutiny when challenges arose.
                  </p>
                  <p className="leading-7">
                    After facing reputation-damaging press and business fallout, Simon realized that the tools to protect 
                    digital identity didn't exist — until now.
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <p className="leading-7 mb-4">
                  <strong>A.R.I.A™</strong> is his answer: an autonomous digital agent that detects threats, classifies risk, 
                  and helps users respond before damage occurs.
                </p>
                <p className="leading-7 mb-4">
                  Simon now helps others control their narrative, protect their future, and rebuild trust — 
                  using technology powered by real-world experience.
                </p>
              </div>

              <div className="bg-muted p-6 rounded-md my-6">
                <blockquote className="italic text-lg">
                  "Reputation is the currency of modern credibility. <strong>A.R.I.A™</strong> protects yours."
                </blockquote>
                <p className="text-right mt-2">— Simon Lindsay</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Based in the UK, available worldwide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a href="https://www.ariaops.co.uk" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    www.ariaops.co.uk
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BiographyPage;
