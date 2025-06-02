
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PersonaSaturationPanel from '@/components/admin/PersonaSaturationPanel';
import { Shield, Globe, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();

  useEffect(() => {
    console.log('🏠 AdminDashboard mounted');
    console.log('📊 Auth state:', { isAuthenticated, isAdmin, isLoading, userEmail: user?.email });
  }, [isAuthenticated, isAdmin, isLoading, user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-white">Loading admin dashboard...</span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    console.log('❌ Not admin, redirecting to regular dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ Admin dashboard access granted');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">A.R.I.A™ Admin Command Center</h1>
          <p className="text-gray-300 mt-2">
            Welcome back, {user?.email}. System operational and ready for your commands.
          </p>
        </div>

        <Tabs defaultValue="persona-saturation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="persona-saturation" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Globe className="h-4 w-4 mr-2" />
              Persona Saturation
            </TabsTrigger>
            <TabsTrigger value="threat-management" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Shield className="h-4 w-4 mr-2" />
              Threat Management
            </TabsTrigger>
            <TabsTrigger value="user-management" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="persona-saturation">
            <PersonaSaturationPanel />
          </TabsContent>

          <TabsContent value="threat-management">
            <div className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
              <h3 className="text-lg font-medium text-white mb-2">Threat Management</h3>
              <p className="text-corporate-lightGray">Advanced threat analysis and response protocols coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="user-management">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
              <h3 className="text-lg font-medium text-white mb-2">User Management</h3>
              <p className="text-corporate-lightGray">User access control and management coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
              <h3 className="text-lg font-medium text-white mb-2">Analytics</h3>
              <p className="text-corporate-lightGray">System analytics and performance metrics coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
