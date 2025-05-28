
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';
import { Badge } from '@/components/ui/badge';

interface VoiceCommandButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const VoiceCommandButton = ({ onTranscript, disabled }: VoiceCommandButtonProps) => {
  const { 
    isListening, 
    isSupported, 
    transcript, 
    startListening, 
    stopListening,
    isSpeaking 
  } = useVoiceCommand();

  // Auto-submit transcript when recognition stops
  if (transcript && !isListening && transcript.trim()) {
    onTranscript(transcript);
  }

  if (!isSupported) {
    return (
      <Button variant="outline" disabled>
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isListening ? "destructive" : "outline"}
        onClick={isListening ? stopListening : startListening}
        disabled={disabled || isSpeaking}
        className={`relative ${isListening ? 'animate-pulse' : ''}`}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Stop</span>
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Voice</span>
          </>
        )}
      </Button>
      
      {isSpeaking && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Volume2 className="h-3 w-3 animate-pulse" />
          A.R.I.A™ Speaking
        </Badge>
      )}
      
      {isListening && (
        <Badge variant="outline" className="animate-pulse">
          🎤 Listening...
        </Badge>
      )}
    </div>
  );
};

export default VoiceCommandButton;
