
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AdminWalkthrough from "@/components/home/AdminWalkthrough";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import StickyHeader from "@/components/layout/StickyHeader";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

const SalesFunnelPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track conversion events after successful form submission
  const trackConversionEvents = () => {
    // Facebook Pixel conversion tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }
    
    // Google Ads conversion tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID/label' // Replace with your actual conversion ID
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const full_name = e.target.full_name.value;
    const email = e.target.email.value;

    try {
      // Insert the scan submission
      const { error } = await supabase
        .from('reputation_scan_submissions')
        .insert([{ full_name, email, keywords: '', status: 'new' }]);

      if (error) {
        toast.error("There was a problem submitting your request. Please try again.");
        console.error("Submission error:", error);
        return;
      }
      
      // Check if there are any matching influencer alerts
      // Note: This is commented out because the table doesn't exist yet
      /*
      const match = await supabase
        .from('influencer_alerts')
        .select('*')
        .eq('influencer_name', full_name)
        .maybeSingle();

      // Update the influencer alert status if there's a match
      if (match.data) {
        await supabase
          .from('influencer_alerts')
          .update({ status: 'responded' })
          .eq('id', match.data.id);
      }
      */

      // Track conversion events
      trackConversionEvents();
      
      // Show success message
      setFormSubmitted(true);
      toast.success("Your scan request has been submitted successfully!");
      
      // Redirect to thank you page
      setTimeout(() => {
        navigate("/thank-you");
      }, 1500);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If authenticated, show admin dashboard walkthrough
  if (isAuthenticated) {
    return (
      <PublicLayout>
        <div className="container max-w-screen-xl mx-auto py-12">
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                Welcome to A.R.I.A™ Admin Dashboard
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Follow this walkthrough guide to manage your clients' reputation,
                analyze threats, and deliver actionable insights.
              </p>
            </div>
            
            <AdminWalkthrough />
            
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="action"
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="shadow-lg"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/clients")}
              >
                Manage Clients
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // For public users, show the landing page with proper navigation
  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col">
      {/* Use the StickyHeader component for consistent navigation */}
      <StickyHeader isScrolled={isScrolled} />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Problem Section */}
      <section className="py-16 px-6 md:px-24 bg-gray-800 text-white text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Google never forgets — but now, you don't have to either.</h2>
          <p className="text-lg">Old articles, buried posts, forum rumors — they all still rank. A.R.I.A™ finds what others see.</p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 md:px-24 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">How A.R.I.A™ Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50">
              <h3 className="font-bold text-xl mb-2">1. Scan</h3>
              <p>We search across web, news, forums & social.</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50">
              <h3 className="font-bold text-xl mb-2">2. Classify</h3>
              <p>We identify threats, fake profiles, & negative press.</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50">
              <h3 className="font-bold text-xl mb-2">3. Respond</h3>
              <p>You get alerts, strategies & AI-crafted responses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section id="scan-form" className="bg-blue-600 py-16 px-6 md:px-8 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Request Your Free A.R.I.A™ Scan</h2>
          {formSubmitted ? (
            <div className="max-w-xl mx-auto p-6 bg-white text-gray-800 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2 text-blue-600">Thank You!</h3>
              <p className="text-lg mb-4">Your scan request has been submitted successfully.</p>
              <p>Our team will analyze your online presence and get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
              <input 
                name="full_name"
                className="w-full p-3 rounded" 
                type="text" 
                placeholder="Your Full Name" 
                required 
              />
              <input 
                name="email"
                className="w-full p-3 rounded" 
                type="email" 
                placeholder="Your Email Address" 
                required 
              />
              <Button 
                type="submit" 
                className="w-full bg-black text-white font-semibold py-6 rounded hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SUBMITTING..." : "SCAN ME"}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Use the Footer component for consistent navigation */}
      <Footer />
    </div>
  );
};

export default SalesFunnelPage;
