
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Client } from '@/types/clients';

/**
 * Fetch all clients
 */
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients");
      return [];
    }
    
    return data.map(client => ({
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
    })) || [];
    
  } catch (error) {
    console.error("Error in fetchClients:", error);
    toast.error("An error occurred while fetching clients");
    return [];
  }
};

/**
 * Add a new client
 */
export const addClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: clientData.name,
        industry: clientData.industry,
        contactname: clientData.contactName,
        contactemail: clientData.contactEmail,
        website: clientData.website || null,
        notes: clientData.notes || null,
        keywordtargets: clientData.keywordTargets || null
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding client:", error);
      toast.error("Failed to add client");
      return null;
    }
    
    return {
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
    
  } catch (error) {
    console.error("Error in addClient:", error);
    toast.error("An error occurred while adding the client");
    return null;
  }
};

/**
 * Update an existing client
 */
export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    const updateData: any = {};
    
    if (clientData.name) updateData.name = clientData.name;
    if (clientData.industry) updateData.industry = clientData.industry;
    if (clientData.contactName) updateData.contactname = clientData.contactName;
    if (clientData.contactEmail) updateData.contactemail = clientData.contactEmail;
    if (clientData.website !== undefined) updateData.website = clientData.website || null;
    if (clientData.notes !== undefined) updateData.notes = clientData.notes || null;
    if (clientData.keywordTargets !== undefined) updateData.keywordtargets = clientData.keywordTargets || null;
    
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
      return null;
    }
    
    return {
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
    
  } catch (error) {
    console.error("Error in updateClient:", error);
    toast.error("An error occurred while updating the client");
    return null;
  }
};

/**
 * Delete a client
 */
export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
      return false;
    }
    
    toast.success("Client deleted successfully");
    return true;
    
  } catch (error) {
    console.error("Error in deleteClient:", error);
    toast.error("An error occurred while deleting the client");
    return false;
  }
};

/**
 * Get a client by ID
 */
export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching client:", error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return {
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
    
  } catch (error) {
    console.error("Error in getClientById:", error);
    return null;
  }
};
