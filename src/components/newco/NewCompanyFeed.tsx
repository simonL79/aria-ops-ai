
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewCompany } from '@/types/newco';
import { AlertTriangle, ChevronRight, Building } from 'lucide-react';

interface NewCompanyFeedProps {
  companies: NewCompany[];
}

const NewCompanyFeed: React.FC<NewCompanyFeedProps> = ({ companies }) => {
  const navigate = useNavigate();

  if (!companies || companies.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 border rounded-lg bg-secondary/50">
        <Building className="h-12 w-12 opacity-50 mb-4" />
        <div className="text-center">
          <h3 className="text-lg font-medium">No Companies Found</h3>
          <p className="text-muted-foreground">
            No company records match your current filters
          </p>
        </div>
      </div>
    );
  }

  const handleViewDetails = (companyId: string) => {
    navigate(`/newco-details/${companyId}`);
  };

  const getRiskBadge = (category: string) => {
    switch (category) {
      case 'green':
        return <Badge className="bg-green-500">Low Risk</Badge>;
      case 'yellow':
        return <Badge className="bg-yellow-500">Medium Risk</Badge>;
      case 'red':
        return <Badge className="bg-red-500">High Risk</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">New</Badge>;
      case 'scanned':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Scanned</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Contacted</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {companies.map(company => (
        <Card key={company.id} className="overflow-hidden">
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-lg font-medium">{company.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {company.industry} • {company.jurisdiction} • {new Date(company.incorporationDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {getStatusBadge(company.status)}
              {getRiskBadge(company.cleanLaunchCategory)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm"><span className="font-medium">Clean Launch Score:</span> {company.cleanLaunchScore}/100</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {company.directors && company.directors.map(director => (
                    <div key={director.id} className="text-xs border px-2 py-1 rounded-md">
                      {director.name} ({director.role})
                      {director.reputationScan && director.reputationScan.riskCategory === 'high' && (
                        <AlertTriangle className="h-3 w-3 inline ml-1 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={() => handleViewDetails(company.id)}
                className="flex items-center gap-1"
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NewCompanyFeed;
