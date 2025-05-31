import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { enhancedVoiceLogService } from '@/services/aria/enhancedVoiceLogService';
import { AnubisSecurityService } from '@/services/aria/anubisSecurityService';

interface VoiceCommandHook {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  isSpeaking: boolean;
}

interface VoiceLogEntry {
  transcript: string;
  response?: string;
  source: string;
}

export const useVoiceCommand = (): VoiceCommandHook => {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionConstructor) {
      recognitionRef.current = new SpeechRecognitionConstructor();
      synthRef.current = window.speechSynthesis;

      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          console.log('🎤 Voice recognition started');
        };

        recognitionRef.current.onresult = (event) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
          
          if (event.results[current].isFinal) {
            // Enhanced logging with security analysis
            enhancedVoiceLogService.logVoiceInteraction({ 
              user_id: user?.id || 'anonymous',
              transcript: transcriptText, 
              source: 'mic' 
            });

            // Check for hotword detection
            if (user?.id) {
              const hotwordDetected = AnubisSecurityService.detectHotword(transcriptText, user.id);
              if (hotwordDetected) {
                console.log('🔥 Hotword detected:', transcriptText);
                toast.success('Anubis activated!');
              }
            }
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          console.log('🎤 Voice recognition ended');
        };

        recognitionRef.current.onerror = (event) => {
          setIsListening(false);
          console.error('🎤 Speech recognition error:', event.error);
          toast.error(`Voice recognition error: ${event.error}`);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported, user]);

  const logVoiceInteraction = async (entry: VoiceLogEntry) => {
    if (!user) return;

    try {
      // Use enhanced voice logging service
      await enhancedVoiceLogService.logVoiceInteraction({
        user_id: user.id,
        transcript: entry.transcript,
        response: entry.response,
        source: entry.source
      });
    } catch (error) {
      console.error('Failed to log voice interaction:', error);
    }
  };

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) return;

    setTranscript('');
    try {
      recognitionRef.current.start();
      toast.success('🎤 Listening for voice command...');
      
      // Log test result for voice recognition start
      if (user?.id) {
        AnubisSecurityService.logTestResult({
          module: 'VoiceRecognition',
          test_name: 'start_listening',
          passed: true,
          execution_time_ms: 0
        });
      }
    } catch (error) {
      console.error('Failed to start recognition:', error);
      toast.error('Failed to start voice recognition');
      
      // Log test failure
      if (user?.id) {
        AnubisSecurityService.logTestResult({
          module: 'VoiceRecognition',
          test_name: 'start_listening',
          passed: false,
          execution_time_ms: 0,
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current || !text.trim()) return;

    // Security check for TTS content using the corrected service
    if (user?.id) {
      // Simple security check - block obvious malicious content
      if (text.includes('<script>') || text.includes('javascript:')) {
        console.warn('🚨 Potential attack detected in TTS content, blocking');
        toast.error('Content blocked for security reasons');
        return;
      }
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log('🔊 A.R.I.A™ speaking...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      console.log('🔊 A.R.I.A™ finished speaking');
      
      // Log the voice response
      logVoiceInteraction({ 
        transcript: text, 
        response: text, 
        source: 'tts' 
      });
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      console.error('Speech synthesis error:', event.error);
    };

    // Try to use a more robotic/AI voice if available
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    synthRef.current.speak(utterance);
  };

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    speak,
    isSpeaking
  };
};
