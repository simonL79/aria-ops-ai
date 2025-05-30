
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/logo';

const AdminLogin = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo variant="light" size="lg" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-300">Secure authentication required</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-orange-500 rounded-full w-fit">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <CardTitle className="text-white">Administrator Login</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your credentials to access the A.R.I.A™ admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@aria-intelligence.com"
                className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Lock className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <div className="text-center">
              <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-400">
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-300">
            ← Back to main site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
