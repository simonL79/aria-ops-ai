
import { toast } from 'sonner';
import { ScanResultStats } from '@/types/aiScraping';

// Mock scan result statistics
const mockStats: Record<string, ScanResultStats> = {
  '24h': {
    totalScanned: 127,
    risksIdentified: 14,
    averageRiskScore: 5.7,
    sourcesDistribution: {
      'Google': 45,
      'News': 22,
      'RSS': 18,
      'Crawler': 25,
      'Manual': 12,
      'Custom': 5
    },
    scanDuration: 8.3
  },
  '7d': {
    totalScanned: 493,
    risksIdentified: 52,
    averageRiskScore: 6.2,
    sourcesDistribution: {
      'Google': 159,
      'News': 87,
      'RSS': 75,
      'Crawler': 102,
      'Manual': 43,
      'Custom': 27
    },
    scanDuration: 7.9
  },
  '30d': {
    totalScanned: 1845,
    risksIdentified: 215,
    averageRiskScore: 5.9,
    sourcesDistribution: {
      'Google': 572,
      'News': 324,
      'RSS': 295,
      'Crawler': 398,
      'Manual': 185,
      'Custom': 71
    },
    scanDuration: 8.1
  },
  'all': {
    totalScanned: 5782,
    risksIdentified: 643,
    averageRiskScore: 6.1,
    sourcesDistribution: {
      'Google': 1872,
      'News': 1023,
      'RSS': 876,
      'Crawler': 1245,
      'Manual': 527,
      'Custom': 239
    },
    scanDuration: 8.5
  }
};

/**
 * Get scan statistics for a specific timeframe
 */
export const getScanStats = async (timeframe: string = '24h'): Promise<ScanResultStats> => {
  // In a real implementation, this would be fetched from a database
  // For now, we'll use mock data
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  return mockStats[timeframe] || mockStats['24h'];
};

/**
 * Export statistics to CSV
 */
export const exportStats = async (timeframe: string = '24h'): Promise<void> => {
  // Get the stats
  const stats = await getScanStats(timeframe);
  
  // Convert stats to CSV format
  const sourceDistributionCSV = Object.entries(stats.sourcesDistribution)
    .map(([source, count]) => `${source},${count}`)
    .join('\n');
  
  const csv = `
A.R.I.A™ Scan Statistics Export (${timeframe})
Generated: ${new Date().toISOString()}

Summary Statistics
-----------------
Total Scanned,${stats.totalScanned}
Risks Identified,${stats.risksIdentified}
Average Risk Score,${stats.averageRiskScore.toFixed(1)}
Scan Duration (s),${stats.scanDuration.toFixed(1)}

Source Distribution
------------------
Source,Count
${sourceDistributionCSV}
`;
  
  // Create a Blob containing the CSV data
  const blob = new Blob([csv], { type: 'text/csv' });
  
  // Create a link element to trigger the download
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `aria_stats_${timeframe}_${new Date().toISOString().slice(0, 10)}.csv`;
  
  // Trigger the download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  
  toast.success('Statistics exported', {
    description: `Exported ${timeframe} stats to CSV file`
  });
};
