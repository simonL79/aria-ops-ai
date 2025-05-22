
import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import StickyHeader from "@/components/layout/StickyHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MentionsTab from "./MentionsTab";
import ClassifyTab from "./ClassifyTab";
import LeadPrioritizationTable from "@/components/reports/LeadPrioritizationTable";
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";

const MentionsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("mentions");
  const [mentions, setMentions] = useState<ContentAlert[]>([
    {
      id: "mention-1",
      platform: "Twitter",
      content: "Negative mention about Acme Corp's customer service",
      date: new Date().toISOString().split('T')[0],
      severity: "medium",
      status: "new",
      detectedEntities: ["Acme Corp"]
    },
    {
      id: "mention-2",
      platform: "Facebook",
      content: "Complaint about Emma Knight's service quality",
      date: new Date().toISOString().split('T')[0],
      severity: "high",
      status: "new",
      detectedEntities: ["Emma Knight"]
    }
  ]);

  const handleViewDetail = (mention: ContentAlert) => {
    toast.info(`Viewing details for: ${mention.id}`);
  };

  const handleMarkResolved = (id: string) => {
    setMentions(prev => 
      prev.map(mention => 
        mention.id === id ? { ...mention, status: "resolved" } : mention
      )
    );
    toast.success("Mention marked as resolved");
  };

  const handleEscalate = (id: string) => {
    setMentions(prev => 
      prev.map(mention => 
        mention.id === id ? { ...mention, severity: "high" } : mention
      )
    );
    toast.warning("Mention escalated");
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
                <TabsTrigger value="mentions">Mentions</TabsTrigger>
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
