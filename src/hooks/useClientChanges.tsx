
import { useState, useEffect } from "react";

interface ClientChange {
  id: string;
  clientName: string;
  changeType: string;
  description: string;
  timestamp: Date;
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
        timestamp: new Date()
      }
    ];
    
    setClientChanges(initialChanges);
    
    // Simulate new changes coming in periodically
    const interval = setInterval(() => {
      // Only add new changes sometimes (low probability to avoid overwhelming the user)
      if (Math.random() > 0.85) {
        const clientNames = ['TechGiant Inc', 'Global Foods', 'Quantum Services', 'Atlas Healthcare', 'Pioneer Media'];
        const changeTypes = ['New Mention', 'Reputation Score Change', 'Threat Detected', 'Profile Updated', 'SERP Position Change'];
        
        const descriptions = [
          'New negative review posted on Trustpilot mentioning quality issues.',
          'Reputation score increased by 5 points after successful response campaign.',
          'Potential coordinated attack detected from competitor-affiliated accounts.',
          'Client updated their brand messaging and key terms.',
          'Dropped 3 positions in search results for key term "industry solutions".'
        ];
        
        const newChange: ClientChange = {
          id: `change-${Date.now()}`,
          clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
          changeType: changeTypes[Math.floor(Math.random() * changeTypes.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          timestamp: new Date()
        };
        
        setClientChanges(prev => [newChange, ...prev].slice(0, 10)); // Keep only latest 10 changes
      }
    }, 45000); // Check every 45 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return clientChanges;
};
