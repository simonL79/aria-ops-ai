
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const formSchema = z.object({
  fullName: z.string().trim().min(1, 'Name is required').max(100),
  industry: z.string().min(1, 'Select an industry'),
  website: z.string().max(500).optional(),
  visibility: z.enum(['low', 'medium', 'high']),
  controversy: z.boolean(),
  email: z.string().trim().email('Valid email required').max(255),
  socialHandle: z.string().max(200).optional(),
});

type FormData = z.infer<typeof formSchema>;

const INDUSTRIES = ['Tech', 'Finance', 'Entertainment', 'Sports', 'Legal', 'Other'];

const getRiskLabel = (score: number) => {
  if (score >= 80) return { label: 'Critical Public Vulnerability', color: 'text-red-400' };
  if (score >= 60) return { label: 'High Narrative Risk', color: 'text-orange-400' };
  if (score >= 40) return { label: 'Elevated Monitoring Required', color: 'text-yellow-400' };
  return { label: 'Low Exposure', color: 'text-green-400' };
};

const getInsights = (data: FormData, score: number): string[] => {
  const insights: string[] = [];
  if (!data.website) {
    insights.push('Your lack of an owned web presence leaves room for hostile content to rank unchallenged.');
  } else {
    insights.push('Your web presence provides a foundation, but defensive content gaps may still exist.');
  }
  if (data.controversy) {
    insights.push('Recent controversy signals elevated press risk and potential narrative acceleration.');
  } else if (data.visibility === 'high') {
    insights.push('High visibility profiles attract sustained monitoring from adversarial actors.');
  } else {
    insights.push('Social sentiment volatility is within normal range for your current profile size.');
  }
  if (!data.socialHandle) {
    insights.push('Missing social verification increases impersonation and identity cloning risk.');
  } else if (score >= 60) {
    insights.push('Press risk is elevated — proactive narrative positioning is recommended.');
  } else {
    insights.push('Your digital footprint shows manageable risk with room for strategic improvement.');
  }
  return insights;
};

const AnimatedScore = ({ target }: { target: number }) => {
  const [current, setCurrent] = useState(0);
  const ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1800;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (current / 100) * circumference;
  const risk = getRiskLabel(current);

  const strokeColor = current >= 80 ? '#EF4444' : current >= 60 ? '#F97316' : current >= 40 ? '#EAB308' : '#10B981';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="58" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <circle
            ref={ref}
            cx="64" cy="64" r="58"
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-100"
            style={{ filter: `drop-shadow(0 0 8px ${strokeColor}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{current}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold ${risk.color}`}>{risk.label}</span>
    </div>
  );
};

const ThreatScoreSection = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    industry: '',
    website: '',
    visibility: 'medium',
    controversy: false,
    email: '',
    socialHandle: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateScore = (data: FormData): number => {
    let s = data.visibility === 'low' ? 25 : data.visibility === 'medium' ? 50 : 70;
    if (data.controversy) s += 15;
    if (!data.website?.trim()) s += 10;
    if (!data.socialHandle?.trim()) s += 5;
    return Math.min(s, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0]?.message || 'Please check your inputs');
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.from('reputation_scan_submissions').insert({
        full_name: formData.fullName,
        email: formData.email,
        company: formData.industry,
        keywords: formData.socialHandle || null,
        details: JSON.stringify({
          website: formData.website,
          visibility: formData.visibility,
          controversy: formData.controversy,
        }),
        scan_type: 'threat_score',
        status: 'new',
      });

      if (error) throw error;

      const s = calculateScore(formData);
      setScore(s);
      setInsights(getInsights(formData, s));
      setSubmitted(true);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof FormData, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <section id="threat-score" className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Get Your Free <span className="text-primary">Reputation Threat Score</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Instantly assess your online exposure risk. No commitment required.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white mb-2">Full Name / Brand Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => update('fullName', e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-white placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Industry *</label>
                  <select
                    value={formData.industry}
                    onChange={e => update('industry', e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-white focus:border-primary focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white mb-2">Website or Main Social Profile</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={e => update('website', e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-white placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm text-white mb-3">Public Visibility Level *</label>
                <div className="flex gap-4">
                  {(['low', 'medium', 'high'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => update('visibility', level)}
                      className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.visibility === level
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-secondary border-border text-muted-foreground hover:border-border'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white mb-3">Recent Press or Controversy?</label>
                <div className="flex gap-4">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => update('controversy', val)}
                      className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.controversy === val
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-secondary border-border text-muted-foreground'
                      }`}
                    >
                      {val ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => update('email', e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-white placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="you@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Social Handle</label>
                  <input
                    type="text"
                    value={formData.socialHandle}
                    onChange={e => update('socialHandle', e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-white placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="@username"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300"
              >
                {loading ? 'Calculating...' : 'Calculate Your Threat Score'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your data is encrypted and never shared. GDPR compliant.
              </p>
            </form>
          ) : (
            <div className="glass-card p-8 md:p-12 text-center space-y-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-white">Your Reputation Threat Score</h3>
              
              <AnimatedScore target={score} />

              <div className="space-y-4 text-left max-w-lg mx-auto">
                <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">Instant Insights</h4>
                {insights.map((insight, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-medium rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300"
                >
                  <Link to="/scan">Receive Full AI Threat Breakdown</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ThreatScoreSection;
