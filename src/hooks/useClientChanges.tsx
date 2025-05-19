
import { useState, useEffect } from "react";

interface ClientChange {
  id: string;
  clientName: string;
  changeType: string;
  description: string;
  timestamp: Date;
  severity?: number;
  platform?: string;
  read: boolean;  // Making this required, not optional
}

export const useClientChanges = () => {
  const [clientChanges, setClientChanges] = useState<ClientChange[]>([]);
  
  // Simulate detecting client changes - in production this would connect to your actual client data
  useEffect(() => {
    // Initial sample data
    const initialChanges: ClientChange[] = [
      {
        id: 'change-1',
        clientName: 'Acme Corp',
        changeType: 'Reputation Score Change',
        description: 'Reputation score decreased by 7 points in the last 24 hours due to negative mentions on Twitter.',
        timestamp: new Date(),
        severity: 6,
        platform: 'Twitter',
        read: false  // Initialize with false
      }
    ];
    
    setClientChanges(initialChanges);
    
    // Simulate new changes coming in periodically
    const interval = setInterval(() => {
      // Only add new changes sometimes (low probability to avoid overwhelming the user)
      if (Math.random() > 0.85) {
        const clientNames = ['TechGiant Inc', 'Global Foods', 'Quantum Services', 'Atlas Healthcare', 'Pioneer Media', 'LuxeSkin'];
        const changeTypes = ['New Mention', 'Reputation Score Change', 'Threat Detected', 'Profile Updated', 'SERP Position Change'];
        
        const descriptions = [
          'New negative review posted on Trustpilot mentioning quality issues.',
          'Reputation score increased by 5 points after successful response campaign.',
          'Potential coordinated attack detected from competitor-affiliated accounts.',
          'Client updated their brand messaging and key terms.',
          'Dropped 3 positions in search results for key term "industry solutions".',
          'Reddit post gaining traction: "LuxeSkin eye cream gave me chemical burns" (3.2K upvotes in 6 hours)'
        ];
        
        const platforms = ['Twitter', 'Facebook', 'Reddit', 'Trustpilot', 'Google', 'News Media'];
        const severities = [3, 4, 6, 7, 8, 9];
        
        const randomIndex = Math.floor(Math.random() * descriptions.length);
        const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
        
        const newChange: ClientChange = {
          id: `change-${Date.now()}`,
          clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
          changeType: changeTypes[Math.floor(Math.random() * changeTypes.length)],
          description: descriptions[randomIndex],
          timestamp: new Date(),
          severity: randomSeverity,
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          read: false
        };
        
        // For the LuxeSkin example (high severity)
        if (descriptions[randomIndex].includes('LuxeSkin')) {
          newChange.severity = 9;
          newChange.platform = 'Reddit';
        }
        
        setClientChanges(prev => [newChange, ...prev].slice(0, 10)); // Keep only latest 10 changes
      }
    }, 45000); // Check every 45 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return clientChanges;
};
