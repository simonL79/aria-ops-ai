
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import CompanyManagement from '@/components/employeeRisk/CompanyManagement';
import EmployeeManagement from '@/components/employeeRisk/EmployeeManagement';
import RiskDashboard from '@/components/employeeRisk/RiskDashboard';
import ScanQueue from '@/components/employeeRisk/ScanQueue';

const EmployeeBrandRiskPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Employee Brand Risk Scanner</h1>
          </div>
          <p className="text-gray-600">
            Monitor and assess employee digital footprints for potential brand reputation risks
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Scan Queue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <RiskDashboard />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyManagement />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeManagement />
          </TabsContent>

          <TabsContent value="queue">
            <ScanQueue />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeBrandRiskPage;
