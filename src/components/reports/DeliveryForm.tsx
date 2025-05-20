
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Send, Mail, Monitor, Calendar } from "lucide-react";

const deliverySchema = z.object({
  deliveryMethod: z.enum(["email", "portal", "meeting"]),
  emailMessage: z.string().optional(),
  isHighPriority: z.boolean().default(false),
  escalationLevel: z.enum(["standard", "urgent", "critical"]).default("standard"),
});

type DeliveryForm = z.infer<typeof deliverySchema>;

interface DeliveryFormProps {
  reportId: string;
  clientName: string;
  clientEmail: string;
  onDeliveryComplete: () => void;
}

const DeliveryForm = ({ reportId, clientName, clientEmail, onDeliveryComplete }: DeliveryFormProps) => {
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<DeliveryForm>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      deliveryMethod: "email",
      emailMessage: `Dear ${clientName},\n\nAttached is your latest reputation intelligence report. This report contains our findings from our recent scan, including sentiment analysis and strategic recommendations.\n\nPlease review at your earliest convenience and let us know if you have any questions.\n\nBest regards,\nA.R.I.A™ Team`,
      isHighPriority: false,
      escalationLevel: "standard",
    },
  });
  
  const deliveryMethod = form.watch("deliveryMethod");
  const isHighPriority = form.watch("isHighPriority");
  
  const handleSubmit = async (data: DeliveryForm) => {
    setIsSending(true);
    
    try {
      // Simulate API call to deliver report
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Report delivered successfully!", {
        description: `The report has been delivered to ${clientName} via ${getDeliveryMethodName(data.deliveryMethod)}.`
      });
      
      onDeliveryComplete();
    } catch (error) {
      toast.error("Failed to deliver report", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const getDeliveryMethodName = (method: string) => {
    switch (method) {
      case "email": return "email";
      case "portal": return "client portal";
      case "meeting": return "scheduled meeting";
      default: return method;
    }
  };
  
  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case "email": return <Mail className="h-5 w-5" />;
      case "portal": return <Monitor className="h-5 w-5" />;
      case "meeting": return <Calendar className="h-5 w-5" />;
      default: return <Send className="h-5 w-5" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getDeliveryIcon(deliveryMethod)}
          Deliver Report to Client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Delivery Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email ({clientEmail})
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="portal" id="portal" />
                        <Label htmlFor="portal" className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          Client Portal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="meeting" id="meeting" />
                        <Label htmlFor="meeting" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Schedule Review Meeting
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            {deliveryMethod === "email" && (
              <FormField
                control={form.control}
                name="emailMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Message</FormLabel>
                    <FormControl>
                      <Textarea rows={8} {...field} />
                    </FormControl>
                    <FormDescription>
                      This message will accompany the report in the email to the client.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="isHighPriority"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Priority Alert</FormLabel>
                    <FormDescription>
                      Mark this delivery as high priority requiring immediate client attention.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isHighPriority && (
              <FormField
                control={form.control}
                name="escalationLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Escalation Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard">Standard (24-hour response requested)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="urgent" id="urgent" />
                          <Label htmlFor="urgent">Urgent (Immediate attention recommended)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="critical" id="critical" />
                          <Label htmlFor="critical">Critical (Legal/severe reputational risk)</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            <Button 
              type="submit" 
              variant="deliver" 
              disabled={isSending}
              className="w-full"
            >
              {isSending ? (
                <>Sending Report...</>
              ) : (
                <>Deliver Report</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DeliveryForm;
