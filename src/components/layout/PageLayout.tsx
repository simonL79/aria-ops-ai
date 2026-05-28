import React, { ReactNode, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const PageLayout = ({
  children,
  title = "A.R.I.A™ – AI Reputation Intelligence Agent",
  description = "Monitor, protect, and repair your digital reputation with A.R.I.A™ — the AI-powered reputation defense system built for founders, influencers, and businesses.",
  className = ""
}: PageLayoutProps) => {
  // Luxury dark intelligence theme on public pages
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Helmet>
      <div className={`min-h-screen bg-background text-foreground ${className}`}>
        {children}
      </div>
    </>
  );
};

export default PageLayout;
