import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { Home, FileQuestion } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SEO
        title="Page Not Found — A.R.I.A™"
        description="The page you are looking for does not exist. Return to A.R.I.A™ reputation intelligence services."
        path="/404"
        noIndex
      />

      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-lg">
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <FileQuestion className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
            404
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Page not found
          </p>
          <p className="text-muted-foreground mb-8">
            The page you are looking for does not exist or has been moved.
            Check the URL or navigate back to safety.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button size="lg" className="gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
