
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Brain, Satellite, Globe, Scale, Users, TestTube, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const modules = [
    {
      title: "Genesis Sentinel",
      description: "Proactive threat detection and intelligence gathering",
      icon: Shield,
      href: "/admin/genesis-sentinel",
      status: "Active"
    },
    {
      title: "Intelligence Core",
      description: "Advanced intelligence analysis and processing",
      icon: Brain,
      href: "/admin/intelligence-core",
      status: "Active"
    },
    {
      title: "Watchtower",
      description: "Continuous monitoring and surveillance systems",
      icon: Satellite,
      href: "/admin/watchtower",
      status: "Active"
    },
    {
      title: "Persona Saturation",
      description: "Strategic content deployment and reputation management",
      icon: Globe,
      href: "/admin/persona-saturation",
      status: "Active"
    },
    {
      title: "Legal + Tactical Ops",
      description: "Legal compliance and tactical operations management",
      icon: Scale,
      href: "/admin/legal-ops",
      status: "Development"
    },
    {
      title: "Client Management",
      description: "Client relationship and account management",
      icon: Users,
      href: "/admin/clients",
      status: "Active"
    },
    {
      title: "QA Testing",
      description: "Quality assurance and system testing",
      icon: TestTube,
      href: "/admin/qa-testing",
      status: "Active"
    },
    {
      title: "System Settings",
      description: "System configuration and preferences",
      icon: Settings,
      href: "/admin/settings",
      status: "Active"
    }
  ];

  return (
    <DashboardLayout>
      <Helmet>
        <title>A.R.I.A™ Admin Dashboard - System Overview</title>
        <meta name="description" content="Central administration dashboard for A.R.I.A system management" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">A.R.I.A™ Administration</h1>
            <p className="text-muted-foreground">Central command and control dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link key={module.title} to={module.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <module.icon className="h-5 w-5" />
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      module.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {module.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
