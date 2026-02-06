
import React, { useState } from 'react';
import PitchForm from './components/PitchForm';
import AudioPlayer from './components/AudioPlayer';
import { PitchData, GeneratedResult } from './types';
import { generatePitchScript, generateSpeech } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMxMode, setIsMxMode] = useState(false);

  const handleGenerate = async (data: PitchData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Generate the script
      const script = await generatePitchScript(data.idea, data.style, data.intensity);
      
      // Step 2: Generate the audio
      const audioBlob = await generateSpeech(script, data.style);
      
      setResult({ script, audioBlob });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12 space-y-4 max-w-2xl relative w-full">
        {/* Logitech MX Mode Toggle */}
        <div className="absolute top-0 right-0 flex items-center space-x-2">
           <span className={`text-xs font-bold ${!isMxMode ? 'text-indigo-400' : 'text-gray-600'}`}>WEB</span>
           <button 
             onClick={() => setIsMxMode(!isMxMode)}
             className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isMxMode ? 'bg-gray-200' : 'bg-gray-800 border border-gray-700'}`}
           >
             <div className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isMxMode ? 'translate-x-6 bg-gray-900' : 'translate-x-0 bg-indigo-500'}`} />
           </button>
           <span className={`text-xs font-bold ${isMxMode ? 'text-gray-900 bg-gray-200 px-2 py-1 rounded badge' : 'text-gray-600'}`}>
             {isMxMode ? 'LOGI MX MODE' : 'LOGITECH'}
           </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
          VibePitch <span className="gradient-text">AI</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Turn a single sentence into a high-vibe spoken script and audio clip in seconds.
        </p>
      </div>

      {/* Main Form */}
      <div className="w-full flex flex-col items-center space-y-12">
        <PitchForm onSubmit={handleGenerate} isLoading={loading} isMxMode={isMxMode} />

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 max-w-xl text-center">
            {error}
          </div>
        )}

        {result && (
          <AudioPlayer script={result.script} audioBlob={result.audioBlob} />
        )}
      </div>

      {/* Logitech Marketplace Plugin Preview */}
      <div className="w-full max-w-4xl mt-16 border-t border-gray-800 pt-10 text-center">
        <h4 className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-4">Logitech Ecosystem Integration</h4>
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 opacity-75 hover:opacity-100 transition-all duration-500">
            <div className="text-left space-y-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">Logi Options+ Marketplace</h3>
                    <span className="bg-purple-900 text-purple-200 text-xs px-2 py-0.5 rounded-full border border-purple-700">Concept</span>
                </div>
                <p className="text-gray-400 text-sm max-w-md">
                   Coming soon: "Create your own Vibe Actions". Install VibePitch directly to your MX Master 3S or Keys S.
                </p>
            </div>
             <button disabled className="px-6 py-2 bg-gray-800 text-gray-500 rounded-lg font-medium border border-gray-700 cursor-not-allowed whitespace-nowrap">
                Install to Options+
             </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-600 text-sm">
        Powered by Google Gemini AI
      </footer>
    </div>
  );
};

export default App;
