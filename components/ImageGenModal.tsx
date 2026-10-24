import React, { useState, useRef } from 'react';
import { generateProImage, analyzeImageWithPro, transcribeAudioWithFlash, getSearchGroundedInfo } from '../services/aiService';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import type { UserSettings } from '../types';

interface ImageGenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerated: (url: string) => void;
    settings: UserSettings;
}

type Tab = 'generate' | 'analyze' | 'transcribe' | 'search';

export const ImageGenModal: React.FC<ImageGenModalProps> = ({ isOpen, onClose, onGenerated, settings }) => {
    const [activeTab, setActiveTab] = useState<Tab>('generate');
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [imageSize, setImageSize] = useState('1K');
    const [isLoading, setIsLoading] = useState(false);
    const [resultText, setResultText] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [sources, setSources] = useState<any[]>([]);

    // Para Análise
    const [analysisImage, setAnalysisImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Para Transcrição
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const handleGenerate = async () => {
        setIsLoading(true);
        setResultImage(null);
        try {
            const url = await generateProImage(prompt, settings, aspectRatio, imageSize);
            setResultImage(url);
        } catch (e) {
            alert("Erro ao gerar imagem.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!analysisImage) return;
        setIsLoading(true);
        setResultText(null);
        try {
            const [header, base64] = analysisImage.split(',');
            const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
            const res = await analyzeImageWithPro(base64, mime, settings, prompt);
            setResultText(res);
        } catch (e) {
            alert("Erro na análise.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setResultText(null);
        setSources([]);
        try {
            const res = await getSearchGroundedInfo(prompt, settings);
            setResultText(res.text);
            setSources(res.sources);
        } catch (e) {
            alert("Erro na busca.");
        } finally {
            setIsLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];
            recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
            recorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64 = (reader.result as string).split(',')[1];
                    setIsLoading(true);
                    try {
                        const res = await transcribeAudioWithFlash(base64, 'audio/webm', settings);
                        setResultText(res);
                    } catch (e) {
                        alert("Erro na transcrição.");
                    } finally {
                        setIsLoading(false);
                    }
                };
                reader.readAsDataURL(blob);
            };
            recorder.start();
            setIsRecording(true);
        } catch (e) {
            alert("Erro ao acessar microfone.");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
                {/* Header do Estúdio */}
                <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-background-light dark:bg-background-dark">
                    <div className="flex gap-2">
                        <button onClick={() => setActiveTab('generate')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'generate' ? 'bg-primary text-text-light-primary' : 'hover:bg-gray-100'}`}>GERAR</button>
                        <button onClick={() => setActiveTab('analyze')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'analyze' ? 'bg-primary text-text-light-primary' : 'hover:bg-gray-100'}`}>ANALISAR (PRO)</button>
                        <button onClick={() => setActiveTab('transcribe')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'transcribe' ? 'bg-primary text-text-light-primary' : 'hover:bg-gray-100'}`}>VOZ</button>
                        <button onClick={() => setActiveTab('search')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'search' ? 'bg-primary text-text-light-primary' : 'hover:bg-gray-100'}`}>BUSCA</button>
                    </div>
                    <button onClick={onClose} className="size-10 flex items-center justify-center rounded-full hover:bg-red-500/10 hover:text-red-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    {activeTab === 'generate' && (
                        <div className="space-y-4">
                            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full p-4 rounded-xl bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark" placeholder="Descreva a imagem que deseja gerar..." rows={3} />
                            <div className="grid grid-cols-2 gap-4">
                                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"><option value="1:1">Quadrado</option><option value="16:9">Horizontal</option><option value="9:16">Vertical</option></select>
                                <select value={imageSize} onChange={e => setImageSize(e.target.value)} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"><option value="1K">HD</option><option value="2K">2K</option><option value="4K">4K (Ultra)</option></select>
                            </div>
                            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full py-4 bg-primary text-text-light-primary font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                {isLoading ? <div className="size-5 border-2 border-text-light-primary border-t-transparent rounded-full animate-spin"></div> : <span className="material-symbols-outlined">auto_awesome</span>}
                                {isLoading ? 'Renderizando...' : 'Gerar Imagem'}
                            </button>
                            {resultImage && (
                                <div className="mt-4 rounded-xl overflow-hidden border border-primary/30 relative group">
                                    <img src={resultImage} alt="Resultado" className="w-full h-auto" />
                                    <button onClick={() => onGenerated(resultImage)} className="absolute bottom-4 right-4 bg-primary text-text-light-primary px-4 py-2 rounded-lg font-bold shadow-xl">Usar como Capa</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'analyze' && (
                        <div className="space-y-4">
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border-light rounded-2xl bg-background-light/50 cursor-pointer hover:border-primary transition-all" onClick={() => fileInputRef.current?.click()}>
                                <input type="file" ref={fileInputRef} onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const r = new FileReader();
                                        r.onload = ev => setAnalysisImage(ev.target?.result as string);
                                        r.readAsDataURL(file);
                                    }
                                }} className="hidden" accept="image/*" />
                                {analysisImage ? <img src={analysisImage} className="max-h-48 rounded-lg shadow-md" /> : <div className="text-center"><span className="material-symbols-outlined text-4xl text-gray-400">add_a_photo</span><p className="text-sm font-bold text-gray-500 mt-2">Clique para analisar foto do produto</p></div>}
                            </div>
                            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full p-4 rounded-xl bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark" placeholder="O que deseja saber sobre este produto? (Opcional)" rows={2} />
                            <button onClick={handleAnalyze} disabled={isLoading || !analysisImage} className="w-full py-4 bg-primary text-text-light-primary font-black rounded-xl flex items-center justify-center gap-2">
                                {isLoading ? 'Analisando...' : 'Realizar Auditoria Pro'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'transcribe' && (
                        <div className="flex flex-col items-center py-10 space-y-6">
                            <button onClick={isRecording ? stopRecording : startRecording} className={`size-24 rounded-full flex items-center justify-center shadow-xl transition-all ${isRecording ? 'bg-red-500 scale-110 animate-pulse' : 'bg-primary'}`}>
                                <span className="material-symbols-outlined text-4xl text-white">{isRecording ? 'stop' : 'mic'}</span>
                            </button>
                            <div className="text-center">
                                <h3 className="font-bold text-lg">{isRecording ? 'Gravando...' : 'Fale sobre seu produto'}</h3>
                                <p className="text-xs text-gray-500">Nossa IA transcreverá sua fala para ideias estratégicas.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div className="space-y-4">
                            <div className="relative">
                                <input value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full p-4 pl-12 rounded-xl bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark" placeholder="Pesquisar tendências no Google Search..." />
                                <span className="material-symbols-outlined absolute left-4 top-4 text-primary">search</span>
                            </div>
                            <button onClick={handleSearch} disabled={isLoading || !prompt} className="w-full py-4 bg-primary text-text-light-primary font-black rounded-xl">Pesquisar com Grounding</button>
                        </div>
                    )}

                    {resultText && (
                        <div className="mt-6 p-6 bg-background-light dark:bg-background-dark rounded-2xl border border-border-light shadow-sm animate-fade-in-up">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Resultado da IA</span>
                                <button onClick={() => { navigator.clipboard.writeText(resultText); alert('Copiado!'); }} className="text-xs font-bold hover:text-primary flex items-center gap-1"><span className="material-symbols-outlined text-sm">content_copy</span> Copiar</button>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{resultText}</ReactMarkdown>
                            </div>
                            {sources.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-dashed border-border-light">
                                    <p className="text-[10px] font-bold text-gray-400 mb-2">FONTES ENCONTRADAS:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {sources.map((s, i) => (
                                            <a key={i} href={s.web?.uri} target="_blank" className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md hover:underline truncate max-w-[200px]">{s.web?.title}</a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};