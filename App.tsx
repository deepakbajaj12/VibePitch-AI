
import React, { useState } from 'react';
import PitchForm from './components/PitchForm';
import AudioPlayer from './components/AudioPlayer';
import MxHardwareSim from './components/MxHardwareSim';
import { PitchData, GeneratedResult, PitchStyle } from './types';
import { generatePitchScript, generateSpeech } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMxMode, setIsMxMode] = useState(false);

  // Lifted state for Hardware Integration
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState<PitchStyle>(PitchStyle.STARTUP);
  const [intensity, setIntensity] = useState(50);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Generate the script
      const script = await generatePitchScript(idea, style, intensity);
      
      // Step 2: Generate the audio
      const audioBlob = await generateSpeech(script, style);
      
      setResult({ script, audioBlob });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${isMxMode ? 'bg-[#0a0a0a]' : 'bg-black'}`}>
      {/* Header */}
      <div className="text-center mb-12 space-y-4 max-w-2xl relative w-full">
        {/* Logitech MX Mode Toggle */}
        <div className="absolute top-0 right-0 flex items-center space-x-2 z-20">
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
          {isMxMode ? 'VibePitch Pro' : 'VibePitch'} <span className="gradient-text">AI</span>
        </h1>
        <p className="text-gray-400 text-lg">
          {isMxMode 
            ? 'The AI Command Center for your Logitech Creative Console.' 
            : 'Turn a single sentence into a high-vibe spoken script and audio clip in seconds.'}
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Form / Input */}
        <div className="flex flex-col items-center space-y-8 w-full">
          <PitchForm 
            idea={idea} 
            setIdea={setIdea} 
            style={style} 
            setStyle={setStyle} 
            intensity={intensity} 
            setIntensity={setIntensity}
            onSubmit={handleGenerate} 
            isLoading={loading} 
            isMxMode={isMxMode} 
          />

          {error && (
            <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 max-w-xl text-center w-full">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Hardware Sim or Result */}
        <div className="flex flex-col items-center space-y-8 w-full">
            {isMxMode ? (
                <div className="space-y-8 w-full animate-fadeIn">
                    <MxHardwareSim 
                        intensity={intensity}
                        setIntensity={setIntensity}
                        style={style}
                        setStyle={setStyle}
                        onGenerate={() => handleGenerate()}
                    />
                    
                    {result && (
                         <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-700">
                             <h3 className="text-white font-bold mb-4">Latest Result</h3>
                             <AudioPlayer script={result.script} audioBlob={result.audioBlob} />
                         </div>
                    )}
                </div>
            ) : (
                <div className="w-full">
                     {result ? (
                        <AudioPlayer script={result.script} audioBlob={result.audioBlob} />
                    ) : (
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl text-gray-600">
                            Result will appear here...
                        </div>
                    )}
                </div>
            )}
        </div>

      </div>

      {/* Logitech Marketplace Plugin Preview */}
      <div className="w-full max-w-4xl mt-16 border-t border-gray-800 pt-10 text-center">
        <h4 className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-4">Logitech Ecosystem Integration</h4>
        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 opacity-75 hover:opacity-100 transition-all duration-500 hover:border-indigo-500/30 group">
            <div className="text-left space-y-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">Logi Options+ Marketplace</h3>
                    <span className="bg-purple-900 text-purple-200 text-xs px-2 py-0.5 rounded-full border border-purple-700">Concept</span>
                </div>
                <p className="text-gray-400 text-sm max-w-md">
                   Install VibePitch Pro directly to your MX Creative Console. Control AI parameters with physical dials and buttons.
                </p>
            </div>
             <button disabled className="px-6 py-2 bg-gray-800 text-gray-400 rounded-lg font-medium border border-gray-700 cursor-not-allowed whitespace-nowrap flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                Coming Soon
             </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-600 text-sm">
        Powered by Google Gemini AI • Designed for Logitech MX
      </footer>
    </div>
  );
};

export default App;
