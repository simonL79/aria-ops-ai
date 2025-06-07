
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Target, Globe, Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
  onEntitiesLoad?: (entities: ClientEntity[]) => void;
}

const ClientSelector = ({ selectedClient, onClientSelect, onEntitiesLoad }: ClientSelectorProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [entities, setEntities] = useState<ClientEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    website: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadClientEntities(selectedClient.id);
    } else {
      setEntities([]);
      onEntitiesLoad?.([]);
    }
  }, [selectedClient]);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (error) throw error;
      
      const mappedClients: Client[] = (data || []).map(client => ({
        id: client.id,
        name: client.name,
        industry: client.industry,
        contactName: client.contactname,
        contactEmail: client.contactemail,
        website: client.website || '',
        notes: client.notes || '',
        keywordTargets: client.keywordtargets || '',
        created_at: client.created_at,
        updated_at: client.updated_at
      }));
      
      setClients(mappedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const loadClientEntities = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_entities')
        .select('*')
        .eq('client_id', clientId)
        .order('entity_name');

      if (error) throw error;
      
      setEntities(data || []);
      onEntitiesLoad?.(data || []);
    } catch (error) {
      console.error('Error loading entities:', error);
      toast.error('Failed to load entities');
    }
  };

  const addNewClient = async () => {
    if (!newClient.name || !newClient.industry || !newClient.contactName || !newClient.contactEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: newClient.name,
          industry: newClient.industry,
          contactname: newClient.contactName,
          contactemail: newClient.contactEmail,
          website: newClient.website || null
        })
        .select()
        .single();

      if (error) throw error;

      const mappedClient: Client = {
        id: data.id,
        name: data.name,
        industry: data.industry,
        contactName: data.contactname,
        contactEmail: data.contactemail,
        website: data.website || '',
        notes: data.notes || '',
        keywordTargets: data.keywordtargets || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setClients([mappedClient, ...clients]);
      setNewClient({ name: '', industry: '', contactName: '', contactEmail: '', website: '' });
      setShowAddForm(false);
      toast.success('Client added successfully');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-corporate-accent">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Selection & Management
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddForm && (
            <Card className="bg-corporate-dark border-corporate-border">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-sm">Client Name *</Label>
                    <Input
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      placeholder="Enter client name"
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Industry *</Label>
                    <Input
                      value={newClient.industry}
                      onChange={(e) => setNewClient({...newClient, industry: e.target.value})}
                      placeholder="Enter industry"
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Contact Name *</Label>
                    <Input
                      value={newClient.contactName}
                      onChange={(e) => setNewClient({...newClient, contactName: e.target.value})}
                      placeholder="Enter contact name"
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Contact Email *</Label>
                    <Input
                      type="email"
                      value={newClient.contactEmail}
                      onChange={(e) => setNewClient({...newClient, contactEmail: e.target.value})}
                      placeholder="Enter contact email"
                      className="bg-corporate-darkSecondary border-corporate-border text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white text-sm">Website</Label>
                  <Input
                    value={newClient.website}
                    onChange={(e) => setNewClient({...newClient, website: e.target.value})}
                    placeholder="Enter website URL"
                    className="bg-corporate-darkSecondary border-corporate-border text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addNewClient} size="sm" className="bg-corporate-accent text-black hover:bg-corporate-accent/90">
                    Add Client
                  </Button>
                  <Button onClick={() => setShowAddForm(false)} size="sm" variant="outline" className="border-corporate-border text-white">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-corporate-lightGray" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-corporate-dark border-corporate-border text-white"
              />
            </div>
            <Select
              value={selectedClient?.id || ''}
              onValueChange={(value) => {
                const client = clients.find(c => c.id === value);
                onClientSelect(client || null);
              }}
            >
              <SelectTrigger className="w-80 bg-corporate-dark border-corporate-border text-white">
                <SelectValue placeholder="Select a client..." />
              </SelectTrigger>
              <SelectContent className="bg-corporate-dark border-corporate-border">
                {filteredClients.map((client) => (
                  <SelectItem key={client.id} value={client.id} className="text-white hover:bg-corporate-darkSecondary">
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-corporate-lightGray">{client.industry}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClient && (
            <Card className="bg-corporate-dark border-corporate-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium text-lg">{selectedClient.name}</h3>
                    <Badge variant="outline" className="text-corporate-accent border-corporate-accent/50 mt-1">
                      {selectedClient.industry}
                    </Badge>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-corporate-lightGray">Contact: {selectedClient.contactName}</p>
                    <p className="text-corporate-lightGray">{selectedClient.contactEmail}</p>
                    {selectedClient.website && (
                      <div className="flex items-center gap-1 mt-1">
                        <Globe className="h-3 w-3 text-corporate-lightGray" />
                        <a href={selectedClient.website} target="_blank" rel="noopener noreferrer" 
                           className="text-corporate-accent hover:underline text-xs">
                          {selectedClient.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {entities.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-corporate-accent" />
                      Entities ({entities.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entities.map((entity) => (
                        <Badge key={entity.id} variant="secondary" className="text-xs">
                          {entity.entity_name} ({entity.entity_type})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSelector;
