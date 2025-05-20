
import { useState, useEffect, useCallback } from 'react';
import { ContentAlert } from '@/types/dashboard';

/**
 * Custom hook for handling scanning logic in monitoring dashboards
 */
const useScanningLogic = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ContentAlert[]>([]);
  const [scanDate, setScanDate] = useState<Date | null>(null);
  const [scanConfig, setScanConfig] = useState({
    depth: 'standard',
    platforms: ['all'],
    timeframe: '7d'
  });

  // Simulate scanning process
  const performScan = useCallback(async () => {
    setIsScanning(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate mock results
    const mockResults: ContentAlert[] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
      id: `result-${Date.now()}-${i}`,
      platform: ['Twitter', 'Reddit', 'News Sites', 'Facebook'][Math.floor(Math.random() * 4)],
      content: `Sample monitoring result #${i + 1} with some context about the brand mention.`,
      date: new Date().toISOString().split('T')[0],
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      status: 'new',
      url: `https://example.com/result-${i}`,
      threatType: ['Reputation Risk', 'Customer Service', 'Product Issue'][Math.floor(Math.random() * 3)]
    }));
    
    // Update results
    setScanResults(prevResults => {
      // Ensure we're adding proper ContentAlert objects and not arrays
      return [...mockResults, ...prevResults];
    });
    
    setScanDate(new Date());
    setIsScanning(false);
    
    // Return high severity count for notifications
    const highSeverityCount = mockResults.filter(result => result.severity === 'high').length;
    return { totalResults: mockResults.length, highSeverity: highSeverityCount };
  }, [scanConfig]);
  
  // Auto-scan effect on initial load
  useEffect(() => {
    const initialScan = async () => {
      // Wait a bit before initial scan to let UI render
      await new Promise(resolve => setTimeout(resolve, 1000));
      await performScan();
    };
    
    initialScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array means run once on mount
  
  // Update scan configuration
  const updateScanConfig = useCallback((newConfig: Partial<typeof scanConfig>) => {
    setScanConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  return {
    isScanning,
    scanResults,
    scanDate,
    scanConfig,
    performScan,
    updateScanConfig
  };
};

export default useScanningLogic;
