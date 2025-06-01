
import React, { ReactNode } from 'react';
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
  className = "bg-corporate-dark"
}: PageLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Helmet>
      <div className={`min-h-screen ${className}`}>
        {children}
      </div>
    </>
  );
};

export default PageLayout;
