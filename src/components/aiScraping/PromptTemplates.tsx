
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AlertTriangle, Save, Copy, Check } from 'lucide-react';

// Default prompt templates matching those in aiScrapingService.ts
const DEFAULT_TEMPLATES = [
  {
    id: 'web-analysis',
    name: 'General Web Page Analysis',
    description: 'Analyze web content for reputation risks',
    usage: 'web',
    template: `You are a reputation analyst.

Analyze the following web page content and identify:
1. The sentiment toward the person or brand mentioned
2. Whether the content contains any reputational risk
3. If there is risk, classify it: Defamation, Controversy, Lawsuit, Misconduct, Rumor, or None
4. Summarize the potential issue in 1-2 sentences
5. Rate the reputational threat from 0 (none) to 10 (severe)

Content:
"""
{content}
"""`,
  },
  {
    id: 'search-analysis',
    name: 'Google Search Result Scanner',
    description: 'Analyze search snippets for reputation risks',
    usage: 'search',
    template: `You are a digital reputation monitor.

The following are Google search snippets for a person or brand.

1. For each result, analyze sentiment (Positive, Neutral, Negative)
2. Highlight any reputational risk or controversy
3. Flag keywords like: accused, scandal, bankruptcy, legal, backlash, fraud, complaint
4. Return a list of flagged items and summarize the concern

Search Snippets:
"""
{content}
"""`,
  },
  {
    id: 'social-analysis',
    name: 'Social Post Risk Analysis',
    description: 'Analyze social posts for reputation risks',
    usage: 'social',
    template: `You are scanning public posts for reputational risk.

Analyze the following social posts. For each post:
1. Identify sentiment (Positive, Neutral, Negative)
2. Does it reference a person or brand negatively?
3. Flag harmful language or insinuations
4. Rate risk level: None, Low, Medium, High
5. Suggest whether the brand should respond or ignore

Posts:
"""
{content}
"""`,
  },
  {
    id: 'reputation-score',
    name: 'Reputation Score Estimator',
    description: 'Estimate reputation health based on mentions',
    usage: 'reputation',
    template: `Based on the following web mentions and summaries, estimate the reputation health of the individual or brand mentioned.

Instructions:
1. Weigh how many mentions are positive vs. negative
2. Consider severity of any flagged content
3. Output a reputation score from 0-100
4. Write 2-3 sentence summary of the brand's public perception

Mentions:
"""
{content}
"""`,
  },
  {
    id: 'response-generator',
    name: 'Generate Proactive Response',
    description: 'Generate a response to a reputational issue',
    usage: 'response',
    template: `Write a professional public response to this reputational issue, written in an {tone} tone.

Include:
- Acknowledgment of the issue
- Brief correction (if needed)
- A call to move forward and offer support/resources

Issue Summary:
"""
{content}
"""`,
  },
];

const PromptTemplates = () => {
  const [templates, setTemplates] = useState(() => {
    const stored = localStorage.getItem('aria_prompt_templates');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored templates:', e);
        return DEFAULT_TEMPLATES;
      }
    }
    return DEFAULT_TEMPLATES;
  });
  
  const [activeTab, setActiveTab] = useState('web-analysis');
  const [editedTemplate, setEditedTemplate] = useState(templates[0]?.template || '');
  const [copied, setCopied] = useState(false);
  
  // Save templates to localStorage
  const saveTemplates = (newTemplates: typeof DEFAULT_TEMPLATES) => {
    localStorage.setItem('aria_prompt_templates', JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };
  
  // Handle template edit
  const handleSaveTemplate = () => {
    const newTemplates = templates.map(t => 
      t.id === activeTab ? { ...t, template: editedTemplate } : t
    );
    saveTemplates(newTemplates);
    toast.success('Template saved', {
      description: 'Your prompt template has been updated'
    });
  };
  
  // Handle template reset to default
  const handleResetTemplate = () => {
    const defaultTemplate = DEFAULT_TEMPLATES.find(t => t.id === activeTab);
    if (defaultTemplate) {
      setEditedTemplate(defaultTemplate.template);
      const newTemplates = templates.map(t => 
        t.id === activeTab ? { ...t, template: defaultTemplate.template } : t
      );
      saveTemplates(newTemplates);
      toast.success('Template reset', {
        description: 'Prompt template has been reset to default'
      });
    }
  };
  
  // Handle copy to clipboard
  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(editedTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard', {
      description: 'Template text copied to clipboard'
    });
  };
  
  // Find the active template
  const activeTemplate = templates.find(t => t.id === activeTab) || templates[0];
  
  // Update edited template when active tab changes
  React.useEffect(() => {
    const template = templates.find(t => t.id === activeTab);
    if (template) {
      setEditedTemplate(template.template);
    }
  }, [activeTab, templates]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">GPT Prompt Templates</CardTitle>
        <CardDescription>
          These templates are used by A.R.I.A™ to analyze content for reputation risks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            {templates.map(template => (
              <TabsTrigger key={template.id} value={template.id}>
                {template.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {templates.map(template => (
            <TabsContent key={template.id} value={template.id} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopyTemplate}
                    >
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleResetTemplate}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  className="font-mono text-sm h-80"
                  value={editedTemplate}
                  onChange={(e) => setEditedTemplate(e.target.value)}
                />
                
                <div className="pt-2">
                  <Button onClick={handleSaveTemplate}>
                    <Save className="h-4 w-4 mr-1" />
                    Save Template
                  </Button>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium mb-2">Usage Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {template.id === 'web-analysis' && 'Use this template to analyze web page content for reputation risks. The AI will identify sentiment, risk type, and severity.'}
                    {template.id === 'search-analysis' && 'Use this template to analyze search snippets for reputation risks. The AI will flag concerning keywords and summarize issues.'}
                    {template.id === 'social-analysis' && 'Use this template to analyze social media posts for reputation risks. The AI will evaluate sentiment and suggest whether to respond.'}
                    {template.id === 'reputation-score' && 'Use this template to estimate reputation health based on mentions. The AI will provide a reputation score and summary.'}
                    {template.id === 'response-generator' && 'Use this template to generate professional responses to reputation issues. The AI will craft a response based on your chosen tone.'}
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PromptTemplates;
