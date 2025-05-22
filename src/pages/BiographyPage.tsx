
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Linkedin, Globe, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import PublicLayout from '@/components/layout/PublicLayout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Helmet } from 'react-helmet-async';

// Error boundary component to catch rendering errors
class PageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Biography page error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">We apologize for the inconvenience. Please try again later.</p>
          <Link to="/">
            <Button variant="default">Return to Home</Button>
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

const BiographyPage = () => {
  // Structured data for Simon Lindsay (Schema.org)
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
    <PublicLayout>
      <Helmet>
        <title>Simon Lindsay – Founder of A.R.I.A™ | AI Reputation Intelligence</title>
        <meta name="description" content="Simon Lindsay is the creator of A.R.I.A™, an AI-powered platform protecting digital reputations for influencers, founders, and public figures." />
        <script type="application/ld+json">
          {JSON.stringify(simonLindseySchema)}
        </script>
      </Helmet>
      
      <PageErrorBoundary>
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
                      <Avatar className="w-48 h-48 border border-premium-silver shadow-md">
                        <AvatarImage 
                          src="/lovable-uploads/f716bb9a-039b-4df0-b832-d0b61c2d220d.png"
                          alt="Simon Lindsay"
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/200x200?text=SL";
                          }}
                        />
                        <AvatarFallback className="text-4xl bg-premium-silver/20">SL</AvatarFallback>
                      </Avatar>
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
      </PageErrorBoundary>
    </PublicLayout>
  );
};

export default BiographyPage;
