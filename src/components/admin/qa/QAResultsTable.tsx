
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  Database,
  Eye,
  Clock
} from 'lucide-react';
import { QATestResult } from '@/services/testing/qaTestRunner';

interface QAResultsTableProps {
  results: QATestResult[];
  selectedPhase: string;
}

const QAResultsTable = ({ results, selectedPhase }: QAResultsTableProps) => {
  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getDataSourceIcon = (dataSource?: 'live' | 'none') => {
    if (dataSource === 'live') {
      return <Database className="h-3 w-3 text-green-600" />;
    } else if (dataSource === 'none') {
      return <Eye className="h-3 w-3 text-gray-400" />;
    }
    return null;
  };

  const getFilteredResults = (): QATestResult[] => {
    if (selectedPhase === 'all') return results;
    return results.filter(r => r.phase === selectedPhase);
  };

  const getPhaseStats = (phase: string) => {
    const phaseResults = phase === 'all' 
      ? results 
      : results.filter(r => r.phase === phase);
      
    return {
      total: phaseResults.length,
      passed: phaseResults.filter(r => r.status === 'pass').length,
      failed: phaseResults.filter(r => r.status === 'fail').length,
      warnings: phaseResults.filter(r => r.status === 'warning').length
    };
  };

  const stats = getPhaseStats(selectedPhase);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedPhase === 'all' ? 'All Tests' : selectedPhase} Results
        </CardTitle>
        <CardDescription>
          {stats.total} tests: {stats.passed} passed, {stats.failed} failed, {stats.warnings} warnings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {getFilteredResults().map((result, index) => (
            <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
              <div className="flex items-start gap-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <h4 className="font-medium flex items-center gap-2">
                    {result.testName}
                    {getDataSourceIcon(result.dataSource)}
                    {result.gdprCompliant !== undefined && (
                      <Shield className={`h-3 w-3 ${result.gdprCompliant ? 'text-blue-600' : 'text-red-600'}`} />
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {result.timestamp.toLocaleTimeString()}
                    <span>•</span>
                    <span>{result.phase}</span>
                    {result.dataSource && (
                      <>
                        <span>•</span>
                        <span className={result.dataSource === 'live' ? 'text-green-600' : 'text-gray-500'}>
                          {result.dataSource === 'live' ? 'Live Data' : 'No Data'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <Badge className={getStatusColor(result.status)}>
                  {result.status}
                </Badge>
                {result.gdprCompliant !== undefined && (
                  <Badge variant="outline" className={result.gdprCompliant ? 'text-blue-600' : 'text-red-600'}>
                    {result.gdprCompliant ? 'GDPR ✓' : 'GDPR ✗'}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QAResultsTable;
