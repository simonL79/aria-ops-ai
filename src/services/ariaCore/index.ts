
// A.R.I.A™ Core Services - Live Data Enforcement and System Compliance

export { LiveDataEnforcer, type LiveDataCompliance } from './liveDataEnforcer';
export { ARIASystemAudit, executeSystemAudit, type SystemAuditResult, type ComprehensiveAuditReport } from './systemAudit';

/**
 * Initialize A.R.I.A™ Core Services with mandatory live data compliance
 */
export const initializeARIACore = async (): Promise<void> => {
  console.log('🚀 Initializing A.R.I.A™ Core Services...');
  
  try {
    // Validate live data compliance
    const { LiveDataEnforcer } = await import('./liveDataEnforcer');
    const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
    
    if (!compliance.isCompliant) {
      throw new Error(`A.R.I.A™ Core initialization failed: ${compliance.message}`);
    }
    
    console.log('✅ A.R.I.A™ Core Services initialized with 100% live data compliance');
    
  } catch (error) {
    console.error('❌ A.R.I.A™ Core initialization failed:', error);
    throw error;
  }
};
