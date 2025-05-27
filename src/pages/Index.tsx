
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Users, FileText, ArrowRight, Lock, Eye, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleAdminAccess = () => {
    if (isAuthenticated && isAdmin) {
      navigate('/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">A.R.I.A™</h1>
              <Badge variant="secondary" className="bg-blue-600 text-white">
                AI Reputation Intelligence
              </Badge>
            </div>
            <Button 
              onClick={handleAdminAccess}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Lock className="h-4 w-4 mr-2" />
              {isAuthenticated && isAdmin ? 'Dashboard' : 'Admin Access'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-white leading-tight">
              AI-Powered Reputation
              <span className="text-blue-400"> Intelligence</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Autonomous threat detection, client-entity mapping, and real-time reputation management 
              across all digital platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <Search className="h-12 w-12 text-blue-400 mx-auto" />
                <CardTitle>Zero-Input Discovery</CardTitle>
                <CardDescription className="text-gray-300">
                  Autonomous scanning across Reddit, Twitter, news platforms and forums
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• Real-time threat detection</div>
                  <div>• Cross-platform monitoring</div>
                  <div>• AI sentiment analysis</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-400 mx-auto" />
                <CardTitle>Client-Entity Intelligence</CardTitle>
                <CardDescription className="text-gray-300">
                  Smart linking between threats and your monitored entities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• Automated entity matching</div>
                  <div>• Priority threat alerts</div>
                  <div>• Confidence scoring</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <FileText className="h-12 w-12 text-green-400 mx-auto" />
                <CardTitle>Evidence & Outreach</CardTitle>
                <CardDescription className="text-gray-300">
                  Automated evidence collection and direct contact discovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>• Screenshot capture</div>
                  <div>• Contact discovery</div>
                  <div>• Outreach automation</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={handleAdminAccess}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4"
          >
            <Shield className="h-5 w-5 mr-2" />
            Access ARIA Intelligence Platform
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Security Notice */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-yellow-900/20 border-yellow-600/30 max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <Lock className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-yellow-100 mb-2">
              Secure Admin Portal
            </h3>
            <p className="text-yellow-200 text-sm">
              This platform contains sensitive reputation intelligence data. 
              All access is logged and monitored for security purposes.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">A.R.I.A™</span>
          </div>
          <p className="text-sm">
            AI Reputation Intelligence Agent • Secure • Autonomous • Intelligent
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
