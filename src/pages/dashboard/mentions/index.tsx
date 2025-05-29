
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import MentionsTab from "./MentionsTab";
import ClassifyTab from "./ClassifyTab";
import LeadPrioritizationTable from "@/components/reports/LeadPrioritizationTable";
import { ContentAlert } from "@/types/dashboard";
import { getMentionsAsAlerts, updateScanResultStatus } from "@/services/monitoring";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const MentionsPage = () => {
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
      
      // Filter for LIVE OSINT data only - NO MOCK DATA
      const liveMentions: ContentAlert[] = alerts
        .filter(alert => {
          // Only include live OSINT intelligence
          const isLiveOSINT = alert.sourceType === 'live_osint' || 
                             alert.sourceType === 'osint_intelligence' ||
                             alert.sourceType === 'live_scan';
          
          // Exclude any mock/test data
          const isNotMockData = !alert.content?.toLowerCase().includes('mock') &&
                               !alert.content?.toLowerCase().includes('test') &&
                               !alert.content?.toLowerCase().includes('demo') &&
                               !alert.platform?.toLowerCase().includes('test');
          
          return isLiveOSINT && isNotMockData;
        })
        .map(alert => ({
          id: alert.id,
          platform: alert.platform,
          content: alert.content,
          date: new Date(alert.date).toLocaleDateString(),
          severity: alert.severity as 'high' | 'medium' | 'low',
          status: alert.status as ContentAlert['status'],
          url: alert.url || '',
          threatType: alert.threatType,
          detectedEntities: alert.detectedEntities || [],
          sourceType: 'live_osint',
          confidenceScore: 85,
          sentiment: 'neutral'
        }));
      
      setMentions(liveMentions);
      console.log(`🔍 A.R.I.A™ MENTIONS: Loaded ${liveMentions.length} live OSINT mentions`);
      
    } catch (error) {
      console.error('Error loading live mentions:', error);
      toast.error("Failed to load live OSINT mentions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (mention: ContentAlert) => {
    toast.info(`Viewing live OSINT mention: ${mention.platform}`, {
      description: mention.content.substring(0, 100) + "..."
    });
  };

  const handleMarkResolved = async (id: string) => {
    try {
      const success = await updateScanResultStatus(id, 'resolved');
      if (success) {
        setMentions(prev => 
          prev.map(mention => 
            mention.id === id ? 
              { ...mention, status: 'resolved' as ContentAlert['status'] } : 
              mention
          )
        );
        toast.success("Live mention marked as resolved");
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
            mention.id === id ? 
              { ...mention, severity: 'high', status: 'actioned' as ContentAlert['status'] } : 
              mention
          )
        );
        toast.warning("Live mention escalated");
      }
    } catch (error) {
      console.error('Error escalating mention:', error);
      toast.error("Failed to escalate mention");
    }
  };

  const liveMentionCount = mentions.length;
  const highSeverityCount = mentions.filter(m => m.severity === 'high').length;

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <DashboardHeader 
          title="A.R.I.A™ Live OSINT Mentions" 
          description="Real-time OSINT monitoring and threat detection for reputation management - 100% Live Data"
          onRefresh={loadMentions}
          totalAlerts={liveMentionCount}
          highSeverityAlerts={highSeverityCount}
        />
        
        {/* Live Data Status */}
        <div className="mb-6 flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-800">Live OSINT Intelligence Feed</span>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              100% Live Data
            </Badge>
            <Badge variant="outline" className="text-green-700">
              {liveMentionCount} Live Mentions
            </Badge>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={loadMentions}
            className="gap-2 border-green-300 text-green-700 hover:bg-green-100"
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Live Feed
          </Button>
        </div>
        
        <Tabs 
          defaultValue="mentions" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="mentions">
              Live Mentions ({liveMentionCount})
            </TabsTrigger>
            <TabsTrigger value="classify">Classify Intelligence</TabsTrigger>
            <TabsTrigger value="leads">Lead Prioritization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mentions">
            {liveMentionCount === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Live OSINT Mentions</h3>
                <p className="text-sm text-gray-500 mb-4">
                  No live mentions detected. A.R.I.A™ OSINT systems are monitoring continuously.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Live monitoring active - Use Operator Console to trigger manual sweeps</span>
                </div>
              </div>
            ) : (
              <MentionsTab 
                mentions={mentions}
                setMentions={setMentions}
                onViewDetail={handleViewDetail}
                onMarkResolved={handleMarkResolved}
                onEscalate={handleEscalate}
              />
            )}
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
    </DashboardLayout>
  );
};

export default MentionsPage;
