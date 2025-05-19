
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/clients";
import { toast } from "sonner";

/**
 * Fetches all clients from the database
 */
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Map database column names to Client interface
    const clients = (data || []).map(item => ({
      id: item.id,
      name: item.name,
      industry: item.industry,
      contactName: item.contactname,
      contactEmail: item.contactemail,
      website: item.website,
      notes: item.notes,
      keywordTargets: item.keywordtargets
    })) as Client[];
    
    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    toast.error("Failed to load clients", {
      description: "There was a problem fetching your client data"
    });
    return [];
  }
};

/**
 * Adds a new client to the database
 */
export const addClient = async (clientData: Omit<Client, 'id'>): Promise<Client | null> => {
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
      throw error;
    }
    
    // Map database response to Client interface
    const client: Client = {
      id: data.id,
      name: data.name,
      industry: data.industry,
      contactName: data.contactname,
      contactEmail: data.contactemail,
      website: data.website,
      notes: data.notes,
      keywordTargets: data.keywordtargets
    };
    
    return client;
  } catch (error) {
    console.error("Error adding client:", error);
    toast.error("Failed to add client", {
      description: "There was a problem saving your client data"
    });
    return null;
  }
};

/**
 * Updates an existing client in the database
 */
export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    const updateData: any = {};
    
    if (clientData.name !== undefined) updateData.name = clientData.name;
    if (clientData.industry !== undefined) updateData.industry = clientData.industry;
    if (clientData.contactName !== undefined) updateData.contactname = clientData.contactName;
    if (clientData.contactEmail !== undefined) updateData.contactemail = clientData.contactEmail;
    if (clientData.website !== undefined) updateData.website = clientData.website;
    if (clientData.notes !== undefined) updateData.notes = clientData.notes;
    if (clientData.keywordTargets !== undefined) updateData.keywordtargets = clientData.keywordTargets;
    
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Map database response to Client interface
    const client: Client = {
      id: data.id,
      name: data.name,
      industry: data.industry,
      contactName: data.contactname,
      contactEmail: data.contactemail,
      website: data.website,
      notes: data.notes,
      keywordTargets: data.keywordtargets
    };
    
    return client;
  } catch (error) {
    console.error("Error updating client:", error);
    toast.error("Failed to update client", {
      description: "There was a problem updating your client data"
    });
    return null;
  }
};

/**
 * Deletes a client from the database
 */
export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    toast.error("Failed to delete client", {
      description: "There was a problem removing your client"
    });
    return false;
  }
};
