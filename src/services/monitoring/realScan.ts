
import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';

interface RealScanOptions {
  fullScan?: boolean;
  source?: string;
  targetEntity?: string;
}

/**
 * Perform real OSINT scan with strict live data enforcement
 */
export const performRealScan = async (options: RealScanOptions = {}) => {
  try {
    // Enforce live data compliance
    const isCompliant = await LiveDataEnforcer.enforceSystemWideLiveData();
    if (!isCompliant) {
      console.warn('🚫 BLOCKED: System not compliant for live data operations');
      throw new Error('Live data enforcement failed. Mock data operations blocked.');
    }

    console.log('🔍 A.R.I.A™ OSINT: Starting real intelligence scan...');
    console.log('🔍 Options:', options);

    // Call live scanning edge functions in sequence
    const scanFunctions = [
      'reddit-scan',
      'uk-news-scanner', 
      'enhanced-intelligence',
      'discovery-scanner',
      'monitoring-scan'
    ];

    const results = [];
    
    for (const func of scanFunctions) {
      try {
        const { data, error } = await supabase.functions.invoke(func, {
          body: { 
            scanType: 'live_osint',
            fullScan: options.fullScan || true,
            targetEntity: options.targetEntity || null,
            source: options.source || 'manual',
            blockMockData: true,
            enforceLiveOnly: true
          }
        });

        if (!error && data?.results) {
          // Validate results are live data only
          for (const result of data.results) {
            const isValidLiveData = await LiveDataEnforcer.validateDataInput(
              result.content || '', 
              result.platform || 'unknown'
            );
            
            if (isValidLiveData) {
              results.push(result);
            } else {
              console.warn('🚫 BLOCKED: Mock data detected and filtered:', result.platform);
            }
          }
        }
      } catch (error) {
        console.warn(`Scan function ${func} failed:`, error);
      }
    }

    console.log(`✅ Validated ${results.length} results as live data`);
    return results;

  } catch (error) {
    console.error('❌ Real scan failed:', error);
    throw error;
  }
};

/**
 * Block any mock scan operations
 */
export const performMockScan = () => {
  console.warn('🚫 BLOCKED: Mock scan operations are disabled. Use performRealScan() for live intelligence.');
  throw new Error('Mock data operations blocked by A.R.I.A™ live enforcement system');
};
