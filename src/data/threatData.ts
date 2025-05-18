
import { 
  MessageSquareWarning, 
  AlertTriangle, 
  Ban, 
  Shield,
  Search,
  Eye,
  ShieldCheck
} from "lucide-react";
import { ContentThreat, IntelligenceStrategy } from "@/types/intelligence";

export const threatTypes: Record<string, ContentThreat> = {
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

export const strategies: IntelligenceStrategy[] = [
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
