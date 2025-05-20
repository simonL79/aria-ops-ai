
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Import pages from their actual locations
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import AiScrapingPage from "./pages/AiScrapingPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/dashboard/intelligence" element={<Index />} />
        <Route path="/dashboard/radar" element={<Index />} />
        <Route path="/dashboard/ai-scraping" element={<AiScrapingPage />} />
        <Route path="/dashboard/monitor" element={<Index />} />
        <Route path="/dashboard/new-companies" element={<Index />} />
        <Route path="/dashboard/new-companies/:id" element={<Index />} />
        <Route path="/dashboard/radar/entity/:id" element={<Index />} />
        <Route path="/settings" element={<Index />} />
        <Route path="/login" element={<Index />} />
        <Route path="/register" element={<Index />} />
      </Routes>
      <Toaster richColors />
    </>
  );
}

export default App;
