
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Play, 
  ExternalLink, 
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  GitBranch
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReviewResult {
  articleId: string;
  reviewTitle: string;
  slug: string;
  summary: string;
  wordCount: number;
  platforms: number;
  deploymentUrls: string[];
}

const ReviewPostGenerator = () => {
  const [entityName, setEntityName] = useState('A.R.I.A Intelligence');
  const [maxArticles, setMaxArticles] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [totalDeployments, setTotalDeployments] = useState(0);

  const generateReviewPosts = async () => {
    setIsGenerating(true);
    setResults([]);
    
    try {
      console.log('🔄 Starting review post generation...');
      
      const { data, error } = await supabase.functions.invoke('generate-review-post', {
        body: {
          entityName,
          maxArticles
        }
      });

      if (error) throw error;

      setResults(data.reviews || []);
      setTotalDeployments(data.totalDeployments || 0);
      
      toast.success(
        `Generated ${data.totalReviews} review posts with ${data.totalDeployments} deployments`,
        {
          description: 'Articles are being deployed to GitHub Pages automatically',
          action: {
            label: 'View Logs',
            onClick: () => window.open('https://github.com/actions', '_blank')
          }
        }
      );
      
    } catch (error) {
      console.error('Review post generation error:', error);
      toast.error('Failed to generate review posts');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyUrls = (urls: string[]) => {
    navigator.clipboard.writeText(urls.join('\n'));
    toast.success(`${urls.length} URLs copied to clipboard`);
  };

  const copyAllUrls = () => {
    const allUrls = results.flatMap(r => r.deploymentUrls);
    navigator.clipboard.writeText(allUrls.join('\n'));
    toast.success(`${allUrls.length} URLs copied to clipboard`);
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <FileText className="h-5 w-5 text-corporate-accent" />
            Review Post Generator
          </CardTitle>
          <div className="text-sm text-corporate-lightGray">
            Generate professional review posts from ingested content sources and auto-deploy to GitHub Pages
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entityName" className="text-white">Entity Name</Label>
              <Input
                id="entityName"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Your entity or company name"
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
            <div>
              <Label htmlFor="maxArticles" className="text-white">Max Articles</Label>
              <Input
                id="maxArticles"
                type="number"
                min="1"
                max="10"
                value={maxArticles}
                onChange={(e) => setMaxArticles(parseInt(e.target.value) || 1)}
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
          </div>

          <Button
            onClick={generateReviewPosts}
            disabled={isGenerating}
            className="bg-corporate-accent text-black hover:bg-corporate-accentDark w-full"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 animate-spin" />
                Generating Reviews & Auto-Deploying...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                <GitBranch className="h-4 w-4" />
                Generate & Deploy Review Posts
              </div>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <div className="text-sm text-corporate-lightGray">
                Processing articles, generating review content, and triggering GitHub Pages deployment...
              </div>
              <Progress value={50} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between corporate-heading">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Generated Reviews ({results.length})
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-corporate-accent">
                  {totalDeployments} Deployments
                </Badge>
                <Badge variant="outline" className="text-green-400">
                  <GitBranch className="h-3 w-3 mr-1" />
                  Auto-Deploy
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyAllUrls}
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy All URLs
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-white line-clamp-2">
                      {result.reviewTitle}
                    </h4>
                    <p className="text-sm text-corporate-lightGray mt-1">
                      {result.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-corporate-lightGray">
                    <span>{result.wordCount.toLocaleString()} words</span>
                    <span>{result.platforms} platforms</span>
                    <span>{result.deploymentUrls.length} URLs</span>
                    <Badge variant="outline" className="text-xs">
                      <GitBranch className="h-3 w-3 mr-1" />
                      GitHub Pages
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyUrls(result.deploymentUrls)}
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {result.deploymentUrls[0] && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(result.deploymentUrls[0], '_blank')}
                        className="text-xs"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {result.deploymentUrls.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <div className="text-xs text-corporate-lightGray">GitHub Pages URLs:</div>
                    <div className="max-h-20 overflow-y-auto space-y-1">
                      {result.deploymentUrls.map((url, urlIndex) => (
                        <div key={urlIndex} className="text-xs text-corporate-accent truncate">
                          {url}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Info Panel */}
      <Card className="corporate-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-corporate-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-corporate-lightGray">
              <p className="font-medium text-white mb-2">Auto-Deployment Pipeline:</p>
              <ul className="space-y-1">
                <li>• Pulls latest articles from Watchtower content sources</li>
                <li>• Generates professional review content with A.R.I.A™ analysis</li>
                <li>• Creates static HTML files in /articles directory</li>
                <li>• Triggers GitHub Action for automatic GitHub Pages deployment</li>
                <li>• Logs all URLs for tracking and verification</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewPostGenerator;
