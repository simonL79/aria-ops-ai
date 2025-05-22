
/**
 * Utility for safely parsing detected entities from various formats
 */

export interface ScanEntity {
  name: string;  // Using name instead of label to match existing code
  type?: string;
  confidence?: number;
}

/**
 * Safely parse detected entities from unknown input
 * This prevents TypeScript TS2589 errors by avoiding deep type inference
 */
export function parseDetectedEntities(input: unknown): ScanEntity[] {
  if (!input) return [];
  
  // Handle array input
  if (Array.isArray(input)) {
    return input.map(item => {
      // Handle string items
      if (typeof item === 'string') {
        return { name: item };
      }
      
      // Handle object items with name property
      if (item && typeof item === 'object') {
        if ('name' in item && typeof (item as any).name === 'string') {
          return {
            name: String((item as any).name),
            type: typeof (item as any).type === 'string' ? (item as any).type : undefined,
            confidence: typeof (item as any).confidence === 'number' ? (item as any).confidence : undefined
          };
        } else if ('label' in item && typeof (item as any).label === 'string') {
          // Support label property as an alternative to name
          return {
            name: String((item as any).label),
            type: typeof (item as any).type === 'string' ? (item as any).type : undefined,
            confidence: typeof (item as any).confidence === 'number' ? (item as any).confidence : undefined
          };
        }
      }
      
      // Default fallback for unknown formats
      return { name: String(item) };
    });
  }
  
  // Handle string input (e.g., JSON string)
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parseDetectedEntities(parsed); // Recursive call with parsed array
      }
      // Single entity as string
      return [{ name: input }];
    } catch {
      // If parsing fails, treat as a single entity
      return [{ name: input }];
    }
  }
  
  // Default: return empty array for unsupported inputs
  return [];
}
