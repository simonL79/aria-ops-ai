
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Link as LinkIcon, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { submitToAriaIngest } from '@/services/ariaIngestService';

const BatchProcessingPanel: React.FC = () => {
  const [batchContent, setBatchContent] = useState('');
  const [urls, setUrls] = useState('');
  const [processing, setProcessing] = useState(false);
  const [batchPlatform, setBatchPlatform] = useState('manual');

  const handleBatchSubmit = async () => {
    if (!batchContent.trim() && !urls.trim()) {
      toast.error('Please enter content or URLs to process');
      return;
    }

    setProcessing(true);
    
    try {
      const contentItems = batchContent.split('\n').filter(item => item.trim());
      const urlItems = urls.split('\n').filter(url => url.trim());
      
      const allItems = [
        ...contentItems.map(content => ({ content, type: 'content' })),
        ...urlItems.map(url => ({ content: `Content from: ${url}`, url, type: 'url' }))
      ];

      let processed = 0;
      for (const item of allItems) {
        await submitToAriaIngest({
          content: item.content,
          platform: batchPlatform,
          url: item.url || '',
          severity: 'medium'
        });
        processed++;
      }

      toast.success(`Batch processing completed: ${processed} items processed`);
      setBatchContent('');
      setUrls('');
    } catch (error) {
      toast.error('Batch processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Batch Processing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Platform</Label>
          <Select value={batchPlatform} onValueChange={setBatchPlatform}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual Entry</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="news">News Sources</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Batch Content (one per line)
          </Label>
          <Textarea
            value={batchContent}
            onChange={(e) => setBatchContent(e.target.value)}
            placeholder="Enter multiple pieces of content, one per line..."
            rows={6}
          />
        </div>

        <div>
          <Label className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            URLs to Process (one per line)
          </Label>
          <Textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="Enter URLs to fetch and analyze, one per line..."
            rows={4}
          />
        </div>

        <Button 
          onClick={handleBatchSubmit} 
          disabled={processing || (!batchContent.trim() && !urls.trim())}
          className="w-full"
        >
          {processing ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Processing Batch...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Process Batch
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BatchProcessingPanel;
