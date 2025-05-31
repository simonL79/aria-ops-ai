
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AnubisMemoryConsole from '@/components/aria/AnubisMemoryConsole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Database, Network, Target } from 'lucide-react';

const AnubisMemoryPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-corporate-dark min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 corporate-heading">
              <Brain className="h-8 w-8 text-corporate-accent" />
              A.N.U.B.I.S™ Memory System
            </h1>
            <p className="corporate-subtext mt-1">
              Advanced Neural Understanding & Behavioral Intelligence System
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-corporate-darkSecondary text-corporate-lightGray border-corporate-border">
              <Database className="h-3 w-3" />
              Qdrant Vector Store
            </Badge>
            <Badge className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
              Memory Intelligence Engine
            </Badge>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Brain className="h-4 w-4 text-corporate-accent" />
                Entity Memories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">∞</div>
              <p className="text-xs corporate-subtext">Contextual intelligence</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Target className="h-4 w-4 text-corporate-accent" />
                Threat Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">∞</div>
              <p className="text-xs corporate-subtext">Behavioral analysis</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Network className="h-4 w-4 text-corporate-accent" />
                Entity Relations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">∞</div>
              <p className="text-xs corporate-subtext">Relationship mapping</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Database className="h-4 w-4 text-corporate-accent" />
                Vector Recall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">&lt; 100ms</div>
              <p className="text-xs corporate-subtext">Query response time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Console */}
        <AnubisMemoryConsole />

        {/* System Capabilities */}
        <Card className="border-corporate-accent bg-corporate-darkSecondary">
          <CardHeader>
            <CardTitle className="text-corporate-accent flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Advanced Memory Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-corporate-lightGray space-y-2 text-sm">
              <p><strong className="text-white">Vector Memory Storage:</strong> Store and retrieve entity memories using semantic similarity</p>
              <p><strong className="text-white">Threat Pattern Recognition:</strong> Automatically identify and track threat patterns across entities</p>
              <p><strong className="text-white">Entity Relationship Mapping:</strong> Discover and map complex relationships between entities</p>
              <p><strong className="text-white">Contextual Intelligence:</strong> Provide comprehensive entity context for enhanced analysis</p>
              <p><strong className="text-white">Temporal Decay:</strong> Implement memory decay functions for relevant information prioritization</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnubisMemoryPage;
