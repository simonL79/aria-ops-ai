
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Building, User, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { fetchClients, addClient } from '@/services/clientsService';
import type { Client } from '@/types/clients';

interface ClientEntity {
  id: string;
  entity_name: string;
  entity_type: string;
  alias?: string;
}

interface ClientSelectorProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client | null) => void;
  onEntitiesLoad: (entities: ClientEntity[]) => void;
}

const ClientSelector = ({ selectedClient, onClientSelect, onEntitiesLoad }: ClientSelectorProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('none');

  // Add client form state
  const [newClient, setNewClient] = useState({
    name: '',
    industry: 'Technology',
    contactName: '',
    contactEmail: '',
    website: '',
    notes: '',
    keywordTargets: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setSelectedClientId(selectedClient.id);
    } else {
      setSelectedClientId('none');
    }
  }, [selectedClient]);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const fetchedClients = await fetchClients();
      setClients(fetchedClients);
    } catch (error) {
      console.error('Failed to load clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    console.log('Client selected:', clientId);
    setSelectedClientId(clientId);
    
    if (clientId === 'none') {
      onClientSelect(null);
      onEntitiesLoad([]);
      return;
    }

    const client = clients.find(c => c.id === clientId);
    if (client) {
      onClientSelect(client);
      
      // Mock entities for now - in real implementation, fetch from client_entities table
      const mockEntities: ClientEntity[] = [
        {
          id: '1',
          entity_name: client.name,
          entity_type: 'organization'
        }
      ];
      onEntitiesLoad(mockEntities);
      
      toast.success(`Selected client: ${client.name}`);
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.contactEmail) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const addedClient = await addClient(newClient);
      if (addedClient) {
        setClients([...clients, addedClient]);
        setNewClient({
          name: '',
          industry: 'Technology',
          contactName: '',
          contactEmail: '',
          website: '',
          notes: '',
          keywordTargets: ''
        });
        setShowAddForm(false);
        toast.success('Client added successfully');
      }
    } catch (error) {
      console.error('Failed to add client:', error);
      toast.error('Failed to add client');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-corporate-accent" />
            Loading Clients...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-corporate-darkSecondary border-corporate-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-corporate-accent" />
          Client Selection & Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client Selection */}
        <div className="space-y-2">
          <Label className="text-corporate-lightGray">Select Active Client</Label>
          <div className="flex gap-2">
            <Select value={selectedClientId} onValueChange={handleClientSelect}>
              <SelectTrigger className="flex-1 bg-corporate-dark border-corporate-border text-white">
                <SelectValue placeholder="Choose a client..." />
              </SelectTrigger>
              <SelectContent className="bg-corporate-dark border-corporate-border">
                <SelectItem 
                  value="none" 
                  className="text-corporate-lightGray hover:bg-corporate-darkSecondary"
                >
                  No client selected
                </SelectItem>
                {filteredClients.map((client) => (
                  <SelectItem 
                    key={client.id} 
                    value={client.id}
                    className="text-white hover:bg-corporate-darkSecondary"
                  >
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-corporate-accent" />
                      <span>{client.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {client.industry}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-corporate-lightGray" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-corporate-dark border-corporate-border text-white placeholder:text-corporate-lightGray"
          />
        </div>

        {/* Selected Client Details */}
        {selectedClient && (
          <div className="bg-corporate-dark rounded p-4 border border-corporate-border">
            <h3 className="text-white font-medium mb-2 flex items-center gap-2">
              <Building className="h-4 w-4 text-corporate-accent" />
              {selectedClient.name}
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-corporate-lightGray">
                <User className="h-3 w-3" />
                <span>{selectedClient.contactName}</span>
              </div>
              <div className="flex items-center gap-2 text-corporate-lightGray">
                <Mail className="h-3 w-3" />
                <span>{selectedClient.contactEmail}</span>
              </div>
              <Badge className="bg-corporate-accent/20 text-corporate-accent">
                {selectedClient.industry}
              </Badge>
            </div>
          </div>
        )}

        {/* Add Client Form */}
        {showAddForm && (
          <div className="bg-corporate-dark rounded p-4 border border-corporate-border space-y-3">
            <h3 className="text-white font-medium">Add New Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-corporate-lightGray text-xs">Client Name *</Label>
                <Input
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  className="bg-corporate-darkSecondary border-corporate-border text-white"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label className="text-corporate-lightGray text-xs">Contact Email *</Label>
                <Input
                  type="email"
                  value={newClient.contactEmail}
                  onChange={(e) => setNewClient({...newClient, contactEmail: e.target.value})}
                  className="bg-corporate-darkSecondary border-corporate-border text-white"
                  placeholder="contact@client.com"
                />
              </div>
              <div>
                <Label className="text-corporate-lightGray text-xs">Contact Name</Label>
                <Input
                  value={newClient.contactName}
                  onChange={(e) => setNewClient({...newClient, contactName: e.target.value})}
                  className="bg-corporate-darkSecondary border-corporate-border text-white"
                  placeholder="Contact person"
                />
              </div>
              <div>
                <Label className="text-corporate-lightGray text-xs">Industry</Label>
                <Select value={newClient.industry} onValueChange={(value) => setNewClient({...newClient, industry: value})}>
                  <SelectTrigger className="bg-corporate-darkSecondary border-corporate-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-corporate-dark border-corporate-border">
                    <SelectItem value="Technology" className="text-white">Technology</SelectItem>
                    <SelectItem value="Finance" className="text-white">Finance</SelectItem>
                    <SelectItem value="Healthcare" className="text-white">Healthcare</SelectItem>
                    <SelectItem value="Legal" className="text-white">Legal</SelectItem>
                    <SelectItem value="Entertainment" className="text-white">Entertainment</SelectItem>
                    <SelectItem value="Real Estate" className="text-white">Real Estate</SelectItem>
                    <SelectItem value="Other" className="text-white">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddClient}
                className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
              >
                Add Client
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-corporate-border text-corporate-lightGray hover:bg-corporate-dark"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-corporate-lightGray">
          <span>{clients.length} total clients</span>
          {searchQuery && (
            <span>{filteredClients.length} filtered results</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
