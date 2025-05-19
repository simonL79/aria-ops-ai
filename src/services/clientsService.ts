
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
    
    // Type assertion to ensure the data matches our Client interface
    return (data || []) as Client[];
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
        contactName: clientData.contactName,
        contactEmail: clientData.contactEmail,
        website: clientData.website || null,
        notes: clientData.notes || null,
        keywordTargets: clientData.keywordTargets || null
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Type assertion to ensure the data matches our Client interface
    return data as Client;
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
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: clientData.name,
        industry: clientData.industry,
        contactName: clientData.contactName,
        contactEmail: clientData.contactEmail,
        website: clientData.website,
        notes: clientData.notes,
        keywordTargets: clientData.keywordTargets
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Type assertion to ensure the data matches our Client interface
    return data as Client;
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
