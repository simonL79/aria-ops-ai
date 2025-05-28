
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AiScrapingDashboard } from "@/components/aiScraping";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AiScrapingPage = () => {
  useEffect(() => {
    // Initialize live monitoring when component mounts
    const setupLiveMonitoring = async () => {
      try {
        console.log("Initializing live monitoring system...");
        
        // Ensure monitoring is active
        const { error } = await supabase
          .from('monitoring_status')
          .upsert({
            id: '1',
            is_active: true,
            last_run: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sources_count: 5
          });

        if (error) {
          console.error('Failed to initialize monitoring:', error);
          toast.error("Failed to initialize live monitoring system");
        } else {
          console.log("Live monitoring system initialized successfully");
          toast.success("Live monitoring system active");
        }
      } catch (error) {
        console.error('Failed to initialize monitoring:', error);
        toast.error("Failed to initialize monitoring system");
      }
    };
    
    setupLiveMonitoring();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <AiScrapingDashboard />
      </div>
    </DashboardLayout>
  );
};

export default AiScrapingPage;
