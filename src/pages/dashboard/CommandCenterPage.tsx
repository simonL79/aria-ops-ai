
import { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ThreatFeed from "@/components/dashboard/ThreatFeed";
import TimelineView from "@/components/dashboard/TimelineView";
import ActionPanel from "@/components/dashboard/ActionPanel";
import SEOTracker from "@/components/dashboard/SEOTracker";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ContentAlert } from "@/types/dashboard";

const CommandCenterPage = () => {
  const { alerts, setAlerts } = useDashboardData();
  const [selectedAlert, setSelectedAlert] = useState<ContentAlert | null>(null);
  
  // Sample timeline data
  const timelineData = [
    { date: "May 11", score: 72, mentions: 23 },
    { date: "May 12", score: 70, mentions: 45 },
    { date: "May 13", score: 68, mentions: 52 },
    { date: "May 14", score: 65, mentions: 87 },
    { date: "May 15", score: 69, mentions: 56 },
    { date: "May 16", score: 73, mentions: 41 },
    { date: "May 17", score: 78, mentions: 32 },
    { date: "May 18", score: 82, mentions: 28 },
  ];
  
  const handleViewAlertDetails = (alert: ContentAlert) => {
    setSelectedAlert(alert);
  };
  
  const handleDismissActionPanel = () => {
    setSelectedAlert(null);
  };
  
  const handleApproveResponse = (response: string) => {
    toast.success("Response approved", {
      description: "Ready to send or copy to clipboard"
    });
  };
  
  const handleSendResponse = (response: string, alertId: string) => {
    // Mark the alert as "actioned"
    setAlerts(prev => 
      prev.map(alert => alert.id === alertId 
        ? { ...alert, status: 'actioned' } 
        : alert
      )
    );
    
    toast.success("Response sent successfully", {
      description: "The alert has been marked as actioned"
    });
    
    // Clear the selected alert after sending
    setSelectedAlert(null);
  };
  
  const handleSEORefresh = () => {
    toast.success("SEO data refreshed", {
      description: "Latest SERP positions retrieved"
    });
  };
  
  return (
    <DashboardLayout>
      <DashboardHeader 
        title="Command Center" 
        description="Monitor and respond to reputation threats in real-time"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <ThreatFeed
            alerts={alerts}
            onViewDetails={handleViewAlertDetails}
          />
        </div>
        <div className="md:col-span-1">
          <TimelineView data={timelineData} />
        </div>
        <div className="md:col-span-1">
          <ActionPanel 
            selectedAlert={selectedAlert}
            onApprove={handleApproveResponse}
            onSend={handleSendResponse}
            onDismiss={handleDismissActionPanel}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <SEOTracker onRefresh={handleSEORefresh} />
      </div>
    </DashboardLayout>
  );
};

export default CommandCenterPage;
