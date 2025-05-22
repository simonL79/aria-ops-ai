
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Download, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const leadMagnetSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
});

type LeadMagnetFormValues = z.infer<typeof leadMagnetSchema>;

interface LeadMagnetFormProps {
  title: string;
  description: string;
  downloadName: string;
  ctaText: string;
  variant?: "default" | "premium";
}

const LeadMagnetForm = ({
  title, 
  description, 
  downloadName,
  ctaText,
  variant = "default"
}: LeadMagnetFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<LeadMagnetFormValues>({
    resolver: zodResolver(leadMagnetSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (data: LeadMagnetFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Store lead information in Supabase using reputation_scan_submissions table temporarily
      // This will be replaced with lead_magnets table after types are updated
      const { error } = await supabase
        .from('reputation_scan_submissions')
        .insert({
          full_name: data.name,
          email: data.email,
          keywords: downloadName, // Using keywords field to store the lead magnet name
          admin_notes: `Lead magnet: ${downloadName}` // Additional info in notes
        });
        
      if (error) throw error;
      
      // Show success message
      toast.success("Your download is ready!", {
        description: "Check your email shortly for more insights from A.R.I.A™",
      });
      
      setSubmitted(true);
      
      // Track conversion events if available
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) (window as any).fbq('track', 'Lead');
        if ((window as any).gtag) (window as any).gtag('event', 'generate_lead');
      }
      
    } catch (error: any) {
      console.error("Error submitting lead magnet form:", error);
      toast.error("Something went wrong", { 
        description: "Please try again or contact us directly." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate background class based on variant
  const getBgClass = () => {
    switch(variant) {
      case "premium":
        return "bg-gradient-to-r from-premium-black to-premium-darkGray border-premium-silver";
      default:
        return "bg-white border-gray-200";
    }
  };

  // Generate text color class based on variant
  const getTextClass = () => {
    switch(variant) {
      case "premium":
        return "text-white";
      default:
        return "text-premium-black";
    }
  };

  return (
    <Card className={`shadow-lg border-2 ${getBgClass()}`}>
      <CardHeader>
        <CardTitle className={`text-xl font-bold ${getTextClass()}`}>{title}</CardTitle>
        <CardDescription className={variant === "premium" ? "text-premium-silver" : "text-gray-600"}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!submitted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={getTextClass()}>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={getTextClass()}>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input placeholder="you@example.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full mt-2" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    {ctaText}
                  </span>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center py-4">
            <div className="bg-green-50 text-green-700 rounded-md p-4 mb-4">
              <p className="font-medium">Thank you!</p>
              <p className="text-sm">Your download link has been sent to your email.</p>
            </div>
            <p className={`text-sm ${variant === "premium" ? "text-premium-silver" : "text-gray-600"}`}>
              We've also added you to our newsletter with insights about reputation management.
              You can unsubscribe anytime.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className={`flex justify-center border-t ${variant === "premium" ? "border-premium-darkGray" : "border-gray-100"} pt-4 text-xs ${variant === "premium" ? "text-premium-silver" : "text-gray-500"}`}>
        Your data is protected under our Privacy Policy
      </CardFooter>
    </Card>
  );
};

export default LeadMagnetForm;
