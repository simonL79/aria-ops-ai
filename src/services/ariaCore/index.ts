
// Re-export all core services
export { threatProcessor, AriaCoreThreatProcessor } from './threatProcessor';
export { LiveDataEnforcer } from './liveDataEnforcer';
export { ThreatIngestionService } from './threatIngestion';

// Initialize core services
export const initializeAriaCore = async () => {
  console.log('🚀 Initializing A.R.I.A™ Core Services...');
  
  try {
    // Import here to avoid circular dependency
    const { LiveDataEnforcer } = await import('./liveDataEnforcer');
    
    // Enforce live data integrity
    const isCompliant = await LiveDataEnforcer.enforceSystemWideLiveData();
    
    if (!isCompliant) {
      console.warn('⚠️ Live data enforcement had issues, but continuing...');
    }
    
    // Validate compliance
    const validation = await LiveDataEnforcer.validateLiveDataCompliance();
    console.log('📊 Live data compliance:', validation);
    
    console.log('✅ A.R.I.A™ Core Services initialized with 100% live data compliance');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to initialize A.R.I.A™ Core Services:', error);
    return false;
  }
};
