
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Archive } from 'lucide-react';

const AnubisAuditLogViewer = () => {
  return (
    <div className="space-y-6">
      <Card className="border-orange-500/20 bg-gradient-to-r from-orange-900/10 to-red-900/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Archive className="h-6 w-6 text-orange-500" />
            Anubis Audit System
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              Archived
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Anubis System Archived
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              The Anubis experimental features have been archived as part of the system cleanup. 
              Core intelligence functionality is now handled by Genesis Sentinel.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Archive className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-400 font-medium mb-1">Migration Complete</h4>
                <p className="text-sm text-gray-300">
                  All active monitoring and intelligence features have been consolidated into 
                  the Genesis Sentinel platform for improved performance and reliability.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnubisAuditLogViewer;
