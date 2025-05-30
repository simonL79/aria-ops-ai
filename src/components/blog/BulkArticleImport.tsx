import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Clipboard, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface BulkArticleImportProps {
  onArticlesAdded: () => void;
}

const BulkArticleImport = ({ onArticlesAdded }: BulkArticleImportProps) => {
  const [bulkContent, setBulkContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setBulkContent(text);
      toast.success('Content pasted from clipboard');
    } catch (error) {
      toast.error('Failed to paste from clipboard');
    }
  };

  const processBulkContent = () => {
    if (!bulkContent.trim()) {
      toast.error('Please paste some content first');
      return;
    }

    setIsProcessing(true);

    try {
      // Split content by double line breaks to separate articles
      const articles = bulkContent.split('\n\n').filter(section => section.trim());
      
      const processedArticles = articles.map((articleText, index) => {
        const lines = articleText.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          return null; // Skip if not enough content
        }

        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        
        // Generate slug from title
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        return {
          title,
          slug: `${slug}-${Date.now()}-${index}`, // Add timestamp to avoid duplicates
          description: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
          content,
          author: 'Simon Lindsay',
          date: new Date().toISOString().split('T')[0],
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
          category: 'Technology',
          status: 'draft' as const
        };
      }).filter(Boolean);

      if (processedArticles.length === 0) {
        toast.error('No valid articles found in the pasted content');
        setIsProcessing(false);
        return;
      }

      // Simulate saving articles (replace with actual save logic)
      console.log('Processing articles:', processedArticles);
      
      setTimeout(() => {
        toast.success(`Successfully processed ${processedArticles.length} articles as drafts`);
        setBulkContent('');
        onArticlesAdded();
        setIsProcessing(false);
      }, 1000);

    } catch (error) {
      console.error('Error processing bulk content:', error);
      toast.error('Failed to process articles');
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Copy className="h-5 w-5" />
          Copy & Paste Articles
        </CardTitle>
        <p className="text-sm text-gray-600">
          Paste multiple articles separated by double line breaks. Each article should have a title on the first line, followed by the content.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="bulk-content">Article Content</Label>
          <Textarea
            id="bulk-content"
            value={bulkContent}
            onChange={(e) => setBulkContent(e.target.value)}
            placeholder={`Example format:

Article Title 1
This is the content of the first article. It can be multiple lines.

Article Title 2
This is the content of the second article.

Article Title 3
This is the content of the third article.`}
            rows={12}
            className="mt-1"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handlePasteFromClipboard}
            className="flex items-center gap-2"
          >
            <Clipboard className="h-4 w-4" />
            Paste from Clipboard
          </Button>
          
          <Button 
            onClick={processBulkContent}
            disabled={isProcessing || !bulkContent.trim()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Add Articles'}
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p><strong>Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Separate each article with a double line break (press Enter twice)</li>
            <li>First line of each section will be used as the title</li>
            <li>All articles will be saved as drafts initially</li>
            <li>You can edit them individually after import</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkArticleImport;
