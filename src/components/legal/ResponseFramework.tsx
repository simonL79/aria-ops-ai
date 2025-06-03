
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Target, Zap, Clock } from 'lucide-react';

const ResponseFramework = () => {
  const [activeResponse, setActiveResponse] = useState('immediate');

  const responseStrategies = [
    {
      id: 'immediate',
      title: 'Immediate Response',
      icon: Zap,
      timeframe: '< 1 hour',
      actions: ['Platform reporting', 'Automated takedown', 'Alert stakeholders'],
      severity: 'high'
    },
    {
      id: 'tactical',
      title: 'Tactical Response',
      icon: Target,
      timeframe: '1-24 hours',
      actions: ['Legal analysis', 'Strategic planning', 'Counter-narrative'],
      severity: 'medium'
    },
    {
      id: 'strategic',
      title: 'Strategic Response',
      icon: Shield,
      timeframe: '24+ hours',
      actions: ['Legal action', 'PR campaign', 'Long-term monitoring'],
      severity: 'low'
    }
  ];

  return (
    <Card className="bg-corporate-darkSecondary border-corporate-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-corporate-accent" />
          Response Framework
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeResponse} onValueChange={setActiveResponse}>
          <TabsList className="grid w-full grid-cols-3 bg-corporate-dark">
            {responseStrategies.map((strategy) => (
              <TabsTrigger
                key={strategy.id}
                value={strategy.id}
                className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray"
              >
                <strategy.icon className="h-4 w-4 mr-1" />
                {strategy.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {responseStrategies.map((strategy) => (
            <TabsContent key={strategy.id} value={strategy.id} className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{strategy.title}</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-corporate-lightGray" />
                    <span className="text-sm text-corporate-lightGray">{strategy.timeframe}</span>
                    <Badge 
                      className={`${
                        strategy.severity === 'high' ? 'bg-red-500' :
                        strategy.severity === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      } text-white`}
                    >
                      {strategy.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  {strategy.actions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-corporate-dark rounded">
                      <div className="w-2 h-2 bg-corporate-accent rounded-full" />
                      <span className="text-white">{action}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-corporate-accent text-black hover:bg-corporate-accentDark">
                  Execute {strategy.title}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResponseFramework;
