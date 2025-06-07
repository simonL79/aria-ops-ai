
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Search, Building, Mail, Globe, User } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    website: '',
    notes: '',
    keywordTargets: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const clientsData = await fetchClients();
      setClients(clientsData);
      console.log('Loaded clients:', clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.industry || !newClient.contactName || !newClient.contactEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const addedClient = await addClient(newClient);
      if (addedClient) {
        setClients([addedClient, ...clients]);
        setNewClient({
          name: '',
          industry: '',
          contactName: '',
          contactEmail: '',
          website: '',
          notes: '',
          keywordTargets: ''
        });
        setShowAddDialog(false);
        toast.success('Client added successfully');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
    }
  };

  const handleClientSelect = (clientId: string) => {
    if (clientId === 'none') {
      onClientSelect(null);
      onEntitiesLoad([]);
      return;
    }

    const client = clients.find(c => c.id === clientId);
    if (client) {
      onClientSelect(client);
      
      // Mock entities for the selected client
      const mockEntities: ClientEntity[] = [
        {
          id: '1',
          entity_name: client.name,
          entity_type: 'primary',
          alias: client.name
        }
      ];
      onEntitiesLoad(mockEntities);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-corporate-darkSecondary border-corporate-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-corporate-accent" />
            Client Context Selection
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-corporate-accent text-black hover:bg-corporate-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-corporate-darkSecondary border-corporate-border text-white">
              <DialogHeader>
                <DialogTitle className="text-corporate-accent">Add New Client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input
                      id="clientName"
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      placeholder="Enter client name"
                      className="bg-corporate-dark border-corporate-border text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      value={newClient.industry}
                      onChange={(e) => setNewClient({...newClient, industry: e.target.value})}
                      placeholder="Enter industry"
                      className="bg-corporate-dark border-corporate-border text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={newClient.contactName}
                      onChange={(e) => setNewClient({...newClient, contactName: e.target.value})}
                      placeholder="Enter contact name"
                      className="bg-corporate-dark border-corporate-border text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={newClient.contactEmail}
                      onChange={(e) => setNewClient({...newClient, contactEmail: e.target.value})}
                      placeholder="Enter contact email"
                      className="bg-corporate-dark border-corporate-border text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newClient.website}
                    onChange={(e) => setNewClient({...newClient, website: e.target.value})}
                    placeholder="Enter website URL"
                    className="bg-corporate-dark border-corporate-border text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddClient} className="bg-corporate-accent text-black hover:bg-corporate-accent/90">
                    Add Client
                  </Button>
                  <Button onClick={() => setShowAddDialog(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-corporate-lightGray" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-corporate-dark border-corporate-border text-white"
          />
        </div>

        {/* Client Selection */}
        <div className="space-y-2">
          <Label className="text-corporate-lightGray">Select Active Client</Label>
          <Select value={selectedClient?.id || 'none'} onValueChange={handleClientSelect}>
            <SelectTrigger className="bg-corporate-dark border-corporate-border text-white">
              <SelectValue placeholder="Select a client for intelligence context" />
            </SelectTrigger>
            <SelectContent className="bg-corporate-dark border-corporate-border">
              <SelectItem value="none" className="text-white hover:bg-corporate-darkSecondary">
                No client selected
              </SelectItem>
              {filteredClients.map((client) => (
                <SelectItem key={client.id} value={client.id} className="text-white hover:bg-corporate-darkSecondary">
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
        </div>

        {/* Selected Client Details */}
        {selectedClient && (
          <div className="bg-corporate-dark rounded p-4 border border-corporate-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Building className="h-4 w-4 text-corporate-accent" />
                {selectedClient.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {selectedClient.industry}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-corporate-lightGray" />
                <span className="text-corporate-lightGray">{selectedClient.contactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-corporate-lightGray" />
                <span className="text-corporate-lightGray">{selectedClient.contactEmail}</span>
              </div>
              {selectedClient.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3 text-corporate-lightGray" />
                  <span className="text-corporate-lightGray">{selectedClient.website}</span>
                </div>
              )}
            </div>

            {selectedClient.keywordTargets && (
              <div className="mt-3 pt-3 border-t border-corporate-border">
                <p className="text-xs text-corporate-lightGray mb-1">Keyword Targets:</p>
                <p className="text-xs text-white">{selectedClient.keywordTargets}</p>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <Users className="h-6 w-6 animate-pulse mx-auto mb-2 text-corporate-accent" />
            <p className="text-corporate-lightGray text-sm">Loading clients...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
