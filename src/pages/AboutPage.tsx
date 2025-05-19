
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Linkedin, Globe, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">About ARIA</h1>
          <p className="text-muted-foreground mt-2">
            Advanced Risk Intelligence Assistant - Your defense against digital threats
          </p>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>Protecting digital identities in an evolving threat landscape</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="leading-7">
                ARIA was founded with a clear purpose: to empower individuals and organizations 
                with powerful tools to monitor, detect, and respond to online threats. In today's 
                digital landscape, your online reputation and security are constantly at risk. 
                Our platform provides comprehensive threat intelligence with advanced AI-powered 
                analytics to safeguard your digital presence.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What We Do</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Real-time threat monitoring and detection</li>
                  <li>Advanced content classification and analysis</li>
                  <li>Digital reputation management</li>
                  <li>SERP defense and optimization</li>
                  <li>Strategic response recommendations</li>
                  <li>Predictive threat analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Our Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 mb-4">
                  ARIA leverages cutting-edge technologies including:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Multi-agent AI analysis systems</li>
                  <li>Machine learning classification models</li>
                  <li>Natural language processing</li>
                  <li>Predictive analytics</li>
                  <li>Secure API integrations</li>
                  <li>Real-time monitoring networks</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:contact@aria-security.com" className="text-primary hover:underline">
                    contact@aria-security.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a href="https://www.aria-security.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    www.aria-security.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  <a href="https://www.linkedin.com/company/aria-security" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-muted-foreground text-sm mt-4">
            <p className="flex items-center justify-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500" /> by the ARIA Team
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AboutPage;
