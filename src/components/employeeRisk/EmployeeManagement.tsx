
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  risk_score: number;
}

interface Company {
  id: string;
  name: string;
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
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
        risk_score: Math.floor(Math.random() * 10) // Placeholder risk score
      }));

      setEmployees(employeeData);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const loadCompanies = async () => {
    try {
      // Use clients table as companies
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const companyData: Company[] = (data || []).map(client => ({
        id: client.id,
        name: client.name
      }));

      setCompanies(companyData);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  };

  const addNewEmployee = async () => {
    if (!selectedCompany) {
      toast.error('Please select a company first');
      return;
    }

    const employeeName = prompt('Enter employee name:');
    const employeeType = prompt('Enter employee type (e.g., manager, staff):');
    
    if (!employeeName || !employeeType) return;

    try {
      const { data, error } = await supabase
        .from('client_entities')
        .insert({
          client_id: selectedCompany,
          entity_name: employeeName,
          entity_type: employeeType
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Employee added successfully');
      loadEmployees(selectedCompany);
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee');
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Users className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            Employee Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Company Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Company</label>
            <select
              value={selectedCompany || ''}
              onChange={(e) => setSelectedCompany(e.target.value || null)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a company...</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCompany ? (
            <>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={addNewEmployee}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>

              <div className="space-y-3">
                {filteredEmployees.map((employee) => (
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
                {filteredEmployees.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No employees found</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Please select a company to view employees</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
