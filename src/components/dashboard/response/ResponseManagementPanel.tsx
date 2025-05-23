
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Copy, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
}

const ResponseManagementPanel: React.FC = () => {
  const [responseText, setResponseText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [responseCategory, setResponseCategory] = useState('general');

  const responseTemplates: ResponseTemplate[] = [
    {
      id: '1',
      name: 'Acknowledge Concern',
      content: 'Thank you for bringing this to our attention. We take all feedback seriously and are looking into this matter.',
      category: 'general'
    },
    {
      id: '2',
      name: 'Clarification Request',
      content: 'We appreciate your feedback. Could you please provide more details so we can better understand and address your concerns?',
      category: 'inquiry'
    },
    {
      id: '3',
      name: 'Crisis Response',
      content: 'We are aware of this situation and are taking immediate action. We will provide updates as soon as more information becomes available.',
      category: 'crisis'
    },
    {
      id: '4',
      name: 'Positive Engagement',
      content: 'Thank you for your kind words! We really appreciate your support and are glad we could meet your expectations.',
      category: 'positive'
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = responseTemplates.find(t => t.id === templateId);
    if (template) {
      setResponseText(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(responseText);
    toast.success('Response copied to clipboard');
  };

  const handleSaveTemplate = () => {
    if (!responseText.trim()) {
      toast.error('Please enter a response to save');
      return;
    }
    toast.success('Response template saved');
  };

  const handleSendResponse = () => {
    if (!responseText.trim()) {
      toast.error('Please enter a response to send');
      return;
    }
    toast.success('Response sent successfully');
    setResponseText('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Response Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Response Templates</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a template..." />
            </SelectTrigger>
            <SelectContent>
              {responseTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    <span>{template.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Response Category</Label>
          <Select value={responseCategory} onValueChange={setResponseCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Response</SelectItem>
              <SelectItem value="inquiry">Customer Inquiry</SelectItem>
              <SelectItem value="crisis">Crisis Management</SelectItem>
              <SelectItem value="positive">Positive Engagement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Response Text</Label>
          <Textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Enter your response here..."
            rows={6}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSendResponse} className="flex-1">
            <Send className="mr-2 h-4 w-4" />
            Send Response
          </Button>
          <Button variant="outline" onClick={handleCopyResponse}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleSaveTemplate}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseManagementPanel;
