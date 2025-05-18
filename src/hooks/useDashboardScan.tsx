
import { useState } from "react";
import { toast } from "sonner";

export const useDashboardScan = (
  alerts: any[],
  setAlerts: (alerts: any[]) => void,
  setFilteredAlerts: (alerts: any[]) => void, 
  setNegativeContent: (value: number) => void
) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulate finding new content
      const newAlerts = [...alerts];
      
      // 50% chance to find new content
      if (Math.random() > 0.5) {
        const platforms = ['Twitter', 'Facebook', 'Reddit', 'Yelp', 'Instagram'];
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
        const randomSeverity = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low';
        
        newAlerts.unshift({
          id: `new-${Date.now()}`,
          platform: randomPlatform,
          content: `New ${randomSeverity === 'high' ? 'negative' : randomSeverity === 'medium' ? 'mixed' : 'positive'} mention found during the latest scan.`,
          date: 'Just now',
          severity: randomSeverity,
          status: 'new'
        });
        
        setAlerts(newAlerts);
        setFilteredAlerts(newAlerts);
        setNegativeContent(prev => prev + (randomSeverity === 'high' ? 1 : 0));
        
        toast.success("Scan completed", {
          description: `Found new content on ${randomPlatform}.`,
        });
      } else {
        toast.success("Scan completed", {
          description: "No new mentions found across monitored platforms.",
        });
      }
    }, 2000);
  };

  return {
    isScanning,
    handleScan
  };
};
