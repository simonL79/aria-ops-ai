
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Client } from "@/types/clients";
import { fetchClients } from "@/services/clientsService";
import ReportGenerator from "@/components/reports/ReportGenerator";
import DeliveryForm from "@/components/reports/DeliveryForm";
import ReportSummary from "@/components/reports/ReportSummary";

const Reports = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("create");
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  
  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      const clientsData = await fetchClients();
      setClients(clientsData);
      setIsLoading(false);
    };
    
    loadClients();
  }, []);

  const handleReportGenerated = (report: any) => {
    setGeneratedReport(report);
    setActiveTab("preview");
  };

  const handleDeliveryComplete = () => {
    // Reset to create new report
    setGeneratedReport(null);
    setActiveTab("create");
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Reputation Reports</h1>
          <p className="text-muted-foreground">
            Generate and deliver comprehensive reputation analysis reports to clients.
          </p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="create">
            <FileText className="mr-2 h-4 w-4" />
            Create Report
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedReport}>
            <FileText className="mr-2 h-4 w-4" />
            Preview Report
          </TabsTrigger>
          <TabsTrigger value="deliver" disabled={!generatedReport}>
            <Send className="mr-2 h-4 w-4" />
            Deliver to Client
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <ReportGenerator 
            clients={clients} 
            onReportGenerated={handleReportGenerated} 
          />
        </TabsContent>
        
        <TabsContent value="preview">
          {generatedReport && (
            <div className="space-y-6">
              <ReportSummary report={generatedReport} />
              
              <div className="flex justify-end">
                <Button 
                  variant="deliver" 
                  onClick={() => setActiveTab("deliver")}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Proceed to Delivery
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="deliver">
          {generatedReport && generatedReport.client && (
            <DeliveryForm
              reportId={generatedReport.id}
              clientName={generatedReport.client.name}
              clientEmail={generatedReport.client.contactEmail}
              onDeliveryComplete={handleDeliveryComplete}
            />
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Reports;
