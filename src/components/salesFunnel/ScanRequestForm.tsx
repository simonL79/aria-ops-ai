
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
    <section id="scan-form" className="relative bg-[#0A0F2C] py-12 sm:py-16 md:py-24 px-4 sm:px-6 text-center scroll-mt-16 overflow-hidden">
      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="border-r border-b border-[#247CFF]/20"></div>
          ))}
        </div>
      </div>
      
      {/* Pulsing surveillance nodes */}
      <div className="absolute top-1/4 left-0 w-4 h-4 bg-[#247CFF] rounded-full animate-pulse shadow-lg shadow-[#247CFF]/50"></div>
      <div className="absolute bottom-1/4 right-0 w-6 h-6 bg-[#38C172] rounded-full animate-pulse shadow-lg shadow-[#38C172]/50"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#247CFF] rounded-full animate-pulse"></div>
      
      <div className="container mx-auto max-w-3xl relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 text-white font-['Space_Grotesk'] tracking-tight px-2">
          REQUEST YOUR FREE A.R.I.A™ SCAN
        </h2>
        <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-[#247CFF] to-[#38C172] mx-auto mb-8 sm:mb-12 md:mb-16"></div>
        
        {formSubmitted ? (
          <div className="group bg-gradient-to-br from-[#D8DEE9] to-white text-[#0A0F2C] rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 backdrop-blur-sm border border-[#38C172]/30 hover:shadow-[0_0_40px_rgba(56,193,114,0.3)] transition-all duration-500 mx-2 sm:mx-0">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-[#38C172] to-[#247CFF] rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg shadow-[#38C172]/30">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-[#38C172] rounded-full"></div>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 text-[#38C172] font-['Space_Grotesk'] tracking-wide">
              SCAN REQUEST SUBMITTED
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-[#0A0F2C] font-['Inter']">
              Your request has been submitted successfully.
            </p>
            <p className="text-sm sm:text-base text-[#1C1C1E] leading-relaxed font-['Inter']">
              Our team will analyze your online presence and get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <div className="bg-[#1C1C1E]/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 md:p-16 border border-[#247CFF]/30 hover:border-[#247CFF]/50 transition-border duration-500 mx-2 sm:mx-0">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 md:space-y-10">
              <div className="group">
                <input 
                  name="full_name"
                  className="w-full p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-[#247CFF]/30 bg-[#0A0F2C]/50 backdrop-blur-sm text-white placeholder-[#D8DEE9]/70 focus:border-[#247CFF] focus:shadow-[0_0_20px_rgba(36,124,255,0.3)] focus:bg-[#0A0F2C]/70 transition-all duration-300 text-base sm:text-lg md:text-xl group-hover:border-[#247CFF]/50 font-['Inter']" 
                  type="text" 
                  placeholder="Your Full Name" 
                  required 
                />
              </div>
              <div className="group">
                <input 
                  name="email"
                  className="w-full p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-[#247CFF]/30 bg-[#0A0F2C]/50 backdrop-blur-sm text-white placeholder-[#D8DEE9]/70 focus:border-[#38C172] focus:shadow-[0_0_20px_rgba(56,193,114,0.3)] focus:bg-[#0A0F2C]/70 transition-all duration-300 text-base sm:text-lg md:text-xl group-hover:border-[#247CFF]/50 font-['Inter']" 
                  type="email" 
                  placeholder="Your Email Address" 
                  required 
                />
              </div>
              <div className="flex justify-center pt-4 sm:pt-6">
                <Button 
                  type="submit" 
                  className="group w-full max-w-sm sm:max-w-md md:max-w-lg bg-[#247CFF] hover:bg-[#247CFF]/90 text-white font-bold py-6 sm:py-8 md:py-10 px-8 sm:px-12 md:px-16 text-base sm:text-lg md:text-xl lg:text-2xl rounded-2xl sm:rounded-3xl border border-[#247CFF]/50 hover:border-[#247CFF] hover:shadow-[0_0_40px_rgba(36,124,255,0.5)] transition-all duration-300 transform hover:scale-105 font-['Space_Grotesk'] tracking-wide sm:tracking-widest uppercase"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3 sm:mr-4"></div>
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl">SUBMITTING...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full mr-3 sm:mr-4 group-hover:animate-pulse shadow-lg"></div>
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl">SCAN ME</span>
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
