
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Download, Send } from "lucide-react";
import { Client } from "@/types/clients";

const reportSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  client: z.string().min(1, "Please select a client"),
  startDate: z.string().min(1, "Please select a start date"),
  endDate: z.string().min(1, "Please select an end date"),
  includeThreats: z.boolean().default(true),
  includeSentiment: z.boolean().default(true),
  includeRecommendations: z.boolean().default(true),
  format: z.enum(["pdf", "dashboard", "email"]).default("pdf"),
});

type ReportForm = z.infer<typeof reportSchema>;

interface ReportGeneratorProps {
  clients: Client[];
  onReportGenerated: (report: any) => void;
}

const ReportGenerator = ({ clients, onReportGenerated }: ReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      client: "",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      includeThreats: true,
      includeSentiment: true,
      includeRecommendations: true,
      format: "pdf",
    },
  });

  const onSubmit = async (data: ReportForm) => {
    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const report = {
        ...data,
        generatedAt: new Date().toISOString(),
        id: `report-${Math.random().toString(36).substring(2, 9)}`,
        client: clients.find((c) => c.id === data.client),
      };
      
      toast.success("Report generated successfully!", {
        description: "Your report is now ready to be delivered to the client."
      });
      
      onReportGenerated(report);
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Client Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Title</FormLabel>
                    <FormControl>
                      <Input placeholder="May 2025 Reputation Analysis" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Client</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <FormLabel className="text-base">Include in Report</FormLabel>
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="includeThreats"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Identified Threats</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="includeSentiment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Sentiment Analysis</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="includeRecommendations"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Strategic Recommendations</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Format</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="dashboard">Interactive Dashboard</SelectItem>
                      <SelectItem value="email">Email Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              variant="generate" 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>Generating Report...</>
              ) : (
                <>Generate Report</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
