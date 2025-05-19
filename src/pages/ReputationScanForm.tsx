
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import Logo from '@/components/ui/logo';

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  keywords: z.string().min(5, { message: "Please enter keywords related to your online presence" }),
});

type FormData = z.infer<typeof formSchema>;

const ReputationScanForm = () => {
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      keywords: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // In a real app, you'd send this data to your backend
    // For now, we'll just redirect to the thank you page
    navigate('/thank-you');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col">
      {/* Simple header */}
      <header className="bg-premium-black text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex justify-center md:justify-start">
            <Logo variant="light" size="sm" />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-premium-black">
              Start Your Free Reputation Scan
            </h1>
            <p className="text-lg text-premium-gray">
              Fill out the form below to receive your personalized reputation report within 24 hours.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords Related to You or Your Business</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your name, business name, industry, social media handles, etc."
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-gray-500 mt-1">
                        Examples: "John Smith, JS Enterprises, @johnsmith, web developer, Chicago business, johnsmith.com"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full py-6" size="lg">
                  Submit and Get Your Report
                </Button>
              </form>
            </Form>
          </div>

          <div className="mt-8 text-center text-sm text-premium-gray">
            <p>Your information is secure and will never be shared with third parties.</p>
            <p className="mt-2">A.R.I.A™ — AI Reputation Intelligence Agent</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReputationScanForm;
