import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AiScrapingPage from './AiScrapingPage';

// This is a fallback page that will redirect to AI scraping for now
const Index = () => {
  const location = useLocation();
  
  // If we're at a path that includes "ai-scraping", show the AI Scraping page
  if (location.pathname.includes('ai-scraping')) {
    return <AiScrapingPage />;
  }
  
  // Otherwise redirect to the AI scraping page
  return <Navigate to="/dashboard/ai-scraping" replace />;
};

export default Index;
