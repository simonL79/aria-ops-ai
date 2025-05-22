
import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import StickyHeader from "@/components/layout/StickyHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadPrioritizationTable from "@/components/reports/LeadPrioritizationTable";
import ReportGenerator from "@/components/reports/ReportGenerator";
import ReportSummary from "@/components/reports/ReportSummary";
import { Client } from "@/types/clients";
import { toast } from "sonner";

const ReportsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [clients, setClients] = useState<Client[]>([
    {
      id: "client-1",
      name: "Acme Corporation",
      industry: "Technology",
      contactName: "John Doe",
      contactEmail: "john@acme.com",
      website: "https://acme.com",
      notes: "Important client",
      keywordTargets: "acme, technology",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "client-2",
      name: "Globex Corporation",
      industry: "Finance",
      contactName: "Jane Smith",
      contactEmail: "jane@globex.com",
      website: "https://globex.com",
      notes: "New client",
      keywordTargets: "globex, finance",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
  const [generatedReport, setGeneratedReport] = useState<any>({
    id: "sample-report",
    title: "Monthly Reputation Report",
    date: new Date().toISOString(),
    client: clients[0],
    sections: [
      { title: "Executive Summary", content: "Sample summary content" },
      { title: "Key Metrics", content: "Sample metrics content" }
    ]
  });

  const handleReportGenerated = (report: any) => {
    setGeneratedReport(report);
    toast.success("Report generated successfully");
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
                <ReportGenerator 
                  clients={clients}
                  onReportGenerated={handleReportGenerated}
                />
              </TabsContent>
              <TabsContent value="summary">
                <ReportSummary report={generatedReport} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
