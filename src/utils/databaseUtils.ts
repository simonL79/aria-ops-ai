
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a column exists in a table
 */
export async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('column_exists', { 
      p_table_name: tableName, 
      p_column_name: columnName 
    });
    
    if (error) {
      console.error(`Error checking if column ${columnName} exists in table ${tableName}:`, error);
      // If the RPC function doesn't exist, fall back to assuming column exists
      // This prevents blocking functionality in case the helper function isn't available
      return true;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error in checkColumnExists for ${columnName} in ${tableName}:`, error);
    // Assume column exists as fallback
    return true;
  }
}

/**
 * Type guard helper to check if a scan result has a specific property
 */
export function hasScanProperty(obj: any, prop: string): boolean {
  return obj && typeof obj === 'object' && prop in obj;
}
