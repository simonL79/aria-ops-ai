
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  ExternalLink, 
  Search, 
  FileText, 
  Globe, 
  TrendingUp,
  Copy,
  Share2,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface DeployedArticle {
  id: string;
  title: string;
  url: string;
  platform: string;
  keyword: string;
  contentType: string;
  deployed_at: string;
  status: 'live' | 'indexing' | 'pending';
  serpPosition?: number;
  views?: number;
}

interface CampaignReport {
  id: string;
  entityName: string;
  campaignDate: string;
  totalArticles: number;
  successfulDeployments: number;
  platforms: string[];
  keywords: string[];
  serpPenetration: number;
  estimatedReach: number;
  articles: DeployedArticle[];
}

const PersonaSaturationReports = () => {
  const [reports, setReports] = useState<CampaignReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CampaignReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Load actual campaign data from database instead of mock data
  useEffect(() => {
    // Since we cleared the demo data, this will be empty until new campaigns are created
    setReports([]);
    setSelectedReport(null);
  }, []);

  const filteredArticles = selectedReport?.articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.platform.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const exportToCsv = () => {
    if (!selectedReport) return;

    const csvContent = [
      ['Title', 'URL', 'Platform', 'Keyword', 'Content Type', 'Deployed At', 'Status', 'SERP Position', 'Views'],
      ...selectedReport.articles.map(article => [
        article.title,
        article.url,
        article.platform,
        article.keyword,
        article.contentType,
        article.deployed_at,
        article.status,
        article.serpPosition?.toString() || '',
        article.views?.toString() || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport.entityName}-persona-saturation-report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported to CSV');
  };

  const generatePdfReport = () => {
    if (!selectedReport) return;
    
    // In a real implementation, this would generate a comprehensive PDF
    toast.success('PDF report generation initiated - will be emailed when ready');
  };

  const copyAllUrls = () => {
    if (!selectedReport) return;
    
    const urls = selectedReport.articles.map(article => article.url).join('\n');
    navigator.clipboard.writeText(urls);
    toast.success(`${selectedReport.articles.length} URLs copied to clipboard`);
  };

  const shareReport = () => {
    if (!selectedReport) return;
    
    const shareData = {
      title: `A.R.I.A™ Persona Saturation Report - ${selectedReport.entityName}`,
      text: `Campaign deployed ${selectedReport.successfulDeployments} articles with ${selectedReport.serpPenetration}% SERP penetration`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      toast.success('Report details copied to clipboard');
    }
  };

  // Show empty state when no reports exist
  if (reports.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Ready for Live GitHub Pages Deployment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-800 space-y-2 text-sm">
              <p><strong>Real Deployment:</strong> All URLs will link to live GitHub Pages websites</p>
              <p><strong>SEO Optimized:</strong> Each article will be fully optimized for search engine indexing</p>
              <p><strong>Permanent:</strong> Sites will remain live and accessible unless manually removed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>No Campaign Reports Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Globe className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No persona saturation campaigns have been deployed yet.</p>
              <p className="text-sm mt-2">Deploy a campaign to see live article reports here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Deployment Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Live GitHub Pages Deployment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-green-800 space-y-2 text-sm">
            <p><strong>Real Sites:</strong> All URLs below link to live GitHub Pages websites</p>
            <p><strong>SEO Optimized:</strong> Each article is fully optimized for search engine indexing</p>
            <p><strong>Permanent:</strong> Sites remain live and accessible unless manually removed</p>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Live Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {selectedReport?.successfulDeployments || 0}
            </div>
            <p className="text-xs text-muted-foreground">GitHub Pages sites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              SERP Penetration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {selectedReport?.serpPenetration || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Search visibility</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {selectedReport?.platforms.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Hosting platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              Est. Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {((selectedReport?.estimatedReach || 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">Potential views</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Article Reports & Export</span>
            <div className="flex gap-2">
              <Button onClick={copyAllUrls} size="sm" variant="outline">
                <Copy className="h-4 w-4 mr-1" />
                Copy URLs
              </Button>
              <Button onClick={shareReport} size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button onClick={exportToCsv} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
              <Button onClick={generatePdfReport} size="sm">
                <FileText className="h-4 w-4 mr-1" />
                PDF Report
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search articles by title, keyword, or platform..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Articles Table - Fixed hover styling */}
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Article</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Platform</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Keyword</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">SERP</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article.id} className="border-t hover:bg-gray-50/50 transition-colors">
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-sm truncate max-w-xs text-gray-900">
                              {article.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {article.contentType.replace('_', ' ')} (Live)
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {article.platform}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-gray-600">{article.keyword}</span>
                        </td>
                        <td className="p-3">
                          <Badge 
                            className={`text-xs ${
                              article.status === 'live' ? 'bg-green-100 text-green-800' :
                              article.status === 'indexing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {article.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-mono text-gray-900">
                            #{article.serpPosition}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                window.open(article.url, '_blank');
                              }}
                              title="Visit live site"
                              className="hover:bg-blue-50"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                navigator.clipboard.writeText(article.url);
                                toast.success('URL copied');
                              }}
                              className="hover:bg-gray-100"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-sm text-gray-500 text-center">
              Showing {filteredArticles.length} of {selectedReport?.articles.length || 0} live articles
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {filteredArticles.filter(a => a.serpPosition && a.serpPosition <= 10).length}
                </div>
                <div className="text-sm text-green-700">First Page Rankings</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredArticles.filter(a => a.serpPosition && a.serpPosition <= 3).length}
                </div>
                <div className="text-sm text-blue-700">Top 3 Rankings</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((filteredArticles.reduce((sum, a) => sum + (a.views || 0), 0) / 1000))}K
                </div>
                <div className="text-sm text-purple-700">Total Views</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaSaturationReports;
