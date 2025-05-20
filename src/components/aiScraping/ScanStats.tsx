
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, Clock, AlertTriangle, Info } from 'lucide-react';
import { ScanResultStats } from '@/types/aiScraping';
import { getScanStats, exportStats } from '@/services/scanStatsService';

const ScanStats = () => {
  const [stats, setStats] = useState<ScanResultStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  const [activeStat, setActiveStat] = useState('sources');
  
  // Colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be fetched from an API
        // For now, we'll use simulated data
        const data = await getScanStats(activeTimeframe);
        setStats(data);
      } catch (error) {
        console.error("Error loading scan stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, [activeTimeframe]);

  const handleExport = async () => {
    try {
      await exportStats(activeTimeframe);
    } catch (error) {
      console.error("Error exporting stats:", error);
    }
  };

  // Prepare data for source distribution chart
  const getSourceData = () => {
    if (!stats) return [];
    
    return Object.entries(stats.sourcesDistribution).map(([name, value]) => ({
      name,
      value
    }));
  };

  const riskDistributionData = [
    { name: 'Low Risk', value: 65 },
    { name: 'Medium Risk', value: 25 },
    { name: 'High Risk', value: 10 }
  ];

  const entityTypeData = [
    { name: 'Organizations', value: 45 },
    { name: 'People', value: 40 },
    { name: 'Locations', value: 15 }
  ];
  
  const scanPerformanceData = [
    { name: 'API Rate', value: 95 },
    { name: 'Success Rate', value: 98 },
    { name: 'Analysis Rate', value: 90 },
    { name: 'Storage Rate', value: 100 }
  ];

  const renderActiveChart = () => {
    switch(activeStat) {
      case 'sources':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getSourceData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {getSourceData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'risk':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#4ade80" /> {/* Green for low risk */}
                <Cell fill="#facc15" /> {/* Yellow for medium risk */}
                <Cell fill="#ef4444" /> {/* Red for high risk */}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'entities':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={entityTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#0088FE" /> {/* Blue for organizations */}
                <Cell fill="#00C49F" /> {/* Green for people */}
                <Cell fill="#FFBB28" /> {/* Yellow for locations */}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scanPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Select a stat to view</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Scan Statistics</h2>
        <div className="flex items-center space-x-2">
          <Select 
            value={activeTimeframe} 
            onValueChange={setActiveTimeframe}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Scanned</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <p className="text-2xl font-bold">{stats.totalScanned}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">Risks Identified</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <p className="text-2xl font-bold">{stats.risksIdentified}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Risk Score</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <p className="text-2xl font-bold">{stats.averageRiskScore.toFixed(1)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">Scan Duration</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <p className="text-2xl font-bold">{stats.scanDuration.toFixed(1)}s</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <Tabs value={activeStat} onValueChange={setActiveStat}>
              <TabsList className="mb-4">
                <TabsTrigger value="sources">Sources Distribution</TabsTrigger>
                <TabsTrigger value="risk">Risk Distribution</TabsTrigger>
                <TabsTrigger value="entities">Entity Types</TabsTrigger>
                <TabsTrigger value="performance">Scan Performance</TabsTrigger>
              </TabsList>
              
              <div className="pt-2">
                {renderActiveChart()}
              </div>
            </Tabs>
          </div>
        </>
      ) : (
        <div className="text-center py-16 space-y-2">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500" />
          <h3 className="text-lg font-medium">No scan data available</h3>
          <p className="text-muted-foreground">
            Run a scan to collect statistics about your AI-powered reputation intelligence
          </p>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
        <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-800">About A.R.I.A™ Scan Statistics</h3>
          <p className="text-sm text-blue-700 mt-1">
            A.R.I.A™ collects anonymous performance metrics to help optimize your scanning and analysis operations.
            These statistics help identify the most efficient data sources and processing methods, while monitoring 
            system health. No personal data or scan results are included in these metrics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScanStats;
