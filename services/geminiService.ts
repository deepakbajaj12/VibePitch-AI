
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
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
    console.error("Gemini Script Error:", errorData);
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

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
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
      console.error("Gemini Audio Error:", errorData);
      throw new Error(errorData.error?.message || "Audio generation failed.");
    }

    const data = await response.json();
    const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) throw new Error("No audio returned from Gemini.");

    const rawPcm = decode(base64Audio);
    const wavHeader = createWavHeader(rawPcm.length, 24000);
    
    const finalWav = new Uint8Array(wavHeader.length + rawPcm.length);
    finalWav.set(wavHeader, 0);
    finalWav.set(rawPcm, wavHeader.length);

    return new Blob([finalWav], { type: 'audio/wav' });

  } catch (error) {
    console.error("Audio generation failed:", error);
    throw error;
  }
}
