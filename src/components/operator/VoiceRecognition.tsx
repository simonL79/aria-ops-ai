
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface VoiceRecognitionProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export const VoiceRecognition = ({ onTranscript, disabled }: VoiceRecognitionProps) => {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setupVoiceRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const setupVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast.success('🎤 Voice command active - speak now');
      };

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        toast.success(`Voice captured: "${transcript}"`);
        
        // Auto-process voice commands
        await processVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        toast.error(`Voice recognition error: ${event.error}`);
      };
    }
  };

  const processVoiceCommand = async (command: string) => {
    if (!command.trim()) return;

    try {
      const { data, error } = await supabase.functions.invoke('process-voice-command', {
        body: {
          command: command,
          userId: user?.id
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to process voice command');
      }

      if (data?.success) {
        toast.success('Command processed successfully');
        onTranscript(command);
      } else {
        throw new Error(data?.error || 'Command processing failed');
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast.error('Command processing failed');
    }
  };

  const startVoiceCommand = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopVoiceCommand = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return {
    isListening,
    startVoiceCommand,
    stopVoiceCommand,
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  };
};
