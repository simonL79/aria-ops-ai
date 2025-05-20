
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Clock, User } from "lucide-react";
import { toast } from "sonner";

interface ReportSummaryProps {
  report: any; // Using any for simplicity
}

const ReportSummary = ({ report }: ReportSummaryProps) => {
  const handleDownload = () => {
    toast.success("Report download started", {
      description: "Your report will be downloaded as a PDF file"
    });
    
    // Simulate download
    setTimeout(() => {
      toast.info("Download complete");
    }, 1500);
  };
  
  if (!report || !report.client) {
    return <div>No report data available</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            {report.title}
          </span>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-1 h-4 w-4" />
            <span>Client: {report.client.name}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>Generated: {new Date(report.date).toLocaleString()}</span>
          </div>
        </div>
        
        {report.notes && (
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium mb-1">Notes:</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{report.notes}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="font-medium">Report Contents:</h3>
          
          {report.sections && report.sections.map((section: any, index: number) => (
            <div key={index} className="border-l-4 border-primary pl-4 py-2">
              <h4 className="font-medium">{section.title}</h4>
              <p className="text-sm text-muted-foreground">{section.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSummary;
