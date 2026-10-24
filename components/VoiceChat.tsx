import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import type { UserSettings } from '../types';

function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

interface VoiceChatProps {
    settings: UserSettings;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ settings }) => {
    const [isActive, setIsActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const sessionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const startSession = async () => {
        setIsConnecting(true);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            callbacks: {
                onopen: () => {
                    const source = audioContextRef.current!.createMediaStreamSource(stream);
                    const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const l = inputData.length;
                        const int16 = new Int16Array(l);
                        for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
                        const pcmBlob = {
                            data: encode(new Uint8Array(int16.buffer)),
                            mimeType: 'audio/pcm;rate=16000',
                        };
                        sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(audioContextRef.current!.destination);
                    setIsActive(true);
                    setIsConnecting(false);
                },
                onmessage: async (message) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (base64Audio) {
                        const ctx = outputAudioContextRef.current!;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                        const source = ctx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(ctx.destination);
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        sourcesRef.current.add(source);
                        source.onended = () => sourcesRef.current.delete(source);
                    }
                    if (message.serverContent?.interrupted) {
                        sourcesRef.current.forEach(s => s.stop());
                        sourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                    }
                },
                onclose: () => setIsActive(false),
                onerror: () => setIsActive(false)
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                systemInstruction: 'Você é um consultor expert em Mercado Livre. Responda de forma curta e amigável por voz. Não mencione o seu nome técnico ou de desenvolvedora.'
            }
        });
        sessionRef.current = sessionPromise;
    };

    const stopSession = () => {
        if (sessionRef.current) sessionRef.current.then((s: any) => s.close());
        setIsActive(false);
    };

    return (
        <div className="fixed bottom-24 right-6 z-50">
            <button 
                onClick={isActive ? stopSession : startSession}
                disabled={isConnecting}
                className={`size-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${isActive ? 'bg-red-500 scale-110' : 'bg-primary hover:scale-105'}`}
            >
                {isConnecting ? (
                    <div className="size-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <span className="material-symbols-outlined text-3xl text-white">
                        {isActive ? 'mic_off' : 'record_voice_over'}
                    </span>
                )}
            </button>
            {isActive && (
                <div className="absolute bottom-20 right-0 bg-card-dark p-4 rounded-xl border border-primary/30 w-64 text-center animate-fade-in-up">
                    <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 0.1}s` }}></div>)}
                    </div>
                    <p className="text-xs font-bold text-primary">Consultor Virtual Ativo...</p>
                </div>
            )}
        </div>
    );
};