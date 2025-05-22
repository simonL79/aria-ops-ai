
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AiScrapingPage from './AiScrapingPage';
import DashboardPage from './dashboard/DashboardPage';
import IntelligencePage from './dashboard/IntelligencePage';
import RadarPage from './dashboard/RadarPage';
import Authentication from './Authentication';

// This is a fallback page that will render the appropriate component based on the current path
const Index = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const path = location.pathname;
  
  // Public home route should go to sales funnel page
  if (path === '/') {
    return <Navigate to="/" replace />;
  }
  
  // If not authenticated, redirect to auth page for protected routes
  if (!isAuthenticated && path !== '/auth') {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
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
