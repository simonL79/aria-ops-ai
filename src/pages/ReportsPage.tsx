
import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import StickyHeader from "@/components/layout/StickyHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadPrioritizationTable from "@/components/reports/LeadPrioritizationTable";
import ReportGenerator from "@/components/reports/ReportGenerator";
import ReportSummary from "@/components/reports/ReportSummary";

const ReportsPage = () => {
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
            <h1 className="text-2xl font-bold mb-6">Reputation Reports</h1>

            <Tabs defaultValue="leads" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="leads">Lead Prioritization</TabsTrigger>
                <TabsTrigger value="generator">Report Generator</TabsTrigger>
                <TabsTrigger value="summary">Summary Dashboard</TabsTrigger>
              </TabsList>
              <TabsContent value="leads">
                <div className="bg-black text-white p-8 rounded-lg shadow-md">
                  <LeadPrioritizationTable />
                </div>
              </TabsContent>
              <TabsContent value="generator">
                <ReportGenerator />
              </TabsContent>
              <TabsContent value="summary">
                <ReportSummary />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
