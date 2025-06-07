
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Eye, 
  Edit, 
  Check, 
  X, 
  Globe, 
  Hash, 
  Link2, 
  Image,
  TrendingUp,
  Award
} from 'lucide-react';

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
    hashtags?: string[];
    internalLinks?: string[];
    imageAlt?: string;
    schemaData?: object;
    seoKeywords?: string[];
    keywordDensity?: number;
    seoScore?: number;
  };
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
  onContentUpdate: (content: any) => void;
}

export const ContentPreview = ({ 
  content, 
  onApprove, 
  onEdit, 
  onReject, 
  onContentUpdate 
}: ContentPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(content.title);
  const [editedBody, setEditedBody] = useState(content.body);

  const handleSaveEdit = () => {
    onContentUpdate({
      ...content,
      title: editedTitle,
      body: editedBody
    });
    setIsEditing(false);
  };

  const getSeoScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Eye className="h-5 w-5 text-corporate-accent" />
          Content Preview & SEO Analysis
          {content.seoScore && (
            <Badge className={`ml-auto ${getSeoScoreColor(content.seoScore)}`}>
              SEO Score: {content.seoScore}/100
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Type & Strategy Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-corporate-dark/50 rounded border border-corporate-accent/30">
          <div>
            <span className="text-xs text-gray-500 uppercase">Content Type</span>
            <p className="text-white font-medium">{content.contentType}</p>
          </div>
          {content.responseAngle && (
            <div>
              <span className="text-xs text-gray-500 uppercase">Response Angle</span>
              <p className="text-white font-medium">{content.responseAngle}</p>
            </div>
          )}
          {content.sourceUrl && (
            <div>
              <span className="text-xs text-gray-500 uppercase">Source Article</span>
              <a 
                href={content.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-corporate-accent hover:underline text-sm flex items-center gap-1"
              >
                View Source <Link2 className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-white font-medium">Article Title</label>
          {isEditing ? (
            <Textarea
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="bg-corporate-dark border-corporate-border text-white"
              rows={2}
            />
          ) : (
            <div className="p-3 bg-corporate-dark border border-corporate-border rounded">
              <h3 className="text-white font-bold text-lg">{content.title}</h3>
            </div>
          )}
        </div>

        {/* SEO Metadata */}
        {(content.metaDescription || content.urlSlug) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.metaDescription && (
              <div>
                <label className="text-white font-medium text-sm">Meta Description</label>
                <p className="text-gray-300 text-sm mt-1">{content.metaDescription}</p>
              </div>
            )}
            {content.urlSlug && (
              <div>
                <label className="text-white font-medium text-sm">URL Slug</label>
                <p className="text-corporate-accent text-sm mt-1">/{content.urlSlug}</p>
              </div>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="space-y-2">
          <label className="text-white font-medium">Article Content</label>
          {isEditing ? (
            <Textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              className="bg-corporate-dark border-corporate-border text-white min-h-[300px]"
            />
          ) : (
            <div className="p-4 bg-corporate-dark border border-corporate-border rounded max-h-96 overflow-y-auto">
              <div className="text-gray-300 whitespace-pre-wrap">{content.body}</div>
            </div>
          )}
        </div>

        {/* SEO Keywords */}
        {content.seoKeywords && content.seoKeywords.length > 0 && (
          <div className="space-y-2">
            <label className="text-white font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              SEO Keywords
            </label>
            <div className="flex flex-wrap gap-1">
              {content.seoKeywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-green-400 border-green-400/50">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags */}
        {content.hashtags && content.hashtags.length > 0 && (
          <div className="space-y-2">
            <label className="text-white font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Social Media Hashtags
            </label>
            <div className="flex flex-wrap gap-1">
              {content.hashtags.map((tag, index) => (
                <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Internal Links */}
        {content.internalLinks && content.internalLinks.length > 0 && (
          <div className="space-y-2">
            <label className="text-white font-medium flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Internal Links
            </label>
            <div className="space-y-1">
              {content.internalLinks.map((link, index) => (
                <p key={index} className="text-corporate-accent text-sm">{link}</p>
              ))}
            </div>
          </div>
        )}

        {/* Image Alt Text */}
        {content.imageAlt && (
          <div className="space-y-2">
            <label className="text-white font-medium flex items-center gap-2">
              <Image className="h-4 w-4" />
              Image Alt Text
            </label>
            <p className="text-gray-300 text-sm">{content.imageAlt}</p>
          </div>
        )}

        {/* Schema Data */}
        {content.schemaData && (
          <div className="space-y-2">
            <label className="text-white font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Schema.org Structured Data
            </label>
            <div className="p-3 bg-corporate-dark border border-corporate-border rounded">
              <pre className="text-gray-300 text-xs overflow-x-auto">
                {JSON.stringify(content.schemaData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* SEO Metrics */}
        {(content.keywordDensity || content.seoScore) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">SEO Optimization</p>
                <p className="text-gray-300 text-sm">Advanced content analysis complete</p>
              </div>
            </div>
            <div className="space-y-1">
              {content.keywordDensity && (
                <p className="text-gray-300 text-sm">
                  Keyword Density: {(content.keywordDensity * 100).toFixed(1)}%
                </p>
              )}
              {content.seoScore && (
                <p className={`text-sm font-medium ${getSeoScoreColor(content.seoScore)}`}>
                  SEO Score: {content.seoScore}/100
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          {isEditing ? (
            <>
              <Button
                onClick={handleSaveEdit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                Approve for Deployment
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent/10"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
              <Button
                onClick={onReject}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
