
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, CheckCircle, X, Search, TrendingUp } from 'lucide-react';

interface ContentPreviewProps {
  content: {
    title: string;
    body: string;
    keywords: string[];
    contentType: string;
    responseAngle?: string;
    sourceUrl?: string;
    metaDescription?: string;
    hashtags?: string;
    seoKeywords?: string[];
    keywordDensity?: any;
  };
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
}

export const ContentPreview = ({ content, onApprove, onReject, onEdit }: ContentPreviewProps) => {
  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Eye className="h-5 w-5 text-corporate-accent" />
          Content Preview
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-corporate-accent">
            {content.contentType}
          </Badge>
          {content.responseAngle && (
            <Badge variant="outline" className="text-blue-400">
              {content.responseAngle}
            </Badge>
          )}
          <Badge variant="outline" className="text-green-400">
            <Search className="h-3 w-3 mr-1" />
            SEO Optimized
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.sourceUrl && (
          <div className="p-3 bg-corporate-dark/50 rounded border border-corporate-accent/30">
            <p className="text-xs text-corporate-lightGray mb-1">Response to:</p>
            <a 
              href={content.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-corporate-accent hover:underline text-sm"
            >
              {content.sourceUrl}
            </a>
          </div>
        )}

        {/* SEO Elements */}
        <div className="space-y-3 p-4 bg-green-500/10 border border-green-500/30 rounded">
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">SEO Elements</span>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs text-corporate-lightGray mb-1">SEO-Optimized Headline:</p>
              <p className="text-white font-medium">{content.title}</p>
            </div>
            
            {content.metaDescription && (
              <div>
                <p className="text-xs text-corporate-lightGray mb-1">Meta Description ({content.metaDescription.length} chars):</p>
                <p className="text-sm text-corporate-lightGray italic">"{content.metaDescription}"</p>
              </div>
            )}

            {content.keywordDensity && (
              <div>
                <p className="text-xs text-corporate-lightGray mb-2">Keyword Density Analysis:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(content.keywordDensity).map(([keyword, data]: [string, any]) => (
                    <div key={keyword} className="flex justify-between text-xs">
                      <span className="text-white">{keyword}:</span>
                      <span className="text-green-400">{data.count}x ({data.density})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-corporate-dark p-4 rounded border border-corporate-border max-h-96 overflow-y-auto">
            <div className="prose prose-invert max-w-none">
              {content.body.split('\n').map((paragraph, index) => (
                <p key={index} className="text-corporate-lightGray mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {content.hashtags && (
            <div>
              <p className="text-sm text-corporate-lightGray mb-2">Social Media Hashtags:</p>
              <p className="text-sm text-blue-400">{content.hashtags}</p>
            </div>
          )}

          {content.keywords.length > 0 && (
            <div>
              <p className="text-sm text-corporate-lightGray mb-2">Target Keywords:</p>
              <div className="flex flex-wrap gap-1">
                {content.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-corporate-border">
          <Button
            onClick={onApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve & Deploy
          </Button>
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex-1 border-corporate-accent text-corporate-accent"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Content
          </Button>
          <Button
            onClick={onReject}
            variant="outline"
            className="text-red-400 border-red-400 hover:bg-red-400/10"
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
