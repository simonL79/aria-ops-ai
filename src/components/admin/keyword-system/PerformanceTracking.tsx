
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Search,
  BarChart3,
  Target
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

interface KeywordIntelligence {
  id: string;
  keyword: string;
  sentiment_score: number;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  platform: string;
}

interface PerformanceTrackingProps {
  articles: DeployedArticle[];
  keywordData: KeywordIntelligence[];
  onRefresh: () => void;
}

const PerformanceTracking: React.FC<PerformanceTrackingProps> = ({
  articles,
  keywordData
}) => {
  const avgSerpPerformance = articles.length > 0 
    ? articles.reduce((acc, article) => acc + article.serp_performance, 0) / articles.length 
    : 0;

  const avgClickThrough = articles.length > 0 
    ? articles.reduce((acc, article) => acc + article.click_through_rate, 0) / articles.length 
    : 0;

  const totalKeywordsCovered = new Set(articles.flatMap(a => a.target_keywords)).size;
  const threatsNeutralized = keywordData.filter(k => k.sentiment_score > -0.2).length;

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Campaign Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{Math.round(avgSerpPerformance)}%</div>
              <p className="text-sm text-gray-400">Avg SERP Performance</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{Math.round(avgClickThrough)}%</div>
              <p className="text-sm text-gray-400">Avg Click-Through</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{totalKeywordsCovered}</div>
              <p className="text-sm text-gray-400">Keywords Covered</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{threatsNeutralized}</div>
              <p className="text-sm text-gray-400">Threats Neutralized</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Article Performance Details */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Individual Article Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{article.title}</h4>
                <Badge variant="outline" className="text-corporate-accent border-corporate-accent/50">
                  {article.deployment_platform}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      SERP Performance
                    </span>
                    <span className="text-sm text-blue-400">{article.serp_performance}%</span>
                  </div>
                  <Progress value={article.serp_performance} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <MousePointer className="h-3 w-3" />
                      Click-Through Rate
                    </span>
                    <span className="text-sm text-green-400">{article.click_through_rate}%</span>
                  </div>
                  <Progress value={article.click_through_rate} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Keywords Ranked
                    </span>
                    <span className="text-sm text-purple-400">{article.target_keywords.length}</span>
                  </div>
                  <Progress value={(article.target_keywords.length / 10) * 100} className="h-2" />
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {article.target_keywords.slice(0, 5).map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
                {article.target_keywords.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.target_keywords.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Performance Data</h3>
              <p className="text-gray-500">
                Deploy articles to begin tracking performance metrics.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keyword Impact Analysis */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white">Keyword Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {keywordData.slice(0, 10).map((keyword) => (
              <div key={keyword.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <div>
                  <span className="text-white font-medium">"{keyword.keyword}"</span>
                  <span className="text-sm text-gray-400 ml-2">({keyword.platform})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${
                    keyword.sentiment_score > 0 ? 'text-green-400' : 
                    keyword.sentiment_score < -0.5 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {keyword.sentiment_score > 0 ? '+' : ''}{keyword.sentiment_score.toFixed(2)}
                  </span>
                  <Badge className={
                    keyword.threat_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                    keyword.threat_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    keyword.threat_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }>
                    {keyword.threat_level}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTracking;
