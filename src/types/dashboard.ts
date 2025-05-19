
// Define client change interface
export interface ClientChange {
  id: string;
  clientId: string;
  clientName: string;
  type: 'update' | 'incident' | 'request';
  description: string;
  timestamp: Date;
  severity?: number;
  read: boolean;
}

// Define content alert interface
export interface ContentAlert {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  status: 'new' | 'read' | 'actioned';
}
