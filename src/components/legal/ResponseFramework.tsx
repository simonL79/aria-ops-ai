
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
        <div className="space-y-4">
          {responseOptions.map((option) => (
            <Card key={option.id} className={`border ${getResponseColor(option.type)} transition-all hover:scale-[1.02] cursor-pointer`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getResponseIcon(option.type)}
                    <div>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        {option.title}
                      </CardTitle>
                      <p className="text-sm text-corporate-lightGray mt-1">{option.description}</p>
                    </div>
                  </div>
                  <Badge className={getBadgeColor(option.type)}>
                    {option.type.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-white">Key Actions:</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {option.actions.map((action, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-corporate-lightGray">
                        <div className="h-1.5 w-1.5 bg-corporate-accent rounded-full mt-2 flex-shrink-0" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-corporate-border">
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-corporate-lightGray">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Timeline:</span>
                      <span>{option.timeline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Cost:</span>
                      <span>{option.cost}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => executeResponse(option.id)} 
                    disabled={isExecuting}
                    className="min-w-[120px]"
                    variant={selectedResponse === option.id ? "default" : "outline"}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isExecuting ? 'Executing...' : selectedResponse === option.id ? 'Active' : 'Execute'}
                  </Button>
                </div>
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
