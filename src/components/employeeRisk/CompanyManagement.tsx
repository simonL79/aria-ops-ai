
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  industry: string;
  employee_count: number;
  created_at: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  risk_score: number;
}

const CompanyManagement = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      loadEmployees(selectedCompany);
    }
  }, [selectedCompany]);

  const loadCompanies = async () => {
    try {
      // Use the existing 'clients' table as a substitute for companies
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform client data to company format
      const companyData: Company[] = (data || []).map(client => ({
        id: client.id,
        name: client.name,
        industry: client.industry,
        employee_count: 0, // Default since we don't have this field
        created_at: client.created_at
      }));

      setCompanies(companyData);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmployees = async (companyId: string) => {
    try {
      // Use client_entities as a substitute for employees
      const { data, error } = await supabase
        .from('client_entities')
        .select('*')
        .eq('client_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform entity data to employee format
      const employeeData: Employee[] = (data || []).map(entity => ({
        id: entity.id,
        name: entity.entity_name,
        email: `${entity.entity_name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
        department: entity.entity_type,
        risk_score: 0 // Default risk score
      }));

      setEmployees(employeeData);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const addNewCompany = async () => {
    const companyName = prompt('Enter company name:');
    const industry = prompt('Enter industry:');
    
    if (!companyName || !industry) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: companyName,
          industry: industry,
          contactname: 'Unknown',
          contactemail: 'unknown@company.com'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Company added successfully');
      loadCompanies();
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('Failed to add company');
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Building className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-6 w-6 text-blue-500" />
            Company Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={addNewCompany}>
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Companies List */}
            <div>
              <h3 className="text-lg font-medium mb-4">Companies ({filteredCompanies.length})</h3>
              <div className="space-y-3">
                {filteredCompanies.map((company) => (
                  <Card
                    key={company.id}
                    className={`cursor-pointer transition-colors ${
                      selectedCompany === company.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCompany(company.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{company.name}</h4>
                          <p className="text-sm text-muted-foreground">{company.industry}</p>
                        </div>
                        <Badge variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          {company.employee_count}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Employees List */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                Entities {selectedCompany ? `(${employees.length})` : ''}
              </h3>
              {selectedCompany ? (
                <div className="space-y-3">
                  {employees.map((employee) => (
                    <Card key={employee.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{employee.name}</h4>
                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                            <p className="text-xs text-muted-foreground">{employee.department}</p>
                          </div>
                          <Badge
                            className={
                              employee.risk_score > 7 ? 'bg-red-100 text-red-800' :
                              employee.risk_score > 4 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }
                          >
                            Risk: {employee.risk_score}/10
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {employees.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No entities found for this company</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select a company to view entities</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyManagement;
