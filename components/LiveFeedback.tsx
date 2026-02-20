import React, { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface LiveFeedbackProps {
  onStop: () => void;
  isRecording: boolean;
  onFillerWord: (word: string) => void;
  fillerCount: number;
}

const LiveFeedback: React.FC<LiveFeedbackProps> = ({ 
  onStop, 
  isRecording, 
  onFillerWord, 
  fillerCount 
}) => {
  const [transcript, setTranscript] = useState('');
  const [volume, setVolume] = useState(0);
  const recognition = useRef<any>(null);

  useEffect(() => {
    // Basic Web Speech Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';

    recognition.current.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      // Very basic filler word detection on the final transcript
      const words = finalTranscript.toLowerCase().split(' ');
      words.forEach(word => {
        if (['um', 'uh', 'like', 'literally', 'so'].includes(word.trim())) {
           onFillerWord(word.trim());
        }
      });
      setTranscript(finalTranscript);
    };

    if (isRecording) {
      recognition.current.start();
    } else {
      if (recognition.current) recognition.current.stop();
    }

    return () => {
      if (recognition.current) recognition.current.stop();
    };
  }, [isRecording]);

  useEffect(() => {
    // Simulate Volume Meter since Web Speech doesn't give volume
    const interval = setInterval(() => {
        setVolume(Math.random() * 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-pulse-border">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 to-purple-900/10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
            Live Performance Feedback
        </h3>
        <button onClick={onStop} className="text-gray-400 hover:text-white transition-colors rotate-90 transform">
             ✖
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
         {/* Filler Word Counter */}
         <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex flex-col items-center justify-center">
             <span className="text-xs font-mono uppercase text-gray-500 mb-1">Filler Words Detected</span>
             <span className={`text-5xl font-mono font-bold ${fillerCount > 5 ? 'text-red-500' : 'text-green-500'}`}>
                 {fillerCount}
             </span>
             <span className="text-xs text-gray-600 mt-2">Target: &lt; 3</span>
         </div>
         
         {/* Confidence Meter (Simulated) */}
         <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex flex-col justify-end">
             <div className="w-full bg-gray-700 h-24 rounded-lg relative overflow-hidden flex items-end gap-1 px-1 pb-1">
                 {[...Array(8)].map((_, i) => (
                     <div 
                         key={i} 
                         className={`w-full rounded-t transition-all duration-100 ease-linear ${i > 4 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                         style={{ height: `${volume * (0.5 + Math.random() * 0.5) * (i/8 + 0.5)}%` }} // Fake wave effect
                     ></div>
                 ))}
             </div>
             <span className="text-xs font-mono uppercase text-gray-500 mt-2 text-center w-full">Vocal Confidence</span>
         </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center font-mono">
         Use Logitech Actions Ring to scroll teleprompter
      </div>
    </div>
  );
};

export default LiveFeedback;
