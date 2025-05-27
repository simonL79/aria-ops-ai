
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Search, Users, Mail, Phone, ExternalLink, Building, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { DiscoveredThreat } from '@/hooks/useDiscoveryScanning';

interface ContactDiscoveryPanelProps {
  threats: DiscoveredThreat[];
}

interface DiscoveredContact {
  id: string;
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
  phone?: string;
  company: string;
  type: 'pr_firm' | 'agent' | 'manager' | 'legal' | 'direct';
  confidence: number;
  source: string;
  entityName: string;
  threatId: string;
}

const ContactDiscoveryPanel = ({ threats }: ContactDiscoveryPanelProps) => {
  const [discoveredContacts, setDiscoveredContacts] = useState<DiscoveredContact[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryProgress, setDiscoveryProgress] = useState(0);
  const [selectedThreat, setSelectedThreat] = useState<string>('');

  const runContactDiscovery = async (threatId?: string) => {
    setIsDiscovering(true);
    setDiscoveryProgress(0);
    
    const threatsToProcess = threatId ? threats.filter(t => t.id === threatId) : threats;
    
    toast.info(`Starting contact discovery for ${threatsToProcess.length} entities...`);

    try {
      for (let i = 0; i < threatsToProcess.length; i++) {
        const threat = threatsToProcess[i];
        
        // Call contact discovery function
        const response = await fetch('/functions/v1/contact-discovery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity_name: threat.entityName,
            entity_type: threat.entityType,
            threat_id: threat.id
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.contacts && data.contacts.length > 0) {
            const newContacts: DiscoveredContact[] = data.contacts.map((contact: any) => ({
              id: Math.random().toString(36).substr(2, 9),
              name: contact.name,
              title: contact.title,
              email: contact.email,
              linkedin: contact.linkedin,
              phone: contact.phone,
              company: contact.company,
              type: contact.type,
              confidence: contact.confidence,
              source: contact.source,
              entityName: threat.entityName,
              threatId: threat.id
            }));

            setDiscoveredContacts(prev => [...prev, ...newContacts]);
            toast.success(`Found ${newContacts.length} contacts for ${threat.entityName}`);
          }
        }

        setDiscoveryProgress(((i + 1) / threatsToProcess.length) * 100);
        
        // Simulate discovery delay
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      toast.success("Contact discovery completed!");
    } catch (error) {
      console.error('Error during contact discovery:', error);
      toast.error("Contact discovery encountered an error");
    } finally {
      setIsDiscovering(false);
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'pr_firm': return 'bg-purple-100 text-purple-800';
      case 'agent': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'legal': return 'bg-red-100 text-red-800';
      case 'direct': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'pr_firm': return Users;
      case 'agent': return Users;
      case 'manager': return Users;
      case 'legal': return Building;
      case 'direct': return Mail;
      default: return Users;
    }
  };

  const highPriorityThreats = threats.filter(t => t.threatLevel >= 7);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Contact Discovery Engine
          </CardTitle>
          <CardDescription>
            Automatically discover PR firms, agents, managers, and legal contacts for entities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Discovery Progress */}
            {isDiscovering && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Discovering contacts...</span>
                  <span>{Math.round(discoveryProgress)}%</span>
                </div>
                <Progress value={discoveryProgress} className="w-full" />
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={() => runContactDiscovery()}
                disabled={isDiscovering || threats.length === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Search className="mr-2 h-4 w-4" />
                {isDiscovering ? "Discovering..." : "Discover All Contacts"}
              </Button>

              <div className="flex items-center gap-2">
                <Label htmlFor="threat-select">Or select specific threat:</Label>
                <select
                  id="threat-select"
                  value={selectedThreat}
                  onChange={(e) => setSelectedThreat(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                  disabled={isDiscovering}
                >
                  <option value="">Select threat...</option>
                  {threats.map(threat => (
                    <option key={threat.id} value={threat.id}>
                      {threat.entityName} ({threat.platform})
                    </option>
                  ))}
                </select>
                {selectedThreat && (
                  <Button
                    onClick={() => runContactDiscovery(selectedThreat)}
                    disabled={isDiscovering}
                    variant="outline"
                  >
                    Discover
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Threats */}
      {highPriorityThreats.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">High Priority Contact Discovery</CardTitle>
            <CardDescription>
              Urgent threats requiring immediate contact outreach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highPriorityThreats.map(threat => (
                <div key={threat.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <span className="font-medium">{threat.entityName}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      Threat Level: {threat.threatLevel}/10 on {threat.platform}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => runContactDiscovery(threat.id)}
                    disabled={isDiscovering}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Priority Discovery
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discovered Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Discovered Contacts ({discoveredContacts.length})</CardTitle>
          <CardDescription>
            Verified contact information for direct outreach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {discoveredContacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No contacts discovered yet. Start contact discovery to find PR, legal, and management contacts.
              </div>
            ) : (
              discoveredContacts.map((contact) => {
                const TypeIcon = getContactTypeIcon(contact.type);
                return (
                  <div key={contact.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <TypeIcon className="h-5 w-5 text-gray-500" />
                          <h4 className="font-medium">{contact.name}</h4>
                          <Badge className={getContactTypeColor(contact.type)}>
                            {contact.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {contact.confidence}% confidence
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {contact.title} at {contact.company}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          {contact.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                          )}
                          {contact.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </span>
                          )}
                          {contact.linkedin && (
                            <a 
                              href={contact.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              LinkedIn
                            </a>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span>Entity: {contact.entityName}</span>
                          <span>Source: {contact.source}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Mail className="mr-1 h-3 w-3" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactDiscoveryPanel;
