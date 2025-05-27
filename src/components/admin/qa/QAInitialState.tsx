
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Database, Lock, Activity } from 'lucide-react';

const QAInitialState = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      title: "System Security",
      description: "Comprehensive security and access verification"
    },
    {
      icon: <Database className="h-6 w-6 text-green-500" />,
      title: "Data Integrity", 
      description: "Database health and data consistency checks"
    },
    {
      icon: <Lock className="h-6 w-6 text-purple-500" />,
      title: "GDPR Compliance",
      description: "Privacy and data protection compliance verification"
    },
    {
      icon: <Activity className="h-6 w-6 text-orange-500" />,
      title: "Performance Monitoring",
      description: "Real-time system performance and health metrics"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QAInitialState;
