
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, User, Edit, Trash2, Scan, AlertTriangle, Shield } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  role: string;
  location: string;
  risk_level: number;
  sentiment_score: number;
  flagged: boolean;
  scan_status: string;
  last_scan: string;
  companies: { name: string };
}

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    company_id: '',
    full_name: '',
    email: '',
    role: '',
    location: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchCompanies();
    // Log dashboard access
    logComplianceActivity('employee_dashboard_accessed', 'User accessed employee management dashboard');
  }, []);

  const logComplianceActivity = async (activityType: string, description: string, dataProcessed?: any) => {
    try {
      await supabase.rpc('log_compliance_activity', {
        p_activity_type: activityType,
        p_description: description,
        p_data_processed: dataProcessed || {},
        p_legal_basis: 'Legitimate Interest',
        p_data_sources: ['A.R.I.A Employee Risk Scanner']
      });
    } catch (error) {
      console.error('Error logging compliance activity:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('company_employees')
        .select(`
          *,
          companies (name)
        `)
        .order('full_name');

      if (error) throw error;
      setEmployees(data || []);
      
      // Log data access
      await logComplianceActivity(
        'employee_data_accessed',
        `Employee data accessed: ${data?.length || 0} records viewed`,
        { records_accessed: data?.length || 0 }
      );
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEmployee) {
        const { error } = await supabase
          .from('company_employees')
          .update(formData)
          .eq('id', editingEmployee.id);
        
        if (error) throw error;
        toast.success('Employee updated successfully');

        // Log the update
        await logComplianceActivity(
          'employee_data_updated',
          `Employee data updated: ${formData.full_name}`,
          { 
            employee_id: editingEmployee.id,
            fields_updated: Object.keys(formData),
            company_id: formData.company_id
          }
        );
      } else {
        const { error } = await supabase
          .from('company_employees')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Employee added successfully');

        // Log the creation
        await logComplianceActivity(
          'employee_data_created',
          `New employee added: ${formData.full_name}`,
          { 
            employee_data: formData,
            data_source: 'Manual Entry'
          }
        );
      }
      
      setDialogOpen(false);
      setEditingEmployee(null);
      setFormData({ company_id: '', full_name: '', email: '', role: '', location: '' });
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      company_id: employee.company_id,
      full_name: employee.full_name,
      email: employee.email,
      role: employee.role || '',
      location: employee.location || ''
    });
    setDialogOpen(true);

    // Log the access
    logComplianceActivity(
      'employee_data_accessed_for_edit',
      `Employee data accessed for editing: ${employee.full_name}`,
      { employee_id: employee.id }
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone and will comply with data retention policies.')) {
      return;
    }

    try {
      // Get employee details before deletion for logging
      const employee = employees.find(emp => emp.id === id);
      
      const { error } = await supabase
        .from('company_employees')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Employee deleted successfully');

      // Log the deletion
      await logComplianceActivity(
        'employee_data_deleted',
        `Employee data deleted: ${employee?.full_name || 'Unknown'}`,
        { 
          employee_id: id,
          deletion_reason: 'Manual deletion by user',
          retention_compliance: true
        }
      );

      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const queueScan = async (employeeId: string) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      
      // Insert directly into the scan queue table
      const { error } = await supabase
        .from('employee_scan_queue')
        .insert({
          employee_id: employeeId,
          priority: 5,
          status: 'queued'
        });
      
      if (error) throw error;
      toast.success('Employee queued for scanning');

      // Log the scan initiation
      await logComplianceActivity(
        'employee_scan_initiated',
        `Employee scan queued: ${employee?.full_name || 'Unknown'}`,
        { 
          employee_id: employeeId,
          scan_type: 'Manual',
          data_sources: ['Social Media', 'Public Records'],
          legal_basis: 'Legitimate Interest'
        }
      );
    } catch (error) {
      console.error('Error queuing scan:', error);
      toast.error('Failed to queue scan');
    }
  };

  const getRiskBadge = (riskLevel: number) => {
    if (riskLevel >= 7) return <Badge variant="destructive">High Risk</Badge>;
    if (riskLevel >= 4) return <Badge variant="secondary">Medium Risk</Badge>;
    if (riskLevel >= 1) return <Badge variant="outline">Low Risk</Badge>;
    return <Badge variant="outline">No Risk</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: 'outline' as const, text: 'Pending' },
      scanning: { variant: 'default' as const, text: 'Scanning' },
      completed: { variant: 'secondary' as const, text: 'Completed' },
      failed: { variant: 'destructive' as const, text: 'Failed' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const resetForm = () => {
    setEditingEmployee(null);
    setFormData({ company_id: '', full_name: '', email: '', role: '', location: '' });
  };

  if (loading) {
    return <div className="text-center p-8">Loading employees...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <Shield className="h-5 w-5 text-blue-600" title="GDPR Compliant" />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="company_id">Company *</Label>
                <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEmployee ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* GDPR Compliance Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">GDPR Compliance Notice</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            All employee scanning activities are conducted under legitimate interest basis and comply with data protection regulations. 
            Comprehensive audit logs are maintained for regulatory compliance.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees yet</h3>
              <p className="text-gray-500 mb-4">
                Add employees to start monitoring their digital brand risks.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Employee
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-semibold">{employee.full_name}</h3>
                        <p className="text-sm text-gray-600">{employee.companies.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {employee.flagged && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      {getRiskBadge(employee.risk_level)}
                      {getStatusBadge(employee.scan_status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <div className="font-medium">{employee.email}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Role:</span>
                      <div className="font-medium">{employee.role || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Risk Level:</span>
                      <div className="font-medium">{employee.risk_level}/10</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Scan:</span>
                      <div className="font-medium">
                        {employee.last_scan ? new Date(employee.last_scan).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(employee)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => queueScan(employee.id)}>
                      <Scan className="h-4 w-4 mr-1" />
                      Scan
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(employee.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
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

export default EmployeeManagement;
