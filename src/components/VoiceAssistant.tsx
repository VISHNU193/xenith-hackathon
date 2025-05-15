
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume, Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { diseaseAnalysisService } from "@/services/diseaseAnalysisService";
import { doctorService } from "@/services/doctorService";

// Kannada responses
const RESPONSES = {
  WAKE_GREETING: "ನಿಮಗೆ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?", // How can I help you?
  DOCTOR_AVAILABLE: "ಡಾಕ್ಟರ್ ರಮೇಶ್ ಲಭ್ಯವಿದ್ದಾರೆ, ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಲು ಬಯಸುವಿರಾ?", // Dr. Ramesh is available, would you like to book an appointment?
  APPOINTMENT_BOOKED: "ನಿಮ್ಮ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಆಗಿದೆ", // Your appointment has been booked
  NAVIGATING: "ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ", // Taking you to the login page
  ANALYZING: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ", // Analyzing your symptoms
  NOT_UNDERSTOOD: "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಹೇಳಿ", // Sorry, I didn't understand. Please try again.
};

interface VoiceAssistantProps {
  isEnabled?: boolean;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isEnabled = true }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Speech API if available
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      toast({
        title: "Voice Assistant Not Available",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive",
      });
      return;
    }

    // Create recognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'kn-IN'; // Set to Kannada

    // Handle recognition results
    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
      
      // Check for wake word "Hey Ayu" (case insensitive)
      const lowerTranscript = (finalTranscript || interimTranscript).toLowerCase();
      if (lowerTranscript.includes('hey ayu') || lowerTranscript.includes('হে আয়ু') || lowerTranscript.includes('ಹೇ ಆಯು')) {
        handleWakeWord();
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'no-speech') {
        // Restart recognition if no speech is detected
        if (isListening && recognitionRef.current) {
          recognitionRef.current.stop();
          setTimeout(() => {
            if (isListening && recognitionRef.current) recognitionRef.current.start();
          }, 100);
        }
      } else {
        toast({
          title: "Voice Assistant Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive",
        });
        setIsListening(false);
      }
    };

    // Initialize AudioContext for TTS
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  // Effect to start/stop listening
  useEffect(() => {
    if (isEnabled && isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }, [isEnabled, isListening]);

  const handleWakeWord = () => {
    // Stop listening temporarily to process command
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsProcessing(true);

    // Respond to wake word
    speakResponse(RESPONSES.WAKE_GREETING);
    setAssistantResponse(RESPONSES.WAKE_GREETING);

    // Set timeout to start listening for command
    setTimeout(() => {
      setTranscript('');
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
        }
        
        // Set up one-time listener for the command
        recognitionRef.current.onend = () => {
          // Process the command once recognition stops
          handleCommand(transcript);
          
          // Reset the onend handler
          recognitionRef.current.onend = null;
          
          // Restart continuous listening after processing
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Error restarting recognition after command:', error);
              }
            }
            setIsProcessing(false);
          }, 1000);
        };
        
        // Stop after a few seconds to process the command
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 5000);
      }
    }, 2000);
  };

  const handleCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Check for doctor availability command
    if (lowerCommand.includes('ಡಾಕ್ಟರ್ ರಮೇಶ್') || lowerCommand.includes('doctor') || lowerCommand.includes('ramesh')) {
      checkDoctorAvailability();
    } 
    // Check for appointment booking command
    else if (lowerCommand.includes('ಅಪಾಯಿಂಟ್ಮೆಂಟ್') || lowerCommand.includes('appointment') || lowerCommand.includes('book')) {
      bookAppointment();
    }
    // Check for navigation command
    else if (lowerCommand.includes('ಲಾಗಿನ್') || lowerCommand.includes('login')) {
      navigateToLogin();
    }
    // Check for disease analysis command
    else if (lowerCommand.includes('ತಲೆನೋವು') || lowerCommand.includes('headache') || 
             lowerCommand.includes('ರೋಗ') || lowerCommand.includes('disease')) {
      analyzeDisease(command);
    }
    // Not understood
    else {
      speakResponse(RESPONSES.NOT_UNDERSTOOD);
      setAssistantResponse(RESPONSES.NOT_UNDERSTOOD);
    }
  };

  const checkDoctorAvailability = async () => {
    try {
      const doctors = await doctorService.getAvailableDoctors();
      const drRamesh = doctors.find(doc => doc.name.includes('Ramesh'));
      
      if (drRamesh && drRamesh.available) {
        speakResponse(RESPONSES.DOCTOR_AVAILABLE);
        setAssistantResponse(RESPONSES.DOCTOR_AVAILABLE);
      } else {
        const notAvailable = "ಡಾಕ್ಟರ್ ರಮೇಶ್ ಪ್ರಸ್ತುತ ಲಭ್ಯವಿಲ್ಲ";
        speakResponse(notAvailable);
        setAssistantResponse(notAvailable);
      }
    } catch (error) {
      console.error('Error checking doctor availability:', error);
      toast({
        title: "Error",
        description: "Failed to check doctor availability",
        variant: "destructive",
      });
    }
  };

  const bookAppointment = async () => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dateStr = tomorrow.toISOString().split('T')[0];
      const timeStr = '10:00';
      
      await doctorService.bookAppointment('doc_1', dateStr, timeStr);
      
      speakResponse(RESPONSES.APPOINTMENT_BOOKED);
      setAssistantResponse(RESPONSES.APPOINTMENT_BOOKED);
      
      toast({
        title: "Appointment Booked",
        description: `Your appointment has been scheduled for tomorrow at 10:00 AM`,
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
    }
  };

  const navigateToLogin = () => {
    speakResponse(RESPONSES.NAVIGATING);
    setAssistantResponse(RESPONSES.NAVIGATING);
    
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const analyzeDisease = async (symptoms: string) => {
    try {
      speakResponse(RESPONSES.ANALYZING);
      setAssistantResponse(RESPONSES.ANALYZING);
      
      const result = await diseaseAnalysisService.analyzeSymptoms(symptoms);
      
      const response = `ಸಂಭವನೀಯ ರೋಗ: ${result.diseaseName}, ಪರಿಹಾರ: ${result.recommendation}`;
      speakResponse(response);
      setAssistantResponse(response);
      
      toast({
        title: "Disease Analysis",
        description: `Possible condition: ${result.diseaseName}`,
      });
    } catch (error) {
      console.error('Error analyzing disease:', error);
      toast({
        title: "Error",
        description: "Failed to analyze symptoms",
        variant: "destructive",
      });
    }
  };

  const speakResponse = (text: string) => {
    // For now, we'll use the browser's speech synthesis
    // In a real implementation, we would connect to the Kannada TTS model
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'kn-IN'; // Set to Kannada
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    setIsListening(prev => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {(isListening || isProcessing) && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-4 max-w-xs w-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Ayu Assistant</h3>
            {isProcessing && <div className="animate-pulse text-primary">Processing...</div>}
          </div>
          
          {transcript && (
            <div className="bg-gray-50 p-2 rounded-md mb-2 text-sm">
              <p className="font-medium">You said:</p>
              <p>{transcript}</p>
            </div>
          )}
          
          {assistantResponse && (
            <div className="bg-primary bg-opacity-10 p-2 rounded-md text-sm">
              <p className="font-medium">Ayu:</p>
              <p>{assistantResponse}</p>
            </div>
          )}
        </div>
      )}
      
      <Button 
        onClick={toggleListening} 
        size="icon"
        className={`rounded-full h-14 w-14 shadow-lg ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary'}`}
      >
        {isListening ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default VoiceAssistant;
