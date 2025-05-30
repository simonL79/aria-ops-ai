
import { useState, useEffect } from 'react';
import type { Client } from '@/types/clients';

interface ClientEntity {
  id: string;
  entity_name: string;
  entity_type: string;
  alias?: string;
}

export const useClientSelection = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientEntities, setClientEntities] = useState<ClientEntity[]>([]);

  return {
    selectedClient,
    setSelectedClient,
    clientEntities,
    setClientEntities
  };
};
