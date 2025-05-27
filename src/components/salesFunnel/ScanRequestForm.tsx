
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;

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
    <section id="scan-form" className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 py-20 px-6 text-center scroll-mt-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-2xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Request Your Free A.R.I.A™ Scan
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12"></div>
        
        {formSubmitted ? (
          <div className="group bg-gradient-to-br from-white to-slate-50 text-slate-800 rounded-3xl shadow-2xl p-12 backdrop-blur-sm border border-white/20 hover:shadow-green-500/20 transition-all duration-500">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Thank You!</h3>
            <p className="text-xl mb-6 text-slate-700">Your scan request has been submitted successfully.</p>
            <p className="text-slate-600 leading-relaxed">Our team will analyze your online presence and get back to you within 24 hours.</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-12 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group">
                <input 
                  name="full_name"
                  className="w-full p-6 rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white placeholder-white/70 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:bg-white/10 transition-all duration-300 text-lg group-hover:border-white/30" 
                  type="text" 
                  placeholder="Your Full Name" 
                  required 
                />
              </div>
              <div className="group">
                <input 
                  name="email"
                  className="w-full p-6 rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white placeholder-white/70 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 focus:bg-white/10 transition-all duration-300 text-lg group-hover:border-white/30" 
                  type="email" 
                  placeholder="Your Email Address" 
                  required 
                />
              </div>
              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  className="group w-full max-w-md bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-8 px-12 text-xl rounded-2xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 border border-white/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      SUBMITTING...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-white rounded-full mr-3 group-hover:animate-pulse"></div>
                      SCAN ME
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScanRequestForm;
