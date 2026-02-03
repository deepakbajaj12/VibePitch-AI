
import React, { useState } from 'react';
import PitchForm from './components/PitchForm';
import AudioPlayer from './components/AudioPlayer';
import { PitchData, GeneratedResult } from './types';
import { generatePitchScript, generateSpeech } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: PitchData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Generate the script
      const script = await generatePitchScript(data.idea, data.style);
      
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
      <div className="text-center mb-12 space-y-4 max-w-2xl">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
          VibePitch <span className="gradient-text">AI</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Turn a single sentence into a high-vibe spoken script and audio clip in seconds.
        </p>
      </div>

      {/* Main Form */}
      <div className="w-full flex flex-col items-center space-y-12">
        <PitchForm onSubmit={handleGenerate} isLoading={loading} />

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 max-w-xl text-center">
            {error}
          </div>
        )}

        {result && (
          <AudioPlayer script={result.script} audioBlob={result.audioBlob} />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-gray-600 text-sm">
        Powered by Google Gemini AI
      </footer>
    </div>
  );
};

export default App;
