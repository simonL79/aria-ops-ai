
import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import StickyHeader from "@/components/layout/StickyHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MentionsTab from "./MentionsTab";
import ClassifyTab from "./ClassifyTab";
import LeadPrioritizationTable from "@/components/reports/LeadPrioritizationTable";
import { ContentAlert } from "@/types/dashboard";
import { getMentionsAsAlerts, updateScanResultStatus } from "@/services/monitoring";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const MentionsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("mentions");
  const [mentions, setMentions] = useState<ContentAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadMentions();
    
    // Check if we should highlight a specific alert
    const alertId = searchParams.get('alert');
    if (alertId) {
      setActiveTab('mentions');
    }
  }, [searchParams]);

  const loadMentions = async () => {
    setIsLoading(true);
    try {
      const alerts = await getMentionsAsAlerts();
      const formattedMentions: ContentAlert[] = alerts.map(alert => ({
        id: alert.id,
        platform: alert.platform,
        content: alert.content,
        date: new Date(alert.date).toLocaleDateString(),
        severity: alert.severity as 'high' | 'medium' | 'low',
        status: alert.status as ContentAlert['status'],
        url: alert.url || '',
        threatType: alert.threatType,
        detectedEntities: alert.detectedEntities || [],
        sourceType: 'scan',
        confidenceScore: 75,
        sentiment: 'neutral'
      }));
      setMentions(formattedMentions);
    } catch (error) {
      console.error('Error loading mentions:', error);
      toast.error("Failed to load mentions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (mention: ContentAlert) => {
    toast.info(`Viewing details for mention: ${mention.platform}`, {
      description: mention.content.substring(0, 100) + "..."
    });
  };

  const handleMarkResolved = async (id: string) => {
    try {
      const success = await updateScanResultStatus(id, 'resolved');
      if (success) {
        setMentions(prev => 
          prev.map(mention => 
            mention.id === id ? { ...mention, status: "resolved" } : mention
          )
        );
        toast.success("Mention marked as resolved");
      }
    } catch (error) {
      console.error('Error marking mention as resolved:', error);
      toast.error("Failed to mark mention as resolved");
    }
  };

  const handleEscalate = async (id: string) => {
    try {
      const success = await updateScanResultStatus(id, 'actioned');
      if (success) {
        setMentions(prev => 
          prev.map(mention => 
            mention.id === id ? { ...mention, severity: "high", status: "actioned" } : mention
          )
        );
        toast.warning("Mention escalated");
      }
    } catch (error) {
      console.error('Error escalating mention:', error);
      toast.error("Failed to escalate mention");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StickyHeader isScrolled={isScrolled} />
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50"
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 0)}
        >
          <div className="container mx-auto py-4">
            <h1 className="text-2xl font-bold mb-6">Reputation Intelligence</h1>

            <Tabs 
              defaultValue="mentions" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="mentions">
                  Mentions ({mentions.length})
                </TabsTrigger>
                <TabsTrigger value="classify">Classify</TabsTrigger>
                <TabsTrigger value="leads">Lead Prioritization</TabsTrigger>
              </TabsList>
              <TabsContent value="mentions">
                <MentionsTab 
                  mentions={mentions}
                  setMentions={setMentions}
                  onViewDetail={handleViewDetail}
                  onMarkResolved={handleMarkResolved}
                  onEscalate={handleEscalate}
                />
              </TabsContent>
              <TabsContent value="classify">
                <ClassifyTab 
                  setMentions={setMentions}
                  setActiveTab={setActiveTab}
                />
              </TabsContent>
              <TabsContent value="leads">
                <LeadPrioritizationTable />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentionsPage;
