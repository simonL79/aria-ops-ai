import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Shield } from 'lucide-react';

export const IronvaultPanel = () => {
  const [surveillanceStatus, setSurveillanceStatus] = useState('active');
  const [documentLeaks, setDocumentLeaks] = useState(0);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-400">
          <Shield className="h-5 w-5" />
          IRONVAULT™ Document Surveillance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">Surveillance</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{surveillanceStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Document Leaks</span>
            </div>
            <div className="text-lg font-bold text-white">{documentLeaks}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
