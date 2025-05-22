
/**
 * Type guard helper to check if a scan result has a specific property
 */
export function hasScanProperty(obj: any, prop: string): boolean {
  return obj && typeof obj === 'object' && prop in obj;
}
