
import { pipeline, env } from '@huggingface/transformers';
import { toast } from 'sonner';

// Configure transformers environment for better browser compatibility
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.useBrowserCache = true;

interface RiskClassificationResult {
  risk: 'Low' | 'Medium' | 'Medium-High' | 'High';
  confidence: number;
  summary: string;
}

// Store loaded classifiers
const loadedClassifiers: Record<string, any> = {};

/**
 * Check if we're in a supported environment with enhanced checks
 */
const isSupported = (): boolean => {
  try {
    const hasWebAssembly = typeof WebAssembly !== 'undefined';
    const hasFetch = typeof fetch !== 'undefined';
    const hasWindow = typeof window !== 'undefined';
    
    console.log('Risk classifier browser support:', {
      hasWebAssembly,
      hasFetch,
      hasWindow
    });
    
    return hasWebAssembly && hasFetch && hasWindow;
  } catch (error) {
    console.error('Risk classifier support check failed:', error);
    return false;
  }
};

/**
 * Load a sentiment classification model in the browser with better error handling
 */
export const loadRiskClassifier = async (modelId: string = 'distilbert-base-uncased-finetuned-sst-2-english'): Promise<boolean> => {
  if (!isSupported()) {
    console.warn('Risk classifier not supported in this environment - missing required browser features');
    return false;
  }

  if (loadedClassifiers[modelId]) {
    return true;
  }
  
  try {
    console.log(`Loading classification model ${modelId}...`);
    
    // Always use CPU for maximum compatibility
    const device = 'cpu';
    
    // Load with extended timeout for classification models
    const loadWithTimeout = async (timeoutMs: number = 60000) => {
      return Promise.race([
        pipeline('text-classification' as any, modelId, { 
          device,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`Downloading risk classifier: ${Math.round(progress.progress * 100)}%`);
            } else if (progress.status === 'loading') {
              console.log(`Loading risk classifier: ${progress.name || 'model files'}`);
            }
          }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Risk classifier loading timeout after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);
    };

    loadedClassifiers[modelId] = await loadWithTimeout();
    
    console.log(`✅ Risk classifier ${modelId} loaded successfully on ${device}`);
    
    if (typeof window !== 'undefined') {
      toast.success('Risk classification model ready');
    }
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error loading risk classifier ${modelId}:`, error);
    
    if (typeof window !== 'undefined') {
      toast.error(`Failed to load risk classification model`, {
        description: errorMessage.includes('timeout') ? 'Model download timeout - try again' : 'Using fallback classification'
      });
    }
    
    return false;
  }
};

/**
 * Classify risk in a text using local HuggingFace model with enhanced fallback
 */
export const classifyRisk = async (text: string, modelId: string = 'distilbert-base-uncased-finetuned-sst-2-english'): Promise<RiskClassificationResult> => {
  // Ensure model is loaded
  if (!loadedClassifiers[modelId]) {
    const loaded = await loadRiskClassifier(modelId);
    if (!loaded) {
      console.log('Using enhanced fallback risk classification');
      
      // Enhanced fallback with threat keyword analysis
      const threatKeywords = ['threat', 'attack', 'hack', 'malware', 'virus', 'scam', 'fraud', 'steal', 'breach', 'vulnerability'];
      const highRiskKeywords = ['kill', 'bomb', 'terrorist', 'violence', 'weapon', 'dangerous'];
      const mediumRiskKeywords = ['suspicious', 'warning', 'alert', 'concern', 'issue', 'problem'];
      
      const lowerText = text.toLowerCase();
      const highRiskScore = highRiskKeywords.filter(word => lowerText.includes(word)).length;
      const threatScore = threatKeywords.filter(word => lowerText.includes(word)).length;
      const mediumRiskScore = mediumRiskKeywords.filter(word => lowerText.includes(word)).length;
      
      if (highRiskScore > 0) {
        return {
          risk: 'High',
          confidence: 0.85,
          summary: 'High-risk content detected via keyword analysis (fallback mode)'
        };
      } else if (threatScore > 1) {
        return {
          risk: 'Medium-High',
          confidence: 0.75,
          summary: 'Multiple threat indicators detected (fallback mode)'
        };
      } else if (threatScore > 0 || mediumRiskScore > 1) {
        return {
          risk: 'Medium',
          confidence: 0.65,
          summary: 'Moderate risk indicators detected (fallback mode)'
        };
      } else {
        return {
          risk: 'Low',
          confidence: 0.55,
          summary: 'No significant risk indicators detected (fallback mode)'
        };
      }
    }
  }
  
  try {
    // Run the model
    const result = await loadedClassifiers[modelId](text);
    console.log('Risk classification result:', result);
    
    // Process the result
    const label = result[0].label;
    const score = result[0].score;
    
    // Enhanced logic: treat "NEGATIVE" as potential risk
    if (label === 'NEGATIVE' && score > 0.8) {
      return {
        risk: 'High',
        confidence: score,
        summary: `High risk detected with ${Math.round(score * 100)}% confidence`
      };
    } else if (label === 'NEGATIVE' && score > 0.6) {
      return {
        risk: 'Medium-High',
        confidence: score,
        summary: `Medium-high risk detected with ${Math.round(score * 100)}% confidence`
      };
    }
    
    return {
      risk: score > 0.8 ? 'Low' : 'Medium',
      confidence: score,
      summary: `Risk assessment completed (${label})`
    };
  } catch (error) {
    console.error(`Error running risk classification:`, error);
    return {
      risk: 'Medium',
      confidence: 0.5,
      summary: 'Error during classification - using safe fallback'
    };
  }
};

/**
 * Batch classify multiple texts
 */
export const batchClassifyRisk = async (texts: string[]): Promise<RiskClassificationResult[]> => {
  const results = [];
  for (const text of texts) {
    try {
      const result = await classifyRisk(text);
      results.push(result);
    } catch (error) {
      console.error(`Error classifying text: ${text.substring(0, 50)}...`, error);
      results.push({
        risk: 'Low' as const,
        confidence: 0,
        summary: 'Error during classification'
      });
    }
  }
  return results;
};
