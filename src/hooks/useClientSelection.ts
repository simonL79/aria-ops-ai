
import { useState, useEffect } from 'react';

interface Client {
  id: string;
  name: string;
}

interface ClientEntity {
  id: string;
  entity_name: string;
  entity_type: string;
}

export const useClientSelection = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientEntities, setClientEntities] = useState<ClientEntity[]>([]);

  useEffect(() => {
    // Mock client selection for now
    setSelectedClient({
      id: '1',
      name: 'Demo Client'
    });
    
    setClientEntities([
      {
        id: '1',
        entity_name: 'Demo Entity',
        entity_type: 'individual'
      }
    ]);
  }, []);

  return {
    selectedClient,
    clientEntities,
    setSelectedClient
  };
};
