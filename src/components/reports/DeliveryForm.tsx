
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeliveryFormProps {
  reportId: string;
  clientName: string;
  clientEmail: string;
  onDeliveryComplete: () => void;
}

const DeliveryForm = ({ 
  reportId, 
  clientName, 
  clientEmail, 
  onDeliveryComplete 
}: DeliveryFormProps) => {
  const [email, setEmail] = useState<string>(clientEmail || "");
  const [subject, setSubject] = useState<string>(`Your Reputation Management Report - ${new Date().toLocaleDateString()}`);
  const [message, setMessage] = useState<string>(
    `Dear ${clientName},\n\nPlease find attached your latest reputation management report.\n\nBest regards,\n[Your Name]`
  );
  const [includeAttachment, setIncludeAttachment] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  
  const handleDownload = () => {
    toast.success("Report download started", {
      description: "Your report will be downloaded as a PDF file"
    });
    
    // Simulate download
    setTimeout(() => {
      const element = document.createElement("a");
      element.setAttribute("href", "#");
      element.setAttribute("download", `Report-${reportId}.pdf`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };
  
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Report delivered successfully", {
      description: `The report has been emailed to ${email}`
    });
    
    setIsSending(false);
    onDeliveryComplete();
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Report for {clientName}</h3>
              <p className="text-sm text-muted-foreground">ID: {reportId}</p>
            </div>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Email Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Email Message</Label>
              <Textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attachment"
                checked={includeAttachment}
                onCheckedChange={(checked) => setIncludeAttachment(!!checked)}
              />
              <Label htmlFor="attachment" className="cursor-pointer">Include report as PDF attachment</Label>
            </div>
            
            <div className="flex justify-end gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onDeliveryComplete}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryForm;
