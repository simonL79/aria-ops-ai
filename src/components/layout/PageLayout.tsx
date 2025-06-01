
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
  
  // Force style application on component mount
  useEffect(() => {
    const applyDarkTheme = () => {
      // Force dark theme on html and body
      document.documentElement.style.backgroundColor = '#0A0B0D';
      document.documentElement.style.color = '#F9FAFB';
      document.body.style.backgroundColor = '#0A0B0D';
      document.body.style.color = '#F9FAFB';
      
      // Add dark class
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      
      // Force styles on root
      const root = document.getElementById('root');
      if (root) {
        root.style.backgroundColor = '#0A0B0D';
        root.style.color = '#F9FAFB';
        root.style.minHeight = '100vh';
      }
    };
    
    // Apply immediately
    applyDarkTheme();
    
    // Apply after a short delay to override any conflicting styles
    const timeoutId = setTimeout(applyDarkTheme, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <style>
          {`
            html, body, #root {
              background-color: #0A0B0D !important;
              color: #F9FAFB !important;
              min-height: 100vh !important;
            }
            
            * {
              color: inherit !important;
            }
            
            .bg-white, .text-black {
              background-color: #0A0B0D !important;
              color: #F9FAFB !important;
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
