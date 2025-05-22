
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper to check if a column exists in a table
 */
export async function checkColumnExists(
  tableName: string, 
  columnName: string
): Promise<boolean> {
  try {
    // Use the RPC function instead of directly querying information_schema
    const { data, error } = await supabase.rpc('column_exists', {
      p_table_name: tableName,
      p_column_name: columnName
    });
    
    if (error) {
      console.error(`Error checking if column ${columnName} exists:`, error);
      return false;
    }
    
    return Boolean(data);
  } catch (error) {
    console.error(`Error in checkColumnExists for ${columnName}:`, error);
    return false;
  }
}

/**
 * Type guard to safely access object properties
 */
export function hasScanProperty(obj: any, property: string): boolean {
  return obj && typeof obj === 'object' && property in obj;
}
