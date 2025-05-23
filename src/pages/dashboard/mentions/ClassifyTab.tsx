
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentAlert } from "@/types/dashboard";
import { storeMention } from "@/services/api/mentionsApiService";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

interface ClassifyTabProps {
  setMentions: React.Dispatch<React.SetStateAction<ContentAlert[]>>;
  setActiveTab: (tab: string) => void;
}

const ClassifyTab = ({ setMentions, setActiveTab }: ClassifyTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    platform: '',
    content: '',
    severity: 'medium' as 'low' | 'medium' | 'high',
    category: '',
    recommendation: '',
    ai_reasoning: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.content) {
      toast.error("Platform and content are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const newAlert = await storeMention({
        platform: formData.platform,
        content: formData.content,
        date: new Date().toISOString().split('T')[0],
        severity: formData.severity,
        category: formData.category,
        recommendation: formData.recommendation,
        ai_reasoning: formData.ai_reasoning,
        sourceType: 'manual'
      });

      // Fixed: Pass a function that properly returns ContentAlert[]
      setMentions((prev: ContentAlert[]) => [newAlert, ...prev]);
      toast.success("Mention classified and added successfully");
      
      // Reset form
      setFormData({
        platform: '',
        content: '',
        severity: 'medium',
        category: '',
        recommendation: '',
        ai_reasoning: ''
      });
      
      // Switch to mentions tab to see the new entry
      setActiveTab('mentions');
    } catch (error) {
      console.error('Error classifying mention:', error);
      toast.error("Failed to classify mention");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Classify New Mention
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform *</label>
              <Select 
                value={formData.platform} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Reddit">Reddit</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="News Sites">News Sites</SelectItem>
                  <SelectItem value="Blogs">Blogs</SelectItem>
                  <SelectItem value="Forums">Forums</SelectItem>
                  <SelectItem value="Review Sites">Review Sites</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Severity *</label>
              <Select 
                value={formData.severity} 
                onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter the mention content..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Customer Complaint, Competitor Mention, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AI Recommendation</label>
            <Textarea
              value={formData.recommendation}
              onChange={(e) => setFormData(prev => ({ ...prev, recommendation: e.target.value }))}
              placeholder="Enter recommendation for handling this mention..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AI Reasoning</label>
            <Textarea
              value={formData.ai_reasoning}
              onChange={(e) => setFormData(prev => ({ ...prev, ai_reasoning: e.target.value }))}
              placeholder="Explain the reasoning behind the classification..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Classifying Mention...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Classify Mention
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClassifyTab;
