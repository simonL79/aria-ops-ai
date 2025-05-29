
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, MapPin, ChevronDown, ChevronUp, Users, AlertTriangle, Shield } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { NewCompany } from '@/types/newco';

interface NewCompanyCardProps {
  company: NewCompany;
}

const NewCompanyCard: React.FC<NewCompanyCardProps> = ({ company }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'companies_house':
        return 'Companies House';
      case 'opencorporates':
        return 'OpenCorporates';
      case 'secretary_of_state':
        return 'Secretary of State';
      case 'manual':
        return 'Manual Entry';
      default:
        return source;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline">New</Badge>;
      case 'scanned':
        return <Badge>Scanned</Badge>;
      case 'contacted':
        return <Badge variant="secondary">Contacted</Badge>;
      case 'onboarded':
        return <Badge>Onboarded</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCleanLaunchBadge = (category?: string) => {
    if (!category) return null;
    
    switch (category) {
      case 'green':
        return <Badge className="bg-green-500">Clean Launch</Badge>;
      case 'yellow':
        return <Badge className="bg-yellow-500 text-black">Caution</Badge>;
      case 'red':
        return <Badge variant="destructive">High Risk</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{company.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" /> {formatDate(company.incorporationDate)}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(company.status)}
            <Badge variant="outline">{getSourceLabel(company.source)}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{company.jurisdiction}</span>
          </div>
          <div className="flex items-center text-sm">
            <Building className="h-4 w-4 mr-2" />
            <span>{company.industry}</span>
          </div>
        </div>

        {company.cleanLaunchScore !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Clean Launch™ Score</span>
              {company.cleanLaunchCategory && (
                <div>{getCleanLaunchBadge(company.cleanLaunchCategory)}</div>
              )}
            </div>
            <Progress 
              value={company.cleanLaunchScore} 
              className="h-2"
            />
          </div>
        )}

        {expanded && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Users className="h-4 w-4 mr-2" /> Directors & Officers
            </h4>
            <div className="space-y-3">
              {company.directors.map((director) => (
                <div key={director.id} className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{director.name}</span>
                    <span className="text-muted-foreground">{director.role}</span>
                  </div>
                  
                  {director.reputationScan && (
                    <div className="mt-1">
                      <div className="flex items-center text-xs">
                        {director.reputationScan.riskCategory === 'high' ? (
                          <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                        ) : director.reputationScan.riskCategory === 'medium' ? (
                          <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" />
                        ) : (
                          <Shield className="h-3 w-3 mr-1 text-green-500" />
                        )}
                        <span>
                          {director.reputationScan.riskCategory === 'high' ? 'High' :
                           director.reputationScan.riskCategory === 'medium' ? 'Medium' : 'Low'} Risk
                        </span>
                        <span className="mx-1">•</span>
                        <span>{director.reputationScan.issues.length} issues found</span>
                      </div>
                      
                      {director.reputationScan.issues.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {director.reputationScan.issues.slice(0, 2).map((issue) => (
                            <div key={issue.id} className="text-xs bg-muted p-2 rounded">
                              <div className="font-medium">{issue.title}</div>
                              <div className="line-clamp-1">{issue.description}</div>
                            </div>
                          ))}
                          {director.reputationScan.issues.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              + {director.reputationScan.issues.length - 2} more issues
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> More
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewCompanyCard;
