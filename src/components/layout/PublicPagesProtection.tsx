
import React, { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface PublicPagesProtectionProps {
  children: ReactNode;
}

const PublicErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">A.R.I.A™ System</h1>
        <p className="text-muted-foreground mb-4">Public page temporarily unavailable</p>
        <button 
          onClick={resetErrorBoundary}
          className="bg-accent text-black px-4 py-2 rounded hover:bg-accent/90"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

const PublicPagesProtection = ({ children }: PublicPagesProtectionProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={PublicErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Public page error caught:', error, errorInfo);
      }}
      onReset={() => {
        window.location.reload();
      }}
    >
      <div className="public-pages-wrapper">
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default PublicPagesProtection;
