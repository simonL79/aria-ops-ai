
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
      
      // Map database fields to TypeScript interface
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
      const entitiesData = data || [];
      setEntities(entitiesData);
      onEntitiesLoad?.(entitiesData);
    } catch (error) {
      console.error('Error loading client entities:', error);
      setEntities([]);
      onEntitiesLoad?.([]);
    }
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId) || null;
    onClientSelect(client);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Select Client for Live Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Client</label>
          <Select 
            value={selectedClient?.id || ''} 
            onValueChange={handleClientChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a client to monitor" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">{client.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {client.industry}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClient && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{selectedClient.name}</h4>
                <p className="text-sm text-gray-600">{selectedClient.contactName} • {selectedClient.contactEmail}</p>
              </div>
              <Badge>{selectedClient.industry}</Badge>
            </div>
            
            {entities.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Monitored Entities ({entities.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {entities.map((entity) => (
                    <Badge key={entity.id} variant="secondary" className="text-xs">
                      {entity.entity_name}
                      {entity.alias && ` (${entity.alias})`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedClient.keywordTargets && (
              <div>
                <span className="text-sm font-medium">Keywords: </span>
                <span className="text-sm text-gray-600">{selectedClient.keywordTargets}</span>
              </div>
            )}
          </div>
        )}

        {selectedClient && entities.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No entities configured for this client.</p>
            <Button variant="outline" size="sm" className="mt-2">
              Add Entities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
