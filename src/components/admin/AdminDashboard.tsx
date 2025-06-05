
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, AlertTriangle, BarChart3, Settings, Activity, TrendingUp, LayoutDashboard, Users, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import ControlCenterPage from '@/pages/admin/ControlCenterPage';
import KeywordToArticleSystemPage from '@/pages/admin/KeywordToArticleSystemPage';
import StrategyBrainTestPage from '@/pages/admin/StrategyBrainTestPage';
import StrategyBrainStage3TestPage from '@/pages/admin/StrategyBrainStage3TestPage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(`/admin${path}`) ? 'active' : undefined;
  };

  return (
    <Routes>
      {/* Keyword to Article System Route */}
      <Route path="/keyword-to-article" element={<KeywordToArticleSystemPage />} />
      
      {/* Control Center Route */}
      <Route path="/control-center" element={<ControlCenterPage />} />
      
      {/* Strategy Brain Test Route */}
      <Route path="/strategy-brain-test" element={<StrategyBrainTestPage />} />
      
      {/* Strategy Brain Stage 3 Test Route */}
      <Route path="/strategy-brain-stage3" element={<StrategyBrainStage3TestPage />} />
      
      {/* Default Route - Redirect to Control Center */}
      <Route path="*" element={<ControlCenterPage />} />
    </Routes>
  );
};

export default AdminDashboard;
