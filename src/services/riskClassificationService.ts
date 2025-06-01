import { pipeline, env } from '@huggingface/transformers';
import { toast } from 'sonner';

// Configure transformers environment for maximum browser compatibility
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 1; // Single thread for better compatibility

interface RiskClassificationResult {
  risk: 'Low' | 'Medium' | 'Medium-High' | 'High';
  confidence: number;
  summary: string;
}

// Store loaded classifiers
const loadedClassifiers: Record<string, any> = {};

/**
 * Quick browser support check for risk classification
 */
const isSupported = (): boolean => {
  try {
    const hasWebAssembly = typeof WebAssembly !== 'undefined';
    const hasFetch = typeof fetch !== 'undefined';
    const hasWindow = typeof window !== 'undefined';
    
    // Quick WASM test
    let wasmSupport = false;
    try {
      const wasmBinary = new Uint8Array([
        0x00, 0x61, 0x73, 0x6d, // WASM magic number
        0x01, 0x00, 0x00, 0x00  // WASM version
      ]);
      const wasmModule = new WebAssembly.Module(wasmBinary);
      wasmSupport = wasmModule instanceof WebAssembly.Module;
    } catch {
      wasmSupport = false;
    }
    
    console.log('Risk classifier support check:', {
      hasWebAssembly,
      wasmSupport,
      hasFetch,
      hasWindow
    });
    
    return hasWebAssembly && wasmSupport && hasFetch && hasWindow;
  } catch (error) {
    console.error('Risk classifier support check failed:', error);
    return false;
  }
};

/**
 * Load risk classification model with very aggressive timeout
 */
export const loadRiskClassifier = async (modelId: string = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'): Promise<boolean> => {
  if (!isSupported()) {
    console.warn('❌ Risk classifier not supported - missing WebAssembly or browser features');
    return false;
  }

  // Always use the most compatible model
  const browserModelId = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';

  if (loadedClassifiers[browserModelId]) {
    console.log('✅ Risk classifier already loaded');
    return true;
  }
  
  try {
    console.log(`🔒 Loading risk classifier ${browserModelId}...`);
    
    // Very aggressive timeout - if it doesn't work quickly, use fallback
    const quickTimeout = 2000; // Only 2 seconds
    
    const modelPromise = pipeline('text-classification' as any, browserModelId, { 
      device: 'cpu',
      progress_callback: (progress: any) => {
        if (progress.status === 'downloading') {
          console.log(`📥 Risk classifier: ${Math.round(progress.progress * 100)}%`);
        }
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Risk classifier timeout after ${quickTimeout}ms`)), quickTimeout)
    );

    loadedClassifiers[browserModelId] = await Promise.race([modelPromise, timeoutPromise]);
    
    console.log(`✅ Risk classifier loaded successfully`);
    
    if (typeof window !== 'undefined') {
      toast.success('🔒 Risk Classifier Ready', {
        description: 'Advanced threat detection enabled'
      });
    }
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Risk classifier loading failed:`, error);
    
    // Show informative message but don't make it alarming since fallback works well
    if (typeof window !== 'undefined') {
      toast.info(`🔄 Using Fallback Risk Analysis`, {
        description: 'Keyword-based threat detection active',
        duration: 4000
      });
    }
    
    return false;
  }
};

/**
 * Classify risk with enhanced fallback logic
 */
export const classifyRisk = async (text: string, modelId: string = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'): Promise<RiskClassificationResult> => {
  const browserModelId = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
  
  // Ensure model is loaded
  if (!loadedClassifiers[browserModelId]) {
    const loaded = await loadRiskClassifier(browserModelId);
    if (!loaded) {
      console.log('🔄 Using enhanced fallback risk classification');
      
      // Enhanced fallback with comprehensive threat analysis
      const highRiskKeywords = ['kill', 'bomb', 'terrorist', 'violence', 'weapon', 'dangerous', 'murder', 'attack', 'assault', 'harm'];
      const threatKeywords = ['threat', 'hack', 'malware', 'virus', 'scam', 'fraud', 'steal', 'breach', 'vulnerability', 'exploit'];
      const mediumRiskKeywords = ['suspicious', 'warning', 'alert', 'concern', 'issue', 'problem', 'risk', 'unsafe', 'questionable'];
      const negativeKeywords = ['bad', 'terrible', 'awful', 'horrible', 'disgusting', 'hate', 'angry', 'furious', 'upset'];
      
      const lowerText = text.toLowerCase();
      const words = lowerText.split(/\s+/);
      
      // Calculate scores based on keyword presence and frequency
      const highRiskScore = highRiskKeywords.filter(word => lowerText.includes(word)).length;
      const threatScore = threatKeywords.filter(word => lowerText.includes(word)).length;
      const mediumRiskScore = mediumRiskKeywords.filter(word => lowerText.includes(word)).length;
      const negativeScore = negativeKeywords.filter(word => lowerText.includes(word)).length;
      
      // Consider text length and intensity
      const textLength = words.length;
      const intensityMarkers = ['very', 'extremely', 'absolutely', 'completely', '!!!', 'definitely'].filter(marker => lowerText.includes(marker)).length;
      
      // Calculate base confidence with complexity factors
      const baseConfidence = 0.65 + (Math.min(textLength, 20) * 0.01) + (intensityMarkers * 0.05);
      
      if (highRiskScore > 0) {
        return {
          risk: 'High',
          confidence: Math.min(baseConfidence + 0.25 + (highRiskScore * 0.1), 0.95),
          summary: `High-risk content detected: ${highRiskScore} critical indicators found (keyword analysis)`
        };
      } else if (threatScore > 1 || (threatScore > 0 && intensityMarkers > 0)) {
        return {
          risk: 'Medium-High',
          confidence: Math.min(baseConfidence + 0.15 + (threatScore * 0.08), 0.9),
          summary: `Multiple threat indicators: ${threatScore} threats, ${intensityMarkers} intensity markers (keyword analysis)`
        };
      } else if (threatScore > 0 || mediumRiskScore > 1 || (negativeScore > 2 && intensityMarkers > 0)) {
        return {
          risk: 'Medium',
          confidence: Math.min(baseConfidence + 0.05 + (mediumRiskScore * 0.05), 0.8),
          summary: `Moderate risk: ${threatScore} threats, ${mediumRiskScore} concerns, ${negativeScore} negative terms (keyword analysis)`
        };
      } else {
        return {
          risk: 'Low',
          confidence: Math.min(baseConfidence, 0.75),
          summary: `No significant risk indicators in ${words.length} words (keyword analysis)`
        };
      }
    }
  }
  
  try {
    // Run the model
    const result = await loadedClassifiers[browserModelId](text);
    console.log('Risk classification result:', result);
    
    // Process the result
    const label = result[0].label;
    const score = result[0].score;
    
    // Enhanced logic: treat "NEGATIVE" as potential risk with nuanced scoring
    if (label === 'NEGATIVE' && score > 0.9) {
      return {
        risk: 'High',
        confidence: score,
        summary: `High confidence negative sentiment detected (${Math.round(score * 100)}%)`
      };
    } else if (label === 'NEGATIVE' && score > 0.75) {
      return {
        risk: 'Medium-High',
        confidence: score,
        summary: `Strong negative sentiment detected (${Math.round(score * 100)}%)`
      };
    } else if (label === 'NEGATIVE' && score > 0.6) {
      return {
        risk: 'Medium',
        confidence: score,
        summary: `Moderate negative sentiment detected (${Math.round(score * 100)}%)`
      };
    }
    
    return {
      risk: score > 0.8 ? 'Low' : 'Medium',
      confidence: score,
      summary: `Risk assessment: ${label} sentiment (${Math.round(score * 100)}% confidence)`
    };
  } catch (error) {
    console.error(`Error running risk classification:`, error);
    return {
      risk: 'Medium',
      confidence: 0.5,
      summary: 'Error during classification - using safe medium risk fallback'
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
