
import { useState, useEffect } from 'react';
import { ContentAlert } from "@/types/dashboard";
import { startContinuousScan, performLiveScan } from '@/services/aiScraping/mockScanner';
import { toast } from "sonner";

export const useScanningLogic = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isInitialScan, setIsInitialScan] = useState<boolean>(true);
  const [scanResults, setScanResults] = useState<ContentAlert[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [metrics, setMetrics] = useState({
    scansToday: 0,
    alertsDetected: 0,
    highPriorityAlerts: 0
  });
  
  useEffect(() => {
    // Start with a one-time scan when component mounts
    if (isInitialScan) {
      setIsScanning(true);
      performLiveScan().then(alerts => {
        setScanResults(prevResults => [...alerts, ...prevResults]);
        
        // Update metrics
        setMetrics(prev => ({
          scansToday: prev.scansToday + 1,
          alertsDetected: prev.alertsDetected + alerts.length,
          highPriorityAlerts: prev.highPriorityAlerts + alerts.filter(a => a.severity === 'high').length
        }));
        
        setIsScanning(false);
        setIsInitialScan(false);
      }).catch(() => {
        setIsScanning(false);
        setIsInitialScan(false);
      });
    }
    
    let stopScanning: (() => void) | null = null;
    
    if (isActive) {
      toast.info("Real-time monitoring activated", {
        description: "ARIA is now actively monitoring for new mentions and alerts"
      });
      
      // Set up continuous scanning
      stopScanning = startContinuousScan((newAlert) => {
        // Fix: Use a properly typed state update that doesn't mix types
        setScanResults(prevResults => {
          const updatedResults = [newAlert, ...prevResults];
          return updatedResults.slice(0, 30); // Keep top 30
        });
        
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          alertsDetected: prev.alertsDetected + 1,
          highPriorityAlerts: prev.highPriorityAlerts + (newAlert.severity === 'high' ? 1 : 0)
        }));
      });
    }
    
    // Clean up the scanning when component unmounts or when isActive changes
    return () => {
      if (stopScanning) {
        stopScanning();
      }
    };
  }, [isActive, isInitialScan]);
  
  const handleToggleScan = () => {
    setIsActive(prev => !prev);
  };
  
  const handleManualScan = async () => {
    setIsScanning(true);
    try {
      const newAlerts = await performLiveScan();
      // Fix: Use a properly typed state update
      setScanResults(prevResults => [...newAlerts, ...prevResults]);
      
      // Update metrics
      setMetrics(prev => ({
        scansToday: prev.scansToday + 1,
        alertsDetected: prev.alertsDetected + newAlerts.length,
        highPriorityAlerts: prev.highPriorityAlerts + newAlerts.filter(a => a.severity === 'high').length
      }));
    } catch (error) {
      console.error("Manual scan error:", error);
    } finally {
      setIsScanning(false);
    }
  };
  
  return {
    isActive,
    setIsActive,
    scanResults,
    isScanning,
    metrics,
    handleToggleScan,
    handleManualScan
  };
};

export default useScanningLogic;
