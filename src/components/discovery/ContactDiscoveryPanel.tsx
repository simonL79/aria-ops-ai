
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Search, Mail, Linkedin, ExternalLink, Phone } from "lucide-react";
import { DiscoveredThreat } from '@/hooks/useDiscoveryScanning';
import { toast } from 'sonner';

interface ContactDiscoveryPanelProps {
  threats: DiscoveredThreat[];
}

interface DiscoveredContact {
  id: string;
  entityName: string;
  contactType: 'pr_firm' | 'agent' | 'manager' | 'legal' | 'direct';
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
  phone?: string;
  company: string;
  confidenceScore: number;
  source: string;
}

const ContactDiscoveryPanel = ({ threats }: ContactDiscoveryPanelProps) => {
  const [discoveredContacts, setDiscoveredContacts] = useState<DiscoveredContact[]>([]);
  const [searchingContacts, setSearchingContacts] = useState<Set<string>>(new Set());
  const [bulkSearching, setBulkSearching] = useState(false);

  const discoverContactsForThreat = async (threat: DiscoveredThreat) => {
    setSearchingContacts(prev => new Set(prev).add(threat.id));
    
    try {
      const response = await fetch('/functions/v1/contact-discovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entity_name: threat.entityName,
          entity_type: threat.entityType,
          threat_id: threat.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to discover contacts');
      }

      const result = await response.json();
      
      if (result.contacts && result.contacts.length > 0) {
        const newContacts: DiscoveredContact[] = result.contacts.map((contact: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          entityName: threat.entityName,
          contactType: contact.type || 'direct',
          name: contact.name || 'Unknown',
          title: contact.title || '',
          email: contact.email,
          linkedin: contact.linkedin,
          phone: contact.phone,
          company: contact.company || '',
          confidenceScore: contact.confidence || 75,
          source: contact.source || 'web_search'
        }));

        setDiscoveredContacts(prev => [...prev, ...newContacts]);
        toast.success(`Found ${newContacts.length} contacts for ${threat.entityName}`);
      } else {
        toast.info(`No contacts found for ${threat.entityName}`);
      }
      
    } catch (error) {
      console.error('Error discovering contacts:', error);
      toast.error("Failed to discover contacts");
    } finally {
      setSearchingContacts(prev => {
        const newSet = new Set(prev);
        newSet.delete(threat.id);
        return newSet;
      });
    }
  };

  const runBulkContactDiscovery = async () => {
    setBulkSearching(true);
    
    try {
      const highPriorityThreats = threats.filter(t => t.threatLevel >= 6);
      
      for (const threat of highPriorityThreats) {
        await discoverContactsForThreat(threat);
        // Add delay to avoid overwhelming services
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast.success("Bulk contact discovery completed!");
      
    } catch (error) {
      console.error('Error in bulk contact discovery:', error);
      toast.error("Bulk contact discovery failed");
    } finally {
      setBulkSearching(false);
    }
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'pr_firm':
        return <Users className="h-4 w-4" />;
      case 'agent':
        return <User className="h-4 w-4" />;
      case 'legal':
        return <Scale className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'pr_firm':
        return 'bg-blue-600';
      case 'agent':
        return 'bg-green-600';
      case 'legal':
        return 'bg-red-600';
      case 'manager':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const highPriorityThreats = threats.filter(t => t.threatLevel >= 6);

  return (
    <div className="space-y-6">
      {/* Contact Discovery Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contact Discovery Engine
          </CardTitle>
          <CardDescription>
            Automated detection of PR firms, agents, managers, and legal contacts for threat entities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Discovery Methods:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>• Official website crawling</div>
                <div>• "Contact Us" & "Press" page analysis</div>
                <div>• Email pattern detection</div>
                <div>• LinkedIn profile matching</div>
                <div>• Hunter.io API integration</div>
                <div>• Footer/header contact extraction</div>
              </div>
            </div>
            
            <Button 
              onClick={runBulkContactDiscovery}
              disabled={bulkSearching || highPriorityThreats.length === 0}
              size="lg"
              className="w-full"
            >
              <Search className="mr-2 h-4 w-4" />
              {bulkSearching ? "Discovering Contacts..." : `Discover Contacts for ${highPriorityThreats.length} High Priority Threats`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Threat Contact Discovery */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Contact Discovery</CardTitle>
          <CardDescription>
            Discover contacts for specific threats requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highPriorityThreats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No high priority threats requiring contact discovery at this time.
              </div>
            ) : (
              highPriorityThreats.map((threat) => (
                <div key={threat.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{threat.entityName}</h4>
                        <Badge variant="outline">{threat.entityType}</Badge>
                        <Badge className={threat.threatLevel >= 8 ? 'bg-red-600' : 'bg-orange-500'}>
                          Level {threat.threatLevel}/10
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {threat.contextSnippet}
                      </p>
                    </div>
                    
                    <Button 
                      size="sm"
                      onClick={() => discoverContactsForThreat(threat)}
                      disabled={searchingContacts.has(threat.id)}
                    >
                      {searchingContacts.has(threat.id) ? (
                        "Searching..."
                      ) : (
                        <>
                          <Search className="mr-1 h-3 w-3" />
                          Find Contacts
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Discovered Contacts */}
      {discoveredContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Discovered Contacts ({discoveredContacts.length})</CardTitle>
            <CardDescription>
              Verified contact information for direct outreach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discoveredContacts.map((contact) => (
                <div key={contact.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{contact.name}</h4>
                        <Badge className={getContactTypeColor(contact.contactType)}>
                          {contact.contactType.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {contact.confidenceScore}% confidence
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {contact.title} at {contact.company}
                      </p>
                      
                      <p className="text-sm font-medium mb-2">
                        Entity: {contact.entityName}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                              {contact.email}
                            </a>
                          </div>
                        )}
                        
                        {contact.linkedin && (
                          <div className="flex items-center gap-1">
                            <Linkedin className="h-3 w-3" />
                            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              LinkedIn
                            </a>
                          </div>
                        )}
                        
                        {contact.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm">
                        Start Outreach
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactDiscoveryPanel;
