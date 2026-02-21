
import React, { useState } from 'react';
import PitchForm from './components/PitchForm';
import AudioPlayer from './components/AudioPlayer';
import MxHardwareSim from './components/MxHardwareSim';
import Teleprompter from './components/Teleprompter';
import LiveFeedback from './components/LiveFeedback';
import { PitchData, GeneratedResult, PitchStyle } from './types';
import { generatePitchScript, generateSpeech } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMxMode, setIsMxMode] = useState(true); // Default to MX Mode for Demo Clarity

  // Lifted state for Hardware Integration (Logitech Creative Console)
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState<PitchStyle>(PitchStyle.STARTUP);
  const [intensity, setIntensity] = useState(50);
  
  // Teleprompter State (Logitech Actions Ring)
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(2.0);
  const [isTeleprompterActive, setIsTeleprompterActive] = useState(false);
  const [isPrompterPlaying, setIsPrompterPlaying] = useState(false);

  // Live Feedback State
  const [isRecording, setIsRecording] = useState(false);
  const [fillerCount, setFillerCount] = useState(0);

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
  
  const handleToggleTeleprompter = () => {
    if (!result) {
        alert("Generate a pitch first!");
        return;
    }
    setIsTeleprompterActive(!isTeleprompterActive);
    setIsPrompterPlaying(false);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${isMxMode ? 'bg-[#0a0a0a]' : 'bg-black'}`}>
      
      {isTeleprompterActive && result && (
        <Teleprompter 
            script={result.script} 
            speed={teleprompterSpeed} 
            isPlaying={isPrompterPlaying}
            onTogglePlay={() => {
                setIsPrompterPlaying(!isPrompterPlaying);
                if (!isPrompterPlaying) {
                    setIsRecording(true); // Auto-record on play
                    setFillerCount(0);
                } else {
                    setIsRecording(false);
                }
            }}
            onClose={() => setIsTeleprompterActive(false)}
        />
      )}

      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-700 z-0"
        style={{
            background: `radial-gradient(circle at 80% 20%, rgba(99, 102, 241, ${intensity * 0.003}) 0%, transparent 50%),
                         radial-gradient(circle at 20% 80%, rgba(236, 72, 153, ${intensity * 0.003}) 0%, transparent 50%)`
        }}
      />

      {/* Header */}
      <div className="text-center mb-12 space-y-4 max-w-2xl relative w-full z-10">
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

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          {isMxMode ? 'VibePitch Command Console' : 'VibePitch'} <span className="gradient-text">AI</span>
        </h1>
        <p className="text-gray-400 text-lg">
          {isMxMode 
            ? 'Use your MX Creative Console to control your AI pitch workflow.' 
            : 'Turn a single sentence into a high-vibe spoken script and audio clip in seconds.'}
        </p>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form / Input (Span 5) */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-8 w-full">
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
            <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 w-full text-center">
              {error}
            </div>
          )}
        </div>

        {/* Center Column: Hardware Sim (Span 4) */}
        <div className="lg:col-span-4 flex flex-col items-center space-y-4 w-full order-last lg:order-none">
            {isMxMode && (
                <div className="w-full sticky top-4">
                    <MxHardwareSim 
                        intensity={intensity}
                        setIntensity={setIntensity}
                        style={style}
                        setStyle={setStyle}
                        onGenerate={() => handleGenerate()}
                        teleprompterSpeed={teleprompterSpeed}
                        setTeleprompterSpeed={setTeleprompterSpeed}
                        toggleTeleprompter={handleToggleTeleprompter}
                        isTeleprompterActive={isTeleprompterActive}
                    />
                    
                    {/* Live Feedback Mini-View when Teleprompter is NOT fullscreen but active in background or always on */}
                    <div className="mt-4">
                        <LiveFeedback 
                            isRecording={isRecording} 
                            onStop={() => setIsRecording(false)} 
                            fillerCount={fillerCount}
                            onFillerWord={() => setFillerCount(c => c + 1)}
                        />
                    </div>
                </div>
            )}
        </div>

        {/* Right Column: Results (Span 3) */}
        <div className="lg:col-span-3 w-full">
            {result ? (
                <div className="space-y-4">
                   <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-700 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 mb-4">
                             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                             <h3 className="text-white font-bold gradient-text">Script Ready</h3>
                        </div>
                        <AudioPlayer script={result.script} audioBlob={result.audioBlob} />
                   </div>
                </div>
            ) : (
                loading ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-indigo-500/30 bg-indigo-900/10 rounded-2xl p-6 text-center space-y-4 animate-pulse-border">
                         <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
                         <h3 className="text-xl font-bold text-white">Generating Pitch...</h3>
                         <div className="text-xs font-mono text-indigo-300 space-y-1 text-left w-full pl-8">
                             <div>&gt; Intensity: {intensity}%</div>
                             <div>&gt; Style: {style}</div>
                             <div>&gt; Analyzing Tone...</div>
                         </div>
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl text-gray-600 p-4 text-center group hover:border-gray-700 transition-colors">
                        <span className="text-4xl mb-4 opacity-50 grayscale group-hover:grayscale-0 transition-all">🎛️</span>
                        <div className="font-bold text-gray-500">Waiting for Command</div>
                        <div className="text-xs text-gray-600 mt-2">Adjust Dial & Press GENERATE</div>
                    </div>
                )
            )}
        </div>
        
      </div>

      {/* Logitech Marketplace Plugin Preview & Ecosystem */}
      <div className="w-full max-w-5xl mt-24 border-t border-gray-800 pt-10 text-center pb-20">
        <h4 className="text-indigo-500 uppercase tracking-widest text-xs font-bold mb-8">Logitech Ecosystem Integration</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-75 hover:opacity-100 transition-all duration-500">
            {/* VS Code Integration */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 group transition-all">
                <div className="text-3xl mb-4 grayscale group-hover:grayscale-0">💻</div>
                <h3 className="text-white font-bold mb-2">VS Code Extension</h3>
                <p className="text-gray-400 text-xs mb-4">
                    Highlight code and press <span className="text-indigo-400 font-mono">MX Button 1</span> to generate technical docs or investor explanations instantly.
                </p>
                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">v0.9.2 Installed</span>
            </div>

            {/* Figma Integration */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-pink-500/50 group transition-all">
                <div className="text-3xl mb-4 grayscale group-hover:grayscale-0">🎨</div>
                <h3 className="text-white font-bold mb-2">Figma Plugin</h3>
                <p className="text-gray-400 text-xs mb-4">
                    Select a frame and rotate <span className="text-indigo-400 font-mono">Dial</span> to generate UX copy variants from "Hype" to "Corporate".
                </p>
                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">v1.0.4 Active</span>
            </div>

            {/* Browser / Social Integration */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-blue-400/50 group transition-all">
                <div className="text-3xl mb-4 grayscale group-hover:grayscale-0">🌐</div>
                <h3 className="text-white font-bold mb-2">Chrome / LinkedIn</h3>
                <p className="text-gray-400 text-xs mb-4">
                    Draft a post and use <span className="text-indigo-400 font-mono">Actions Ring</span> to adjust viral tone. Auto-hastag generation on Button 2.
                </p>
                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">v1.2.0 Syncing</span>
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-600 text-sm pb-8">
        Designed for Logitech DevStudio 2026
      </footer>
    </div>
  );
};

export default App;
