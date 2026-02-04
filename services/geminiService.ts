
import { PitchStyle } from '../types';

// Access API Key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Helper to decode base64 to Uint8Array
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to create a WAV file from raw PCM data (Gemini returns 24kHz Mono PCM)
function createWavHeader(dataLength: number, sampleRate: number): Uint8Array {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  /* RIFF identifier */
  view.setUint32(0, 0x52494646, false); // "RIFF"
  /* file length */
  view.setUint32(4, 36 + dataLength, true);
  /* RIFF type */
  view.setUint32(8, 0x57415645, false); // "WAVE"
  /* format chunk identifier */
  view.setUint32(12, 0x666d7420, false); // "fmt "
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true); // PCM - 1
  /* channel count */
  view.setUint16(22, 1, true); // Mono - 1
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 2, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  view.setUint32(36, 0x64617461, false); // "data"
  /* data chunk length */
  view.setUint32(40, dataLength, true);

  return new Uint8Array(buffer);
}

// Helper to find a valid text generation model dynamically
async function getBestTextModel(): Promise<string> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    if (!data.models) return 'gemini-1.5-flash';

    const textModels = data.models
      .filter((m: any) => m.supportedGenerationMethods.includes('generateContent') && !m.name.includes('vision'))
      .map((m: any) => m.name.replace('models/', ''));

    // Preference list
    const preferred = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-1.0-pro'];
    
    for (const pref of preferred) {
      if (textModels.includes(pref)) return pref;
    }
    
    // Return first available if no preference match
    return textModels[0] || 'gemini-pro';
  } catch (e) {
    console.warn("Model list failed, falling back to gemini-1.5-flash", e);
    return 'gemini-1.5-flash';
  }
}

export async function generatePitchScript(idea: string, style: PitchStyle): Promise<string> {
  const stylePrompts = {
    [PitchStyle.STARTUP]: "Professional, visionary, and energetic. Focus on the 'problem/solution' narrative. Use terms like 'scalability', 'innovation', and 'future'.",
    [PitchStyle.GAME_TRAILER]: "Epic, cinematic, and dramatic. Use intense pauses, heavy adjectives, and a 'coming soon' vibe. Imagine a movie trailer voice.",
    [PitchStyle.SCIENTIFIC]: "Curious, clear, and educational. Explain the mechanism with wonder but precision. Use 'fascinating', 'discovery', and 'observe'.",
    [PitchStyle.CRAZY_HYPE]: "Maximum energy, fast-paced, urban slang, and high enthusiasm. Lots of exclamation marks in feeling. Use 'insane', 'next level', and 'absolute fire'."
  };

  const prompt = `Turn this idea into a 30-40 second natural spoken script (approx 60-80 words): "${idea}". 
  Style: ${style}.
  Instruction: ${stylePrompts[style]}.
  Rules: No bullet points. Use only natural spoken language. Do not include stage directions like [Music Fades In]. Just the text to be spoken.`;

  // Dynamically find a working model
  const modelName = await getBestTextModel();
  console.log("Using Gemini Model:", modelName);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, topP: 0.95 }
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Gemini Script Error (Model: " + modelName + "):", errorData);
    throw new Error(errorData.error?.message || `Script generation failed (${response.status}). Check API Key.`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate script.";
}

export async function generateSpeech(text: string, style: PitchStyle): Promise<Blob> {
  // Map pitch style to best voice
  const voiceMap = {
    [PitchStyle.STARTUP]: 'Kore',
    [PitchStyle.GAME_TRAILER]: 'Fenrir',
    [PitchStyle.SCIENTIFIC]: 'Puck',
    [PitchStyle.CRAZY_HYPE]: 'Charon'
  };

  // Models to try for Audio generation in order of preference
  // gemini-2.0-flash-exp: Best quality, experimental
  // gemini-1.5-flash: Standard, wide availability, supports audio
  // gemini-1.5-flash-latest: Latest alias
  // gemini-1.5-pro: Higher quality but potentially slower/quota limits
  const modelsToTry = ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro'];

  let lastError: any;

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting Audio Generation with model: ${model}`);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voiceMap[style] },
                },
              },
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // If 404 (Not Found) or 400 (Bad Request - likely model doesn't support audio), try next
        if (response.status === 404 || response.status === 400) {
           console.warn(`Model ${model} not available or doesn't support audio. Trying next...`);
           lastError = errorData;
           continue; 
        }
        // For other errors (403 quota, 500 server), throw immediately or maybe continue? 
        // Let's assume strict fail for auth/quota issues, but continue for model issues.
        throw new Error(errorData.error?.message || `Audio generation failed with ${model}`);
      }

      const data = await response.json();
      const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (!base64Audio) {
         throw new Error(`No audio data in response from ${model}`);
      }

      const rawPcm = decode(base64Audio);
      const wavHeader = createWavHeader(rawPcm.length, 24000);
      
      const finalWav = new Uint8Array(wavHeader.length + rawPcm.length);
      finalWav.set(wavHeader, 0);
      finalWav.set(rawPcm, wavHeader.length);

      return new Blob([finalWav], { type: 'audio/wav' });

    } catch (error) {
      console.warn(`Audio generation failed for ${model}:`, error);
      lastError = error;
      // Continue loop to next model
    }
  }

  // If we get here, all models failed.
  console.error("All Gemini audio models failed. Falling back to Browser TTS.");
  return generateSpeechFallback(text);
}

// Fallback to Web Speech API (Browser TTS)
function generateSpeechFallback(text: string): Promise<Blob> {
  return new Promise((resolve) => {
    // We cannot easily create a Blob from window.speechSynthesis.
    // However, to keep the UI working without crashing, we can:
    // 1. Play the audio directly here using the browser API.
    // 2. Return a dummy Blob so the UI doesn't crash (though the AudioPlayer visualizer won't work perfectly).
    
    // Choose approach 1 for user experience: Speak it immediately.
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;

    // Try to select a better voice
    const voices = window.speechSynthesis.getVoices();
    // Prefer Google voices or English voices
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Google") || v.lang === "en-US");
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
    
    // Return an empty blob to satisfy the type signature and prevent UI crashes.
    // The user hears the audio via the browser, and the "AudioPlayer" component will exist but be silent.
    resolve(new Blob([], { type: 'audio/wav' })); 
  });
}
