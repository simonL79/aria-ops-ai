
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Target,
  Shield,
  MessageSquare,
  FileText,
  TrendingUp,
  Rocket
} from 'lucide-react';
import { IntelligencePipeline, IntelligencePipelineResult } from '@/services/intelligence/intelligencePipeline';

interface PipelineCommunicationPanelProps {
  entityName: string;
}

const PipelineCommunicationPanel: React.FC<PipelineCommunicationPanelProps> = ({ entityName }) => {
  const [pipelineResults, setPipelineResults] = useState<IntelligencePipelineResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const executePipeline = async () => {
    if (!entityName) return;
    
    setIsExecuting(true);
    setActiveStep('entity-scan');
    
    try {
      const results = await IntelligencePipeline.executeFullPipeline(entityName);
      setPipelineResults(results);
    } catch (error) {
      console.error('Pipeline execution failed:', error);
    } finally {
      setIsExecuting(false);
      setActiveStep(null);
    }
  };

  const pipelineSteps = [
    {
      id: 'entity-scan',
      title: 'Entity Scan',
      icon: Target,
      description: 'Threat detection and analysis',
      data: pipelineResults?.entityScan
    },
    {
      id: 'cia-precision',
      title: 'CIA Precision',
      icon: Shield,
      description: 'False positive filtering',
      data: pipelineResults?.ciaPrecision
    },
    {
      id: 'counter-narratives',
      title: 'Counter Narratives',
      icon: MessageSquare,
      description: 'Strategic response generation',
      data: pipelineResults?.counterNarratives
    },
    {
      id: 'article-generation',
      title: 'Article Generation',
      icon: FileText,
      description: 'Content template creation',
      data: pipelineResults?.articleGeneration
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: TrendingUp,
      description: 'Pipeline efficiency analysis',
      data: pipelineResults?.performance
    },
    {
      id: 'deployment',
      title: 'Deployment',
      icon: Rocket,
      description: 'Readiness assessment',
      data: pipelineResults?.deployment
    }
  ];

  const getStepStatus = (stepId: string) => {
    if (activeStep === stepId) return 'active';
    if (pipelineResults) return 'complete';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'complete': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Card className="bg-corporate-dark border-corporate-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-corporate-accent" />
          Intelligence Pipeline Communication
        </CardTitle>
        <p className="text-corporate-lightGray text-sm">
          Coordinated flow between Entity Scan → CIA Precision → Counter Narratives → Article Generation
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Pipeline Flow Visualization */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {pipelineSteps.map((step, index) => {
            const Icon = step.icon;
            const status = getStepStatus(step.id);
            
            return (
              <div key={step.id} className="relative">
                <div className={`p-4 rounded-lg border transition-all ${
                  status === 'active' ? 'border-blue-500 bg-blue-500/10' :
                  status === 'complete' ? 'border-green-500 bg-green-500/10' :
                  'border-gray-600 bg-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-5 w-5 ${
                      status === 'active' ? 'text-blue-400' :
                      status === 'complete' ? 'text-green-400' :
                      'text-gray-400'
                    }`} />
                    {status === 'active' && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
                    )}
                    {status === 'complete' && (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    )}
                  </div>
                  
                  <h4 className="text-sm font-medium text-white mb-1">{step.title}</h4>
                  <p className="text-xs text-corporate-lightGray">{step.description}</p>
                  
                  {step.data && (
                    <div className="mt-2 text-xs">
                      {step.id === 'entity-scan' && (
                        <span className="text-green-400">
                          {(step.data as any).threats_detected} threats detected
                        </span>
                      )}
                      {step.id === 'cia-precision' && (
                        <span className="text-blue-400">
                          {((step.data as any).precision_score * 100).toFixed(1)}% precision
                        </span>
                      )}
                      {step.id === 'counter-narratives' && (
                        <span className="text-purple-400">
                          {(step.data as any).narratives_generated} strategies
                        </span>
                      )}
                      {step.id === 'article-generation' && (
                        <span className="text-yellow-400">
                          {(step.data as any).articles_suggested} templates
                        </span>
                      )}
                      {step.id === 'performance' && (
                        <span className="text-orange-400">
                          {(step.data as any).pipeline_efficiency.toFixed(1)}% efficiency
                        </span>
                      )}
                      {step.id === 'deployment' && (
                        <Badge className={`text-xs ${
                          (step.data as any).ready_for_deployment ? 'bg-green-500' : 'bg-yellow-500'
                        }`}>
                          {(step.data as any).ready_for_deployment ? 'Ready' : 'Pending'}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Connection Arrow */}
                {index < pipelineSteps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 text-corporate-lightGray h-4 w-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* Execute Pipeline Button */}
        <div className="flex justify-center">
          <Button
            onClick={executePipeline}
            disabled={isExecuting || !entityName}
            className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            {isExecuting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Executing Pipeline...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Execute Coordinated Pipeline
              </>
            )}
          </Button>
        </div>

        {/* Results Summary */}
        {pipelineResults && (
          <div className="mt-6 p-4 bg-corporate-darkSecondary rounded-lg">
            <h4 className="text-white font-medium mb-3">Pipeline Communication Results</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-corporate-lightGray">Threats → Precision:</span>
                <div className="text-white">
                  {pipelineResults.entityScan.threats_detected} → {pipelineResults.ciaPrecision.verified_results.length} verified
                </div>
              </div>
              
              <div>
                <span className="text-corporate-lightGray">Precision → Narratives:</span>
                <div className="text-white">
                  {pipelineResults.ciaPrecision.verified_results.length} threats → {pipelineResults.counterNarratives.narratives_generated} strategies
                </div>
              </div>
              
              <div>
                <span className="text-corporate-lightGray">Narratives → Articles:</span>
                <div className="text-white">
                  {pipelineResults.counterNarratives.narratives_generated} strategies → {pipelineResults.articleGeneration.articles_suggested} templates
                </div>
              </div>
              
              <div>
                <span className="text-corporate-lightGray">Processing Time:</span>
                <div className="text-white">
                  {(pipelineResults.performance.total_processing_time / 1000).toFixed(2)}s
                </div>
              </div>
              
              <div>
                <span className="text-corporate-lightGray">Efficiency Score:</span>
                <div className="text-white">
                  {pipelineResults.performance.pipeline_efficiency.toFixed(1)}%
                </div>
              </div>
              
              <div>
                <span className="text-corporate-lightGray">Deployment Status:</span>
                <Badge className={pipelineResults.deployment.ready_for_deployment ? 'bg-green-500' : 'bg-yellow-500'}>
                  {pipelineResults.deployment.ready_for_deployment ? 'Ready' : 'Pending'}
                </Badge>
              </div>
            </div>

            {/* Deployment Suggestions */}
            {pipelineResults.deployment.suggested_actions.length > 0 && (
              <div className="mt-4">
                <h5 className="text-white font-medium mb-2">Suggested Actions:</h5>
                <ul className="space-y-1">
                  {pipelineResults.deployment.suggested_actions.map((action, index) => (
                    <li key={index} className="text-corporate-lightGray text-sm flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PipelineCommunicationPanel;
