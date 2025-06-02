
import React from 'react';
import { Shield, MessageSquare, Users } from 'lucide-react';

const ServicesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground">
            Reputation Management Services – Powered by A.R.I.A™
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            A.R.I.A™ isn't just for individuals, CEOs, or global brands. Reputation is personal – and everyone 
            deserves protection. Whether you're facing online abuse, negative press, or algorithmic bias, we've 
            built elite tools for every type of modern digital reality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Social Media Protection */}
          <div className="text-center space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Social Media Protection</h3>
              <div className="text-left space-y-3 text-muted-foreground">
                <div>
                  <strong className="text-foreground">What We Do:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Monitor reputation across Facebook, Twitter, Instagram, LinkedIn, TikTok</li>
                    <li>• Neutralize hostile content and toxic harassment</li>
                    <li>• Amplify positive social signals and user testimonials</li>
                    <li>• Crisis response activation for harassment or content storms</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">Why It Matters:</strong>
                  <p className="text-sm mt-1">Your digital footprint shapes perception. Every hostile comment gets seen. Social platforms decide who gets amplified and who gets buried.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Influencer & Creator Shield */}
          <div className="text-center space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Influencer & Creator Shield</h3>
              <div className="text-left space-y-3 text-muted-foreground">
                <div>
                  <strong className="text-foreground">What We Do:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Real-time monitoring for emerging threats and mentions</li>
                    <li>• De-amplification against algorithmic penalties</li>
                    <li>• It tactics influence strategies to neutralize harassment</li>
                    <li>• Strategic content optimization and placement</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">Why It Matters:</strong>
                  <p className="text-sm mt-1">One coordinated attack can destroy years of audience building. Your creativity gets monetized by platforms designed to exploit creators, and bias gets you.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Everyday People Protection */}
          <div className="text-center space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Everyday People Protection</h3>
              <div className="text-left space-y-3 text-muted-foreground">
                <div>
                  <strong className="text-foreground">What We Do:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Clean search results tied to fraud investigations</li>
                    <li>• Protect families from doxxing and digital abuse</li>
                    <li>• Privacy protection from algorithmic monitoring</li>
                    <li>• Right to be forgotten coaching and advocacy</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">Why It Matters:</strong>
                  <p className="text-sm mt-1">You don't need to be famous to become a target. Ex. If you've had a vindictive roommate, if you've made a political post someone didn't like, you're at risk.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold mb-6 text-foreground">Ready to Get Started?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get a comprehensive assessment of your digital risk profile. Our experts will identify vulnerabilities and provide a strategic roadmap.
          </p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg font-medium rounded-lg">
            Request Your Assessment →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
