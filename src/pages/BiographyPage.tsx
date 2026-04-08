
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
          <h2 className="text-2xl font-bold mb-4 text-foreground">Something went wrong</h2>
          <p className="mb-6 text-muted-foreground">We apologize for the inconvenience. Please try again later.</p>
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
              <h1 className="text-3xl font-bold tracking-tight text-foreground">About Simon Lindsay</h1>
              <p className="text-muted-foreground mt-2">
                Founder of A.R.I.A™ — the AI Reputation Intelligence Agent
              </p>
            </div>

            <div className="grid gap-8">
              <Card className="bg-card border-border overflow-hidden">
                <CardHeader className="bg-secondary border-b border-border">
                  <CardTitle className="text-foreground">Simon Lindsay</CardTitle>
                  <CardDescription className="text-muted-foreground">Entrepreneur and Digital Reputation Expert</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex justify-center">
                      <Avatar className="w-48 h-48 border border-border shadow-md">
                        <AvatarImage 
                          src="/lovable-uploads/f716bb9a-039b-4df0-b832-d0b61c2d220d.png"
                          alt="Simon Lindsay"
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/200x200?text=SL";
                          }}
                        />
                        <AvatarFallback className="text-4xl bg-secondary">SL</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="md:w-2/3">
                      <p className="leading-7 mb-4 text-muted-foreground">
                        Simon Lindsay is the founder of <strong className="text-foreground">A.R.I.A™</strong> (AI Reputation Intelligence Agent), an advanced reputation intelligence platform designed to monitor, analyse, and protect digital reputation in an increasingly AI-driven information environment.
                      </p>
                      <p className="leading-7 mb-4 text-muted-foreground">
                        With experience spanning combat sports, celebrity management, commercial partnerships, and digital strategy, Simon has developed an international network across sport, media, and business. His work focuses on identifying emerging reputational risks, protecting public profiles, and structuring strategic opportunities that strengthen both personal and organisational brands.
                      </p>
                      <p className="leading-7 text-muted-foreground">
                        Through A.R.I.A™, Simon combines artificial intelligence with real-world experience operating in high-profile environments. The platform enables clients to monitor their digital footprint, anticipate narrative risks, and maintain greater control over how they are represented across search, media, and social platforms.
                      </p>
                    </div>
                  </div>

                  <Separator className="my-6 bg-border" />

                  <div>
                    <p className="leading-7 mb-4 text-muted-foreground">
                      Alongside his work in reputation intelligence, Simon remains active across boxing, BKFC, and the wider sports and entertainment industry, where he structures brand partnerships and commercial opportunities for athletes, creators, and public figures.
                    </p>
                  </div>

                  <div className="bg-secondary p-6 rounded-md my-6 border border-border">
                    <blockquote className="italic text-lg text-foreground">
                      "Protect reputation. Control narrative. Unlock strategic opportunity."
                    </blockquote>
                    <p className="text-right mt-2 text-muted-foreground">— Simon Lindsay</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="bg-secondary border-b border-border">
                  <CardTitle className="text-foreground">Contact</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Based in the UK, available worldwide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href="https://www.ariaops.co.uk" className="text-primary hover:text-primary/80 hover:underline" target="_blank" rel="noopener noreferrer">
                        www.ariaops.co.uk
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href="mailto:simon@ariaops.co.uk" className="text-primary hover:text-primary/80 hover:underline">
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
