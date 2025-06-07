
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  TrendingUp, 
  Users, 
  Building, 
  Award,
  Lightbulb,
  Target,
  RefreshCw
} from 'lucide-react';

interface ContentType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'defensive' | 'offensive' | 'follow_up';
}

interface ContentTypeSelectorProps {
  onContentTypeSelect: (contentType: string, config: any) => void;
  selectedEntity?: string;
}

export const ContentTypeSelector = ({ 
  onContentTypeSelect, 
  selectedEntity 
}: ContentTypeSelectorProps) => {
  const [selectedType, setSelectedType] = React.useState<string>('');
  const [customContent, setCustomContent] = React.useState('');
  const [followUpSource, setFollowUpSource] = React.useState('');
  const [targetKeywords, setTargetKeywords] = React.useState('');

  const contentTypes: ContentType[] = [
    {
      id: 'positive_profile',
      name: 'Positive Profile Article',
      description: 'Professional achievement and expertise showcase',
      icon: <Award className="h-5 w-5" />,
      category: 'defensive'
    },
    {
      id: 'industry_analysis',
      name: 'Industry Analysis',
      description: 'Thought leadership and market insights',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'defensive'
    },
    {
      id: 'expert_commentary',
      name: 'Expert Commentary',
      description: 'Professional opinions and expert analysis',
      icon: <Users className="h-5 w-5" />,
      category: 'defensive'
    },
    {
      id: 'company_news',
      name: 'Company Achievement',
      description: 'Business milestones and corporate updates',
      icon: <Building className="h-5 w-5" />,
      category: 'defensive'
    },
    {
      id: 'innovation_showcase',
      name: 'Innovation Showcase',
      description: 'Technology and innovation highlights',
      icon: <Lightbulb className="h-5 w-5" />,
      category: 'offensive'
    },
    {
      id: 'strategic_narrative',
      name: 'Strategic Counter-Narrative',
      description: 'Targeted response to specific concerns',
      icon: <Target className="h-5 w-5" />,
      category: 'offensive'
    },
    {
      id: 'follow_up_expansion',
      name: 'Follow-Up Expansion',
      description: 'Build on previous positive coverage',
      icon: <RefreshCw className="h-5 w-5" />,
      category: 'follow_up'
    }
  ];

  const handleGenerateContent = () => {
    if (!selectedType) return;

    const config = {
      contentType: selectedType,
      entity: selectedEntity,
      customContent: customContent.trim() || null,
      followUpSource: followUpSource.trim() || null,
      targetKeywords: targetKeywords.split(',').map(k => k.trim()).filter(k => k),
      timestamp: new Date().toISOString()
    };

    onContentTypeSelect(selectedType, config);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'defensive': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'offensive': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'follow_up': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="h-5 w-5 text-corporate-accent" />
          Content Type & Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Type Selection */}
        <div className="space-y-3">
          <Label className="text-white">Select Content Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {contentTypes.map((type) => (
              <div 
                key={type.id}
                className={`p-3 border rounded cursor-pointer transition-all ${
                  selectedType === type.id 
                    ? 'border-corporate-accent bg-corporate-accent/10' 
                    : 'border-corporate-border hover:border-corporate-accent/50'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {type.icon}
                  <span className="font-medium text-white">{type.name}</span>
                  <Badge className={`text-xs ${getCategoryColor(type.category)}`}>
                    {type.category}
                  </Badge>
                </div>
                <p className="text-sm text-corporate-lightGray">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-Up Source (only for follow-up content) */}
        {selectedType === 'follow_up_expansion' && (
          <div className="space-y-2">
            <Label className="text-white">Source Article/Coverage to Build Upon</Label>
            <Input
              value={followUpSource}
              onChange={(e) => setFollowUpSource(e.target.value)}
              placeholder="URL or title of previous positive article"
              className="bg-corporate-dark border-corporate-border text-white"
            />
            <p className="text-xs text-corporate-lightGray">
              Reference previous positive coverage to create follow-up content
            </p>
          </div>
        )}

        {/* Target Keywords */}
        <div className="space-y-2">
          <Label className="text-white">Target Keywords (comma-separated)</Label>
          <Input
            value={targetKeywords}
            onChange={(e) => setTargetKeywords(e.target.value)}
            placeholder="professional excellence, industry leader, innovation"
            className="bg-corporate-dark border-corporate-border text-white"
          />
        </div>

        {/* Custom Content Override */}
        <div className="space-y-2">
          <Label className="text-white">Custom Content (Optional)</Label>
          <Textarea
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
            placeholder="Provide specific content to include or leave blank for AI generation"
            className="bg-corporate-dark border-corporate-border text-white min-h-[100px]"
          />
          <p className="text-xs text-corporate-lightGray">
            Override AI generation with specific content requirements
          </p>
        </div>

        <Button
          onClick={handleGenerateContent}
          disabled={!selectedType}
          className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
        >
          Configure Content for Deployment
        </Button>
      </CardContent>
    </Card>
  );
};
