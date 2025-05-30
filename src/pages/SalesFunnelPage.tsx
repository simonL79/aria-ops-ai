
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminDashboardWelcome from "@/components/salesFunnel/AdminDashboardWelcome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SalesFunnelPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AdminDashboardWelcome />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
            Elevate Your<br />
            Online Reputation
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Safeguard your brand, enhance your presence,<br />
            and transform your image with our comprehensive.
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 text-black px-8 py-3 rounded-full text-lg font-medium">
            Request a Demo
          </Button>
        </div>
      </section>

      {/* Client Logos */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            <div className="text-gray-400 font-light text-lg">Goldman<br />Sachs</div>
            <div className="text-gray-400 font-light text-lg">Deloitte.</div>
            <div className="text-gray-400 font-light text-lg flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-400"></div>
              Microsoft
            </div>
            <div className="text-gray-400 font-light text-xl tracking-wider">HSBC</div>
            <div className="w-12 h-12 border border-gray-400 flex items-center justify-center">
              <span className="text-gray-400 font-bold">GM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Powered by AI Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
              Powered by AI,<br />
              Delivered by Experts
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded">
                <div className="text-sm text-gray-400 mb-2">CALIFORNIA SATURN CO.</div>
                <div className="h-24 bg-gray-800 rounded mb-2"></div>
                <div className="text-xs text-gray-500">Forecast data</div>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Score</span>
                  <span className="text-2xl">576</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/54be2a4a-0be1-459c-b307-390e14873c37.png" 
              alt="Professional headshot" 
              className="w-80 h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 leading-tight">
            Real Stories,<br />
            Real Results
          </h2>
          <p className="text-gray-400 mb-12 max-w-md">
            Learn tri, myeer for regulator livelliae, duck, 
            positions, arerit tour and bellisair Lagos 
            maecenatio.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-white">Laura M.</h3>
                  <p className="text-sm text-gray-400">ENTREPRENEUR CONSULTATION AND PREV BOT...</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-white">Andrew R.</h3>
                  <p className="text-sm text-gray-400">STRATEGIC CONSULTANT MARKETING...</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-white">Sarah W.</h3>
                  <p className="text-sm text-gray-400">MARKETING VP PERSONAL RESPONSIBLE...</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
            Pricing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-2xl font-light mb-6">Private</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Professional plan</li>
                <li>• Consultation case</li>
                <li>• Contact us</li>
              </ul>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-2xl font-light mb-6">Executive</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Professional plan</li>
                <li>• Consultation case</li>
                <li>• Contact us</li>
              </ul>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800 p-8">
              <h3 className="text-2xl font-light mb-6">Enterprise</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Professional plan</li>
                <li>• Consultation case</li>
                <li>• Contact us</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalesFunnelPage;
