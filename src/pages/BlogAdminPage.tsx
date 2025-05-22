
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PublicLayout from '@/components/layout/PublicLayout';
import BlogAdminPanel from '@/components/blog/BlogAdminPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const BlogAdminPage = () => {
  const [isSending, setIsSending] = React.useState(false);
  const { user } = useAuth();
  
  const handleSendMagicLink = async () => {
    if (!user || !user.email) {
      toast.error("User information not available");
      return;
    }
    
    setIsSending(true);
    
    try {
      toast.info("Sending magic link...");
      
      const { error } = await supabase.auth.signInWithOtp({
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/blog/admin`,
        },
      });
      
      if (error) throw error;
      
      toast.success("Magic link sent! Check your email.");
    } catch (error) {
      console.error("Error sending magic link:", error);
      toast.error("Failed to send magic link. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <PublicLayout>
      <Helmet>
        <title>Blog Administration - A.R.I.A™</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Administration</h1>
          
          <Button 
            variant="outline" 
            onClick={handleSendMagicLink} 
            className="mt-4 md:mt-0"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send New Magic Link
              </>
            )}
          </Button>
        </div>
        
        <BlogAdminPanel />
      </div>
    </PublicLayout>
  );
};

export default BlogAdminPage;
