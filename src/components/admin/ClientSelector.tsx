
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Building } from 'lucide-react';
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
  const [clientEntities, setClientEntities] = useState<ClientEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
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
        updated_at: client.updated_at || client.created_at
      }));

      setClients(mappedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const loadClientEntities = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_entities')
        .select('*')
        .eq('client_id', clientId);

      if (error) throw error;

      const entities: ClientEntity[] = (data || []).map(entity => ({
        id: entity.id,
        entity_name: entity.entity_name,
        entity_type: entity.entity_type,
        alias: entity.alias
      }));

      setClientEntities(entities);
      if (onEntitiesLoad) {
        onEntitiesLoad(entities);
      }
    } catch (error) {
      console.error('Error loading client entities:', error);
      toast.error('Failed to load client entities');
    }
  };

  const handleClientChange = (value: string) => {
    if (value === 'none' || value === '') {
      onClientSelect(null);
      setClientEntities([]);
      if (onEntitiesLoad) {
        onEntitiesLoad([]);
      }
      return;
    }

    const client = clients.find(c => c.id === value);
    if (client) {
      onClientSelect(client);
      loadClientEntities(client.id);
      toast.success(`Selected client: ${client.name}`);
    }
  };

  return (
    <Card className="bg-corporate-darkSecondary border-corporate-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Building className="h-5 w-5 text-corporate-accent" />
          Client Context Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-corporate-lightGray">Select Active Client</label>
          <Select 
            value={selectedClient?.id || 'none'} 
            onValueChange={handleClientChange}
            disabled={loading}
          >
            <SelectTrigger className="bg-corporate-dark border-corporate-border text-white">
              <SelectValue placeholder={loading ? "Loading clients..." : "Choose a client"} />
            </SelectTrigger>
            <SelectContent className="bg-corporate-dark border-corporate-border">
              <SelectItem value="none" className="text-corporate-lightGray">
                No client selected
              </SelectItem>
              {clients.map((client) => (
                <SelectItem 
                  key={client.id} 
                  value={client.id}
                  className="text-white hover:bg-corporate-darkSecondary cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
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

        {selectedClient && (
          <div className="space-y-3 p-3 bg-corporate-dark rounded border border-corporate-border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-white">{selectedClient.name}</h4>
              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-corporate-lightGray">
                <span className="font-medium">Contact:</span> {selectedClient.contactName}
              </p>
              <p className="text-corporate-lightGray">
                <span className="font-medium">Email:</span> {selectedClient.contactEmail}
              </p>
              <p className="text-corporate-lightGray">
                <span className="font-medium">Industry:</span> {selectedClient.industry}
              </p>
              {selectedClient.keywordTargets && (
                <p className="text-corporate-lightGray">
                  <span className="font-medium">Keywords:</span> {selectedClient.keywordTargets}
                </p>
              )}
            </div>
            
            {clientEntities.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-white">Associated Entities</h5>
                <div className="flex flex-wrap gap-1">
                  {clientEntities.map((entity) => (
                    <Badge key={entity.id} variant="outline" className="text-xs">
                      {entity.entity_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={loadClients}
            variant="outline" 
            size="sm"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Loading...' : 'Refresh Clients'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('/admin/clients', '_blank')}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
