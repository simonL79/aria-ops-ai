
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Rocket, 
  ExternalLink, 
  Globe, 
  Activity, 
  CheckCircle,
  Clock
} from 'lucide-react';

interface DeployedArticle {
  id: string;
  title: string;
  url: string;
  target_keywords: string[];
  deployment_platform: string;
  serp_performance: number;
  click_through_rate: number;
  deployment_date: string;
  status: 'indexing' | 'ranked' | 'optimizing';
}

interface DeploymentCenterProps {
  articles: DeployedArticle[];
  onRefresh: () => void;
}

const DeploymentCenter: React.FC<DeploymentCenterProps> = ({
  articles,
  onRefresh
}) => {
  const [deploymentPlatform, setDeploymentPlatform] = useState('github-pages');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ranked': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'indexing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'optimizing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github-pages': return <Globe className="h-4 w-4" />;
      case 'netlify': return <Rocket className="h-4 w-4" />;
      case 'vercel': return <Activity className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Deployment Controls */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Live Deployment Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400">Deployment Platform</label>
              <Select value={deploymentPlatform} onValueChange={setDeploymentPlatform}>
                <SelectTrigger className="bg-corporate-dark border-corporate-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="github-pages">GitHub Pages</SelectItem>
                  <SelectItem value="netlify">Netlify</SelectItem>
                  <SelectItem value="vercel">Vercel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Auto-Index</label>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 block text-center mt-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            </div>
            <div>
              <label className="text-sm text-gray-400">Quick Deploy</label>
              <Button 
                className="bg-corporate-accent text-black hover:bg-corporate-accent/90 w-full mt-2"
                size="sm"
              >
                Deploy Ready Articles
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployed Articles */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Live Deployed Articles</h3>
        
        {articles.map((article) => (
          <Card key={article.id} className="bg-corporate-dark border-corporate-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-2">{article.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      {getPlatformIcon(article.deployment_platform)}
                      {article.deployment_platform}
                    </div>
                    <span>•</span>
                    <span>Deployed: {new Date(article.deployment_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(article.status)}>
                    {article.status.toUpperCase()}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Live
                  </Button>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{article.serp_performance}%</div>
                  <div className="text-xs text-gray-500">SERP Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{article.click_through_rate}%</div>
                  <div className="text-xs text-gray-500">Click-Through Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">{article.target_keywords.length}</div>
                  <div className="text-xs text-gray-500">Target Keywords</div>
                </div>
              </div>

              {/* Target Keywords */}
              <div>
                <span className="text-sm text-gray-400">Target Keywords:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {article.target_keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {articles.length === 0 && (
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-8 text-center">
              <Rocket className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Deployed Articles</h3>
              <p className="text-gray-500">
                Generate and approve articles to begin live deployment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DeploymentCenter;
