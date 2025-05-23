
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, LinkIcon, Loader, X, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { submitToAriaIngest } from '@/services/ariaIngestService';

interface BatchItem {
  id: string;
  content: string;
  type: 'content' | 'url';
  url?: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

interface BatchResults {
  total: number;
  successful: number;
  failed: number;
  items: BatchItem[];
}

const BatchProcessingPanel: React.FC = () => {
  const [batchContent, setBatchContent] = useState('');
  const [urls, setUrls] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [batchPlatform, setBatchPlatform] = useState('manual');
  const [progress, setProgress] = useState(0);
  const [currentItem, setCurrentItem] = useState<string>('');
  const [results, setResults] = useState<BatchResults | null>(null);

  const prepareBatchItems = (): BatchItem[] => {
    const items: BatchItem[] = [];
    
    // Add content items
    const contentItems = batchContent.split('\n').filter(item => item.trim());
    contentItems.forEach((content, index) => {
      items.push({
        id: `content-${index}`,
        content: content.trim(),
        type: 'content',
        status: 'pending'
      });
    });

    // Add URL items
    const urlItems = urls.split('\n').filter(url => url.trim());
    urlItems.forEach((url, index) => {
      items.push({
        id: `url-${index}`,
        content: `Content from: ${url}`,
        type: 'url',
        url: url.trim(),
        status: 'pending'
      });
    });

    return items;
  };

  const processSingleItem = async (item: BatchItem): Promise<BatchItem> => {
    try {
      setCurrentItem(item.content.substring(0, 50) + '...');
      
      const result = await submitToAriaIngest({
        content: item.content,
        platform: batchPlatform,
        url: item.url || '',
        severity: 'medium'
      });

      if (result) {
        return { ...item, status: 'success' };
      } else {
        return { ...item, status: 'error', error: 'No response received' };
      }
    } catch (error) {
      return { 
        ...item, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  const handleBatchSubmit = async () => {
    const items = prepareBatchItems();
    
    if (items.length === 0) {
      toast.error('Please enter content or URLs to process');
      return;
    }

    setProcessing(true);
    setCancelled(false);
    setProgress(0);
    setCurrentItem('');
    
    const batchResults: BatchResults = {
      total: items.length,
      successful: 0,
      failed: 0,
      items: [...items]
    };

    try {
      for (let i = 0; i < items.length; i++) {
        if (cancelled) {
          toast.info('Batch processing cancelled');
          break;
        }

        // Update item status to processing
        batchResults.items[i] = { ...batchResults.items[i], status: 'processing' };
        setResults({ ...batchResults });

        // Process the item
        const processedItem = await processSingleItem(items[i]);
        batchResults.items[i] = processedItem;

        // Update counters
        if (processedItem.status === 'success') {
          batchResults.successful++;
        } else {
          batchResults.failed++;
        }

        // Update progress
        const progressPercent = ((i + 1) / items.length) * 100;
        setProgress(progressPercent);
        setResults({ ...batchResults });

        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!cancelled) {
        toast.success(`Batch processing completed: ${batchResults.successful} successful, ${batchResults.failed} failed`);
        if (batchResults.successful > 0) {
          setBatchContent('');
          setUrls('');
        }
      }
    } catch (error) {
      toast.error('Batch processing failed');
      console.error('Batch processing error:', error);
    } finally {
      setProcessing(false);
      setCurrentItem('');
    }
  };

  const handleCancel = () => {
    setCancelled(true);
    toast.info('Cancelling batch processing...');
  };

  const handleRetryFailed = async () => {
    if (!results) return;

    const failedItems = results.items.filter(item => item.status === 'error');
    if (failedItems.length === 0) return;

    setProcessing(true);
    setCancelled(false);
    setProgress(0);

    const updatedResults = { ...results };

    try {
      for (let i = 0; i < failedItems.length; i++) {
        if (cancelled) break;

        const itemIndex = results.items.findIndex(item => item.id === failedItems[i].id);
        updatedResults.items[itemIndex] = { ...failedItems[i], status: 'processing' };
        setResults({ ...updatedResults });

        const processedItem = await processSingleItem(failedItems[i]);
        updatedResults.items[itemIndex] = processedItem;

        if (processedItem.status === 'success') {
          updatedResults.successful++;
          updatedResults.failed--;
        }

        const progressPercent = ((i + 1) / failedItems.length) * 100;
        setProgress(progressPercent);
        setResults({ ...updatedResults });

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast.success('Retry completed');
    } catch (error) {
      toast.error('Retry failed');
    } finally {
      setProcessing(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setProgress(0);
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
            disabled={processing}
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
            disabled={processing}
          />
        </div>

        {processing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing: {currentItem}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleBatchSubmit} 
            disabled={processing || (!batchContent.trim() && !urls.trim())}
            className="flex-1"
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
          
          {processing && (
            <Button 
              variant="outline"
              onClick={handleCancel}
              disabled={cancelled}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Batch Results</h4>
              <Button variant="ghost" size="sm" onClick={clearResults}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{results.total}</div>
                <div className="text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.successful}</div>
                <div className="text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-muted-foreground">Failed</div>
              </div>
            </div>

            {results.failed > 0 && !processing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryFailed}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry Failed Items ({results.failed})
              </Button>
            )}

            <div className="max-h-48 overflow-y-auto space-y-2">
              {results.items.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-2 p-2 text-sm border rounded"
                >
                  {item.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                  {item.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  {item.status === 'processing' && (
                    <Loader className="h-4 w-4 animate-spin text-blue-500 flex-shrink-0" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{item.content}</div>
                    {item.error && (
                      <div className="text-red-500 text-xs mt-1">{item.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BatchProcessingPanel;
