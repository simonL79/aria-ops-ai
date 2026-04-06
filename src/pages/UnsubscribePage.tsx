import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

type Status = 'loading' | 'valid' | 'already_unsubscribed' | 'invalid' | 'success' | 'error';

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (!res.ok) {
          setStatus('invalid');
        } else if (data.valid === false && data.reason === 'already_unsubscribed') {
          setStatus('already_unsubscribed');
        } else if (data.valid) {
          setStatus('valid');
        } else {
          setStatus('invalid');
        }
      } catch {
        setStatus('invalid');
      }
    };

    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', {
        body: { token },
      });
      if (error) throw error;
      const result = typeof data === 'string' ? JSON.parse(data) : data;
      if (result.success) {
        setStatus('success');
      } else if (result.reason === 'already_unsubscribed') {
        setStatus('already_unsubscribed');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <Card className="bg-gray-900 border-gray-800 p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-400">Validating your request...</p>
          </>
        )}

        {status === 'valid' && (
          <>
            <h1 className="text-2xl font-bold text-white mb-4">Unsubscribe</h1>
            <p className="text-gray-400 mb-6">
              Are you sure you want to unsubscribe from A.R.I.A™ emails?
            </p>
            <Button
              onClick={handleUnsubscribe}
              disabled={processing}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {processing ? 'Processing...' : 'Confirm Unsubscribe'}
            </Button>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Unsubscribed</h1>
            <p className="text-gray-400">You've been successfully unsubscribed.</p>
          </>
        )}

        {status === 'already_unsubscribed' && (
          <>
            <CheckCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Already Unsubscribed</h1>
            <p className="text-gray-400">You've already been unsubscribed from our emails.</p>
          </>
        )}

        {status === 'invalid' && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Invalid Link</h1>
            <p className="text-gray-400">This unsubscribe link is invalid or has expired.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Something Went Wrong</h1>
            <p className="text-gray-400">Please try again later or contact support.</p>
          </>
        )}
      </Card>
    </div>
  );
};

export default UnsubscribePage;
