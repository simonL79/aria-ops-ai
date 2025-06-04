
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, Target, BarChart3 } from 'lucide-react';

interface PerformanceTabProps {
  entityName: string;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ entityName }) => {
  const [performanceData, setPerformanceData] = useState({
    threatsDetected: 0,
    threatsResolved: 0,
    precision: 0,
    avgResponseTime: 0
  });

  useEffect(() => {
    // Simulate loading performance data
    setPerformanceData({
      threatsDetected: 24,
      threatsResolved: 18,
      precision: 87.5,
      avgResponseTime: 142
    });
  }, [entityName]);

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-corporate-accent" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-4">Entity: {entityName}</h4>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-5 w-5 text-corporate-accent" />
                  <Badge className="bg-green-500/20 text-green-400">
                    Active
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {performanceData.threatsDetected}
                </div>
                <div className="text-corporate-lightGray text-sm">
                  Threats Detected
                </div>
              </div>

              <div className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  <Badge className="bg-blue-500/20 text-blue-400">
                    Resolved
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {performanceData.threatsResolved}
                </div>
                <div className="text-corporate-lightGray text-sm">
                  Threats Resolved
                </div>
              </div>

              <div className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 text-corporate-accent" />
                  <Badge className="bg-corporate-accent text-black">
                    CIA-Grade
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {performanceData.precision}%
                </div>
                <div className="text-corporate-lightGray text-sm">
                  Precision Score
                </div>
              </div>

              <div className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-yellow-400" />
                  <Badge className="bg-yellow-500/20 text-yellow-400">
                    Speed
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {performanceData.avgResponseTime}ms
                </div>
                <div className="text-corporate-lightGray text-sm">
                  Avg Response Time
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-corporate-darkTertiary rounded-lg">
              <h5 className="text-white font-medium mb-2">System Performance Summary</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Resolution Rate:</span>
                  <span className="text-green-400">
                    {Math.round((performanceData.threatsResolved / performanceData.threatsDetected) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">CIA Validation Status:</span>
                  <span className="text-corporate-accent">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Last Updated:</span>
                  <span className="text-white">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTab;
