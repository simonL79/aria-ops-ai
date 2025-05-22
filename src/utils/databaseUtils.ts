
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper to check if a column exists in a table
 */
export async function checkColumnExists(
  tableName: string, 
  columnName: string
): Promise<boolean> {
  try {
    // Use direct edge function invocation
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/column_exists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({
        table_name: tableName,
        column_name: columnName
      })
    });
    
    if (!response.ok) {
      console.error(`Error checking if column ${columnName} exists: HTTP ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    return !!data?.exists;
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
