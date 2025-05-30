
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

    // Call the monitoring-scan edge function for REAL data only
    const { data, error } = await supabase.functions.invoke('monitoring-scan', {
      body: { 
        scanType: 'live_osint',
        fullScan: options.fullScan || true,
        targetEntity: options.targetEntity || null,
        source: options.source || 'manual',
        blockMockData: true,
        enforceLiveOnly: true
      }
    });

    if (error) {
      console.error('❌ Real scan error:', error);
      throw error;
    }

    console.log('✅ Real scan completed:', data);

    // Validate results are live data only
    if (data?.results) {
      const validatedResults = [];
      
      for (const result of data.results) {
        // Validate each result is live data
        const isValidLiveData = await LiveDataEnforcer.validateDataInput(
          result.content || '', 
          result.platform || 'unknown'
        );
        
        if (isValidLiveData) {
          validatedResults.push(result);
        } else {
          console.warn('🚫 BLOCKED: Mock data detected and filtered:', result.platform);
        }
      }

      console.log(`✅ Validated ${validatedResults.length}/${data.results.length} results as live data`);
      return validatedResults;
    }

    return data?.results || [];

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

