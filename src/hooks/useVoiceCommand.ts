
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
            logVoiceInteraction({ transcript: transcriptText, source: 'mic' });
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
  }, [isSupported]);

  const logVoiceInteraction = async (entry: VoiceLogEntry) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('anubis_voice_log')
        .insert({
          user_id: user.id,
          transcript: entry.transcript,
          response: entry.response,
          source: entry.source,
          processed: !!entry.response,
          response_time: entry.response ? new Date().toISOString() : null
        });

      if (error) {
        console.error('Voice log error:', error);
      }
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
    } catch (error) {
      console.error('Failed to start recognition:', error);
      toast.error('Failed to start voice recognition');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current || !text.trim()) return;

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
