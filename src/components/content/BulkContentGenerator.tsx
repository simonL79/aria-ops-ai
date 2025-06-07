
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Zap, 
  Loader2, 
  CheckCircle, 
  Clock,
  GitBranch,
  Target,
  Pause,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { GitDeploymentService } from '@/services/deployment/gitDeployment';

interface BulkContentGeneratorProps {
  selectedClient: any;
  contentConfig: any;
  onBulkComplete: (results: any[]) => void;
}

const BATCH_SIZE = 10;
const BATCH_DELAY = 15000; // 15 seconds between batches

export const BulkContentGenerator: React.FC<BulkContentGeneratorProps> = ({
  selectedClient,
  contentConfig,
  onBulkComplete
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [completedArticles, setCompletedArticles] = useState(0);
  const [progress, setProgress] = useState(0);
  const [batchDelay, setBatchDelay] = useState(15);
  const [deploymentResults, setDeploymentResults] = useState<any[]>([]);

  const quantityOptions = [100, 200, 500, 1000];

  const generateVariedContent = (baseConfig: any, index: number) => {
    const variations = [
      { angle: 'Leadership Excellence', type: 'thought_leadership' },
      { angle: 'Industry Innovation', type: 'industry_insight' },
      { angle: 'Professional Achievement', type: 'achievement_profile' },
      { angle: 'Strategic Vision', type: 'vision_piece' },
      { angle: 'Market Leadership', type: 'market_analysis' }
    ];

    const variation = variations[index % variations.length];
    
    return {
      ...baseConfig,
      title: `${selectedClient?.name}: ${variation.angle} - Article ${index + 1}`,
      content: `${selectedClient?.name} continues to demonstrate exceptional ${variation.angle.toLowerCase()} in their field.

Through strategic vision and unwavering commitment to excellence, ${selectedClient?.name} has established themselves as a thought leader in the industry.

Key achievements in this area include:
- Pioneering innovative solutions that drive industry advancement
- Building sustainable partnerships that create lasting value  
- Demonstrating commitment to professional excellence and ethical standards
- Contributing to industry knowledge through thought leadership

Recent developments highlight ${selectedClient?.name}'s continued growth and positive impact on the sector. Industry experts recognize their contributions as setting new standards for professional excellence.

The focus on ${baseConfig.targetKeywords?.join(', ') || 'innovation, leadership, excellence'} reflects a comprehensive approach to strategic development and sustainable growth.

Moving forward, ${selectedClient?.name} remains committed to driving positive change and delivering exceptional results across all areas of operation.`,
      contentType: variation.type,
      articleNumber: index + 1,
      variationAngle: variation.angle
    };
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleBulkGeneration = async () => {
    if (!selectedClient || !contentConfig) {
      toast.error('Please ensure client and content configuration are set');
      return;
    }

    setIsGenerating(true);
    setIsPaused(false);
    setCompletedArticles(0);
    setCurrentBatch(0);
    setDeploymentResults([]);

    const totalArticles = selectedQuantity;
    const batches = Math.ceil(totalArticles / BATCH_SIZE);
    setTotalBatches(batches);

    console.log(`🚀 Starting bulk generation: ${totalArticles} articles in ${batches} batches`);

    try {
      const allResults: any[] = [];

      for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
        if (isPaused) {
          toast.info('Bulk generation paused');
          break;
        }

        setCurrentBatch(batchIndex + 1);
        const startIndex = batchIndex * BATCH_SIZE;
        const endIndex = Math.min(startIndex + BATCH_SIZE, totalArticles);
        const batchSize = endIndex - startIndex;

        console.log(`📦 Processing batch ${batchIndex + 1}/${batches} (Articles ${startIndex + 1}-${endIndex})`);

        // Generate batch content
        const batchPromises = Array.from({ length: batchSize }, async (_, i) => {
          const articleIndex = startIndex + i;
          const variedConfig = generateVariedContent(contentConfig, articleIndex);

          try {
            const result = await GitDeploymentService.deployToGitHub({
              entityName: selectedClient.name,
              content: variedConfig.content,
              title: variedConfig.title,
              keywords: variedConfig.targetKeywords || [],
              contentType: variedConfig.contentType
            });

            setCompletedArticles(prev => prev + 1);
            setProgress((completedArticles + 1) / totalArticles * 100);

            return {
              success: result.success,
              articleNumber: articleIndex + 1,
              title: variedConfig.title,
              url: result.deploymentUrl,
              repositoryUrl: result.repositoryUrl,
              contentType: variedConfig.contentType,
              variationAngle: variedConfig.variationAngle
            };
          } catch (error) {
            console.error(`❌ Failed to deploy article ${articleIndex + 1}:`, error);
            return {
              success: false,
              articleNumber: articleIndex + 1,
              title: variedConfig.title,
              error: error.message
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        allResults.push(...batchResults);
        setDeploymentResults(prev => [...prev, ...batchResults]);

        const successCount = batchResults.filter(r => r.success).length;
        toast.success(`Batch ${batchIndex + 1} complete: ${successCount}/${batchSize} articles deployed`);

        // Delay between batches (except for the last batch)
        if (batchIndex < batches - 1 && !isPaused) {
          console.log(`⏳ Waiting ${batchDelay} seconds before next batch...`);
          await sleep(batchDelay * 1000);
        }
      }

      const totalSuccess = allResults.filter(r => r.success).length;
      toast.success(`Bulk generation complete! ${totalSuccess}/${totalArticles} articles deployed successfully`);
      onBulkComplete(allResults);

    } catch (error) {
      console.error('❌ Bulk generation failed:', error);
      toast.error(`Bulk generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setProgress(100);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Bulk generation resumed' : 'Bulk generation paused');
  };

  const stopGeneration = () => {
    setIsGenerating(false);
    setIsPaused(false);
    toast.warning('Bulk generation stopped');
  };

  return (
    <Card className="border-corporate-border bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="text-corporate-accent flex items-center gap-2">
          <Target className="h-5 w-5" />
          Bulk Content Saturation Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quantity Selection */}
        {!isGenerating && (
          <div className="space-y-4">
            <div>
              <Label className="text-corporate-lightGray">Articles to Generate</Label>
              <div className="flex gap-2 mt-2">
                {quantityOptions.map(qty => (
                  <Button
                    key={qty}
                    variant={selectedQuantity === qty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedQuantity(qty)}
                    className={selectedQuantity === qty ? "bg-corporate-accent text-black" : ""}
                  >
                    {qty}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-corporate-lightGray">Batch Delay (seconds)</Label>
                <Input
                  type="number"
                  value={batchDelay}
                  onChange={(e) => setBatchDelay(parseInt(e.target.value) || 15)}
                  min={5}
                  max={60}
                  className="bg-corporate-dark border-corporate-border text-white"
                />
              </div>
              <div>
                <Label className="text-corporate-lightGray">Estimated Time</Label>
                <div className="text-corporate-accent font-medium mt-2">
                  {Math.ceil(selectedQuantity / BATCH_SIZE) * batchDelay / 60} minutes
                </div>
              </div>
            </div>

            <Button
              onClick={handleBulkGeneration}
              disabled={!selectedClient || !contentConfig}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              Start Bulk Generation ({selectedQuantity} Articles)
            </Button>
          </div>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-corporate-lightGray">Progress</span>
                <span className="text-white">{completedArticles}/{selectedQuantity} articles</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-400">{currentBatch}/{totalBatches}</div>
                <p className="text-xs text-gray-400">Current Batch</p>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">{completedArticles}</div>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-400">{selectedQuantity - completedArticles}</div>
                <p className="text-xs text-gray-400">Remaining</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePauseResume}
                variant="outline"
                className="flex-1"
              >
                {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={stopGeneration}
                variant="destructive"
                className="flex-1"
              >
                Stop Generation
              </Button>
            </div>
          </div>
        )}

        {/* Batch Processing Info */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-400 font-medium">Smart Batch Processing</p>
              <p className="text-blue-300">
                Generates {BATCH_SIZE} articles per batch with {batchDelay}s delays to prevent GitHub rate limiting.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Results */}
        {deploymentResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Recent Deployments</h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {deploymentResults.slice(-5).map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 border border-corporate-border rounded text-xs"
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <GitBranch className="h-3 w-3 text-red-500" />
                    )}
                    <span className="text-white">Article #{result.articleNumber}</span>
                  </div>
                  <Badge 
                    variant={result.success ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {result.success ? 'DEPLOYED' : 'FAILED'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
