
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Building, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  AlertTriangle, 
  Shield, 
  FileText,
  Calendar,
  Mail,
  ArrowUpRight
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NewCompany } from '@/types/newco';
import { toast } from 'sonner';

interface NewCompanyCardProps {
  company: NewCompany;
}

const NewCompanyCard: React.FC<NewCompanyCardProps> = ({ company }) => {
  const [expanded, setExpanded] = useState(false);

  const getCleanLaunchColor = (category?: 'green' | 'yellow' | 'red') => {
    switch (category) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline">New</Badge>;
      case 'scanned':
        return <Badge variant="secondary">Scanned</Badge>;
      case 'contacted':
        return <Badge variant="default">Contacted</Badge>;
      case 'onboarded':
        return <Badge variant="success" className="bg-green-500">Onboarded</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return null;
    }
  };

  const hasReputationIssues = company.directors.some(
    director => director.reputationScan?.issues.length > 0
  );

  const handleGenerateReport = () => {
    toast.success("Report generation initiated", {
      description: "Your Clean Launch Report will be ready shortly"
    });
  };

  const handleCreateOutreach = () => {
    toast.success("Outreach draft created", {
      description: "Check the outreach tab to review and send"
    });
  };

  return (
    <Card className={`shadow-sm transition-all ${expanded ? 'shadow-md' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{company.name}</CardTitle>
              {getStatusBadge(company.status)}
              {hasReputationIssues && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Reputation Issues
                </Badge>
              )}
            </div>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>{company.jurisdiction}</span>
              <span>•</span>
              <span>{company.industry}</span>
              <span>•</span>
              <Calendar className="h-3 w-3 inline" />
              <span>
                Incorporated {format(new Date(company.incorporationDate), 'MMM d, yyyy')}
              </span>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end">
            {company.cleanLaunchScore !== undefined && (
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground mb-1">Clean Launch Score</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={company.cleanLaunchScore} 
                    max={100} 
                    className="w-24 h-2" 
                    indicatorClassName={getCleanLaunchColor(company.cleanLaunchCategory)}
                  />
                  <span className="text-sm font-medium">{company.cleanLaunchScore}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4" />
          <span className="font-medium">Directors:</span>
          <span>{company.directors.map(d => d.name).join(', ')}</span>
        </div>

        {expanded && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Risk Assessment</h4>
            {company.directors.map(director => (
              <div key={director.id} className="mb-3 p-2 bg-secondary/50 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{director.name}</span>
                  <span className="text-xs">{director.role}</span>
                </div>
                
                {director.reputationScan ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Risk Score</span>
                        <div className="flex items-center gap-1">
                          <Progress 
                            value={director.reputationScan.riskScore} 
                            max={100} 
                            className="w-16 h-1.5"
                            indicatorClassName={`${director.reputationScan.riskCategory === 'high' ? 'bg-red-500' : 
                              director.reputationScan.riskCategory === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                          />
                          <span className="text-xs font-medium">{director.reputationScan.riskScore}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Sentiment</span>
                        <span className="text-xs font-medium">
                          {(director.reputationScan.overallSentiment * 100).toFixed(0)}%
                          {director.reputationScan.overallSentiment > 0 ? ' positive' : 
                           director.reputationScan.overallSentiment < 0 ? ' negative' : ' neutral'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Sources</span>
                        <span className="text-xs">
                          {director.reputationScan.sources.news + 
                           director.reputationScan.sources.social + 
                           director.reputationScan.sources.legal + 
                           director.reputationScan.sources.other} total mentions
                        </span>
                      </div>
                    </div>
                    
                    {director.reputationScan.issues.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {director.reputationScan.issues.length} reputation issue(s) detected
                        </span>
                        <ul className="mt-1 space-y-1">
                          {director.reputationScan.issues.map(issue => (
                            <li key={issue.id} className="text-xs p-1.5 bg-secondary rounded">
                              <div className="flex justify-between">
                                <span className="font-medium">{issue.title}</span>
                                <Badge variant={
                                  issue.severity === 'high' ? 'destructive' :
                                  issue.severity === 'medium' ? 'secondary' : 'outline'
                                } className="h-4 px-1">
                                  {issue.severity}
                                </Badge>
                              </div>
                              <p className="mt-0.5 text-muted-foreground">{issue.description}</p>
                              {issue.source && (
                                <div className="mt-1 flex items-center justify-between">
                                  <span className="text-[10px] text-muted-foreground">
                                    Source: {issue.source}
                                    {issue.date && ` • ${format(new Date(issue.date), 'MMM yyyy')}`}
                                  </span>
                                  {issue.url && (
                                    <a 
                                      href={issue.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[10px] flex items-center text-blue-500 hover:underline"
                                    >
                                      View <ArrowUpRight className="h-2 w-2 ml-0.5" />
                                    </a>
                                  )}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    No reputation scan available
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <Button 
          variant="ghost" 
          className="p-1 h-auto"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <div className="flex items-center text-xs">
              <ChevronUp className="h-4 w-4 mr-1" />
              Collapse
            </div>
          ) : (
            <div className="flex items-center text-xs">
              <ChevronDown className="h-4 w-4 mr-1" />
              See details
            </div>
          )}
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center h-8"
            onClick={handleGenerateReport}
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Clean Launch Report
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="flex items-center h-8"
            onClick={handleCreateOutreach}
          >
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            Create Outreach
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewCompanyCard;
