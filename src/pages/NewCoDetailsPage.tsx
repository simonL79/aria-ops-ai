
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Mail, Phone, Users, Building, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";
import { NewCompany } from "@/types/newco";

const NewCoDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<NewCompany | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Sample mock data for demonstration
  const mockCompanies = [
    {
      id: "nc-1",
      name: "Quantum Innovations Ltd",
      incorporationDate: "2025-05-18",
      jurisdiction: "United Kingdom",
      industry: "Technology",
      sicCode: "62020",
      source: "companies_house",
      cleanLaunchScore: 85,
      cleanLaunchCategory: "green",
      status: "new",
      address: "123 Tech Lane, London, UK",
      directors: [
        {
          id: "d-1",
          name: "Sarah Johnson",
          role: "Director",
          address: "123 Tech Lane, London",
          reputationScan: {
            id: "rs-1",
            personId: "d-1",
            scanDate: "2025-05-19",
            overallSentiment: 0.7,
            riskScore: 15,
            riskCategory: "low",
            issues: [],
            sources: {
              news: 3,
              social: 12,
              legal: 0,
              other: 1
            }
          }
        }
      ]
    },
    {
      id: "nc-2",
      name: "EcoSolutions Global Inc",
      incorporationDate: "2025-05-17",
      jurisdiction: "United States",
      industry: "Environmental Services",
      sicCode: "3825",
      source: "secretary_of_state",
      cleanLaunchScore: 62,
      cleanLaunchCategory: "yellow",
      status: "scanned",
      address: "456 Green Avenue, Austin, TX, USA",
      directors: [
        {
          id: "d-2",
          name: "Michael Roberts",
          role: "CEO",
          address: "789 Executive Drive, Austin, TX",
          reputationScan: {
            id: "rs-2",
            personId: "d-2",
            scanDate: "2025-05-18",
            overallSentiment: -0.2,
            riskScore: 45,
            riskCategory: "medium",
            issues: [
              {
                id: "ri-1",
                type: "controversy",
                title: "Environmental Dispute",
                description: "Was involved in a dispute regarding environmental regulations at previous company",
                source: "Local News",
                url: "https://example.com/news/article",
                date: "2024-11-10",
                severity: "medium",
                remediationStatus: "not_started"
              }
            ],
            sources: {
              news: 8,
              social: 23,
              legal: 1,
              other: 4
            }
          }
        },
        {
          id: "d-3",
          name: "Jennifer Lee",
          role: "CFO",
          address: "101 Finance Street, Austin, TX",
          reputationScan: {
            id: "rs-3",
            personId: "d-3",
            scanDate: "2025-05-18",
            overallSentiment: 0.5,
            riskScore: 20,
            riskCategory: "low",
            issues: [],
            sources: {
              news: 2,
              social: 8,
              legal: 0,
              other: 1
            }
          }
        }
      ]
    },
    {
      id: "nc-3",
      name: "Fintech Frontier Ltd",
      incorporationDate: "2025-05-15",
      jurisdiction: "United Kingdom",
      industry: "Finance",
      sicCode: "64209",
      source: "companies_house",
      cleanLaunchScore: 35,
      cleanLaunchCategory: "red",
      status: "contacted",
      address: "45 Financial Street, Manchester, UK",
      directors: [
        {
          id: "d-4",
          name: "David Chen",
          role: "Director",
          address: "45 Financial Street, Manchester",
          reputationScan: {
            id: "rs-4",
            personId: "d-4",
            scanDate: "2025-05-16",
            overallSentiment: -0.6,
            riskScore: 75,
            riskCategory: "high",
            issues: [
              {
                id: "ri-2",
                type: "lawsuit",
                title: "Financial Misconduct Lawsuit",
                description: "Named in a lawsuit regarding financial misconduct at previous firm",
                source: "Court Records",
                date: "2023-08-22",
                severity: "high",
                remediationStatus: "in_progress",
                remediationStrategy: "Legal counsel engaged, press statement prepared"
              },
              {
                id: "ri-3",
                type: "negative_press",
                title: "Negative Media Coverage",
                description: "Subject of negative coverage in financial press",
                source: "Financial Times",
                url: "https://example.com/finance/article",
                date: "2024-02-15",
                severity: "medium",
                remediationStatus: "in_progress"
              }
            ],
            sources: {
              news: 15,
              social: 42,
              legal: 3,
              other: 7
            }
          }
        }
      ]
    }
  ];
  
  useEffect(() => {
    // Simulating data fetch
    setLoading(true);
    
    setTimeout(() => {
      const foundCompany = mockCompanies.find(c => c.id === id);
      if (foundCompany) {
        setCompany(foundCompany);
      } else {
        toast.error("Company data not found");
        navigate("/newco");
      }
      setLoading(false);
    }, 500);
  }, [id, navigate]);
  
  const handleDownloadReport = () => {
    toast.success("Report generation started", {
      description: "Your report will be available to download shortly"
    });
    
    setTimeout(() => {
      toast.success("Report ready", {
        description: "Report has been generated and is ready to download",
        action: {
          label: "Download PDF",
          onClick: () => console.log("Download initiated")
        }
      });
    }, 2000);
  };
  
  const handleSendEmail = () => {
    toast("Send report via email", {
      description: "Enter client email to send the report",
      action: {
        label: "Send",
        onClick: () => {
          toast.success("Report sent", {
            description: "Report has been emailed to client"
          });
        }
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-12">
          <span>Loading company details...</span>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!company) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-12">
          <span>Company not found</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/newco")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          {company.cleanLaunchCategory === "green" && (
            <Badge className="ml-2 bg-green-500">Low Risk</Badge>
          )}
          {company.cleanLaunchCategory === "yellow" && (
            <Badge className="ml-2 bg-yellow-500">Medium Risk</Badge>
          )}
          {company.cleanLaunchCategory === "red" && (
            <Badge className="ml-2 bg-red-500">High Risk</Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Company Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Incorporated:</span>
                <span>{new Date(company.incorporationDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jurisdiction:</span>
                <span>{company.jurisdiction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry:</span>
                <span>{company.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SIC Code:</span>
                <span>{company.sicCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address:</span>
                <span>{company.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clean Launch Score:</span>
                <span className="font-bold">{company.cleanLaunchScore}/100</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {company.directors.some(d => 
              d.reputationScan && 
              d.reputationScan.issues && 
              d.reputationScan.issues.length > 0
            ) ? (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Reputation risks detected</p>
                    <p className="text-sm">This company has individuals associated with it who have reputation concerns.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {company.directors.map(director => 
                    director.reputationScan && 
                    director.reputationScan.issues && 
                    director.reputationScan.issues.length > 0 && (
                      <div key={director.id} className="border p-3 rounded-md">
                        <p className="font-medium">{director.name} ({director.role})</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Risk Score: {director.reputationScan.riskScore}/100 ({director.reputationScan.riskCategory} risk)
                        </p>
                        <ul className="space-y-2">
                          {director.reputationScan.issues.map(issue => (
                            <li key={issue.id} className="text-sm">
                              <span className="font-medium">{issue.title}</span>: {issue.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">No significant risks detected</p>
                  <p className="text-sm">Initial analysis shows no major reputation concerns for this company or its directors.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="directors">
        <TabsList>
          <TabsTrigger value="directors">Directors & Personnel</TabsTrigger>
          <TabsTrigger value="media">Media Analysis</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="directors" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Directors & Key Personnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {company.directors.map(director => (
                  <div key={director.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{director.name}</h4>
                        <p className="text-sm text-muted-foreground">{director.role}</p>
                        
                        {director.address && (
                          <p className="text-sm mt-2">{director.address}</p>
                        )}
                      </div>
                      
                      {director.reputationScan && (
                        <div className="text-right">
                          <p className="text-sm">
                            Sentiment: {director.reputationScan.overallSentiment > 0 ? 'Positive' : 
                                      director.reputationScan.overallSentiment < 0 ? 'Negative' : 'Neutral'}
                          </p>
                          <p className="text-sm">
                            Risk: {director.reputationScan.riskScore}/100
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                              director.reputationScan.riskCategory === 'low' ? 'bg-green-100 text-green-800' :
                              director.reputationScan.riskCategory === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {director.reputationScan.riskCategory}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {director.reputationScan && director.reputationScan.issues && director.reputationScan.issues.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Identified Issues:</p>
                        <ul className="space-y-2">
                          {director.reputationScan.issues.map(issue => (
                            <li key={issue.id} className="bg-red-50 p-3 rounded-md">
                              <p className="text-sm font-medium">{issue.title}</p>
                              <p className="text-xs text-muted-foreground">{issue.description}</p>
                              <div className="flex justify-between mt-2">
                                <span className="text-xs">{issue.source} | {new Date(issue.date).toLocaleDateString()}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  issue.severity === 'low' ? 'bg-green-100 text-green-800' :
                                  issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {issue.severity} severity
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center p-12 text-center">
                <div>
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Media Analysis</h3>
                  <p className="text-muted-foreground mt-2">
                    Media mentions and sentiment analysis will be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outreach" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Outreach Campaign
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Email Template</h4>
                <div className="bg-card border p-4 rounded-md">
                  <p className="mb-2">Subject: Protecting Your New Business's Digital Reputation</p>
                  <p>Dear [Company Name] Team,</p>
                  <p className="mt-2">Congratulations on your new business venture with [Company Name]!</p>
                  <p className="mt-2">
                    As you establish your brand in the [Industry] sector, I wanted to reach out about the importance of
                    protecting your business reputation from day one. Our reputation management services help new businesses
                    build a strong digital foundation and prevent potential issues before they arise.
                  </p>
                  <p className="mt-2">
                    Would you be available for a brief conversation about how we can help [Company Name] establish and
                    maintain a positive online presence?
                  </p>
                  <p className="mt-2">Best regards,</p>
                  <p>Your Name</p>
                </div>
              </div>
              
              <div className="flex gap-4 justify-end">
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Log Phone Call
                </Button>
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Company activity timeline will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default NewCoDetailsPage;
