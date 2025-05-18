
import { useState } from "react";
import { 
  Shield, 
  ShieldCheck, 
  Eye, 
  Search, 
  MessageSquareWarning,
  AlertTriangle,
  Ban
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Define intelligence levels and strategies
type IntelligenceLevel = 'basic' | 'advanced' | 'expert';
type ContentThreatType = 'falseReviews' | 'coordinatedAttack' | 'competitorSmear' | 'botActivity';

interface ContentThreat {
  type: ContentThreatType;
  description: string;
  icon: React.ReactNode;
  detectionRate: number;
  difficulty: 'easy' | 'moderate' | 'hard';
}

interface IntelligenceStrategy {
  name: string;
  description: string;
  effectivenessRate: number;
  platforms: string[];
  timeToImplement: string;
  icon: React.ReactNode;
}

const threatTypes: Record<ContentThreatType, ContentThreat> = {
  falseReviews: {
    type: 'falseReviews',
    description: 'Fake negative reviews posted by non-customers',
    icon: <MessageSquareWarning className="h-4 w-4" />,
    detectionRate: 78,
    difficulty: 'moderate'
  },
  coordinatedAttack: {
    type: 'coordinatedAttack',
    description: 'Multiple accounts posting similar negative content',
    icon: <AlertTriangle className="h-4 w-4" />,
    detectionRate: 65,
    difficulty: 'hard'
  },
  competitorSmear: {
    type: 'competitorSmear',
    description: 'Negative content from competitor entities',
    icon: <Ban className="h-4 w-4" />,
    detectionRate: 58,
    difficulty: 'hard'
  },
  botActivity: {
    type: 'botActivity',
    description: 'Automated negative content from bot accounts',
    icon: <Shield className="h-4 w-4" />,
    detectionRate: 89,
    difficulty: 'easy'
  }
};

const strategies: IntelligenceStrategy[] = [
  {
    name: 'Pattern Recognition',
    description: 'Uses AI to identify patterns in negative content that suggest coordination',
    effectivenessRate: 76,
    platforms: ['Twitter', 'Reddit', 'Facebook'],
    timeToImplement: '1-2 days',
    icon: <Search className="h-4 w-4" />
  },
  {
    name: 'Linguistic Analysis',
    description: 'Analyzes language patterns to identify fake reviews and comments',
    effectivenessRate: 82,
    platforms: ['Yelp', 'Google Reviews', 'Amazon'],
    timeToImplement: '3-5 days',
    icon: <Eye className="h-4 w-4" />
  },
  {
    name: 'Cross-Platform Monitoring',
    description: 'Monitors multiple platforms to identify coordinated attacks',
    effectivenessRate: 94,
    platforms: ['All Major Platforms'],
    timeToImplement: '1 week',
    icon: <ShieldCheck className="h-4 w-4" />
  }
];

const getIntelligenceLevelColor = (level: IntelligenceLevel) => {
  switch (level) {
    case 'basic': 
      return 'bg-blue-500 hover:bg-blue-600';
    case 'advanced':
      return 'bg-purple-600 hover:bg-purple-700';
    case 'expert':
      return 'bg-red-600 hover:bg-red-700';
    default:
      return 'bg-gray-500';
  }
};

const ContentIntelligencePanel = () => {
  const [level, setLevel] = useState<IntelligenceLevel>('basic');
  
  const handleActivateIntelligence = () => {
    toast.success(`${level.charAt(0).toUpperCase() + level.slice(1)} intelligence activated`, {
      description: "Analyzing content patterns and identifying threats..."
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`${getIntelligenceLevelColor(level)} text-white`}>
          <Shield className="mr-2 h-4 w-4" />
          Intelligence
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Tabs defaultValue="threats" className="w-full">
          <div className="border-b px-3">
            <TabsList className="grid grid-cols-3 mt-2 mb-2">
              <TabsTrigger value="threats">Threats</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="threats" className="p-4 space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-2">Detected Content Threats</h3>
              {Object.values(threatTypes).map((threat) => (
                <div key={threat.type} className="flex items-start justify-between mb-3 p-2 rounded hover:bg-gray-100">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">{threat.icon}</div>
                    <div>
                      <p className="text-sm font-medium">{threat.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                      <p className="text-xs text-muted-foreground">{threat.description}</p>
                    </div>
                  </div>
                  <Badge variant={threat.difficulty === 'easy' ? 'outline' : threat.difficulty === 'moderate' ? 'secondary' : 'destructive'} className="text-xs">
                    {threat.difficulty}
                  </Badge>
                </div>
              ))}
            </div>
            <Button size="sm" className="w-full" onClick={handleActivateIntelligence}>
              Analyze Content
            </Button>
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-4 p-4">
            <div>
              <h3 className="font-medium text-sm mb-2">Defense Strategies</h3>
              {strategies.map((strategy, index) => (
                <Card key={strategy.name} className="mb-3">
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center">
                        {strategy.icon}
                        <span className="ml-2">{strategy.name}</span>
                      </CardTitle>
                      <Badge className="bg-green-600">{strategy.effectivenessRate}%</Badge>
                    </div>
                    <CardDescription className="text-xs mt-1">{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Platforms: {strategy.platforms.join(', ')}</span>
                      <span className="text-muted-foreground">Time: {strategy.timeToImplement}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="p-4">
            <div className="mb-4">
              <h3 className="font-medium text-sm mb-2">Intelligence Level</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={level === 'basic' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setLevel('basic')}
                  className={level === 'basic' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                >
                  Basic
                </Button>
                <Button 
                  variant={level === 'advanced' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setLevel('advanced')}
                  className={level === 'advanced' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Advanced
                </Button>
                <Button 
                  variant={level === 'expert' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setLevel('expert')}
                  className={level === 'expert' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  Expert
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {level === 'basic' ? 'Basic detection of negative content and simple patterns.' : 
                 level === 'advanced' ? 'Advanced linguistic analysis and cross-platform monitoring.' :
                 'Expert-level forensic analysis of coordinated campaigns and sophisticated attacks.'}
              </p>
            </div>
            <Button size="sm" className="w-full" onClick={handleActivateIntelligence}>
              Apply Settings
            </Button>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default ContentIntelligencePanel;
