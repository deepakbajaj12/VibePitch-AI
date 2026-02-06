
import React, { useRef, useEffect, useState } from 'react';
import * as Tooltip from "@radix-ui/react-tooltip";

interface AudioPlayerProps {
  script: string;
  audioBlob?: Blob;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ script, audioBlob }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFallback = audioBlob && audioBlob.size === 0;
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAudio = () => {
    if (!audioBlob || isFallback) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibepitch-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl bg-gray-900 border border-indigo-500/30 rounded-2xl p-8 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold gradient-text">Your Generated Pitch</h3>
            <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-gray-300 transition-colors"
                >
                  {copied ? (
                     <span className="text-green-400">Copied!</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
            </div>
        </div>
        <p className="text-gray-300 leading-relaxed text-lg italic">
          "{script}"
        </p>
      </div>

      <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-auto flex-grow">
        {isFallback ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <Tooltip.Provider>
              <Tooltip.Root>
                <div className="flex justify-center items-center gap-2 text-sm text-gray-400 mb-2">
                  🔊 Voice playback powered by your device
                  <Tooltip.Trigger asChild>
                    <button className="text-gray-500 hover:text-white cursor-help">
                      ℹ️
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-black text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50 border border-gray-700"
                      sideOffset={6}
                    >
                      Using built-in device voice (fallback mode)
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </div>
              </Tooltip.Root>
            </Tooltip.Provider>

            <button 
              onClick={handleSpeakFallback}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors w-full justify-center"
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
        
        {!isFallback && audioBlob && (
            <button 
              onClick={downloadAudio}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
                title="Download .mp3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export MP3
            </button>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
