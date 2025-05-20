
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardControls from "@/components/dashboard/DashboardControls";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import ContentAlerts from "@/components/dashboard/ContentAlerts";
import RealTimeAlerts from "@/components/dashboard/real-time-alerts";
import IntelligenceDashboard from "@/components/dashboard/IntelligenceDashboard";
import DigitalRiskFingerprint from "@/components/dashboard/DigitalRiskFingerprint";
import ReputationRiskScore from "@/components/dashboard/ReputationRiskScore";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDashboardScan } from "@/hooks/useDashboardScan";
import { useClientChanges } from "@/hooks/useClientChanges";
import { ContentAlert } from "@/types/dashboard";
import { markAlertAsRead, dismissAlert } from "@/services/contentActionService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThreatClassificationResult } from "@/services/openaiService";

const DashboardPage = () => {
  const {
    filteredAlerts, 
    setFilteredAlerts,
    startDate,
    setStartDate,
    endDate, 
    setEndDate,
    reputationScore, 
    previousScore,
    sources, 
    alerts, 
    setAlerts,
    actions, 
    monitoredSources, 
    negativeContent, 
    setNegativeContent,
    removedContent 
  } = useDashboardData();
  
  const { isScanning, handleScan } = useDashboardScan(
    alerts,
    setAlerts,
    setFilteredAlerts,
    setNegativeContent
  );
  
  const { clientChanges, riskFingerprints } = useClientChanges();
  
  const [selectedTab, setSelectedTab] = useState<string>("intelligence");
  const [selectedAlert, setSelectedAlert] = useState<ContentAlert | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>("Acme Corp");
  
  // Listen for client changes in real-time and notify for unread items
  useEffect(() => {
    const unreadChanges = clientChanges.filter(change => !change.read);
    if (unreadChanges.length > 0) {
      const highSeverityChanges = unreadChanges.filter(c => c.severity && c.severity >= 7);
      if (highSeverityChanges.length > 0) {
        toast.warning(`${highSeverityChanges.length} high-risk client ${highSeverityChanges.length === 1 ? 'alert' : 'alerts'}`, {
          description: "Urgent attention required for client issues"
        });
      }
    }
  }, [clientChanges]);

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSelectTestProfile = (profile: any, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    toast.info(`Test profile "${profile.name}" selected`, {
      description: "Dashboard data has been updated to reflect this test scenario."
    });
    
    // Update selected client when test profile is selected
    if (profile.name && profile.name.includes("Acme")) {
      setSelectedClient("Acme Corp");
    } else if (profile.name && profile.name.includes("LuxeSkin")) {
      setSelectedClient("LuxeSkin");
    }
  };

  const handleViewAlertDetail = (alert: ContentAlert, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    setSelectedAlert(alert);
    toast.info("Alert selected for analysis", {
      description: `You can now analyze and respond to this ${alert.severity} severity mention.`
    });
  };

  const handleMarkAlertAsRead = async (alertId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    const alertToUpdate = alerts.find(alert => alert.id === alertId);
    if (!alertToUpdate) return;
    
    // Use the contentActionService to mark as read in the database
    const success = await markAlertAsRead(alertToUpdate);
    
    if (success) {
      setFilteredAlerts(prev => 
        prev.map(alert => alert.id === alertId 
          ? { ...alert, status: 'read' } 
          : alert
        )
      );
      
      setAlerts(prev => 
        prev.map(alert => alert.id === alertId 
          ? { ...alert, status: 'read' } 
          : alert
        )
      );
    }
  };

  const handleDismissAlert = async (alertId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    const alertToUpdate = alerts.find(alert => alert.id === alertId);
    if (!alertToUpdate) return;
    
    // Use the contentActionService to dismiss in the database
    const success = await dismissAlert(alertToUpdate);
    
    if (success) {
      setFilteredAlerts(prev => prev.filter(alert => alert.id !== alertId));
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    }
  };

  const handleClassificationResult = (result: ThreatClassificationResult) => {
    toast.info(`Content classified as "${result.category}"`, {
      description: `Severity: ${result.severity}/10. Recommended action: ${result.action}`
    });
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <DashboardLayout>
      <DashboardHeader 
        title="Brand Intelligence Dashboard" 
        description="Monitor, analyze and respond to online reputation threats"
      />
      
      <DashboardControls
        isScanning={isScanning}
        onScan={handleScan}
        onDateRangeChange={handleDateRangeChange}
        onSelectTestProfile={handleSelectTestProfile}
      />
      
      <div className="mb-6">
        <DashboardMetrics 
          reputationScore={reputationScore}
          previousScore={previousScore}
          sources={monitoredSources}
          alerts={negativeContent}
          removed={removedContent}
        />
      </div>
      
      <Tabs value={selectedTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="w-full grid grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="intelligence" type="button">Intelligence</TabsTrigger>
          <TabsTrigger value="content" type="button">Content Alerts</TabsTrigger>
          <TabsTrigger value="realtime" type="button">Real-Time</TabsTrigger>
          <TabsTrigger value="analytics" type="button">Analytics</TabsTrigger>
          <TabsTrigger value="riskProfile" type="button">Risk Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="intelligence" className="mt-6">
          <IntelligenceDashboard onAlertDetected={handleClassificationResult} />
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <ContentAlerts alerts={filteredAlerts} />
        </TabsContent>
        
        <TabsContent value="realtime" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeAlerts 
              alerts={filteredAlerts.filter(a => a.status === 'new')} 
              onDismiss={handleDismissAlert}
              onMarkAsRead={handleMarkAlertAsRead}
              onViewDetail={handleViewAlertDetail}
            />
            <ContentAlerts alerts={filteredAlerts.filter(a => a.status === 'new')} />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <div className="bg-muted rounded-md p-12 text-center">
            <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">Detailed analytics and trend visualization will be available in the next update.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="riskProfile" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DigitalRiskFingerprint selectedClient={selectedClient} />
            <ReputationRiskScore selectedClient={selectedClient} />
          </div>
          
          <div className="mt-6 p-4 border rounded-md bg-blue-50 border-blue-200">
            <h3 className="text-lg font-medium mb-2 text-blue-800">Digital Risk Fingerprint™</h3>
            <p className="text-sm text-blue-700">
              This proprietary risk profile is custom-built for each client and adapts over time. 
              It analyzes sensitivity to keywords, known threats, and preferred response tones to provide
              intelligent monitoring and protection specifically tailored to this organization.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default DashboardPage;
