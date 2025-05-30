
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Clipboard, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

  const processBulkContent = async () => {
    if (!bulkContent.trim()) {
      toast.error('Please paste some content first');
      return;
    }

    setIsProcessing(true);

    try {
      // Split content by double line breaks to separate articles
      const articles = bulkContent.split('\n\n').filter(section => section.trim());
      
      console.log('Raw articles found:', articles);
      
      const processedArticles = articles.map((articleText, index) => {
        const lines = articleText.split('\n').filter(line => line.trim());
        
        console.log(`Processing article ${index + 1}:`, lines);
        
        // More flexible parsing - just need at least one line for title
        if (lines.length < 1) {
          console.log(`Skipping article ${index + 1}: No content`);
          return null;
        }

        const title = lines[0].trim();
        // If there's only one line, use it as both title and content
        const content = lines.length > 1 ? lines.slice(1).join('\n').trim() : title;
        
        // Generate slug from title
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        const article = {
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
        
        console.log(`Article ${index + 1} processed:`, article);
        return article;
      }).filter(Boolean);

      console.log('Final processed articles:', processedArticles);

      if (processedArticles.length === 0) {
        toast.error('No valid articles found. Please check your format - each article should have at least a title.');
        setIsProcessing(false);
        return;
      }

      // Save articles to database
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(processedArticles)
        .select();

      if (error) {
        console.error('Error saving articles:', error);
        throw error;
      }

      console.log('Articles saved successfully:', data);
      toast.success(`Successfully processed ${processedArticles.length} articles as drafts`);
      setBulkContent('');
      onArticlesAdded();

    } catch (error) {
      console.error('Error processing bulk content:', error);
      toast.error('Failed to process articles. Please try again.');
    } finally {
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
