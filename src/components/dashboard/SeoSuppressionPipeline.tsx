
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, FileText } from "lucide-react";
import { SeoContent } from "@/types/dashboard";

const SeoSuppressionPipeline = () => {
  const [seoContent] = useState<SeoContent[]>([
    {
      id: '1',
      title: 'Positive Brand Story - Company Innovation',
      content: 'Comprehensive article highlighting company achievements and innovation milestones.',
      keywords: ['innovation', 'company success', 'technology leadership'],
      priority: 'high',
      status: 'published',
      type: 'article',
      score: 95,
      publishDate: '2024-01-15'
    },
    {
      id: '2', 
      title: 'Executive Interview - Industry Leadership',
      content: 'In-depth interview with CEO discussing industry trends and company vision.',
      keywords: ['CEO interview', 'industry leadership', 'company vision'],
      priority: 'high',
      status: 'pending',
      type: 'interview',
      score: 88,
      publishDate: '2024-01-20'
    },
    {
      id: '3',
      title: 'Corporate Social Responsibility Report',
      content: 'Annual CSR report showcasing community impact and sustainability initiatives.',
      keywords: ['CSR', 'sustainability', 'community impact'],
      priority: 'medium',
      status: 'draft',
      type: 'report',
      score: 82,
      publishDate: '2024-01-25'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          SEO Suppression Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {seoContent.map((content) => (
            <div key={content.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-sm">{content.title}</h3>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(content.priority)}>
                    {content.priority}
                  </Badge>
                  <Badge className={getStatusColor(content.status || 'draft')}>
                    {content.status || 'draft'}
                  </Badge>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">{content.content}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Score: {content.score || 0}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {content.type || 'article'}
                </span>
                {content.publishDate && (
                  <span>Publish: {content.publishDate}</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {content.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
              
              <Button size="sm" variant="outline">
                Edit Content
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoSuppressionPipeline;
