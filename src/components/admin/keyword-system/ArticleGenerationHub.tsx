
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Zap, 
  CheckCircle, 
  Clock,
  Settings
} from 'lucide-react';

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

interface ArticleGenerationHubProps {
  narratives: CounterNarrative[];
  onRefresh: () => void;
}

const ArticleGenerationHub: React.FC<ArticleGenerationHubProps> = ({
  narratives,
  onRefresh
}) => {
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const generateArticle = async (narrativeId: string) => {
    setGeneratingId(narrativeId);
    // Simulate article generation
    setTimeout(() => {
      setGeneratingId(null);
      onRefresh();
    }, 3000);
  };

  const approvedNarratives = narratives.filter(n => n.status === 'approved');

  return (
    <div className="space-y-6">
      {/* Generation Hub Header */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Article Generation Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            Generate SEO-optimized articles from approved counter-narrative strategies.
          </p>
        </CardContent>
      </Card>

      {/* Approved Narratives for Generation */}
      <div className="space-y-4">
        {approvedNarratives.map((narrative) => (
          <Card key={narrative.id} className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{narrative.recommended_theme}</CardTitle>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  APPROVED
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Strategy Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase">Format</span>
                  <p className="text-white font-medium">{narrative.content_format}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Tone</span>
                  <p className="text-white font-medium">{narrative.emotional_tone}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Audience</span>
                  <p className="text-white font-medium">{narrative.target_audience}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase">Keywords</span>
                  <p className="text-white font-medium">{narrative.target_keywords.length} terms</p>
                </div>
              </div>

              {/* Target Keywords */}
              <div>
                <Label className="text-gray-400 text-sm">Target Keywords:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {narrative.target_keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-corporate-accent border-corporate-accent/50">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Generation Controls */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <Button
                  onClick={() => generateArticle(narrative.id)}
                  disabled={generatingId === narrative.id}
                  className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
                >
                  {generatingId === narrative.id ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Article
                    </>
                  )}
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {approvedNarratives.length === 0 && (
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Approved Strategies</h3>
              <p className="text-gray-500">
                Approve counter-narrative strategies to begin article generation.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ArticleGenerationHub;
