
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AiScrapingPage from './AiScrapingPage';
import DashboardPage from './dashboard/DashboardPage';
import IntelligencePage from './dashboard/IntelligencePage';
import RadarPage from './dashboard/RadarPage';

// This is a fallback page that will render the appropriate component based on the current path
const Index = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Check the current path and render the appropriate component
  if (path.includes('ai-scraping')) {
    return <AiScrapingPage />;
  } else if (path.includes('intelligence')) {
    return <IntelligencePage />;
  } else if (path.includes('radar')) {
    return <RadarPage />;
  } else if (path === '/dashboard') {
    return <DashboardPage />;
  }
  
  // Default redirect to the AI scraping page
  return <Navigate to="/dashboard/ai-scraping" replace />;
};

export default Index;
