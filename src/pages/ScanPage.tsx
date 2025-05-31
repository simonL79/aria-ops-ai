
import React from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Shield, Target } from 'lucide-react';

const ScanPage = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Reputation Scan
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get a comprehensive analysis of your digital reputation across all platforms
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-6 w-6 text-orange-500" />
                  Start Your Reputation Scan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Full Name or Company</Label>
                  <Input 
                    id="name"
                    placeholder="Enter name or company to scan..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website" className="text-gray-300">Website (Optional)</Label>
                  <Input 
                    id="website"
                    placeholder="https://yourwebsite.com"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3">
                  <Shield className="mr-2 h-5 w-5" />
                  Start Free Reputation Scan
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-600">
                  <div className="text-center">
                    <Target className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Real-time Monitoring</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Threat Detection</p>
                  </div>
                  <div className="text-center">
                    <Search className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Deep Analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ScanPage;
