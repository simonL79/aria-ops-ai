import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContentAlert } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ExternalLink,
  Link,
  MessageSquare,
  User,
  Building,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { saveMentionAnalysis } from "@/services/api/mentionsApiService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface MentionDetailsDialogProps {
  mention: ContentAlert;
  isOpen: boolean;
  onClose: () => void;
}

const MentionDetailsDialog = ({ mention, isOpen, onClose }: MentionDetailsDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const formSchema = z.object({
    threatLevel: z.enum(['high', 'medium', 'low'], {
      required_error: "Please select a threat level.",
    }),
    category: z.string().min(2, {
      message: "Category must be at least 2 characters.",
    }),
    recommendedAction: z.string().min(10, {
      message: "Recommended action must be at least 10 characters.",
    }),
    confidence: z.number().min(0).max(100).default(75),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      threatLevel: mention.severity || 'medium',
      category: mention.category || '',
      recommendedAction: mention.recommendation || '',
      confidence: mention.confidenceScore || 75
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    try {
      const success = await saveMentionAnalysis(mention.id, values);
      if (success) {
        toast.success("Analysis saved successfully!");
        onClose();
      } else {
        toast.error("Failed to save analysis.");
      }
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast.error("An error occurred while saving the analysis.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Mention Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected mention.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Content</h4>
            <p className="text-sm text-gray-600">{mention.content}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Source Information</h4>
              <p className="text-sm text-gray-600">
                Platform: {mention.platform}
              </p>
              <p className="text-sm text-gray-600">
                Source Type: {mention.sourceType}
              </p>
              <p className="text-sm text-gray-600">
                Date: {mention.date}
              </p>
              {mention.url && (
                <p className="text-sm text-gray-600">
                  URL:
                  <a
                    href={mention.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline ml-1"
                  >
                    {mention.url}
                  </a>
                </p>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
              <p className="text-sm text-gray-600">
                Severity: {mention.severity}
              </p>
              <p className="text-sm text-gray-600">
                Status: {mention.status}
              </p>
              {mention.detectedEntities && mention.detectedEntities.length > 0 && (
                <p className="text-sm text-gray-600">
                  Detected Entities: {mention.detectedEntities.join(", ")}
                </p>
              )}
              {mention.potentialReach && (
                <p className="text-sm text-gray-600">
                  Potential Reach: {mention.potentialReach}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-600">
                {mention.threatType ? `Threat Type: ${mention.threatType}` : 'No specific threat identified'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Confidence Score: {mention.confidenceScore}%
              </p>
              {mention.source_credibility_score && (
                <p className="text-sm text-gray-600 mt-1">
                  Source Credibility: {(mention.source_credibility_score * 100).toFixed(0)}%
                </p>
              )}
              {mention.media_is_ai_generated && (
                <p className="text-sm text-gray-600 mt-1">
                  AI Generated Content Detected
                  {mention.ai_detection_confidence && ` (${(mention.ai_detection_confidence * 100).toFixed(0)}% confidence)`}
                </p>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Analysis & Action</h4>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="threatLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Threat Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a threat level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recommendedAction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recommended Action</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Recommended action"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Save Analysis"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MentionDetailsDialog;
