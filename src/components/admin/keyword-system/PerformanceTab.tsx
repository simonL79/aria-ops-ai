
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Target, Shield, MessageSquare, FileText } from 'lucide-react';

interface PerformanceTabProps {
  entityName: string;
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ entityName }) => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    pipeline_efficiency: 87.5,
    total_processing_time: 2340,
    threats_detected: 12,
    precision_rate: 92.3,
    narratives_generated: 8,
    articles_suggested: 15,
    deployment_readiness: 85
  });

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const performanceStages = [
    {
      name: 'Entity Scan',
      icon: Target,
      completion: 100,
      processing_time: 450,
      results: performanceMetrics.threats_detected
    },
    {
      name: 'CIA Precision',
      icon: Shield,
      completion: 100,
      processing_time: 320,
      results: Math.round(performanceMetrics.threats_detected * (performanceMetrics.precision_rate / 100))
    },
    {
      name: 'Counter Narratives',
      icon: MessageSquare,
      completion: 95,
      processing_time: 890,
      results: performanceMetrics.narratives_generated
    },
    {
      name: 'Article Generation',
      icon: FileText,
      completion: 90,
      processing_time: 680,
      results: performanceMetrics.articles_suggested
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-corporate-accent" />
            Pipeline Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-corporate-darkSecondary rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {performanceMetrics.pipeline_efficiency}%
              </div>
              <div className="text-corporate-lightGray text-sm">Pipeline Efficiency</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${getEfficiencyColor(performanceMetrics.pipeline_efficiency)}`}
                  style={{ width: `${performanceMetrics.pipeline_efficiency}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-corporate-darkSecondary rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {(performanceMetrics.total_processing_time / 1000).toFixed(1)}s
              </div>
              <div className="text-corporate-lightGray text-sm">Total Processing Time</div>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="h-3 w-3 text-corporate-accent" />
                <span className="text-corporate-accent text-xs">Average</span>
              </div>
            </div>

            <div className="p-4 bg-corporate-darkSecondary rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {performanceMetrics.precision_rate}%
              </div>
              <div className="text-corporate-lightGray text-sm">Precision Rate</div>
              <Badge className={`mt-2 ${getEfficiencyColor(performanceMetrics.precision_rate)}`}>
                {performanceMetrics.precision_rate >= 90 ? 'Excellent' : 
                 performanceMetrics.precision_rate >= 75 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>

            <div className="p-4 bg-corporate-darkSecondary rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {performanceMetrics.deployment_readiness}%
              </div>
              <div className="text-corporate-lightGray text-sm">Deployment Ready</div>
              <Badge className={`mt-2 ${performanceMetrics.deployment_readiness >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                {performanceMetrics.deployment_readiness >= 80 ? 'Ready' : 'Pending'}
              </Badge>
            </div>
          </div>

          {/* Stage Performance Breakdown */}
          <div>
            <h4 className="text-white font-medium mb-4">Stage Performance Breakdown</h4>
            <div className="space-y-3">
              {performanceStages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <div key={index} className="p-4 bg-corporate-darkTertiary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-corporate-accent" />
                        <span className="text-white font-medium">{stage.name}</span>
                      </div>
                      <Badge className={`${getEfficiencyColor(stage.completion)}`}>
                        {stage.completion}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-corporate-lightGray">Processing Time:</span>
                        <div className="text-white">{stage.processing_time}ms</div>
                      </div>
                      <div>
                        <span className="text-corporate-lightGray">Results:</span>
                        <div className="text-white">{stage.results}</div>
                      </div>
                      <div>
                        <span className="text-corporate-lightGray">Efficiency:</span>
                        <div className="text-white">{stage.completion}%</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-1 mt-3">
                      <div 
                        className={`h-1 rounded-full ${getEfficiencyColor(stage.completion)}`}
                        style={{ width: `${stage.completion}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-corporate-darkSecondary rounded-lg">
            <h4 className="text-white font-medium mb-3">Performance Recommendations</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-corporate-lightGray">
                <TrendingUp className="h-3 w-3 text-green-400" />
                Pipeline efficiency is optimal at {performanceMetrics.pipeline_efficiency}%
              </li>
              <li className="flex items-center gap-2 text-corporate-lightGray">
                <Target className="h-3 w-3 text-blue-400" />
                Precision rate of {performanceMetrics.precision_rate}% exceeds target threshold
              </li>
              <li className="flex items-center gap-2 text-corporate-lightGray">
                <Clock className="h-3 w-3 text-yellow-400" />
                Consider optimizing counter narrative generation (890ms processing time)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTab;
