
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Activity, 
  Eye, 
  Shield, 
  Zap,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MonitoringService {
  name: string;
  isActive: boolean;
  description: string;
  lastCheck?: string;
}

const RealTimeMonitoringActivator = () => {
  const [services, setServices] = useState<MonitoringService[]>([]);
  const [isActivating, setIsActivating] = useState(false);
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);

  useEffect(() => {
    checkMonitoringStatus();
    const interval = setInterval(checkMonitoringStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkMonitoringStatus = async () => {
    try {
      // Check monitoring status
      const { data: status } = await supabase
        .from('monitoring_status')
        .select('*')
        .eq('id', '1')
        .single();

      setIsMonitoringActive(status?.is_active || false);

      // Check live status modules
      const { data: modules } = await supabase
        .from('live_status')
        .select('*')
        .order('name');

      const serviceList: MonitoringService[] = [
        {
          name: 'Reddit OSINT Scanner',
          isActive: modules?.some(m => m.name.includes('Reddit') && m.system_status === 'LIVE') || false,
          description: 'Live Reddit content monitoring'
        },
        {
          name: 'News Feed Monitor',
          isActive: modules?.some(m => m.name.includes('News') && m.system_status === 'LIVE') || false,
          description: 'RSS and news source tracking'
        },
        {
          name: 'Social Media Scanner',
          isActive: modules?.some(m => m.name.includes('Social') && m.system_status === 'LIVE') || false,
          description: 'Multi-platform social monitoring'
        },
        {
          name: 'Threat Classification',
          isActive: modules?.some(m => m.name.includes('Threat') && m.system_status === 'LIVE') || false,
          description: 'AI-powered threat analysis'
        },
        {
          name: 'Entity Recognition',
          isActive: modules?.some(m => m.name.includes('Entity') && m.system_status === 'LIVE') || false,
          description: 'Client entity detection'
        },
        {
          name: 'Real-time Alerts',
          isActive: modules?.some(m => m.name.includes('Alert') && m.system_status === 'LIVE') || false,
          description: 'Instant notification system'
        }
      ];

      setServices(serviceList);

    } catch (error) {
      console.error('Failed to check monitoring status:', error);
    }
  };

  const activateRealTimeMonitoring = async () => {
    setIsActivating(true);
    toast.info('📡 Activating real-time monitoring systems...');

    try {
      // Activate monitoring status
      await supabase
        .from('monitoring_status')
        .upsert({
          id: '1',
          is_active: true,
          sources_count: 12,
          last_run: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      // Activate all monitoring modules
      const modules = [
        'Live Threat Scanner',
        'Social Media Monitor', 
        'News Feed Scanner',
        'Forum Analysis Engine',
        'Legal Discussion Monitor',
        'Reputation Risk Detector',
        'Entity Recognition Engine',
        'Real-time Alert System',
        'HyperCore Intelligence',
        'EIDETIC Memory Engine'
      ];

      for (const module of modules) {
        await supabase
          .from('live_status')
          .upsert({
            name: module,
            system_status: 'LIVE',
            last_report: new Date().toISOString()
          }, { onConflict: 'name' });
      }

      // Trigger initial monitoring scan
      await supabase.functions.invoke('monitoring-scan', {
        body: { 
          fullScan: true,
          source: 'real_time_activation'
        }
      });

      // Log activation
      await supabase
        .from('aria_ops_log')
        .insert({
          operation_type: 'monitoring_activation',
          module_source: 'real_time_activator',
          success: true,
          operation_data: {
            activated_modules: modules.length,
            activation_time: new Date().toISOString()
          }
        });

      toast.success('✅ Real-time monitoring activated successfully!');
      await checkMonitoringStatus();

    } catch (error) {
      console.error('Failed to activate monitoring:', error);
      toast.error('❌ Failed to activate real-time monitoring');
    } finally {
      setIsActivating(false);
    }
  };

  const toggleService = async (serviceName: string, isActive: boolean) => {
    try {
      const status = isActive ? 'LIVE' : 'OFFLINE';
      
      await supabase
        .from('live_status')
        .upsert({
          name: serviceName,
          system_status: status,
          last_report: new Date().toISOString()
        }, { onConflict: 'name' });

      await checkMonitoringStatus();
      toast.success(`${serviceName} ${isActive ? 'activated' : 'deactivated'}`);

    } catch (error) {
      console.error('Failed to toggle service:', error);
      toast.error('Failed to toggle service');
    }
  };

  const activeServices = services.filter(s => s.isActive).length;
  const totalServices = services.length;

  return (
    <div className="space-y-6">
      {/* Main Control */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-corporate-accent" />
            Real-Time Monitoring Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="flex items-center justify-between p-4 bg-corporate-darkSecondary rounded border border-corporate-border">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${isMonitoringActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-white font-medium">
                Monitoring Status: {isMonitoringActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            <Badge className={isMonitoringActive ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}>
              {activeServices}/{totalServices} Services Online
            </Badge>
          </div>

          {/* Activation Button */}
          <Button
            onClick={activateRealTimeMonitoring}
            disabled={isActivating || isMonitoringActive}
            className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            {isActivating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Activating Monitoring...
              </>
            ) : isMonitoringActive ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Real-Time Monitoring Active
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Activate Real-Time Monitoring
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Service Controls */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-corporate-accent" />
            Monitoring Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-corporate-darkSecondary rounded border border-corporate-border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{service.name}</span>
                    <Badge className={service.isActive ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50'}>
                      {service.isActive ? 'ACTIVE' : 'OFFLINE'}
                    </Badge>
                  </div>
                  <p className="text-corporate-lightGray text-sm">{service.description}</p>
                </div>
                <Switch
                  checked={service.isActive}
                  onCheckedChange={(checked) => toggleService(service.name, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-white font-medium">Monitoring Instructions</h4>
              <div className="text-corporate-lightGray text-sm space-y-1">
                <p>• Click "Activate Real-Time Monitoring" to start all services</p>
                <p>• Individual services can be toggled using the switches</p>
                <p>• Services will automatically scan for threats and generate alerts</p>
                <p>• Monitor the dashboard for real-time updates and notifications</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMonitoringActivator;
