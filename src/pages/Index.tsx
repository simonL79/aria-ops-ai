
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, TrendingUp, Eye, Check, ArrowRight } from "lucide-react";

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

  const handleScanRequest = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/scan');
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C]">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-[#247CFF] to-[#38C172] rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white font-['Space_Grotesk'] tracking-tight">A.R.I.A™</h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#247CFF] mb-6 font-['Space_Grotesk'] tracking-wide">
            ADAPTIVE REPUTATION INTELLIGENCE & ANALYSIS
          </h2>
          <p className="text-xl text-[#D8DEE9] mb-12 font-['Inter']">
            Real-time protection for your name, your business, and your future.
          </p>
          
          <div className="mb-16">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 font-['Space_Grotesk']">
              PROTECT WHAT MATTERS — BEFORE IT BREAKS
            </h3>
            <p className="text-lg text-[#D8DEE9] max-w-2xl mx-auto font-['Inter']">
              You don't need to be famous to be at risk.<br />
              You just need someone to say the wrong thing — in the wrong place — at the wrong time.
            </p>
          </div>

          <Button
            onClick={() => navigate('/scan')}
            className="bg-[#247CFF] hover:bg-[#1c63cc] text-white px-12 py-4 text-lg font-bold rounded-xl border-2 border-[#247CFF] hover:border-[#1c63cc] hover:shadow-[0_0_20px_rgba(36,124,255,0.4)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-wide uppercase"
          >
            REQUEST YOUR PRIVATE SCAN
          </Button>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 px-6 bg-[#1C1C1E]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-white font-['Space_Grotesk'] tracking-tight">
            A.R.I.A™ IS THE WORLD'S FIRST FULLY-MANAGED REPUTATION INTELLIGENCE SYSTEM THAT:
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "FINDS THREATS BEFORE YOU'RE AWARE",
                description: "Detects risks across the internet before they impact you",
                gradient: "from-[#247CFF] to-[#38C172]"
              },
              {
                title: "TRACKS ACROSS ALL PLATFORMS",
                description: "Forums, news, social media, and AI systems monitoring",
                gradient: "from-[#38C172] to-[#247CFF]"
              },
              {
                title: "HUMAN-READABLE REPORTS",
                description: "No tools, no dashboards — just clear insights",
                gradient: "from-[#247CFF] to-[#1C1C1E]"
              },
              {
                title: "PREVENTS FUTURE CRISES",
                description: "Stops problems before they exist",
                gradient: "from-[#1C1C1E] to-[#247CFF]"
              },
              {
                title: "CORRECTS FALSE MEMORIES",
                description: "Fixes what search engines and AI models remember",
                gradient: "from-[#247CFF] to-[#38C172]"
              },
              {
                title: "ZERO INPUT SCANNING",
                description: "Finds everything — even what you didn't search for",
                gradient: "from-[#38C172] to-[#247CFF]"
              }
            ].map((capability, index) => (
              <Card key={index} className="group p-8 bg-[#0A0F2C] hover:bg-[#0A0F2C]/80 border border-[#247CFF]/20 hover:border-[#247CFF]/50 shadow-lg hover:shadow-[0_0_25px_rgba(36,124,255,0.2)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${capability.gradient} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(36,124,255,0.4)] transition-shadow duration-500`}>
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-4 text-lg text-white group-hover:text-[#247CFF] transition-colors font-['Space_Grotesk'] tracking-wide">
                  {capability.title}
                </h3>
                <p className="text-[#D8DEE9] group-hover:text-white transition-colors font-['Inter']">
                  {capability.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Threat Intelligence Section */}
      <section className="py-20 px-6 bg-[#0A0F2C]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-white font-['Space_Grotesk'] tracking-tight">
            THREAT INTELLIGENCE THAT MATTERS
          </h2>
          <p className="text-lg text-[#D8DEE9] text-center mb-16 font-['Inter'] max-w-3xl mx-auto">
            Our advanced monitoring systems detect and classify threats across multiple vectors, providing early warning for reputation risks before they escalate.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "SOCIAL MEDIA ATTACKS",
                description: "Monitor and neutralize coordinated attacks across all social platforms before they gain momentum.",
                gradient: "from-[#247CFF] to-[#38C172]"
              },
              {
                title: "SEARCH ENGINE MANIPULATION",
                description: "Detect and counter negative SEO campaigns designed to damage your online reputation.",
                gradient: "from-[#38C172] to-[#247CFF]"
              },
              {
                title: "CORPORATE ESPIONAGE",
                description: "Identify threats from competitors, disgruntled employees, and industrial espionage attempts.",
                gradient: "from-[#247CFF] to-[#1C1C1E]"
              },
              {
                title: "AI MODEL POISONING",
                description: "Prevent false information from being embedded into AI training data and language models.",
                gradient: "from-[#1C1C1E] to-[#247CFF]"
              }
            ].map((threat, index) => (
              <Card key={index} className="group p-8 bg-[#1C1C1E] hover:bg-[#1C1C1E]/80 border border-[#38C172]/20 hover:border-[#38C172]/50 shadow-lg hover:shadow-[0_0_25px_rgba(56,193,114,0.2)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl">
                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${threat.gradient} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(56,193,114,0.4)] transition-shadow duration-500`}>
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-4 text-xl text-white group-hover:text-[#38C172] transition-colors font-['Space_Grotesk'] tracking-wide">
                  {threat.title}
                </h3>
                <p className="text-[#D8DEE9] group-hover:text-white transition-colors font-['Inter']">
                  {threat.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Types Section */}
      <section className="py-20 px-6 bg-[#D8DEE9]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-[#0A0F2C] font-['Space_Grotesk'] tracking-tight">
            WHO WE PROTECT
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "EXECUTIVES",
                description: "Founders, CEOs, and public leaders",
                gradient: "from-[#247CFF] to-[#38C172]"
              },
              {
                title: "CREATORS",
                description: "Influencers and professionals",
                gradient: "from-[#38C172] to-[#247CFF]"
              },
              {
                title: "ORGANIZATIONS",
                description: "Brands, agencies, and legal teams",
                gradient: "from-[#247CFF] to-[#1C1C1E]"
              },
              {
                title: "INDIVIDUALS",
                description: "Private people with reputational vulnerabilities",
                gradient: "from-[#1C1C1E] to-[#247CFF]"
              }
            ].map((client, index) => (
              <Card key={index} className="group p-8 text-center bg-white hover:bg-[#0A0F2C] border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${client.gradient} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(36,124,255,0.3)] transition-shadow duration-500`}>
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <h3 className="font-bold mb-4 text-xl text-[#0A0F2C] group-hover:text-white transition-colors font-['Space_Grotesk'] tracking-wide">
                  {client.title}
                </h3>
                <p className="text-[#1C1C1E] group-hover:text-[#D8DEE9] transition-colors font-['Inter']">
                  {client.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-[#1C1C1E]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white font-['Space_Grotesk'] tracking-tight">
            WHAT YOU GET
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "WEEKLY INTELLIGENCE REPORTS",
                description: "Summarized risks, shifts in sentiment, and clear next steps.",
                gradient: "from-[#247CFF] to-[#38C172]"
              },
              {
                title: "INSTANT ALERTS",
                description: "When something urgent emerges — we notify you directly.",
                gradient: "from-[#38C172] to-[#247CFF]"
              },
              {
                title: "MEMORY OVERWRITES",
                description: "We help correct what AI models and search engines \"remember\" about you.",
                gradient: "from-[#247CFF] to-[#1C1C1E]"
              },
              {
                title: "PRE-CRISIS FORECASTING",
                description: "Detect reputation risks before they happen, based on tone, behavior, and online chatter.",
                gradient: "from-[#1C1C1E] to-[#247CFF]"
              },
              {
                title: "ZERO INPUT SCANNING",
                description: "No keywords needed. We look for everything — even what you didn't know to search for.",
                gradient: "from-[#247CFF] to-[#38C172]"
              },
              {
                title: "PRIVATE BY DESIGN",
                description: "GDPR-compliant, no public dashboards, enterprise-grade encryption.",
                gradient: "from-[#38C172] to-[#247CFF]"
              }
            ].map((service, index) => (
              <Card key={index} className="group p-8 bg-[#0A0F2C] hover:bg-[#0A0F2C]/80 border border-[#247CFF]/20 hover:border-[#247CFF]/50 shadow-lg hover:shadow-[0_0_25px_rgba(36,124,255,0.2)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl">
                <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(36,124,255,0.4)] transition-shadow duration-500`}>
                  <ArrowRight className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold mb-4 text-lg text-white group-hover:text-[#247CFF] transition-colors font-['Space_Grotesk'] tracking-wide">
                  {service.title}
                </h3>
                <p className="text-[#D8DEE9] group-hover:text-white transition-colors font-['Inter']">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 px-6 bg-[#1C1C1E]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 text-white font-['Space_Grotesk'] tracking-tight">
            PRIVATE BY DESIGN
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "FULLY GDPR-COMPLIANT",
                description: "Complete data protection compliance",
                gradient: "from-[#38C172] to-[#247CFF]"
              },
              {
                title: "NO PUBLIC DASHBOARD, EVER",
                description: "Your data stays completely private",
                gradient: "from-[#247CFF] to-[#38C172]"
              },
              {
                title: "ENTERPRISE-GRADE ENCRYPTION",
                description: "Bank-level security for all data",
                gradient: "from-[#247CFF] to-[#1C1C1E]"
              },
              {
                title: "VERIFIED SECURE OPERATORS",
                description: "Only trusted personnel handle your information",
                gradient: "from-[#1C1C1E] to-[#247CFF]"
              }
            ].map((feature, index) => (
              <Card key={index} className="group p-8 bg-[#0A0F2C] hover:bg-[#0A0F2C]/80 border border-[#38C172]/20 hover:border-[#38C172]/50 shadow-lg hover:shadow-[0_0_25px_rgba(56,193,114,0.2)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mr-6 group-hover:shadow-[0_0_20px_rgba(56,193,114,0.4)] transition-shadow duration-500`}>
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-white group-hover:text-[#38C172] transition-colors font-['Space_Grotesk'] tracking-wide">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-[#D8DEE9] group-hover:text-white transition-colors font-['Inter']">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 bg-[#0A0F2C]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white font-['Space_Grotesk'] tracking-tight">
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "TELL US WHO TO PROTECT",
                description: "You specify what (or who) needs monitoring"
              },
              {
                step: "2", 
                title: "WE SCAN EVERYTHING",
                description: "Open internet + AI ecosystem monitoring"
              },
              {
                step: "3",
                title: "YOU RECEIVE REPORTS", 
                description: "Private, actionable insights + urgent alerts"
              },
              {
                step: "4",
                title: "WE FIX IT QUIETLY",
                description: "Prevention and resolution behind the scenes"
              }
            ].map((process, index) => (
              <Card key={index} className="group p-8 text-center bg-[#1C1C1E] hover:bg-[#1C1C1E]/80 border border-[#247CFF]/20 hover:border-[#247CFF]/50 shadow-lg hover:shadow-[0_0_25px_rgba(36,124,255,0.2)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#247CFF] to-[#38C172] flex items-center justify-center text-white font-black text-2xl font-['Space_Grotesk'] group-hover:shadow-[0_0_20px_rgba(36,124,255,0.4)] transition-shadow duration-500">
                  {process.step}
                </div>
                <h3 className="font-bold mb-4 text-lg text-white group-hover:text-[#247CFF] transition-colors font-['Space_Grotesk'] tracking-wide">
                  {process.title}
                </h3>
                <p className="text-[#D8DEE9] group-hover:text-white transition-colors font-['Inter']">
                  {process.description}
                </p>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16 space-y-4">
            <p className="text-2xl font-bold text-white font-['Space_Grotesk']">NO NEED TO LOG IN.</p>
            <p className="text-2xl font-bold text-white font-['Space_Grotesk']">NO ALERTS UNLESS IT MATTERS.</p>
            <p className="text-2xl font-bold text-white font-['Space_Grotesk']">WE HANDLE IT ALL FOR YOU.</p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-6 bg-[#D8DEE9]">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-12 text-sm text-[#0A0F2C]">
            {[
              {
                icon: Shield,
                text: "GDPR COMPLIANT",
                gradient: "from-[#38C172] to-[#247CFF]"
              },
              {
                icon: TrendingUp,
                text: "USED BY AGENCIES & ENTERPRISES",
                gradient: "from-[#247CFF] to-[#38C172]"
              },
              {
                icon: Eye,
                text: "HUMAN + AI VERIFIED",
                gradient: "from-[#247CFF] to-[#1C1C1E]"
              },
              {
                icon: Shield,
                text: "BUILT IN THE UK",
                gradient: "from-[#1C1C1E] to-[#247CFF]"
              }
            ].map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div key={index} className="group flex items-center p-4 rounded-2xl hover:bg-white/50 transition-all duration-300 hover:shadow-lg">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${badge.gradient} mr-4 group-hover:shadow-[0_0_15px_rgba(36,124,255,0.3)] transition-shadow duration-300`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold tracking-wide font-['Space_Grotesk']">
                    {badge.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-[#0A0F2C]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-white font-['Space_Grotesk'] tracking-tight">
            READY TO STAY AHEAD OF THE STORY?
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-[#247CFF] mb-12 font-['Space_Grotesk'] tracking-wide">
            YOUR REPUTATION DESERVES PROTECTION
          </h3>
          
          <div className="space-y-6 mb-12">
            <p className="text-xl text-[#D8DEE9] font-['Inter']">Your name shouldn't be left unguarded.</p>
            <p className="text-xl text-[#D8DEE9] font-['Inter']">Your past shouldn't define your future.</p>
            <p className="text-xl text-[#D8DEE9] font-['Inter']">Your story shouldn't be written without you.</p>
          </div>

          {/* Scan Request Form */}
          <Card className="max-w-md mx-auto p-8 bg-gradient-to-r from-[#1C1C1E]/40 via-[#0A0F2C]/60 to-[#1C1C1E]/40 border border-[#247CFF]/30 rounded-2xl backdrop-blur-sm">
            <h4 className="text-lg font-bold mb-6 text-[#247CFF] font-['Space_Grotesk'] tracking-wide">
              REQUEST YOUR FREE A.R.I.A™ SCAN
            </h4>
            <form onSubmit={handleScanRequest} className="space-y-4">
              <Input
                placeholder="Your Full Name"
                className="bg-[#1C1C1E] border-[#247CFF]/30 text-white placeholder-[#D8DEE9]/60 focus:border-[#247CFF] font-['Inter']"
              />
              <Input
                type="email"
                placeholder="Your Email Address"
                className="bg-[#1C1C1E] border-[#247CFF]/30 text-white placeholder-[#D8DEE9]/60 focus:border-[#247CFF] font-['Inter']"
              />
              <Button
                type="submit"
                className="w-full bg-[#247CFF] hover:bg-[#1c63cc] text-white px-6 py-3 font-bold rounded-xl border-2 border-[#247CFF] hover:border-[#1c63cc] hover:shadow-[0_0_20px_rgba(36,124,255,0.4)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-wide uppercase"
              >
                SCAN ME
              </Button>
            </form>
            <p className="text-xs text-[#D8DEE9] mt-4 font-['Inter']">
              SECURE • CONFIDENTIAL • PROFESSIONAL
            </p>
          </Card>
        </div>
      </section>

      {/* Admin Access Section */}
      <section className="py-16 px-6 bg-[#0A0F2C] border-t border-[#247CFF]/20">
        <div className="container mx-auto text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-[#1C1C1E]/40 via-[#0A0F2C]/60 to-[#1C1C1E]/40 border border-[#247CFF]/30 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 text-[#247CFF] font-['Space_Grotesk'] tracking-wide">
                SECURE ADMIN PORTAL
              </h3>
              <p className="text-sm text-[#D8DEE9] mb-6 font-['Inter']">
                Access the A.R.I.A™ intelligence platform. All access is logged and monitored.
              </p>
              <button
                onClick={handleAdminAccess}
                className="w-full bg-[#247CFF] hover:bg-[#1c63cc] text-white px-6 py-3 text-sm font-bold rounded-xl border-2 border-[#247CFF] hover:border-[#1c63cc] hover:shadow-[0_0_20px_rgba(36,124,255,0.4)] transform hover:scale-105 transition-all duration-300 font-['Space_Grotesk'] tracking-wide uppercase"
              >
                {isAuthenticated && isAdmin ? 'Enter Dashboard' : 'Admin Access'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1C1E]/40 backdrop-blur-sm border-t border-[#247CFF]/20 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-[#247CFF] to-[#38C172] rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-white font-['Space_Grotesk'] tracking-wide">A.R.I.A™</span>
          </div>
          <p className="text-sm text-[#D8DEE9] font-['Inter']">
            Adaptive Reputation Intelligence & Analysis • Secure • Autonomous • Intelligent
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
