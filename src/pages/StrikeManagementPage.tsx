
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Target, Clock } from "lucide-react";
import StrikeRequestInterface from '@/components/strikes/StrikeRequestInterface';
import AdminStrikeDashboard from '@/components/strikes/AdminStrikeDashboard';
import AdminGuard from '@/components/auth/AdminGuard';
import { useAuth } from '@/hooks/useAuth';

const StrikeManagementPage = () => {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>A.R.I.A/EX™ Strike Management - Coordinated Content Takedown</title>
        <meta name="description" content="Execute coordinated content strikes across multiple platforms with A.R.I.A/EX™ Emergency Strike Engine" />
      </Helmet>
      
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Zap className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-red-600">A.R.I.A/EX™ Strike Management</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Coordinated content takedown system with multi-platform strike capabilities. 
            Submit batch requests for DMCA, GDPR, platform flags, and legal escalation.
          </p>
          
          {/* System Status */}
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Strike Engine Online
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              Emergency Response Ready
            </Badge>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto" />
              <CardTitle className="text-lg">Batch Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Submit multiple URLs in a single request for coordinated takedown across platforms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-green-600 mx-auto" />
              <CardTitle className="text-lg">Multi-Strike Types</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                DMCA, GDPR, platform flags, search deindexing, and legal escalation options
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto" />
              <CardTitle className="text-lg">Admin Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                All strike requests require admin review and approval before execution
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="request" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="request" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Submit Strike Request
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="mt-6">
            <div className="flex justify-center">
              <StrikeRequestInterface />
            </div>
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <AdminGuard>
              <AdminStrikeDashboard />
            </AdminGuard>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-red-800">⚠️ Emergency Strike Protocol</h3>
              <p className="text-sm text-red-700">
                This system is integrated with the A.R.I.A/EX™ Emergency Strike Engine. 
                All actions are logged and monitored. Only submit legitimate takedown requests 
                with proper legal justification.
              </p>
              <p className="text-xs text-red-600 font-medium">
                Misuse of this system may result in account suspension and legal consequences.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StrikeManagementPage;
