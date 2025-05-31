import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Shield, AlertTriangle, Activity } from 'lucide-react';

export const SentinelgridPanel = () => {
  const [meshStatus, setMeshStatus] = useState('active');
  const [globalThreats, setGlobalThreats] = useState(7);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Globe className="h-5 w-5" />
          SENTINELGRID™ Global Risk Mesh
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Mesh Status</span>
            </div>
            <div className="text-lg font-bold text-white capitalize">{meshStatus}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Global Threats</span>
            </div>
            <div className="text-lg font-bold text-white">{globalThreats}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
