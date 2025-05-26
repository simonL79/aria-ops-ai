
export interface ExportableData {
  id: string;
  created_at: string;
  platform: string;
  content: string;
  url?: string;
  severity?: string;
  status?: string;
  threat_type?: string;
  risk_entity_name?: string;
  sentiment?: number;
  confidence_score?: number;
}

export const exportToCSV = (data: ExportableData[], filename: string = 'aria-export') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Define headers
  const headers = [
    'ID',
    'Date Created',
    'Platform',
    'Content',
    'URL',
    'Severity',
    'Status',
    'Threat Type',
    'Entity Name',
    'Sentiment Score',
    'Confidence Score'
  ];

  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.id}"`,
      `"${new Date(row.created_at).toLocaleDateString()}"`,
      `"${row.platform}"`,
      `"${(row.content || '').replace(/"/g, '""').substring(0, 500)}"`, // Escape quotes and limit content
      `"${row.url || ''}"`,
      `"${row.severity || ''}"`,
      `"${row.status || ''}"`,
      `"${row.threat_type || ''}"`,
      `"${row.risk_entity_name || ''}"`,
      `"${row.sentiment || ''}"`,
      `"${row.confidence_score || ''}"`
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatDataForExport = (scanResults: any[]): ExportableData[] => {
  return scanResults.map(result => ({
    id: result.id,
    created_at: result.created_at,
    platform: result.platform,
    content: result.content,
    url: result.url,
    severity: result.severity,
    status: result.status,
    threat_type: result.threat_type,
    risk_entity_name: result.risk_entity_name,
    sentiment: result.sentiment,
    confidence_score: result.confidence_score
  }));
};
