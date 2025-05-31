
import { useState } from 'react';
import { anubisSecurityService } from '@/services/aria/anubisSecurityService';
import { toast } from 'sonner';

export const useVoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Check if speech recognition is supported
  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const startListening = () => {
    if (!isSupported) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }
    
    setIsListening(true);
    // Mock voice recognition
    setTimeout(() => {
      setTranscript('System status check');
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const processCommand = async (command: string) => {
    try {
      const result = { command, processed: true, timestamp: new Date().toISOString() };
      await anubisSecurityService.logTestResult(result);
      toast.success('Voice command processed');
      return result;
    } catch (error) {
      console.error('Error processing voice command:', error);
      const result = { command, processed: false, error: error instanceof Error ? error.message : 'Unknown error' };
      await anubisSecurityService.logTestResult(result);
      toast.error('Failed to process voice command');
      return result;
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    processCommand,
    isSupported,
    isSpeaking
  };
};
