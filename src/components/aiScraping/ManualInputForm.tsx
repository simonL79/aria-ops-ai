
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader, Plus } from 'lucide-react';
import { addManualResult } from '@/services/aiScrapingService';

interface ManualInputFormProps {
  onSuccess: () => void;
}

const ManualInputForm = ({ onSuccess }: ManualInputFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    entityName: '',
    entityType: 'person' as 'person' | 'organization' | 'location',
    content: '',
    url: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.entityName || !formData.content) {
      toast.error('Missing information', {
        description: 'Please fill in all required fields.'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Now uses AI to analyze the content
      await addManualResult({
        entityName: formData.entityName,
        entityType: formData.entityType,
        content: formData.content,
        url: formData.url || undefined
      });
      
      toast.success('Content added successfully', {
        description: 'Your content has been processed with AI analysis'
      });
      
      // Reset form
      setFormData({
        entityName: '',
        entityType: 'person',
        content: '',
        url: ''
      });
      
      // Call success callback
      onSuccess();
    } catch (error) {
      console.error('Error adding manual input:', error);
      toast.error('Error adding content', {
        description: 'Something went wrong while processing your content.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Manual Input</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entityName">Entity Name *</Label>
              <Input
                id="entityName"
                name="entityName"
                placeholder="Enter name of person, brand or organization"
                value={formData.entityName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entityType">Entity Type *</Label>
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
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Enter content to analyze (news article, social media post, review, etc.)"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              The content will be analyzed using AI to determine sentiment, risk level, and recommendations
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Source URL (optional)</Label>
            <Input
              id="url"
              name="url"
              placeholder="Enter URL of the source content"
              value={formData.url}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add & Analyze Content
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualInputForm;
