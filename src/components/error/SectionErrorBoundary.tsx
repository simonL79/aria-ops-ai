import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  /** Name of the section, used to group errors in the admin log. */
  section: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary that renders a friendly fallback AND records the crash to
 * `client_error_logs` so admins can review UI failures in production.
 */
class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[${this.props.section}] Section error:`, error, errorInfo);

    try {
      const { data } = await supabase.auth.getUser();
      await supabase.from('client_error_logs').insert({
        section: this.props.section,
        route: typeof window !== 'undefined' ? window.location.pathname : null,
        message: error?.message?.slice(0, 2000) || 'Unknown error',
        stack: error?.stack?.slice(0, 8000) || null,
        component_stack: errorInfo?.componentStack?.slice(0, 8000) || null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        user_id: data?.user?.id ?? null,
      } as any);
    } catch (logErr) {
      console.error('Failed to record error log:', logErr);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-6">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-14 h-14 bg-destructive/15 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle className="w-7 h-7 text-destructive" />
              </div>
              <CardTitle className="text-lg">Something went wrong here</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                This section failed to load. The issue has been logged and our team has been notified.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <p className="text-destructive text-xs font-mono text-center break-words">
                {this.state.error?.message || 'Unknown error'}
              </p>
              <Button onClick={this.handleRetry} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
