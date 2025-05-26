
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Network, Target, Zap, RefreshCw, Download } from 'lucide-react';
import { enhancedCorrelationEngine, ThreatNetwork, NetworkNode, NetworkEdge } from '@/services/intelligence/enhancedCorrelationEngine';
import { toast } from 'sonner';

// Enhanced Cytoscape component with error handling
const CytoscapeComponent = React.lazy(() => 
  import('react-cytoscapejs').catch(() => ({
    default: () => <div className="flex items-center justify-center h-full text-muted-foreground">Network visualization unavailable</div>
  }))
);

interface EnhancedSigintVisualizerProps {
  threats: any[];
  selectedThreats?: string[];
}

const EnhancedSigintVisualizer = ({ threats, selectedThreats = [] }: EnhancedSigintVisualizerProps) => {
  const [network, setNetwork] = useState<ThreatNetwork | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('network');
  const [cytoscapeElements, setCytoscapeElements] = useState<any[]>([]);
  const [networkStats, setNetworkStats] = useState<any>(null);

  const analyzedThreats = selectedThreats.length > 0 ? selectedThreats : threats.slice(0, 20).map(t => t.id);

  useEffect(() => {
    if (analyzedThreats.length > 1) {
      generateNetwork();
    }
  }, [analyzedThreats]);

  const generateNetwork = async () => {
    setLoading(true);
    try {
      const threatNetwork = await enhancedCorrelationEngine.generateThreatNetwork(analyzedThreats);
      setNetwork(threatNetwork);
      
      // Convert to Cytoscape format
      const elements = [
        ...threatNetwork.nodes.map(node => ({
          data: {
            id: node.id,
            label: node.label,
            type: node.type,
            ...node.metadata
          },
          style: {
            'background-color': node.color,
            'width': node.size,
            'height': node.size,
            'label': node.label,
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#fff',
            'font-size': '10px',
            'text-wrap': 'wrap',
            'text-max-width': '60px'
          }
        })),
        ...threatNetwork.edges.map(edge => ({
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            weight: edge.weight,
            type: edge.type,
            confidence: edge.confidence
          },
          style: {
            'line-color': getEdgeColor(edge.type),
            'target-arrow-color': getEdgeColor(edge.type),
            'target-arrow-shape': 'triangle',
            'width': Math.max(edge.weight * 5, 1),
            'opacity': edge.confidence
          }
        }))
      ];
      
      setCytoscapeElements(elements);
      setNetworkStats(threatNetwork.metrics);
      
    } catch (error) {
      console.error('Network generation failed:', error);
      toast.error('Failed to generate threat network');
    } finally {
      setLoading(false);
    }
  };

  const getEdgeColor = (type: string): string => {
    switch (type) {
      case 'similarity': return '#ff6b6b';
      case 'timing': return '#4ecdc4';
      case 'actor_link': return '#45b7d1';
      case 'platform_cross': return '#f9ca24';
      default: return '#6c5ce7';
    }
  };

  const exportNetwork = () => {
    if (!network) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      threats: analyzedThreats.length,
      network: network,
      metrics: networkStats
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-network-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Network data exported');
  };

  const getNodeTypeColor = (type: string): string => {
    switch (type) {
      case 'threat': return 'bg-red-500';
      case 'actor': return 'bg-orange-500';
      case 'platform': return 'bg-blue-500';
      case 'keyword': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskLevelColor = (level: string): string => {
    switch (level) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (analyzedThreats.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Enhanced SIGINT Network Analysis
          </CardTitle>
          <CardDescription>
            Select at least 2 threats to generate network visualization
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Enhanced SIGINT Network Analysis
            </CardTitle>
            <CardDescription>
              AI-powered threat correlation and network visualization ({analyzedThreats.length} threats)
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={generateNetwork} disabled={loading} variant="outline" size="sm">
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-1" />
                  Regenerate
                </>
              )}
            </Button>
            
            {network && (
              <Button onClick={exportNetwork} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="network">Network Graph</TabsTrigger>
            <TabsTrigger value="clusters">Threat Clusters</TabsTrigger>
            <TabsTrigger value="metrics">Network Metrics</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="network" className="space-y-4">
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Generating threat network...</p>
                </div>
              </div>
            ) : cytoscapeElements.length > 0 ? (
              <div className="h-96 w-full border rounded-lg">
                <React.Suspense fallback={<div className="flex items-center justify-center h-full">Loading visualization...</div>}>
                  <CytoscapeComponent
                    elements={cytoscapeElements}
                    style={{ width: '100%', height: '100%' }}
                    layout={{ 
                      name: 'cose',
                      idealEdgeLength: 100,
                      nodeOverlap: 20,
                      refresh: 20,
                      fit: true,
                      padding: 30,
                      randomize: false,
                      componentSpacing: 100,
                      nodeRepulsion: 400000,
                      edgeElasticity: 100,
                      nestingFactor: 5,
                      gravity: 80,
                      numIter: 1000,
                      initialTemp: 200,
                      coolingFactor: 0.95,
                      minTemp: 1.0
                    }}
                    stylesheet={[
                      {
                        selector: 'node',
                        style: {
                          'label': 'data(label)',
                          'text-valign': 'center',
                          'text-halign': 'center',
                          'color': '#fff',
                          'font-size': '10px',
                          'text-wrap': 'wrap',
                          'text-max-width': '60px',
                          'border-width': 2,
                          'border-color': '#fff'
                        }
                      },
                      {
                        selector: 'edge',
                        style: {
                          'curve-style': 'bezier',
                          'target-arrow-shape': 'triangle',
                          'arrow-scale': 1.2
                        }
                      },
                      {
                        selector: 'node:selected',
                        style: {
                          'border-width': 4,
                          'border-color': '#FFD700'
                        }
                      }
                    ]}
                  />
                </React.Suspense>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No network data available</p>
                  <Button onClick={generateNetwork} className="mt-2">
                    Generate Network
                  </Button>
                </div>
              </div>
            )}
            
            {network && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">{network.nodes.length}</div>
                  <div className="text-sm text-muted-foreground">Nodes</div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">{network.edges.length}</div>
                  <div className="text-sm text-muted-foreground">Connections</div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">{network.clusters.length}</div>
                  <div className="text-sm text-muted-foreground">Clusters</div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">{Math.round(network.metrics.density * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Density</div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="clusters" className="space-y-4">
            {network?.clusters.map((cluster, index) => (
              <div key={cluster.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Cluster #{index + 1}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskLevelColor(cluster.riskLevel)}>
                      {cluster.riskLevel.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(cluster.coherence * 100)}% coherence
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {cluster.threats.length} threats • Centroid: {cluster.centroid}
                </div>
                
                <div className="space-y-1">
                  {cluster.characteristics.map((char, i) => (
                    <div key={i} className="text-xs bg-muted p-2 rounded">
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {!network?.clusters.length && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No threat clusters identified</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            {networkStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Network Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Nodes:</span>
                      <span className="font-mono">{networkStats.totalNodes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Edges:</span>
                      <span className="font-mono">{networkStats.totalEdges}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network Density:</span>
                      <span className="font-mono">{(networkStats.density * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clustering Coefficient:</span>
                      <span className="font-mono">{networkStats.clustering.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Top Central Nodes</h4>
                  <div className="space-y-2">
                    {Object.entries(networkStats.centralityScores)
                      .sort(([,a], [,b]) => (b as number) - (a as number))
                      .slice(0, 5)
                      .map(([nodeId, score]) => (
                        <div key={nodeId} className="flex justify-between text-sm">
                          <span className="truncate">{nodeId.substring(0, 20)}...</span>
                          <span className="font-mono">{(score as number).toFixed(3)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Timeline visualization coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">
                Will show threat propagation over time with correlation patterns
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedSigintVisualizer;
