
import React, { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Settings, RefreshCcw, Building, Download } from "lucide-react";
import { NewCompany, NewCoFilters } from "@/types/newco";
import NewCompanyFeed from "@/components/newco/NewCompanyFeed";
import NewCoFilterBar from "@/components/newco/NewCoFilterBar";
import { toast } from "sonner";

const mockNewCompanies: NewCompany[] = [
  {
    id: "nc-1",
    name: "Quantum Innovations Ltd",
    incorporationDate: "2025-05-18",
    jurisdiction: "United Kingdom",
    industry: "Technology",
    sicCode: "62020",
    source: "companies_house",
    cleanLaunchScore: 85,
    cleanLaunchCategory: "green",
    status: "new",
    directors: [
      {
        id: "d-1",
        name: "Sarah Johnson",
        role: "Director",
        address: "123 Tech Lane, London",
        reputationScan: {
          id: "rs-1",
          personId: "d-1",
          scanDate: "2025-05-19",
          overallSentiment: 0.7,
          riskScore: 15,
          riskCategory: "low",
          issues: [],
          sources: {
            news: 3,
            social: 12,
            legal: 0,
            other: 1
          }
        }
      }
    ]
  },
  {
    id: "nc-2",
    name: "EcoSolutions Global Inc",
    incorporationDate: "2025-05-17",
    jurisdiction: "United States",
    industry: "Environmental Services",
    sicCode: "3825",
    source: "secretary_of_state",
    cleanLaunchScore: 62,
    cleanLaunchCategory: "yellow",
    status: "scanned",
    directors: [
      {
        id: "d-2",
        name: "Michael Roberts",
        role: "CEO",
        reputationScan: {
          id: "rs-2",
          personId: "d-2",
          scanDate: "2025-05-18",
          overallSentiment: -0.2,
          riskScore: 45,
          riskCategory: "medium",
          issues: [
            {
              id: "ri-1",
              type: "controversy",
              title: "Environmental Dispute",
              description: "Was involved in a dispute regarding environmental regulations at previous company",
              source: "Local News",
              url: "https://example.com/news/article",
              date: "2024-11-10",
              severity: "medium",
              remediationStatus: "not_started"
            }
          ],
          sources: {
            news: 8,
            social: 23,
            legal: 1,
            other: 4
          }
        }
      },
      {
        id: "d-3",
        name: "Jennifer Lee",
        role: "CFO",
        reputationScan: {
          id: "rs-3",
          personId: "d-3",
          scanDate: "2025-05-18",
          overallSentiment: 0.5,
          riskScore: 20,
          riskCategory: "low",
          issues: [],
          sources: {
            news: 2,
            social: 8,
            legal: 0,
            other: 1
          }
        }
      }
    ]
  },
  {
    id: "nc-3",
    name: "Fintech Frontier Ltd",
    incorporationDate: "2025-05-15",
    jurisdiction: "United Kingdom",
    industry: "Finance",
    sicCode: "64209",
    source: "companies_house",
    cleanLaunchScore: 35,
    cleanLaunchCategory: "red",
    status: "contacted",
    directors: [
      {
        id: "d-4",
        name: "David Chen",
        role: "Director",
        address: "45 Financial Street, Manchester",
        reputationScan: {
          id: "rs-4",
          personId: "d-4",
          scanDate: "2025-05-16",
          overallSentiment: -0.6,
          riskScore: 75,
          riskCategory: "high",
          issues: [
            {
              id: "ri-2",
              type: "lawsuit",
              title: "Financial Misconduct Lawsuit",
              description: "Named in a lawsuit regarding financial misconduct at previous firm",
              source: "Court Records",
              date: "2023-08-22",
              severity: "high",
              remediationStatus: "in_progress",
              remediationStrategy: "Legal counsel engaged, press statement prepared"
            },
            {
              id: "ri-3",
              type: "negative_press",
              title: "Negative Media Coverage",
              description: "Subject of negative coverage in financial press",
              source: "Financial Times",
              url: "https://example.com/finance/article",
              date: "2024-02-15",
              severity: "medium",
              remediationStatus: "in_progress"
            }
          ],
          sources: {
            news: 15,
            social: 42,
            legal: 3,
            other: 7
          }
        }
      }
    ]
  }
];

const NewCoPage: React.FC = () => {
  const [newCompanies, setNewCompanies] = useState<NewCompany[]>(mockNewCompanies);
  const [loading, setLoading] = useState(false);
  const [lastScan, setLastScan] = useState<string>("2025-05-20T08:00:00Z");
  const [filters, setFilters] = useState<NewCoFilters>({
    timeframe: 'this_week',
    jurisdictions: [],
    industries: [],
    cleanLaunchCategories: [],
    status: []
  });

  const refreshData = async () => {
    setLoading(true);
    // In a real implementation, this would fetch new company registration data
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastScan(new Date().toISOString());
    toast.success("Company registration scan complete", {
      description: "New company data has been refreshed"
    });
    setLoading(false);
  };

  const handleFilterChange = (newFilters: Partial<NewCoFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Apply filters to companies
  const filteredCompanies = newCompanies.filter(company => {
    // Filter by jurisdiction
    if (filters.jurisdictions.length > 0 && !filters.jurisdictions.includes(company.jurisdiction)) {
      return false;
    }
    
    // Filter by industry
    if (filters.industries.length > 0 && !filters.industries.includes(company.industry)) {
      return false;
    }
    
    // Filter by clean launch category
    if (filters.cleanLaunchCategories.length > 0 && 
        company.cleanLaunchCategory && 
        !filters.cleanLaunchCategories.includes(company.cleanLaunchCategory)) {
      return false;
    }
    
    // Filter by status
    if (filters.status.length > 0 && !filters.status.includes(company.status)) {
      return false;
    }
    
    return true;
  });

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">NewCo Reputation Defense</h1>
        <p className="text-muted-foreground">
          Monitor new company registrations and identify proactive reputation management opportunities
        </p>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            Last scan: {new Date(lastScan).toLocaleString()}
          </span>
          <Button variant="ghost" size="sm" className="ml-auto h-7">
            <Settings className="h-3 w-3 mr-1" />
            <span className="text-xs">Configure NewCo Defense</span>
          </Button>
          <Button variant="outline" size="sm" className="ml-2 h-7" onClick={refreshData} disabled={loading}>
            <RefreshCcw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs">Run Scan</span>
          </Button>
          <Button variant="outline" size="sm" className="ml-2 h-7">
            <Download className="h-3 w-3 mr-1" />
            <span className="text-xs">Export</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="companies">New Companies</TabsTrigger>
          <TabsTrigger value="founders">Founders</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
        </TabsList>
        
        <TabsContent value="companies" className="py-4">
          <NewCoFilterBar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
          <NewCompanyFeed 
            companies={filteredCompanies}
          />
        </TabsContent>
        
        <TabsContent value="founders" className="py-4">
          <div className="flex items-center justify-center p-12 border rounded-lg bg-secondary/50">
            <Building className="h-12 w-12 opacity-50 mb-4" />
            <div className="text-center">
              <h3 className="text-lg font-medium">Founders View</h3>
              <p className="text-muted-foreground">
                Detailed founder reputation analysis coming soon
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="outreach" className="py-4">
          <div className="flex items-center justify-center p-12 border rounded-lg bg-secondary/50">
            <Building className="h-12 w-12 opacity-50 mb-4" />
            <div className="text-center">
              <h3 className="text-lg font-medium">Outreach Dashboard</h3>
              <p className="text-muted-foreground">
                Automated outreach pipeline and templates coming soon
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default NewCoPage;
