
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Globe, AlertTriangle, Eye, MapPin, Ban } from 'lucide-react';
import { toast } from 'sonner';

interface IPRequestLog {
  id: string;
  ip_address: string;
  user_agent?: string;
  endpoint_accessed?: string;
  status_code?: number;
  detected_threat: boolean;
  request_time: string;
  notes?: string;
}

interface IPGeolocation {
  ip_address: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  last_updated: string;
}

interface BlacklistedIP {
  ip_address: string;
  reason?: string;
  severity?: string;
  added_at: string;
  active: boolean;
}

export const PerimetrixPanel = () => {
  const [ipRequests, setIpRequests] = useState<IPRequestLog[]>([]);
  const [geoData, setGeoData] = useState<IPGeolocation[]>([]);
  const [blacklistedIPs, setBlacklistedIPs] = useState<BlacklistedIP[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPerimetrixData();
  }, []);

  const loadPerimetrixData = async () => {
    await Promise.all([loadIPRequests(), loadGeoData(), loadBlacklistedIPs()]);
  };

  const loadIPRequests = async () => {
    try {
      // Use mock data since the tables are newly created
      const mockData: IPRequestLog[] = [
        {
          id: '1',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          endpoint_accessed: '/api/scan-results',
          status_code: 200,
          detected_threat: false,
          request_time: new Date().toISOString(),
          notes: 'Normal user request'
        },
        {
          id: '2',
          ip_address: '203.0.113.50',
          user_agent: 'curl/7.68.0',
          endpoint_accessed: '/api/admin',
          status_code: 403,
          detected_threat: true,
          request_time: new Date(Date.now() - 86400000).toISOString(),
          notes: 'Suspicious automated access attempt'
        },
        {
          id: '3',
          ip_address: '10.0.0.5',
          user_agent: 'PostmanRuntime/7.29.0',
          endpoint_accessed: '/api/data-export',
          status_code: 401,
          detected_threat: false,
          request_time: new Date(Date.now() - 172800000).toISOString(),
          notes: 'API testing activity'
        }
      ];
      setIpRequests(mockData);
    } catch (error) {
      console.error('Error loading IP request logs:', error);
      setIpRequests([]);
    }
  };

  const loadGeoData = async () => {
    try {
      const mockData: IPGeolocation[] = [
        {
          ip_address: '192.168.1.100',
          country: 'United Kingdom',
          region: 'England',
          city: 'London',
          latitude: 51.5074,
          longitude: -0.1278,
          last_updated: new Date().toISOString()
        },
        {
          ip_address: '203.0.113.50',
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          latitude: null,
          longitude: null,
          last_updated: new Date(Date.now() - 86400000).toISOString()
        },
        {
          ip_address: '10.0.0.5',
          country: 'United States',
          region: 'California',
          city: 'San Francisco',
          latitude: 37.7749,
          longitude: -122.4194,
          last_updated: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setGeoData(mockData);
    } catch (error) {
      console.error('Error loading geolocation data:', error);
      setGeoData([]);
    }
  };

  const loadBlacklistedIPs = async () => {
    try {
      const mockData: BlacklistedIP[] = [
        {
          ip_address: '203.0.113.100',
          reason: 'Botnet traffic detected',
          severity: 'critical',
          added_at: new Date().toISOString(),
          active: true
        },
        {
          ip_address: '198.51.100.25',
          reason: 'Repeated brute force attempts',
          severity: 'high',
          added_at: new Date(Date.now() - 86400000).toISOString(),
          active: true
        },
        {
          ip_address: '192.0.2.150',
          reason: 'Malware distribution',
          severity: 'medium',
          added_at: new Date(Date.now() - 172800000).toISOString(),
          active: false
        }
      ];
      setBlacklistedIPs(mockData);
    } catch (error) {
      console.error('Error loading blacklisted IPs:', error);
      setBlacklistedIPs([]);
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (statusCode?: number) => {
    if (!statusCode) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    if (statusCode >= 500) return 'bg-red-500/20 text-red-400 border-red-500/50';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  };

  const scanNewIP = async () => {
    setIsLoading(true);
    try {
      const newIPs = ['45.33.32.156', '172.217.164.110', '151.101.193.140'];
      const endpoints = ['/api/health', '/admin/dashboard', '/api/users', '/api/reports'];
      const userAgents = ['Chrome/91.0', 'Firefox/89.0', 'Safari/14.1', 'curl/7.68.0'];
      
      const randomIP = newIPs[Math.floor(Math.random() * newIPs.length)];
      const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
      const randomStatus = [200, 403, 404, 500][Math.floor(Math.random() * 4)];
      const threatDetected = Math.random() > 0.7;
      
      const newRequest: IPRequestLog = {
        id: Date.now().toString(),
        ip_address: randomIP,
        user_agent: randomUserAgent,
        endpoint_accessed: randomEndpoint,
        status_code: randomStatus,
        detected_threat: threatDetected,
        request_time: new Date().toISOString(),
        notes: threatDetected ? 'Suspicious activity detected by PERIMETRIX™' : 'Normal request processed'
      };

      setIpRequests(prev => [newRequest, ...prev.slice(0, 9)]);
      toast.success('New IP request logged by PERIMETRIX™');
    } catch (error) {
      console.error('Error scanning new IP:', error);
      toast.error('Failed to scan IP request');
    } finally {
      setIsLoading(false);
    }
  };

  const blacklistIP = async () => {
    setIsLoading(true);
    try {
      const newIPs = ['185.220.100.240', '91.121.88.53', '46.166.139.111'];
      const reasons = ['Malicious scanning activity', 'DDoS attack source', 'Credential stuffing attempts', 'Spam bot activity'];
      const severities = ['low', 'medium', 'high', 'critical'];
      
      const randomIP = newIPs[Math.floor(Math.random() * newIPs.length)];
      const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      
      const newBlacklist: BlacklistedIP = {
        ip_address: randomIP,
        reason: randomReason,
        severity: randomSeverity,
        added_at: new Date().toISOString(),
        active: true
      };

      setBlacklistedIPs(prev => [newBlacklist, ...prev.slice(0, 9)]);
      toast.success('IP address blacklisted by PERIMETRIX™');
    } catch (error) {
      console.error('Error blacklisting IP:', error);
      toast.error('Failed to blacklist IP');
    } finally {
      setIsLoading(false);
    }
  };

  const geolocateIP = async () => {
    setIsLoading(true);
    try {
      const newIPs = ['8.8.8.8', '1.1.1.1', '208.67.222.222'];
      const locations = [
        { country: 'United States', region: 'California', city: 'Mountain View', lat: 37.4056, lng: -122.0775 },
        { country: 'Australia', region: 'New South Wales', city: 'Sydney', lat: -33.8688, lng: 151.2093 },
        { country: 'Germany', region: 'Bavaria', city: 'Munich', lat: 48.1351, lng: 11.5820 }
      ];
      
      const randomIP = newIPs[Math.floor(Math.random() * newIPs.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      const newGeoData: IPGeolocation = {
        ip_address: randomIP,
        country: randomLocation.country,
        region: randomLocation.region,
        city: randomLocation.city,
        latitude: randomLocation.lat,
        longitude: randomLocation.lng,
        last_updated: new Date().toISOString()
      };

      setGeoData(prev => [newGeoData, ...prev.slice(0, 9)]);
      toast.success('IP geolocation data updated');
    } catch (error) {
      console.error('Error geolocating IP:', error);
      toast.error('Failed to geolocate IP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* IP Request Monitoring */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            PERIMETRIX™ Request Monitoring
            <Button
              size="sm"
              onClick={scanNewIP}
              disabled={isLoading}
              className="ml-auto text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              Scan
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {ipRequests.length === 0 ? (
            <div className="text-gray-500 text-sm">No IP requests logged</div>
          ) : (
            ipRequests.map((request) => (
              <div key={request.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Shield className="h-4 w-4 text-blue-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-blue-300">[{request.ip_address}]</span>
                  </div>
                  <div className="text-xs text-blue-400 mb-1">
                    {request.endpoint_accessed || 'Unknown endpoint'} | {request.user_agent?.substring(0, 30)}...
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(request.request_time).toLocaleTimeString()} | 
                    {request.notes?.substring(0, 40)}...
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getStatusColor(request.status_code)}>
                    {request.status_code || 'N/A'}
                  </Badge>
                  <Badge className={request.detected_threat ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}>
                    {request.detected_threat ? 'threat' : 'clean'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* IP Geolocation Intelligence */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <Globe className="h-4 w-4" />
            IP Geolocation Intelligence
            <Button
              size="sm"
              onClick={geolocateIP}
              disabled={isLoading}
              className="ml-auto text-xs bg-green-600 hover:bg-green-700"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Locate
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {geoData.length === 0 ? (
            <div className="text-gray-500 text-sm">No geolocation data available</div>
          ) : (
            geoData.map((geo) => (
              <div key={geo.ip_address} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <MapPin className="h-4 w-4 text-green-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-green-300">[{geo.ip_address}]</span>
                  </div>
                  <div className="text-xs text-green-400 mb-1">
                    {geo.city || 'Unknown'}, {geo.region || 'Unknown'}, {geo.country || 'Unknown'}
                  </div>
                  {geo.latitude && geo.longitude && (
                    <div className="text-xs text-gray-400 mb-1">
                      Coords: {geo.latitude.toFixed(4)}, {geo.longitude.toFixed(4)}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(geo.last_updated).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* IP Blacklist Management */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <Ban className="h-4 w-4" />
            IP Blacklist Management
            <Button
              size="sm"
              onClick={blacklistIP}
              disabled={isLoading}
              className="ml-auto text-xs bg-red-600 hover:bg-red-700"
            >
              <Ban className="h-3 w-3 mr-1" />
              Blacklist
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {blacklistedIPs.length === 0 ? (
            <div className="text-gray-500 text-sm">No blacklisted IPs</div>
          ) : (
            blacklistedIPs.map((blocked) => (
              <div key={blocked.ip_address} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-red-300">[{blocked.ip_address}]</span>
                  </div>
                  <div className="text-xs text-red-400 mb-1">
                    {blocked.reason || 'No reason specified'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Added: {new Date(blocked.added_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getSeverityColor(blocked.severity)}>
                    {blocked.severity || 'unknown'}
                  </Badge>
                  <Badge className={blocked.active ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50'}>
                    {blocked.active ? 'active' : 'inactive'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
