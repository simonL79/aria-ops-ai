
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DownloadCloud, Shield, AlertTriangle, FileDown, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const GDPRSettings = () => {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processingEnabled, setProcessingEnabled] = useState(true);
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState<number>(30); // days
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(true);
  const [consentManagement, setConsentManagement] = useState(true);
  const [limitedProcessing, setLimitedProcessing] = useState(false);
  
  const handleDownloadData = () => {
    toast.success("Data export initiated", {
      description: "Your data export is being prepared and will be emailed to you."
    });
    setDownloadDialogOpen(false);
  };
  
  const handleDeleteData = () => {
    toast.success("Data deletion request submitted", {
      description: "We'll process your data deletion request within 30 days as per GDPR requirements."
    });
    setDeleteDialogOpen(false);
  };
  
  const toggleProcessing = (checked: boolean) => {
    setProcessingEnabled(checked);
    toast.info(
      checked 
        ? "Data processing enabled" 
        : "Data processing restricted", 
      {
        description: checked 
          ? "A.R.I.A™ will now fully process your data." 
          : "A.R.I.A™ will now limit processing of your personal data."
      }
    );
  };
  
  const toggleLimitedProcessing = (checked: boolean) => {
    setLimitedProcessing(checked);
    toast.info(
      checked 
        ? "Limited processing enabled" 
        : "Standard processing restored", 
      { description: "Your preference has been saved." }
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <CardTitle>GDPR Data Settings</CardTitle>
        </div>
        <CardDescription>
          Manage how your data is processed and exercising your GDPR rights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="processing-consent" className="font-medium">Data Processing</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable processing of your personal data
              </p>
            </div>
            <Switch 
              id="processing-consent" 
              checked={processingEnabled}
              onCheckedChange={toggleProcessing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="limited-processing" className="font-medium">Limited Processing</Label>
              <p className="text-sm text-muted-foreground">
                Restrict processing to essential operations only
              </p>
            </div>
            <Switch 
              id="limited-processing" 
              checked={limitedProcessing}
              onCheckedChange={toggleLimitedProcessing}
              disabled={!processingEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="consent-management" className="font-medium">Consent Management</Label>
              <p className="text-sm text-muted-foreground">
                Allow management of marketing and communication preferences
              </p>
            </div>
            <Switch 
              id="consent-management" 
              checked={consentManagement}
              onCheckedChange={setConsentManagement}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-delete" className="font-medium">Automatic Data Deletion</Label>
              <p className="text-sm text-muted-foreground">
                Automatically delete your data after {dataRetentionPeriod} days of inactivity
              </p>
            </div>
            <Switch 
              id="auto-delete" 
              checked={autoDeleteEnabled}
              onCheckedChange={setAutoDeleteEnabled}
            />
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-medium mb-4">Your GDPR Rights</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Right to Access</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  You have the right to request a copy of all personal data we hold about you.
                  This includes data used for monitoring, analysis, and reporting.
                </p>
                <AlertDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <DownloadCloud className="h-4 w-4" />
                      Download My Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Download Your Data</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will compile all personal data we hold about you into an exportable format.
                        The data package will be emailed to your registered email address.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDownloadData}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Confirm Download
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Right to Be Forgotten</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  You can request deletion of all your personal data from our systems.
                  Please note that this action cannot be undone and will reset your account.
                </p>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete My Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete All Your Data</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently erase all personal data we hold about you. This action cannot be undone.
                        Are you sure you want to proceed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteData}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Permanently Delete Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Other GDPR Rights</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  You also have the right to:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mb-4">
                  <li>Rectify inaccurate data we hold about you</li>
                  <li>Object to processing for direct marketing</li>
                  <li>Data portability (receive your data in a structured format)</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  To exercise any of these rights, please contact our Data Protection Officer at dpo@ariaops.co.uk
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg mt-6">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Important Notice</h4>
            <p className="text-sm text-amber-700">
              Restricting data processing may limit some A.R.I.A™ functionality. 
              For corporate accounts, please coordinate GDPR settings with your administrator.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GDPRSettings;
