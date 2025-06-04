import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, AlertTriangle, BarChart3, Settings, Activity, TrendingUp, LayoutDashboard, Users, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import ControlCenterPage from '@/pages/admin/ControlCenterPage';
import StrategyBrainTestPage from '@/pages/admin/StrategyBrainTestPage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(`/admin${path}`) ? 'active' : undefined;
  };

  return (
    <Routes>
      {/* Control Center Route */}
      <Route path="/control-center" element={<ControlCenterPage />} />
      
      {/* Strategy Brain Test Route */}
      <Route path="/strategy-brain-test" element={<StrategyBrainTestPage />} />
      
      {/* Default Route - Redirect to Control Center */}
      <Route path="*" element={<ControlCenterPage />} />
    </Routes>
  );
};

export default AdminDashboard;
