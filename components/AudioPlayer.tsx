
import React, { useRef, useEffect } from 'react';

interface AudioPlayerProps {
  script: string;
  audioBlob?: Blob;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ script, audioBlob }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFallback = audioBlob && audioBlob.size === 0;

  useEffect(() => {
    if (audioBlob && !isFallback && audioRef.current) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current.src = url;
      audioRef.current.play().catch(e => console.error("Auto-play blocked:", e));
      
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob, isFallback]);

  const handleSpeakFallback = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google US') || v.lang === 'en-US');
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-2xl bg-gray-900 border border-indigo-500/30 rounded-2xl p-8 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <h3 className="text-xl font-bold gradient-text">Your Generated Pitch</h3>
        <p className="text-gray-300 leading-relaxed text-lg italic">
          "{script}"
        </p>
      </div>

      <div className="pt-6 border-t border-gray-800">
        {isFallback ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-yellow-500 mb-2">
              Note: Using browser TTS because Gemini Audio is unavailable.
            </p>
            <button 
              onClick={handleSpeakFallback}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Replay Voice
            </button>
          </div>
        ) : (
          <audio ref={audioRef} controls className="w-full h-12" />
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
