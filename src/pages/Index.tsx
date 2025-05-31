
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Target, Eye, Zap } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                A.R.I.A.™
              </h1>
              <p className="text-xl md:text-2xl text-orange-400 mb-4">
                AI Reputation Intelligence Agent
              </p>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Protect, monitor, and defend your digital reputation with autonomous AI-powered intelligence
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/scan">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                  Start Reputation Scan
                </Button>
              </Link>
              
              {isAuthenticated && isAdmin && (
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3">
                    Access Dashboard
                  </Button>
                </Link>
              )}
              
              {!isAuthenticated && (
                <Link to="/admin/login">
                  <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-3">
                    Admin Access
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Comprehensive Digital Protection
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Shield className="h-8 w-8 text-orange-500 mb-2" />
                  <CardTitle className="text-white">Threat Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Real-time monitoring across all digital platforms
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Target className="h-8 w-8 text-orange-500 mb-2" />
                  <CardTitle className="text-white">Response Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Automated response strategies for every threat level
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Eye className="h-8 w-8 text-orange-500 mb-2" />
                  <CardTitle className="text-white">24/7 Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Continuous surveillance of your digital footprint
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Zap className="h-8 w-8 text-orange-500 mb-2" />
                  <CardTitle className="text-white">Instant Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Immediate deployment of countermeasures
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 bg-gray-900">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Created by Simon Lindsay
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              After facing reputation challenges firsthand, Simon built A.R.I.A.™ to help others 
              protect their digital identity before damage occurs.
            </p>
            <Link to="/simon-lindsay">
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                Learn More About Simon
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default Index;
