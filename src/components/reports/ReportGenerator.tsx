
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2 } from "lucide-react";
import { Client } from "@/types/clients";
import { toast } from "sonner";

interface ReportGeneratorProps {
  clients: Client[];
  onReportGenerated: (report: any) => void;
}

const ReportGenerator = ({ clients, onReportGenerated }: ReportGeneratorProps) => {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [reportType, setReportType] = useState<string>("monthly");
  const [customNotes, setCustomNotes] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const client = clients.find(c => c.id === selectedClient);
      
      if (!client) {
        throw new Error("Client not found");
      }
      
      // Generate a mock report
      const report = {
        id: `rep-${Date.now()}`,
        client: client,
        type: reportType,
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Reputation Report`,
        date: new Date().toISOString(),
        notes: customNotes,
        sections: [
          {
            title: "Executive Summary",
            content: "This report summarizes the reputation management activities and results over the selected period."
          },
          {
            title: "Key Metrics",
            content: "Detail of key performance indicators related to online reputation."
          },
          {
            title: "Content Analysis",
            content: "Analysis of content mentioning the client across various platforms."
          },
          {
            title: "Recommendations",
            content: "Strategic recommendations based on current reputation status."
          }
        ]
      };
      
      onReportGenerated(report);
      toast.success("Report generated successfully");
      
    } catch (error) {
      toast.error("Failed to generate report", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="client">Select Client</Label>
            <Select 
              value={selectedClient} 
              onValueChange={setSelectedClient}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Clients</SelectLabel>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select 
              value={reportType} 
              onValueChange={setReportType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Report Types</SelectLabel>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="quarterly">Quarterly Report</SelectItem>
                  <SelectItem value="crisis">Crisis Report</SelectItem>
                  <SelectItem value="custom">Custom Report</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customNotes">Notes & Special Instructions</Label>
            <Textarea 
              id="customNotes"
              placeholder="Add any specific instructions or notes for this report..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full sm:w-auto" 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
