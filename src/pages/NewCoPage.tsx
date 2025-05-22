
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import DashboardLayout from "@/components/layout/DashboardLayout";
import NewCompanyFeed from "@/components/newco/NewCompanyFeed";
import { Button } from "@/components/ui/button";
import { NewCompany } from "@/types/newco";
import { fetchCompaniesFromDatabase } from '@/services/cleanLaunch/databaseService';
import { runCleanLaunchPipeline } from '@/services/cleanLaunch/pipelineService';
import { Calendar, RefreshCw, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const NewCoPage = () => {
  const [companies, setCompanies] = useState<NewCompany[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadCompanies();
  }, [statusFilter]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      // Fetch companies from database
      const dbCompanies = await fetchCompaniesFromDatabase({
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 10
      });
      
      // Format database companies to match our NewCompany type
      const formattedCompanies: NewCompany[] = dbCompanies.map(company => ({
        id: `ch_${company.company_number}`,
        name: company.company_name,
        incorporationDate: company.date_of_incorporation,
        jurisdiction: 'United Kingdom', // Default jurisdiction
        industry: company.industry || 'Unknown',
        source: 'companies_house',
        status: company.scan_status,
        cleanLaunchScore: company.risk_score,
        cleanLaunchCategory: company.risk_category as 'green' | 'yellow' | 'red',
        directors: company.officers ? formatDirectors(company.officers) : []
      }));
      
      setCompanies(formattedCompanies);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };
  
  // Format directors from database JSON format
  const formatDirectors = (officers: any[]) => {
    if (!Array.isArray(officers)) {
      try {
        officers = JSON.parse(officers);
      } catch {
        return [];
      }
    }
    
    return officers.map((officer, index) => ({
      id: `dir_${index}`,
      name: officer.name || 'Unknown',
      role: officer.role || 'Director',
      reputationScan: officer.risk ? {
        id: `scan_${index}`,
        personId: `dir_${index}`,
        scanDate: new Date().toISOString(),
        overallSentiment: 0,
        riskScore: 0,
        riskCategory: officer.risk as 'low' | 'medium' | 'high',
        issues: [],
        sources: {
          news: 0,
          social: 0,
          legal: 0,
          other: 0
        }
      } : undefined
    }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadCompanies();
      toast.success('Company list refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh company list');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAnalyzeCompany = async (company: NewCompany) => {
    toast.info(`Analyzing ${company.name}...`);
    try {
      const updatedCompany = await runCleanLaunchPipeline(company);
      setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
      toast.success(`Analysis completed for ${company.name}`);
    } catch (error) {
      console.error('Error analyzing company:', error);
      toast.error(`Failed to analyze ${company.name}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">New Company Intelligence</h1>
          <p className="text-muted-foreground">
            Analyze new UK company registrations to identify potential clients
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            variant="default"
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Latest Companies
          </Button>
        </div>
      </div>

      <div className="flex items-center mb-6 gap-2">
        <span className="text-sm font-medium">Status:</span>
        <div className="flex gap-2">
          {['all', 'pending', 'scanning', 'scanned', 'contacted'].map((status) => (
            <Button 
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status === 'all' ? 'All' : status}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : companies.length > 0 ? (
        <NewCompanyFeed companies={companies} onAnalyze={handleAnalyzeCompany} />
      ) : (
        <div className="p-12 border rounded-lg bg-muted/30 flex flex-col items-center justify-center">
          <p className="mb-4 text-lg font-medium">No companies found</p>
          <p className="text-muted-foreground mb-6 text-center">
            No companies match your current filters or there are no new company registrations to analyze
          </p>
          <Button onClick={handleRefresh}>Refresh Data</Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default NewCoPage;
