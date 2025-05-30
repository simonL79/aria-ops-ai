
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Target, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EnhancedIntelligence = () => {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">A.R.I.A™</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 text-white mb-2">
                <Shield className="h-10 w-10 text-amber-400" />
                Enhanced Intelligence
              </h1>
              <p className="text-xl text-gray-300">
                Advanced threat intelligence and predictive analysis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#111214] border-gray-800 hover:border-amber-600/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5 text-amber-400" />
                  Threat Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-400">5</div>
                <p className="text-sm text-gray-400">Active threats</p>
              </CardContent>
            </Card>

            <Card className="bg-[#111214] border-gray-800 hover:border-amber-600/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-amber-400" />
                  Prediction Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">94%</div>
                <p className="text-sm text-gray-400">Model performance</p>
              </CardContent>
            </Card>

            <Card className="bg-[#111214] border-gray-800 hover:border-amber-600/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400">Medium</div>
                <p className="text-sm text-gray-400">Current risk level</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800/50 mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 A.R.I.A™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedIntelligence;
