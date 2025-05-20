
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { addManualResult } from '@/services/aiScrapingService';
import { toast } from 'sonner';

interface ManualInputFormProps {
  onSuccess?: () => void;
}

const ManualInputForm = ({ onSuccess }: ManualInputFormProps) => {
  const [formData, setFormData] = useState({
    entityName: '',
    entityType: 'person',
    content: '',
    url: '',
    sentiment: undefined as number | undefined,
    category: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.entityName || !formData.content) {
      toast.error("Required fields missing", {
        description: "Entity name and content are required"
      });
      return;
    }
    
    addManualResult({
      entityName: formData.entityName,
      entityType: formData.entityType as 'person' | 'organization' | 'location',
      content: formData.content,
      url: formData.url || undefined,
      sentiment: formData.sentiment,
      category: formData.category || undefined
    });
    
    toast.success("Content added successfully", {
      description: "Your content has been added and analyzed"
    });
    
    // Reset form
    setFormData({
      entityName: '',
      entityType: 'person',
      content: '',
      url: '',
      sentiment: undefined,
      category: ''
    });
    
    // Call success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entityName">Entity Name*</Label>
                <Input
                  id="entityName"
                  name="entityName"
                  placeholder="e.g., John Smith, Acme Corp"
                  value={formData.entityName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entityType">Entity Type*</Label>
                <Select 
                  value={formData.entityType} 
                  onValueChange={(value) => handleSelectChange('entityType', value)}
                >
                  <SelectTrigger id="entityType">
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="person">Person</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content*</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter the content to analyze..."
                rows={5}
                value={formData.content}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the raw text of a review, social media post, news article mention, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Source URL (optional)</Label>
              <Input
                id="url"
                name="url"
                placeholder="https://..."
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category (optional)</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reputation Threat">Reputation Threat</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="News">News</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Leave blank for AI to determine category
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              Add & Analyze Content
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualInputForm;
