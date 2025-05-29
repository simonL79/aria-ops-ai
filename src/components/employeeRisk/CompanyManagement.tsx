
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  created_at: string;
}

interface Employee {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  role: string;
  location: string;
  risk_level: number;
  created_at: string;
}

const CompanyManagement = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    website: ''
  });
  
  const [newEmployee, setNewEmployee] = useState({
    full_name: '',
    email: '',
    role: '',
    location: '',
    risk_level: 0
  });

  useEffect(() => {
    if (user) {
      fetchCompanies();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCompany) {
      fetchEmployees(selectedCompany);
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      console.log('Fetching companies...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies');
        return;
      }

      console.log('Companies loaded:', data?.length || 0);
      setCompanies(data || []);
    } catch (error) {
      console.error('Error in fetchCompanies:', error);
      toast.error('Failed to load companies');
    }
  };

  const fetchEmployees = async (companyId: string) => {
    try {
      console.log('Fetching employees for company:', companyId);
      const { data, error } = await supabase
        .from('company_employees')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to load employees');
        return;
      }

      console.log('Employees loaded:', data?.length || 0);
      setEmployees(data || []);
    } catch (error) {
      console.error('Error in fetchEmployees:', error);
      toast.error('Failed to load employees');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to save companies');
      return;
    }

    if (!newCompany.name || !newCompany.industry) {
      toast.error('Company name and industry are required');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Saving company:', newCompany);
      
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: newCompany.name.trim(),
          industry: newCompany.industry.trim(),
          website: newCompany.website.trim() || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving company:', error);
        toast.error(`Failed to save company: ${error.message}`);
        return;
      }

      console.log('Company saved successfully:', data);
      toast.success('Company saved successfully');
      
      // Reset form
      setNewCompany({
        name: '',
        industry: '',
        website: ''
      });
      
      // Refresh companies list
      await fetchCompanies();
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to save employees');
      return;
    }

    if (!selectedCompany) {
      toast.error('Please select a company first');
      return;
    }

    if (!newEmployee.full_name || !newEmployee.email) {
      toast.error('Employee name and email are required');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Saving employee:', newEmployee);
      
      const { data, error } = await supabase
        .from('company_employees')
        .insert({
          company_id: selectedCompany,
          full_name: newEmployee.full_name.trim(),
          email: newEmployee.email.trim(),
          role: newEmployee.role.trim() || null,
          location: newEmployee.location.trim() || null,
          risk_level: newEmployee.risk_level || 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving employee:', error);
        toast.error(`Failed to save employee: ${error.message}`);
        return;
      }

      console.log('Employee saved successfully:', data);
      toast.success('Employee saved successfully');
      
      // Reset form
      setNewEmployee({
        full_name: '',
        email: '',
        role: '',
        location: '',
        risk_level: 0
      });
      
      // Refresh employees list
      await fetchEmployees(selectedCompany);
      
    } catch (error) {
      console.error('Error in handleEmployeeSubmit:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Company</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                value={newCompany.name}
                onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter company name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                value={newCompany.industry}
                onChange={(e) => setNewCompany(prev => ({ ...prev, industry: e.target.value }))}
                placeholder="Enter industry"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={newCompany.website}
                onChange={(e) => setNewCompany(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Company'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Companies ({companies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <p className="text-muted-foreground">No companies found. Add your first company above.</p>
          ) : (
            <div className="space-y-2">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedCompany === company.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCompany(company.id)}
                >
                  <div className="font-medium">{company.name}</div>
                  <div className="text-sm text-muted-foreground">{company.industry}</div>
                  {company.website && (
                    <div className="text-sm text-blue-600">{company.website}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCompany && (
        <Card>
          <CardHeader>
            <CardTitle>Add Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmployeeSubmit} className="space-y-4">
              <div>
                <Label htmlFor="employee-name">Full Name *</Label>
                <Input
                  id="employee-name"
                  value={newEmployee.full_name}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="employee-email">Email *</Label>
                <Input
                  id="employee-email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="employee-role">Role</Label>
                <Input
                  id="employee-role"
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Enter job role"
                />
              </div>
              
              <div>
                <Label htmlFor="employee-location">Location</Label>
                <Input
                  id="employee-location"
                  value={newEmployee.location}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                />
              </div>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Add Employee'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {selectedCompany && (
        <Card>
          <CardHeader>
            <CardTitle>Employees ({employees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <p className="text-muted-foreground">No employees found for this company.</p>
            ) : (
              <div className="space-y-2">
                {employees.map((employee) => (
                  <div key={employee.id} className="p-3 border rounded">
                    <div className="font-medium">{employee.full_name}</div>
                    <div className="text-sm text-muted-foreground">{employee.email}</div>
                    {employee.role && (
                      <div className="text-sm">{employee.role}</div>
                    )}
                    {employee.location && (
                      <div className="text-sm text-muted-foreground">{employee.location}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyManagement;
