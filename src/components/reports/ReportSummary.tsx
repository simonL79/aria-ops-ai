
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, SendHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ThreatClassificationResult } from "@/types/intelligence";
import { format } from "date-fns";

interface ReportSummaryProps {
  report: any;
}

// Mock data for the report preview
const mockReputationScore = 7.3;
const mockThreats: ThreatClassificationResult[] = [
  {
    category: "Reputation Threat",
    severity: 8,
    recommendation: "Immediate response required",
    ai_reasoning: "Direct attack on brand with high visibility"
  },
  {
    category: "Misinformation",
    severity: 6,
    recommendation: "Publish clarification",
    ai_reasoning: "False information about product ingredients"
  },
  {
    category: "Legal Risk",
    severity: 7,
    recommendation: "Consult legal team",
    ai_reasoning: "Potential trademark infringement claim"
  }
];

const ReportSummary = ({ report }: ReportSummaryProps) => {
  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return "bg-red-500 text-white";
    if (severity >= 5) return "bg-amber-500 text-white";
    return "bg-blue-500 text-white";
  };
  
  const getFormatName = (format: string) => {
    switch (format) {
      case "pdf": return "PDF Document";
      case "dashboard": return "Interactive Dashboard";
      case "email": return "Email Summary";
      default: return format;
    }
  };

  const getFormatIcon = (format: string) => {
    return <FileText className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getFormatIcon(report.format)}
            <span>{report.title}</span>
          </div>
          <Badge variant="outline" className="font-normal">
            {getFormatName(report.format)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
            <p className="text-base font-semibold">{report.client?.name || "Unnamed Client"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Date Range</h3>
            <p className="text-base">
              {format(new Date(report.startDate), "MMM d, yyyy")} -{" "}
              {format(new Date(report.endDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        <Separator />
        
        {/* Executive Summary */}
        <div>
          <h3 className="font-medium text-lg mb-2">Executive Summary</h3>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center p-4 bg-background rounded-md border">
                <span className="text-sm text-muted-foreground">Reputation Score</span>
                <span className="text-2xl font-bold">{mockReputationScore.toFixed(1)}/10</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background rounded-md border">
                <span className="text-sm text-muted-foreground">Sentiment Analysis</span>
                <div className="flex gap-1 mt-2">
                  <div className="h-2 bg-red-500 rounded-l-full w-20"></div>
                  <div className="h-2 bg-amber-500 w-12"></div>
                  <div className="h-2 bg-green-500 rounded-r-full w-24"></div>
                </div>
                <span className="text-xs mt-1">43% Positive</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background rounded-md border">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <span className="text-amber-500 font-bold text-lg">Moderate</span>
              </div>
            </div>
            <p className="text-sm">
              Analysis of {report.client?.name}'s online reputation during the specified period shows a moderate risk profile. 
              We've identified several reputation threats that require attention, though the overall sentiment remains net positive.
              Strategic response is recommended to address the identified threats.
            </p>
          </div>
        </div>
        
        {/* Key Threats */}
        {report.includeThreats && (
          <div>
            <h3 className="font-medium text-lg mb-2">Key Threats Identified</h3>
            <div className="space-y-3">
              {mockThreats.map((threat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(threat.severity)}>
                        {threat.category}
                      </Badge>
                      <span className="text-sm font-semibold">Severity: {threat.severity}/10</span>
                    </div>
                    <p className="text-sm mt-1">{threat.ai_reasoning}</p>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {threat.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Recommendations */}
        {report.includeRecommendations && (
          <div>
            <h3 className="font-medium text-lg mb-2">Strategic Recommendations</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium">1. Address Misinformation</p>
                <p className="text-sm mt-1">
                  Publish a clarifying statement on official channels addressing the misconceptions about product ingredients.
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium">2. Legal Consultation</p>
                <p className="text-sm mt-1">
                  Consult with legal team regarding the potential trademark infringement claim to determine appropriate course of action.
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium">3. Monitor Response</p>
                <p className="text-sm mt-1">
                  Set up dedicated monitoring for related keywords to track the effectiveness of response strategies.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button variant="scan" className="flex items-center gap-2">
            <SendHorizontal className="h-4 w-4" />
            Share Internally
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSummary;
