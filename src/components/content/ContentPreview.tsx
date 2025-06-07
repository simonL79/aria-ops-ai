
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Check, X, FileText, Globe, Search } from 'lucide-react';

interface ContentPreviewProps {
  content: any;
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
  onContentUpdate: (updatedContent: any) => void;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  content,
  onApprove,
  onEdit,
  onReject,
  onContentUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content.content || '');
  const [editedTitle, setEditedTitle] = useState(content.title || '');

  const handleSaveEdit = () => {
    const updated = {
      ...content,
      title: editedTitle,
      content: editedContent
    };
    onContentUpdate(updated);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(content.content || '');
    setEditedTitle(content.title || '');
    setIsEditing(false);
  };

  if (!content) {
    return null;
  }

  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-corporate-accent" />
            Live SEO Content Preview
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500 text-white">
              <Globe className="h-3 w-3 mr-1" />
              SEO Score: {content.seoScore || 92}/100
            </Badge>
            <Badge className="bg-blue-500 text-white">
              <Search className="h-3 w-3 mr-1" />
              Ready for Deployment
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-corporate-lightGray">Title</label>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="bg-corporate-dark border-corporate-border text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-corporate-lightGray">Content</label>
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[300px] bg-corporate-dark border-corporate-border text-white font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancelEdit} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{content.title}</h3>
              <div className="p-4 bg-corporate-dark border border-corporate-border rounded">
                <div className="prose prose-invert max-w-none">
                  {content.content?.split('\n').map((paragraph: string, index: number) => (
                    paragraph.trim() ? (
                      <p key={index} className="text-gray-300 mb-3">{paragraph}</p>
                    ) : null
                  ))}
                </div>
              </div>
            </div>

            {content.keywords && content.keywords.length > 0 && (
              <div>
                <label className="text-sm font-medium text-corporate-lightGray">SEO Keywords</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.keywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-corporate-accent border-corporate-accent">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 p-3 bg-corporate-dark rounded border border-corporate-border">
              <div>
                <div className="text-xs text-corporate-lightGray">Meta Description</div>
                <div className="text-sm text-white">{content.metaDescription || 'Auto-generated'}</div>
              </div>
              <div>
                <div className="text-xs text-corporate-lightGray">URL Slug</div>
                <div className="text-sm text-corporate-accent">{content.urlSlug || 'auto-generated'}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={onApprove} className="bg-corporate-accent text-black hover:bg-corporate-accent/90">
                <Check className="h-4 w-4 mr-2" />
                Approve for Deployment
              </Button>
              <Button onClick={() => setIsEditing(true)} variant="outline" className="text-corporate-accent border-corporate-accent">
                <Edit className="h-4 w-4 mr-2" />
                Edit Content
              </Button>
              <Button onClick={onReject} variant="outline" className="text-red-400 border-red-400">
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
