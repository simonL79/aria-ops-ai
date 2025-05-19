
import { useState, useEffect, FormEvent } from "react";
import { toast } from "sonner";
import { quickRiskAssessment } from "@/utils/riskProfileUtils";

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

// New interface for the Digital Risk Fingerprint
interface RiskFingerprint {
  clientId: string;
  clientName: string;
  keywords: string[];
  sensitivityScore: number;
  knownThreats: string[];
  pastAttackVectors: string[];
  tonalPreferences: {
    boldness: number;    // 1-10 scale
    empathy: number;     // 1-10 scale
    formality: number;   // 1-10 scale
  };
  responseTiming: 'immediate' | 'measured' | 'delayed';
  riskScore: number;     // 0-100 scale
  lastUpdated: Date;
}

export const useClientChanges = () => {
  const [clientChanges, setClientChanges] = useState<ClientChange[]>([]);
  const [riskFingerprints, setRiskFingerprints] = useState<RiskFingerprint[]>([]);
  const [isUpdatingFingerprint, setIsUpdatingFingerprint] = useState(false);
  
  // Initialize sample risk fingerprints
  useEffect(() => {
    const initialFingerprints: RiskFingerprint[] = [
      {
        clientId: 'client-1',
        clientName: 'Acme Corp',
        keywords: ['quality', 'defect', 'recall', 'overpriced', 'customer service'],
        sensitivityScore: 7,
        knownThreats: ['Product quality complaints', 'Twitter backlash'],
        pastAttackVectors: ['Negative reviews campaign', 'Competitor smear campaign'],
        tonalPreferences: {
          boldness: 8,
          empathy: 6,
          formality: 7
        },
        responseTiming: 'immediate',
        riskScore: 72,
        lastUpdated: new Date()
      },
      {
        clientId: 'client-2',
        clientName: 'LuxeSkin',
        keywords: ['chemical burn', 'allergy', 'ingredients', 'reaction', 'toxic', 'recall'],
        sensitivityScore: 9,
        knownThreats: ['Product safety concerns', 'Ingredient transparency'],
        pastAttackVectors: ['Viral Reddit posts', 'Influencer exposés'],
        tonalPreferences: {
          boldness: 3,
          empathy: 9,
          formality: 8
        },
        responseTiming: 'measured',
        riskScore: 81,
        lastUpdated: new Date()
      }
    ];
    
    setRiskFingerprints(initialFingerprints);
  }, []);
  
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
        const randomClientName = clientNames[Math.floor(Math.random() * clientNames.length)];
        
        // Check if this change matches any risk fingerprint keywords
        let finalSeverity = randomSeverity;
        let matchedFingerprint = riskFingerprints.find(fp => fp.clientName === randomClientName);
        
        if (matchedFingerprint) {
          // Use quick risk assessment against the fingerprint
          const description = descriptions[randomIndex];
          const assessment = quickRiskAssessment(description, matchedFingerprint.keywords);
          
          if (assessment.matchedKeywords.length > 0) {
            // Increase severity based on risk assessment
            finalSeverity = assessment.riskLevel === 'high' ? 9 : 
                           assessment.riskLevel === 'medium' ? 7 : 
                           randomSeverity;
                           
            // Update the risk score for the fingerprint based on severity
            updateRiskFingerprint(matchedFingerprint.clientId, {
              riskScore: Math.min(100, matchedFingerprint.riskScore + (finalSeverity - 5) * 2),
              lastUpdated: new Date()
            });
          }
        }
        
        const newChange: ClientChange = {
          id: `change-${Date.now()}`,
          clientName: randomClientName,
          changeType: changeTypes[Math.floor(Math.random() * changeTypes.length)],
          description: descriptions[randomIndex],
          timestamp: new Date(),
          severity: finalSeverity,
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          read: false
        };
        
        // For the LuxeSkin example (high severity)
        if (descriptions[randomIndex].includes('LuxeSkin')) {
          newChange.severity = 9;
          newChange.platform = 'Reddit';
          newChange.clientName = 'LuxeSkin';
          
          // Update risk fingerprint based on this new threat
          if (matchedFingerprint && matchedFingerprint.clientName === 'LuxeSkin') {
            updateRiskFingerprint(matchedFingerprint.clientId, {
              riskScore: Math.min(100, matchedFingerprint.riskScore + 5),
              lastUpdated: new Date()
            });
          }
        }
        
        setClientChanges(prev => [newChange, ...prev].slice(0, 10)); // Keep only latest 10 changes
      }
    }, 45000); // Check every 45 seconds
    
    return () => clearInterval(interval);
  }, [riskFingerprints]);
  
  // Function to update a risk fingerprint
  const updateRiskFingerprint = (clientId: string, updates: Partial<RiskFingerprint>) => {
    setRiskFingerprints(prev => 
      prev.map(fp => 
        fp.clientId === clientId 
          ? { ...fp, ...updates } 
          : fp
      )
    );
  };
  
  // Add a new keyword to a client's fingerprint
  const addKeywordToFingerprint = (clientId: string, keyword: string) => {
    setRiskFingerprints(prev => 
      prev.map(fp => 
        fp.clientId === clientId 
          ? { ...fp, keywords: [...fp.keywords, keyword], lastUpdated: new Date() } 
          : fp
      )
    );
    
    toast.success("Keyword added to risk profile", {
      description: `"${keyword}" added to client's sensitivity list`
    });
  };
  
  // Add a known threat to a client's fingerprint
  const addKnownThreat = (clientId: string, threat: string) => {
    setRiskFingerprints(prev => 
      prev.map(fp => 
        fp.clientId === clientId 
          ? { ...fp, knownThreats: [...fp.knownThreats, threat], lastUpdated: new Date() } 
          : fp
      )
    );
    
    toast.success("Threat vector recorded", {
      description: `New threat pattern added to client's risk profile`
    });
  };
  
  // Update tonal preferences
  const updateTonalPreferences = (clientId: string, updates: Partial<RiskFingerprint['tonalPreferences']>) => {
    setRiskFingerprints(prev => 
      prev.map(fp => 
        fp.clientId === clientId 
          ? { 
              ...fp, 
              tonalPreferences: { ...fp.tonalPreferences, ...updates },
              lastUpdated: new Date() 
            } 
          : fp
      )
    );
    
    toast.success("Tonal preferences updated", {
      description: `Response tone calibration complete`
    });
  };
  
  // Create a new risk fingerprint for a client
  const createRiskFingerprint = (
    clientName: string, 
    initialKeywords: string[] = [],
    initialThreats: string[] = []
  ) => {
    const newFingerprint: RiskFingerprint = {
      clientId: `client-${Date.now()}`,
      clientName,
      keywords: initialKeywords,
      sensitivityScore: 5, // Default middle value
      knownThreats: initialThreats,
      pastAttackVectors: [],
      tonalPreferences: {
        boldness: 5,
        empathy: 5,
        formality: 5
      },
      responseTiming: 'measured',
      riskScore: 50, // Default middle value
      lastUpdated: new Date()
    };
    
    setRiskFingerprints(prev => [...prev, newFingerprint]);
    
    toast.success("Risk Fingerprint™ created", {
      description: `Digital Risk Profile initialized for ${clientName}`
    });
    
    return newFingerprint.clientId;
  };
  
  // Handle form submission to update a fingerprint (fixing the TS error here)
  const handleFingerprintFormSubmit = (e: FormEvent<Element>, updates: Partial<RiskFingerprint>, clientId: string) => {
    e.preventDefault();
    setIsUpdatingFingerprint(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      updateRiskFingerprint(clientId, updates);
      setIsUpdatingFingerprint(false);
      
      toast.success("Risk Fingerprint™ updated", {
        description: "Client risk profile has been recalibrated"
      });
    }, 800);
  };
  
  // Mark a client change as read
  const markClientChangeAsRead = (changeId: string) => {
    setClientChanges(prev => 
      prev.map(change => 
        change.id === changeId ? { ...change, read: true } : change
      )
    );
  };
  
  return {
    clientChanges,
    riskFingerprints,
    isUpdatingFingerprint,
    updateRiskFingerprint,
    addKeywordToFingerprint,
    addKnownThreat,
    updateTonalPreferences,
    createRiskFingerprint,
    handleFingerprintFormSubmit,
    markClientChangeAsRead
  };
};
