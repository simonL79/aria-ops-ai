
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, TrendingUp, Users, Shield } from 'lucide-react';

interface RiskSummary {
  company_id: string;
  company_name: string;
  total_employees: number;
  high_risk_employees: number;
  medium_risk_employees: number;
  low_risk_employees: number;
  avg_sentiment: number;
  percent_negative: number;
  active_batches: number;
  flagged_employees: number;
  last_scan_date: string;
}

const RiskDashboard = () => {
  const [riskSummaries, setRiskSummaries] = useState<RiskSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskSummaries();
  }, []);

  const fetchRiskSummaries = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_risk_summary')
        .select('*')
        .order('company_name');

      if (error) throw error;
      setRiskSummaries(data || []);
    } catch (error) {
      console.error('Error fetching risk summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalEmployees = riskSummaries.reduce((sum, company) => sum + company.total_employees, 0);
  const totalHighRisk = riskSummaries.reduce((sum, company) => sum + company.high_risk_employees, 0);
  const totalFlagged = riskSummaries.reduce((sum, company) => sum + company.flagged_employees, 0);
  const totalActiveScans = riskSummaries.reduce((sum, company) => sum + company.active_batches, 0);

  if (loading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Across {riskSummaries.length} companies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalHighRisk}</div>
            <p className="text-xs text-muted-foreground">
              {totalEmployees > 0 ? ((totalHighRisk / totalEmployees) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalFlagged}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalActiveScans}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Company Risk Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Company Risk Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {riskSummaries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No companies found. Add companies to start monitoring employee risks.
            </div>
          ) : (
            <div className="space-y-4">
              {riskSummaries.map((company) => (
                <div key={company.company_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{company.company_name}</h3>
                    <div className="flex gap-2">
                      {company.high_risk_employees > 0 && (
                        <Badge variant="destructive">
                          {company.high_risk_employees} High Risk
                        </Badge>
                      )}
                      {company.flagged_employees > 0 && (
                        <Badge variant="secondary">
                          {company.flagged_employees} Flagged
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Employees:</span>
                      <div className="font-medium">{company.total_employees}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">High Risk:</span>
                      <div className="font-medium text-red-600">{company.high_risk_employees}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Medium Risk:</span>
                      <div className="font-medium text-orange-600">{company.medium_risk_employees}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Low Risk:</span>
                      <div className="font-medium text-green-600">{company.low_risk_employees}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Sentiment:</span>
                      <div className="font-medium">
                        {company.avg_sentiment ? company.avg_sentiment.toFixed(2) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskDashboard;
