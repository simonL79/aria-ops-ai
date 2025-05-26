
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Shield, Target, Activity } from 'lucide-react';
import { callOpenAI } from '@/services/api/openaiClient';
import { toast } from 'sonner';

// Dynamic import for Cytoscape to avoid SSR issues
const CytoscapeComponent = React.lazy(() => 
  import('react-cytoscapejs').catch(() => ({
    default: () => <div className="flex items-center justify-center h-full text-muted-foreground">Network visualization unavailable</div>
  }))
);

// ======================================
// GPT Utility
// ======================================
const runPrompt = async (prompt: string) => {
  try {
    const response = await callOpenAI({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5
    });
    return response.choices[0].message.content?.trim() ?? '';
  } catch (error) {
    console.error('Error running prompt:', error);
    toast.error('Failed to get AI analysis');
    return '';
  }
};

// ======================================
// Threat Escalation Predictor
// ======================================
const ThreatEscalationPredictor = ({ summary }: { summary: string }) => {
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const getPrediction = async () => {
    setLoading(true);
    const prompt = `
Based on the following summary of a digital reputational threat, estimate the likelihood of escalation (Low / Moderate / High) and briefly explain why:

"${summary}"

Respond in the format: 
Likelihood: [Low|Moderate|High]
Reason: [Explanation]
    `;
    const result = await runPrompt(prompt);
    setPrediction(result);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Escalation Risk Analysis
        </CardTitle>
        <CardDescription>
          AI-powered prediction of threat escalation likelihood
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={getPrediction} disabled={loading} className="mb-4">
          {loading ? 'Analyzing...' : 'Predict Escalation Risk'}
        </Button>
        {prediction && (
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{prediction}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ======================================
// Psychographic Profiler
// ======================================
const PsychographicProfiler = ({ summary }: { summary: string }) => {
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    setLoading(true);
    const prompt = `
Given this threat summary, create a profile of the threat actor's likely tone, motive, and likelihood of escalation:

"${summary}"

Respond in this format:
Tone: [e.g., Hostile, Sarcastic, Neutral]
Motive: [e.g., Discredit, Shame, Disrupt]
Escalation Risk: [Low | Moderate | High]
    `;
    const result = await runPrompt(prompt);
    setProfile(result);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Psychographic Profile
        </CardTitle>
        <CardDescription>
          Behavioral analysis of threat actor patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={getProfile} disabled={loading} variant="secondary" className="mb-4">
          {loading ? 'Profiling...' : 'Generate Psychographic Profile'}
        </Button>
        {profile && (
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{profile}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ======================================
// Counterplay Assistant
// ======================================
const CounterplayAssistant = ({ summary }: { summary: string }) => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    setLoading(true);
    const prompt = `
Based on this reputational threat summary, suggest a recommended strategic response (Engage / Ignore / De-escalate / Escalate) and explain why.

Summary:
"${summary}"

Respond in this format:
Recommended Strategy: [Option]
Reason: [Explanation]
Optional Language: [Optional copy or talking points]
    `;
    const result = await runPrompt(prompt);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Strategic Response
        </CardTitle>
        <CardDescription>
          AI-recommended counterplay strategies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={getAdvice} disabled={loading} variant="outline" className="mb-4">
          {loading ? 'Advising...' : 'Get Counterplay Strategy'}
        </Button>
        {advice && (
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{advice}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ======================================
// SIGINT Visualizer
// ======================================
const SigintVisualizer = ({ threats }: { threats: any[] }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const nodes = threats.map((t: any, i: number) => ({
      data: { id: t.id || `threat-${i}`, label: t.title || t.content?.substring(0, 30) || `Threat ${i}` }
    }));

    const edges = threats.flatMap((t1: any, i1: number) =>
      threats.flatMap((t2: any, i2: number) =>
        i1 < i2 && t1.platform === t2.platform
          ? [{ data: { source: t1.id || `threat-${i1}`, target: t2.id || `threat-${i2}` } }]
          : []
      )
    );

    setElements([...nodes, ...edges]);
  }, [threats]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          SIGINT Network Analysis
        </CardTitle>
        <CardDescription>
          Visual correlation of threat actors and platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full border rounded-lg">
          <React.Suspense fallback={<div className="flex items-center justify-center h-full">Loading visualization...</div>}>
            <CytoscapeComponent
              elements={elements}
              style={{ width: '100%', height: '100%' }}
              layout={{ name: 'cose' }}
              stylesheet={[
                {
                  selector: 'node',
                  style: {
                    'background-color': '#666',
                    'label': 'data(label)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#fff',
                    'font-size': '12px'
                  }
                },
                {
                  selector: 'edge',
                  style: {
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle'
                  }
                }
              ]}
            />
          </React.Suspense>
        </div>
      </CardContent>
    </Card>
  );
};

// ======================================
// Main Threat Intelligence Panel
// ======================================
export const ThreatIntelligencePanel = ({
  summary,
  threats
}: {
  summary: string;
  threats: any[];
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Advanced Threat Intelligence</h2>
      </div>
      
      <Tabs defaultValue="escalation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="escalation">Escalation</TabsTrigger>
          <TabsTrigger value="profile">Profiling</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>
        
        <TabsContent value="escalation" className="mt-6">
          <ThreatEscalationPredictor summary={summary} />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <PsychographicProfiler summary={summary} />
        </TabsContent>
        
        <TabsContent value="strategy" className="mt-6">
          <CounterplayAssistant summary={summary} />
        </TabsContent>
        
        <TabsContent value="network" className="mt-6">
          <SigintVisualizer threats={threats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
