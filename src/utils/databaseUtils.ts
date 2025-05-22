
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper to check if a column exists in a table
 */
export async function checkColumnExists(
  tableName: string, 
  columnName: string
): Promise<boolean> {
  try {
    // Query the Postgres information schema directly
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', tableName)
      .eq('column_name', columnName);
    
    if (error) {
      console.error(`Error checking if column ${columnName} exists:`, error);
      return false;
    }
    
    return Array.isArray(data) && data.length > 0;
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
