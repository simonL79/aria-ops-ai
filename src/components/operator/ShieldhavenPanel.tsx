
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Scale, CheckCircle } from 'lucide-react';

export function ShieldhavenPanel() {
  const [legalDefenseStatus, setLegalDefenseStatus] = useState('ready');
  const [regulatoryCompliance, setRegulatoryCompliance] = useState(98);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-400">
          <Scale className="h-5 w-5" />
          SHIELDHAVEN™ Legal AI Defense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-gray-400">Defense Status</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{legalDefenseStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Compliance %</span>
            </div>
            <div className="text-lg font-bold text-white">{regulatoryCompliance}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
