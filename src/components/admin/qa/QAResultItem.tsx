
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface QAResultItemProps {
  result: QATestResult;
  index: number;
}

const QAResultItem = ({ result, index }: QAResultItemProps) => {
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

  const getButtonVariant = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'outline';
      case 'fail':
        return 'destructive';
      case 'warning':
        return 'secondary';
    }
  };

  const getDataSourceIcon = (dataSource?: string) => {
    if (dataSource === 'live') {
      return <Database className="h-3 w-3 text-green-600" />;
    } else if (dataSource === 'none') {
      return <Eye className="h-3 w-3 text-gray-400" />;
    }
    return null;
  };

  // Safely handle timestamp conversion
  const getTimestampDisplay = (timestamp?: string) => {
    if (!timestamp) return new Date().toLocaleTimeString();
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch {
      return new Date().toLocaleTimeString();
    }
  };

  return (
    <Button
      variant={getButtonVariant(result.status)}
      className="w-full h-auto p-4 justify-start text-left hover:scale-[1.02] transition-all duration-200"
      asChild
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start gap-3 flex-1">
          {getStatusIcon(result.status)}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium flex items-center gap-2 mb-1">
              {result.testName}
              {getDataSourceIcon(result.dataSource)}
              {result.gdprCompliant !== undefined && (
                <Shield className={`h-3 w-3 ${result.gdprCompliant ? 'text-blue-600' : 'text-red-600'}`} />
              )}
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              {result.message}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {getTimestampDisplay(result.timestamp)}
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
        
        <div className="flex flex-col items-end gap-2 ml-4">
          <Badge className={getStatusColor(result.status)}>
            {result.status}
          </Badge>
          {result.gdprCompliant !== undefined && (
            <Badge variant="outline" className={result.gdprCompliant ? 'text-blue-600 border-blue-200' : 'text-red-600 border-red-200'}>
              {result.gdprCompliant ? 'GDPR ✓' : 'GDPR ✗'}
            </Badge>
          )}
        </div>
      </div>
    </Button>
  );
};

export default QAResultItem;
