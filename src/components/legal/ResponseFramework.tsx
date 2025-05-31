
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Scale, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface ResponseOption {
  id: string;
  type: 'soft' | 'firm' | 'nuclear';
  title: string;
  description: string;
  actions: string[];
  timeline: string;
  cost: string;
}

const ResponseFramework = () => {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const responseOptions: ResponseOption[] = [
    {
      id: 'soft',
      type: 'soft',
      title: 'Soft Response',
      description: 'Diplomatic approach with relationship preservation',
      actions: [
        'Polite correction requests',
        'Educational content sharing',
        'Collaborative fact-checking',
        'Community engagement'
      ],
      timeline: 'Immediate - 24 hours',
      cost: 'Low'
    },
    {
      id: 'firm',
      type: 'firm',
      title: 'Firm Response',
      description: 'Authoritative approach with legal backing',
      actions: [
        'Formal cease & desist letters',
        'Platform takedown requests',
        'Legal precedent citations',
        'Professional enforcement'
      ],
      timeline: '24 - 72 hours',
      cost: 'Medium'
    },
    {
      id: 'nuclear',
      type: 'nuclear',
      title: 'Nuclear Response',
      description: 'Full legal escalation and litigation preparation',
      actions: [
        'Litigation threat assessment',
        'Court filing preparation',
        'Asset investigation',
        'Injunctive relief pursuit'
      ],
      timeline: '1 - 2 weeks',
      cost: 'High'
    }
  ];

  const getResponseColor = (type: string) => {
    switch (type) {
      case 'soft': return 'border-green-500/30 bg-green-500/10';
      case 'firm': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'nuclear': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-corporate-border';
    }
  };

  const getResponseIcon = (type: string) => {
    switch (type) {
      case 'soft': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'firm': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'nuclear': return <Scale className="h-5 w-5 text-red-400" />;
      default: return null;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'soft': return 'bg-green-500/20 text-green-400';
      case 'firm': return 'bg-yellow-500/20 text-yellow-400';
      case 'nuclear': return 'bg-red-500/20 text-red-400';
      default: return 'bg-corporate-accent text-black';
    }
  };

  const executeResponse = async (responseId: string) => {
    setIsExecuting(true);
    const response = responseOptions.find(r => r.id === responseId);
    
    try {
      // Simulate response execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${response?.title} protocol initiated successfully`);
      setSelectedResponse(responseId);
    } catch (error) {
      toast.error('Failed to execute response protocol');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Scale className="h-5 w-5 text-corporate-accent" />
          Response Framework Selection
        </CardTitle>
        <p className="text-sm text-corporate-lightGray">Choose appropriate escalation level based on threat severity</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {responseOptions.map((option) => (
            <Card key={option.id} className={`border ${getResponseColor(option.type)} transition-all hover:scale-105`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getResponseIcon(option.type)}
                    {option.title}
                  </CardTitle>
                  <Badge className={getBadgeColor(option.type)}>
                    {option.type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-corporate-lightGray">{option.description}</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">Actions:</h4>
                  <ul className="text-xs text-corporate-lightGray space-y-1">
                    {option.actions.map((action, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-1 w-1 bg-corporate-accent rounded-full" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between text-xs text-corporate-lightGray">
                  <span>Timeline: {option.timeline}</span>
                  <span>Cost: {option.cost}</span>
                </div>
                
                <Button 
                  onClick={() => executeResponse(option.id)} 
                  disabled={isExecuting}
                  className="w-full"
                  variant={selectedResponse === option.id ? "default" : "outline"}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isExecuting ? 'Executing...' : selectedResponse === option.id ? 'Active' : 'Execute'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {selectedResponse && (
          <div className="mt-6 p-4 bg-corporate-accent/20 border border-corporate-accent rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-corporate-accent" />
              <span className="text-sm text-white font-medium">
                {responseOptions.find(r => r.id === selectedResponse)?.title} protocol is now active
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponseFramework;
