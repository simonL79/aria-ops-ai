
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ArticleGenerationTabProps {
  entityName: string;
}

const ArticleGenerationTab: React.FC<ArticleGenerationTabProps> = ({ entityName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [articleTemplates, setArticleTemplates] = useState<any[]>([]);

  const generateArticleTemplates = async () => {
    if (!entityName) {
      toast.error('Please select an entity first');
      return;
    }

    setIsGenerating(true);
    try {
      toast.info(`📄 Generating article templates for ${entityName}...`);

      // Create sample article templates
      const templates = [
        {
          id: `template-1-${Date.now()}`,
          title: `Understanding ${entityName}: A Comprehensive Profile`,
          content_type: 'blog_post',
          target_audience: 'general_public',
          key_messages: ['Professional achievements', 'Industry expertise', 'Community impact'],
          suggested_length: '1000-1500 words',
          urgency: 'medium',
          platforms: ['website', 'linkedin', 'medium']
        },
        {
          id: `template-2-${Date.now()}`,
          title: `${entityName}: Setting the Record Straight`,
          content_type: 'press_release',
          target_audience: 'media',
          key_messages: ['Factual clarification', 'Context provision', 'Expert perspectives'],
          suggested_length: '500-800 words',
          urgency: 'high',
          platforms: ['press', 'website', 'social_media']
        },
        {
          id: `template-3-${Date.now()}`,
          title: `Social Media Response Strategy for ${entityName}`,
          content_type: 'social_media',
          target_audience: 'social_followers',
          key_messages: ['Transparency', 'Accountability', 'Forward momentum'],
          suggested_length: '280 characters',
          urgency: 'high',
          platforms: ['twitter', 'facebook', 'linkedin']
        }
      ];

      setArticleTemplates(templates);
      toast.success(`✅ Generated ${templates.length} article templates`);
    } catch (error) {
      console.error('Failed to generate templates:', error);
      toast.error('❌ Failed to generate article templates');
    } finally {
      setIsGenerating(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-corporate-accent" />
            Article Generation Hub
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Entity: {entityName}</h4>
              <p className="text-corporate-lightGray text-sm">
                Content template creation and strategic article suggestions
              </p>
            </div>
            <Button
              onClick={generateArticleTemplates}
              disabled={isGenerating || !entityName}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isGenerating ? (
                <>
                  <FileText className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Templates
                </>
              )}
            </Button>
          </div>

          {articleTemplates.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-white font-medium">
                Article Templates ({articleTemplates.length})
              </h4>
              <div className="space-y-4">
                {articleTemplates.map((template) => (
                  <div key={template.id} className="p-4 bg-corporate-darkSecondary rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="text-white font-medium mb-2">{template.title}</h5>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className="bg-corporate-accent text-black">
                            {template.content_type}
                          </Badge>
                          <Badge className={getUrgencyColor(template.urgency)}>
                            {template.urgency} priority
                          </Badge>
                          <Badge variant="outline" className="text-corporate-lightGray">
                            {template.suggested_length}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-corporate-accent hover:bg-corporate-accent/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-corporate-lightGray text-sm">Target Audience: </span>
                        <span className="text-white text-sm">{template.target_audience}</span>
                      </div>
                      
                      <div>
                        <span className="text-corporate-lightGray text-sm">Key Messages: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.key_messages.map((message: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {message}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-corporate-lightGray text-sm">Platforms: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.platforms.map((platform: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs text-corporate-lightGray">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {articleTemplates.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
              <p className="text-corporate-lightGray">
                No article templates generated yet for {entityName}
              </p>
              <p className="text-corporate-lightGray text-sm">
                Click "Generate Templates" to create content strategies
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleGenerationTab;
