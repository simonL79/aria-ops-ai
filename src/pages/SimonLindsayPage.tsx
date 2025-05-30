
import React from 'react';
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Target, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const SimonLindsayPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <PublicLayout>
        <div className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Simon Lindsay</h1>
                <p className="text-xl text-gray-300">
                  Founder & CEO of A.R.I.A™
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-orange-500 text-black">Reputation Intelligence Expert</Badge>
                  <Badge variant="secondary" className="bg-gray-600 text-white">AI Strategist</Badge>
                  <Badge variant="secondary" className="bg-gray-600 text-white">Crisis Prevention Specialist</Badge>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-white">About Simon</h2>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      Simon Lindsay is a pioneering figure in the field of digital reputation intelligence, 
                      with over a decade of experience in crisis prevention and strategic reputation management.
                    </p>
                    <p>
                      As the founder of A.R.I.A™, Simon has developed cutting-edge AI systems that proactively 
                      identify and neutralize reputation threats before they can cause damage to individuals 
                      and organizations.
                    </p>
                    <p>
                      His expertise spans across multiple domains including AI technology, crisis communication, 
                      and strategic intelligence, making him a sought-after advisor for high-profile clients 
                      across various industries.
                    </p>
                  </div>
                </div>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Key Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-orange-500 mt-1" />
                      <span className="text-gray-300">Developed the first AI-powered reputation intelligence platform</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-orange-500 mt-1" />
                      <span className="text-gray-300">Protected over 1,000+ high-profile individuals and organizations</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-orange-500 mt-1" />
                      <span className="text-gray-300">Prevented 500+ potential reputation crises through proactive monitoring</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-orange-500 mt-1" />
                      <span className="text-gray-300">Pioneered predictive threat assessment methodologies</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-white">Vision & Philosophy</h2>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <blockquote className="text-lg text-gray-300 italic border-l-4 border-orange-500 pl-6">
                      "In the digital age, your reputation is your most valuable asset. The question isn't whether 
                      you'll face a reputation threat, but whether you'll be prepared when it happens. At A.R.I.A™, 
                      we believe in turning the tables on digital threats through intelligent, proactive protection."
                    </blockquote>
                    <cite className="text-orange-500 font-semibold mt-4 block">- Simon Lindsay</cite>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-white">Expertise Areas</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-orange-500">AI & Machine Learning</h3>
                      <p className="text-gray-300">
                        Advanced expertise in developing AI systems for threat detection, 
                        natural language processing, and predictive analytics.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-orange-500">Crisis Communication</h3>
                      <p className="text-gray-300">
                        Strategic communication planning and execution during high-stakes 
                        reputation crises and sensitive situations.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-orange-500">Strategic Intelligence</h3>
                      <p className="text-gray-300">
                        Intelligence gathering and analysis for proactive threat identification 
                        and strategic decision-making.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-orange-500">Digital Security</h3>
                      <p className="text-gray-300">
                        Comprehensive digital security strategies and implementation 
                        for reputation protection and privacy preservation.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6 text-white">Work With Simon</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Ready to discuss your reputation intelligence needs? Get in touch for a consultation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Link to="/scan">Request Assessment</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Link to="/contact">Contact Simon</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    </div>
  );
};

export default SimonLindsayPage;
