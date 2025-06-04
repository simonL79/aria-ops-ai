
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEntityMemory = (selectedEntity: string) => {
  const [entityMemory, setEntityMemory] = useState<any[]>([]);

  useEffect(() => {
    loadEntityMemory();
  }, [selectedEntity]);

  const loadEntityMemory = async () => {
    if (!selectedEntity) return;

    try {
      const { data: memory } = await supabase
        .from('anubis_entity_memory')
        .select('*')
        .eq('entity_name', selectedEntity)
        .order('created_at', { ascending: false })
        .limit(20);

      setEntityMemory(memory || []);
    } catch (error) {
      console.error('Failed to load entity memory:', error);
    }
  };

  return { entityMemory, loadEntityMemory };
};
