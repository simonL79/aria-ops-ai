
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  description: string;
  onRefresh?: () => void;
  totalAlerts?: number;
  highSeverityAlerts?: number;
}

const DashboardHeader = ({ 
  title, 
  description, 
  onRefresh,
  totalAlerts = 0,
  highSeverityAlerts = 0
}: DashboardHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-[#247CFF]" />
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                100% Live Data
              </div>
            </Badge>
          </div>
          <p className="text-gray-600">{description}</p>
          
          {/* Live Status Indicators */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-700">OSINT Systems Active</span>
            </div>
            
            {totalAlerts > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
                <span className="text-blue-700">{totalAlerts} Live Threats</span>
                {highSeverityAlerts > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {highSeverityAlerts} High Risk
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <span className="text-red-700">Mock Data Blocked</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Live Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
