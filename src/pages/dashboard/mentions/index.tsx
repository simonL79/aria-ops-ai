
import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import StickyHeader from "@/components/layout/StickyHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MentionsTab from "./MentionsTab";
import ClassifyTab from "./ClassifyTab";
import LeadPrioritizationTable from "@/components/reports/LeadPrioritizationTable";

const MentionsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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

            <Tabs defaultValue="mentions" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="mentions">Mentions</TabsTrigger>
                <TabsTrigger value="classify">Classify</TabsTrigger>
                <TabsTrigger value="leads">Lead Prioritization</TabsTrigger>
              </TabsList>
              <TabsContent value="mentions">
                <MentionsTab />
              </TabsContent>
              <TabsContent value="classify">
                <ClassifyTab />
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
