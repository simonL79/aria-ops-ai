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
 * Enhanced browser support check for risk classification
 */
const isSupported = (): boolean => {
  try {
    const hasWebAssembly = typeof WebAssembly !== 'undefined';
    const hasFetch = typeof fetch !== 'undefined';
    const hasWindow = typeof window !== 'undefined';
    
    // Test WebAssembly with enhanced validation
    let wasmSupport = false;
    try {
      const wasmBinary = new Uint8Array([
        0x00, 0x61, 0x73, 0x6d, // WASM magic number
        0x01, 0x00, 0x00, 0x00  // WASM version
      ]);
      const wasmModule = new WebAssembly.Module(wasmBinary);
      wasmSupport = wasmModule instanceof WebAssembly.Module;
      
      // Test instantiation as well
      const wasmInstance = new WebAssembly.Instance(wasmModule);
      wasmSupport = wasmSupport && wasmInstance instanceof WebAssembly.Instance;
    } catch {
      wasmSupport = false;
    }
    
    // Check for required browser features
    const hasArrayBuffer = typeof ArrayBuffer !== 'undefined';
    const hasUint8Array = typeof Uint8Array !== 'undefined';
    
    console.log('Risk classifier enhanced support check:', {
      hasWebAssembly,
      wasmSupport,
      hasFetch,
      hasWindow,
      hasArrayBuffer,
      hasUint8Array,
      userAgent: navigator.userAgent.substring(0, 50)
    });
    
    return hasWebAssembly && wasmSupport && hasFetch && hasWindow && hasArrayBuffer && hasUint8Array;
  } catch (error) {
    console.error('Risk classifier support check failed:', error);
    return false;
  }
};

/**
 * Load risk classification model with progressive loading strategy
 */
export const loadRiskClassifier = async (modelId: string = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'): Promise<boolean> => {
  if (!isSupported()) {
    console.warn('Risk classifier not supported - missing required browser features or WebAssembly');
    return false;
  }

  // Ensure we use browser-compatible model
  const browserModelId = modelId.includes('Xenova/') ? modelId : 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';

  if (loadedClassifiers[browserModelId]) {
    return true;
  }
  
  try {
    console.log(`Loading risk classification model ${browserModelId}...`);
    
    // Always use CPU for maximum compatibility
    const device = 'cpu';
    
    // Progressive loading with multiple strategies
    const loadWithMultipleStrategies = async () => {
      const strategies = [
        { timeout: 8000, description: 'Quick load' },
        { timeout: 15000, description: 'Standard load' },
        { timeout: 30000, description: 'Extended load' }
      ];
      
      for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];
        try {
          console.log(`Risk classifier attempt ${i + 1}/3: ${strategy.description} (${strategy.timeout}ms timeout)`);
          
          return await Promise.race([
            pipeline('text-classification' as any, browserModelId, { 
              device,
              progress_callback: (progress: any) => {
                if (progress.status === 'downloading') {
                  console.log(`Downloading risk classifier: ${Math.round(progress.progress * 100)}%`);
                } else if (progress.status === 'loading') {
                  console.log(`Loading risk classifier: ${progress.name || 'model files'}`);
                } else if (progress.status === 'ready') {
                  console.log(`Risk classifier ready for inference`);
                }
              }
            }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error(`Risk classifier loading timeout after ${strategy.timeout}ms`)), strategy.timeout)
            )
          ]);
        } catch (strategyError) {
          console.log(`Strategy ${i + 1} failed:`, strategyError.message);
          if (i === strategies.length - 1) {
            throw strategyError;
          }
          // Brief pause before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    };

    loadedClassifiers[browserModelId] = await loadWithMultipleStrategies();
    
    console.log(`✅ Risk classifier ${browserModelId} loaded successfully on ${device}`);
    
    if (typeof window !== 'undefined') {
      toast.success('Risk classification model ready', {
        description: 'Advanced threat detection enabled'
      });
    }
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error loading risk classifier ${browserModelId}:`, error);
    
    // Enhanced error analysis for better user guidance
    let specificError = 'Risk classifier loading failed';
    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      specificError = 'Model download timeout - network connection may be slow. Try refreshing or using a faster connection.';
    } else if (errorMessage.includes('WebAssembly') || errorMessage.includes('wasm')) {
      specificError = 'WebAssembly not supported or disabled. Enable WebAssembly in browser settings or try Chrome/Edge.';
    } else if (errorMessage.includes('memory') || errorMessage.includes('Memory')) {
      specificError = 'Insufficient browser memory - close other tabs and try again.';
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      specificError = 'Network error - check internet connection and firewall settings.';
    } else if (errorMessage.includes('quota') || errorMessage.includes('storage')) {
      specificError = 'Browser storage full - clear browser cache and try again.';
    } else if (errorMessage.includes('CORS')) {
      specificError = 'Cross-origin request blocked - browser security restrictions.';
    }
    
    if (typeof window !== 'undefined') {
      toast.error(`Failed to load risk classification model`, {
        description: specificError,
        duration: 10000
      });
    }
    
    return false;
  }
};

/**
 * Classify risk with enhanced fallback logic
 */
export const classifyRisk = async (text: string, modelId: string = 'distilbert-base-uncased-finetuned-sst-2-english'): Promise<RiskClassificationResult> => {
  // Ensure model is loaded
  if (!loadedClassifiers[modelId]) {
    const loaded = await loadRiskClassifier(modelId);
    if (!loaded) {
      console.log('Using enhanced fallback risk classification');
      
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
      const baseConfidence = 0.6 + (Math.min(textLength, 20) * 0.01) + (intensityMarkers * 0.05);
      
      if (highRiskScore > 0) {
        return {
          risk: 'High',
          confidence: Math.min(baseConfidence + 0.25 + (highRiskScore * 0.1), 0.95),
          summary: `High-risk content detected: ${highRiskScore} critical indicators found (fallback mode)`
        };
      } else if (threatScore > 1 || (threatScore > 0 && intensityMarkers > 0)) {
        return {
          risk: 'Medium-High',
          confidence: Math.min(baseConfidence + 0.15 + (threatScore * 0.08), 0.9),
          summary: `Multiple threat indicators detected: ${threatScore} threats, ${intensityMarkers} intensity markers (fallback mode)`
        };
      } else if (threatScore > 0 || mediumRiskScore > 1 || (negativeScore > 2 && intensityMarkers > 0)) {
        return {
          risk: 'Medium',
          confidence: Math.min(baseConfidence + 0.05 + (mediumRiskScore * 0.05), 0.8),
          summary: `Moderate risk indicators: ${threatScore} threats, ${mediumRiskScore} concerns, ${negativeScore} negative terms (fallback mode)`
        };
      } else {
        return {
          risk: 'Low',
          confidence: Math.min(baseConfidence, 0.7),
          summary: `No significant risk indicators detected in ${words.length} words (fallback mode)`
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
      summary: `Risk assessment completed: ${label} sentiment (${Math.round(score * 100)}% confidence)`
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
