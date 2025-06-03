
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Target, 
  Settings, 
  CheckCircle, 
  Clock,
  User
} from 'lucide-react';

interface KeywordIntelligence {
  id: string;
  keyword: string;
  sentiment_score: number;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  platform: string;
}

interface CounterNarrative {
  id: string;
  target_keywords: string[];
  recommended_theme: string;
  content_format: string;
  emotional_tone: string;
  target_audience: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface ClientControlPanelProps {
  keywordData: KeywordIntelligence[];
  narratives: CounterNarrative[];
  onRefresh: () => void;
}

const ClientControlPanel: React.FC<ClientControlPanelProps> = ({
  keywordData,
  narratives,
  onRefresh
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedNarrative, setSelectedNarrative] = useState<string | null>(null);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  return (
    <div className="space-y-6">
      {/* Client Dashboard Header */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <User className="h-5 w-5" />
            Client Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            Review detected threats, select counter-narrative strategies, and approve content generation.
          </p>
        </CardContent>
      </Card>

      {/* Keyword Selection */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white">Detected Negative Keywords</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywordData.map((keyword) => (
              <div key={keyword.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">"{keyword.keyword}"</p>
                  <p className="text-sm text-gray-400">{keyword.platform}</p>
                </div>
                <Switch
                  checked={selectedKeywords.includes(keyword.keyword)}
                  onCheckedChange={() => toggleKeyword(keyword.keyword)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Narrative Selection */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white">AI Recommended Strategies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {narratives.map((narrative) => (
            <div 
              key={narrative.id} 
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedNarrative === narrative.id 
                  ? 'border-corporate-accent bg-corporate-accent/10' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedNarrative(narrative.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{narrative.recommended_theme}</h3>
                <Badge variant="outline" className="text-corporate-accent border-corporate-accent/50">
                  {narrative.content_format}
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                Tone: {narrative.emotional_tone} | Audience: {narrative.target_audience}
              </p>
              <div className="flex flex-wrap gap-1">
                {narrative.target_keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Panel */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Button
              disabled={!selectedNarrative || selectedKeywords.length === 0}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Generate Articles
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              <Clock className="h-4 w-4 mr-2" />
              Schedule for Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientControlPanel;
