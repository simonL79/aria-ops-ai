
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, CheckCircle } from 'lucide-react';

const TitanvaultPanel = () => {
  const [complianceStatus, setComplianceStatus] = useState('compliant');
  const [legalDocuments, setLegalDocuments] = useState(156);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-400">
          <Shield className="h-5 w-5" />
          TITANVAULT™ Legal Fortress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Compliance</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{complianceStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-gray-400">Legal Docs</span>
            </div>
            <div className="text-lg font-bold text-white">{legalDocuments}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TitanvaultPanel;
