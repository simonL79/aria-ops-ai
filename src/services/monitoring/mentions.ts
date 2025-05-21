
import { Mention } from './types';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Save a mention to the database
 */
export const saveMention = (
  platform: string,
  content: string,
  source: string,
  severity: 'high' | 'medium' | 'low',
  threatType?: string
): Mention => {
  // Create a new mention object
  const mention: Mention = {
    id: uuidv4(),
    platform,
    content,
    source,
    date: new Date(),
    severity,
    status: 'new',
    threatType
  };
  
  // Save to Supabase (asynchronously)
  saveMentionToDatabase(mention);
  
  return mention;
};

/**
 * Save mention to Supabase (internal function)
 */
const saveMentionToDatabase = async (mention: Mention) => {
  try {
    // Convert Mention type to database format
    const mentionData = {
      id: mention.id,
      platform: mention.platform,
      content: mention.content,
      url: mention.source,
      date: mention.date.toISOString(),
      severity: mention.severity,
      status: mention.status,
      threat_type: mention.threatType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('scan_results')
      .insert(mentionData);
    
    if (error) {
      console.error("Error saving mention to database:", error);
    }
  } catch (error) {
    console.error("Error in saveMentionToDatabase:", error);
  }
};

/**
 * Get all mentions from the database
 */
export const getAllMentions = async (): Promise<Mention[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching mentions:", error);
      return [];
    }
    
    // Convert database format to Mention type
    return data.map(item => ({
      id: item.id,
      platform: item.platform,
      content: item.content,
      source: item.url,
      date: new Date(item.created_at),
      severity: item.severity as 'high' | 'medium' | 'low',
      status: item.status as 'new' | 'read' | 'actioned' | 'resolved' | 'reviewing',
      threatType: item.threat_type
    }));
  } catch (error) {
    console.error("Error in getAllMentions:", error);
    return [];
  }
};

/**
 * Clear all mentions from the database
 * Note: This is for testing purposes only
 */
export const clearMentions = async (): Promise<void> => {
  try {
    // Truncate scan_results table - only available for admin roles
    const { error } = await supabase.rpc('truncate_scan_results');
    
    if (error) {
      console.error("Error clearing mentions:", error);
    }
  } catch (error) {
    console.error("Error in clearMentions:", error);
  }
};

/**
 * Get mentions filtered by platform
 */
export const getMentionsByPlatform = async (platform: string): Promise<Mention[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_results')
      .select('*')
      .eq('platform', platform)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching mentions by platform:", error);
      return [];
    }
    
    // Convert database format to Mention type
    return data.map(item => ({
      id: item.id,
      platform: item.platform,
      content: item.content,
      source: item.url,
      date: new Date(item.created_at),
      severity: item.severity as 'high' | 'medium' | 'low',
      status: item.status as 'new' | 'read' | 'actioned' | 'resolved' | 'reviewing',
      threatType: item.threat_type
    }));
  } catch (error) {
    console.error("Error in getMentionsByPlatform:", error);
    return [];
  }
};

