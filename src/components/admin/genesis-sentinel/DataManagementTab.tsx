
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Info
} from 'lucide-react';
import DataIntegrityPanel from '../DataIntegrityPanel';

const DataManagementTab = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Data Management</h2>
          <p className="text-corporate-lightGray">System-wide data integrity and mock data prevention</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Clean Environment
        </Badge>
      </div>

      {/* System Status Alert */}
      <Card className="corporate-card border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Shield className="h-5 w-5" />
            Mock Data Cleanup Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">All mock/test data has been permanently removed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-white">Database triggers active to prevent mock data reintroduction</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-corporate-accent" />
              <span className="text-white">System is now running with live data only</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Integrity Panel */}
      <DataIntegrityPanel />

      {/* Information Panel */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Info className="h-5 w-5 text-corporate-accent" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-500/10 rounded border-l-4 border-blue-500">
              <strong className="text-blue-400">Tables Cleaned:</strong>
              <p className="text-corporate-lightGray mt-1">
                content_sources, persona_deployments, anubis_feedback_memory, anubis_playbook_suggestions, 
                scan_results, activity_logs, entities, blog_posts
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded border-l-4 border-green-500">
              <strong className="text-green-400">Protection Active:</strong>
              <p className="text-corporate-lightGray mt-1">
                Triggers prevent insertion of data containing 'mock', 'test', 'demo', or 'example.com' URLs
              </p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded border-l-4 border-yellow-500">
              <strong className="text-yellow-400">Monitoring:</strong>
              <p className="text-corporate-lightGray mt-1">
                All new data insertions are automatically validated for production readiness
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagementTab;
