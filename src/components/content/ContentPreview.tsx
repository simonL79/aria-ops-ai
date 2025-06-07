
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, CheckCircle, X, Search, TrendingUp, Link, Image, Star } from 'lucide-react';

interface ContentPreviewProps {
  content: {
    title: string;
    body: string;
    keywords: string[];
    contentType: string;
    responseAngle?: string;
    sourceUrl?: string;
    metaDescription?: string;
    urlSlug?: string;
    hashtags?: string;
    internalLinks?: string;
    imageAlt?: string;
    schemaData?: string;
    seoKeywords?: string[];
    keywordDensity?: any;
    seoScore?: number;
  };
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
}

export const ContentPreview = ({ content, onApprove, onReject, onEdit }: ContentPreviewProps) => {
  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Eye className="h-5 w-5 text-corporate-accent" />
          Content Preview
        </CardTitle>
        <div className="flex items-center gap-2 flex-wrap">
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
          {content.seoScore && (
            <Badge variant="outline" className={getSeoScoreColor(content.seoScore)}>
              <Star className="h-3 w-3 mr-1" />
              SEO Score: {content.seoScore}/100
            </Badge>
          )}
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

        {/* Advanced SEO Elements */}
        <div className="space-y-3 p-4 bg-green-500/10 border border-green-500/30 rounded">
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">Advanced SEO Elements</span>
          </div>
          
          <div className="space-y-3">
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

            {content.urlSlug && (
              <div>
                <p className="text-xs text-corporate-lightGray mb-1">URL Slug:</p>
                <p className="text-sm text-blue-400 font-mono">/{content.urlSlug}</p>
              </div>
            )}

            {content.keywordDensity && (
              <div>
                <p className="text-xs text-corporate-lightGray mb-2">Advanced Keyword Analysis:</p>
                <div className="space-y-2">
                  {Object.entries(content.keywordDensity).map(([keyword, data]: [string, any]) => (
                    <div key={keyword} className="bg-corporate-dark/50 p-2 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-medium">{keyword}</span>
                        <span className="text-green-400">{data.density}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-corporate-lightGray">
                          Exact: {data.exactMatches || data.count || 0}x
                        </div>
                        <div className="text-corporate-lightGray">
                          Partial: {data.partialMatches || 0}x
                        </div>
                        {data.placement && (
                          <div className="col-span-2 flex flex-wrap gap-1 mt-1">
                            {data.placement.inFirstSentence && (
                              <Badge variant="outline" className="text-xs text-green-400">First sentence</Badge>
                            )}
                            {data.placement.inHeadings && (
                              <Badge variant="outline" className="text-xs text-blue-400">In headings</Badge>
                            )}
                            {data.placement.earlyPlacement && (
                              <Badge variant="outline" className="text-xs text-yellow-400">Early placement</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-3">
          <div className="bg-corporate-dark p-4 rounded border border-corporate-border max-h-96 overflow-y-auto">
            <div className="prose prose-invert max-w-none">
              {content.body.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('##')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-white mt-4 mb-2">
                      {paragraph.replace(/^##\s/, '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('#')) {
                  return (
                    <h2 key={index} className="text-xl font-bold text-white mt-6 mb-3">
                      {paragraph.replace(/^#\s/, '')}
                    </h2>
                  );
                }
                return (
                  <p key={index} className="text-corporate-lightGray mb-3 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Additional SEO Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.internalLinks && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Link className="h-4 w-4 text-blue-400" />
                  <p className="text-sm font-medium text-blue-400">Internal Link Suggestions:</p>
                </div>
                <p className="text-xs text-corporate-lightGray whitespace-pre-wrap">{content.internalLinks}</p>
              </div>
            )}

            {content.imageAlt && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4 text-purple-400" />
                  <p className="text-sm font-medium text-purple-400">Image Alt Text:</p>
                </div>
                <p className="text-xs text-corporate-lightGray">{content.imageAlt}</p>
              </div>
            )}
          </div>

          {content.schemaData && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded">
              <p className="text-sm font-medium text-orange-400 mb-2">Schema Markup Data:</p>
              <pre className="text-xs text-corporate-lightGray whitespace-pre-wrap overflow-x-auto">
                {content.schemaData}
              </pre>
            </div>
          )}

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
