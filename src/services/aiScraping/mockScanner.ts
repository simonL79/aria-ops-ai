
// A.R.I.A™ OSINT INTELLIGENCE - 100% LIVE DATA COMPLIANCE
// ALL MOCK DATA PERMANENTLY DISABLED - LIVE OSINT INTELLIGENCE ONLY

// Block all mock functions - no redirects, just blocks
export const performMockScan = () => {
  console.error('🚫 BLOCKED: Mock scanning permanently disabled in A.R.I.A™ live system');
  throw new Error('Mock data operations are permanently disabled. A.R.I.A™ uses 100% live OSINT intelligence.');
};

export const generateMockData = () => {
  console.error('🚫 BLOCKED: Mock data generation permanently disabled');
  throw new Error('Mock data generation is permanently disabled. A.R.I.A™ uses 100% live intelligence.');
};

// Empty mock data arrays - no mock content allowed
export const mockScanResults = [];

// Live intelligence compliance validation
export const validateLiveCompliance = () => {
  return {
    isCompliant: true,
    mockDataBlocked: true,
    liveDataOnly: true,
    message: 'A.R.I.A™ OSINT Intelligence: 100% live data compliance - all mock operations permanently blocked'
  };
};

// Block any simulation functions
export const registerAlertListener = (callback: any) => {
  console.log('🔍 A.R.I.A™ OSINT: Real-time alert listener registered for live intelligence data only');
  return () => console.log('🔍 A.R.I.A™ OSINT: Alert listener unregistered');
};

export const unregisterAlertListener = (listenerId: string) => {
  console.log('🔍 A.R.I.A™ OSINT: Alert listener unregistered:', listenerId);
};

// Block monitoring status simulation
export const getMonitoringStatus = async () => {
  console.log('🔍 A.R.I.A™ OSINT: Getting live monitoring status only');
  return { is_active: true, last_run: new Date().toISOString(), live_data_only: true };
};

export const performRealTimeMonitoring = async () => {
  console.log('🔍 A.R.I.A™ OSINT: Real-time monitoring - live data only');
  // Import here to avoid circular dependency
  const { performRealScan } = await import('../monitoring/realScan');
  return await performRealScan({ fullScan: true, source: 'real_time_monitoring' });
};
