
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ScanRequestForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  return (
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
              className="w-full p-3 rounded border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
              type="text" 
              placeholder="Your Full Name" 
              required 
            />
            <input 
              name="email"
              className="w-full p-3 rounded border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
              type="email" 
              placeholder="Your Email Address" 
              required 
            />
            <Button 
              type="submit" 
              className="w-full bg-blue-800 text-white font-semibold py-6 rounded hover:bg-blue-900 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "SUBMITTING..." : "SCAN ME"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ScanRequestForm;
