
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
  className = ""
}: PageLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <style>
          {`
            html, body, #root {
              background-color: #0A0B0D !important;
              color: #F9FAFB !important;
              min-height: 100vh !important;
            }
          `}
        </style>
      </Helmet>
      <div className={`min-h-screen bg-corporate-dark text-white ${className}`} style={{ backgroundColor: '#0A0B0D', color: '#F9FAFB' }}>
        {children}
      </div>
    </>
  );
};

export default PageLayout;
