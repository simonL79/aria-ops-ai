
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Archive, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnubisValidationPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card className="border-orange-500/20 bg-gradient-to-r from-orange-900/10 to-red-900/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Archive className="h-6 w-6 text-orange-500" />
            Anubis Validation Panel
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              Archived
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Validation System Retired
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              The Anubis validation panel has been retired. System validation and 
              health monitoring is now handled by the Genesis Sentinel platform.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Archive className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">Enhanced Validation Available</h4>
                  <p className="text-sm text-gray-300">
                    Access comprehensive system validation and monitoring through Genesis Sentinel.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/admin/genesis-sentinel')}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                <span>Go to Genesis Sentinel</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnubisValidationPanel;
