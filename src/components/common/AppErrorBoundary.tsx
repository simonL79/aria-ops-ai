
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Shield, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-corporate-dark flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-corporate-darkSecondary border-corporate-border">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-white text-2xl mb-2">
                A.R.I.A™ System Error
              </CardTitle>
              <p className="text-corporate-lightGray">
                The system encountered an unexpected error and needs to recover
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-corporate-dark border border-corporate-border rounded p-4">
                <h4 className="text-white font-medium mb-2">Error Details:</h4>
                <p className="text-red-400 text-sm font-mono">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
                {this.state.error?.stack && (
                  <details className="mt-2">
                    <summary className="text-corporate-lightGray text-sm cursor-pointer">
                      Technical Details
                    </summary>
                    <pre className="text-xs text-corporate-lightGray mt-2 overflow-auto">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={this.handleRetry}
                  className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Retry Operation
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="border-corporate-border text-corporate-lightGray hover:bg-corporate-dark"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Application
                </Button>
              </div>

              <div className="text-center">
                <p className="text-corporate-lightGray text-sm">
                  If this problem persists, please check the console for additional details
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
