
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Target } from 'lucide-react';
import { toast } from 'sonner';

interface ArticleGenerationTabProps {
  entityName: string;
}

const ArticleGenerationTab: React.FC<ArticleGenerationTabProps> = ({ entityName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);

  const generateArticles = async () => {
    if (!entityName) {
      toast.error('Please select an entity first');
      return;
    }

    setIsGenerating(true);
    try {
      toast.info(`📝 Generating articles for ${entityName}...`);

      // Simulate article generation
      const newArticles = [
        {
          id: Date.now(),
          title: `Strategic Insights: ${entityName} Market Analysis`,
          type: 'market_analysis',
          status: 'draft',
          keywords: ['market', 'analysis', entityName.toLowerCase()],
          created_at: new Date().toISOString()
        },
        {
          id: Date.now() + 1,
          title: `Industry Leadership: ${entityName} Perspective`,
          type: 'thought_leadership',
          status: 'draft',
          keywords: ['leadership', 'industry', entityName.toLowerCase()],
          created_at: new Date().toISOString()
        }
      ];

      setArticles(prev => [...prev, ...newArticles]);
      toast.success(`✅ Generated ${newArticles.length} article concepts`);
    } catch (error) {
      console.error('Failed to generate articles:', error);
      toast.error('❌ Failed to generate articles');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-corporate-accent" />
            Article Generation Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Entity: {entityName}</h4>
              <p className="text-corporate-lightGray text-sm">
                AI-powered article generation and content strategy
              </p>
            </div>
            <Button
              onClick={generateArticles}
              disabled={isGenerating || !entityName}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isGenerating ? (
                <>
                  <Target className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Articles
                </>
              )}
            </Button>
          </div>

          {articles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-white font-medium">
                Generated Articles ({articles.length})
              </h4>
              <div className="space-y-3">
                {articles.map((article) => (
                  <div key={article.id} className="p-4 bg-corporate-darkSecondary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-corporate-accent text-black">
                        {article.type}
                      </Badge>
                      <Badge variant="outline" className="text-corporate-lightGray">
                        {article.status}
                      </Badge>
                    </div>
                    <h5 className="text-white font-medium mb-2">{article.title}</h5>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.keywords.map((keyword: string, index: number) => (
                          <Badge key={index} className="bg-blue-500/20 text-blue-300 text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-corporate-lightGray text-sm">
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {articles.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
              <p className="text-corporate-lightGray">
                No articles generated yet for {entityName}
              </p>
              <p className="text-corporate-lightGray text-sm">
                Click "Generate Articles" to create strategic content
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleGenerationTab;
