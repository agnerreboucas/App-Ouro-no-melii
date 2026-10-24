
import React, { useState, useRef, useEffect } from 'react';
import type { UserSettings, ImageSearchResult, MarketIntelligence } from '../types';
import { findProductByImage, getMarketIntelligence, findProductByText } from '../services/aiService';

interface SearchByImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDataFound: (data: { productName: string; sellPrice: number; category: string; imageUrl?: string }) => void;
    onMarketIntelligence: (mi: MarketIntelligence, imageUrl: string) => void;
    settings: UserSettings;
}

type ModalState = 'idle' | 'camera' | 'preview' | 'loading' | 'success' | 'error' | 'typing';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const SearchByImageModal: React.FC<SearchByImageModalProps> = ({ isOpen, onClose, onDataFound, onMarketIntelligence, settings }) => {
    const [modalState, setModalState] = useState<ModalState>('idle');
    const [imageData, setImageData] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<ImageSearchResult | null>(null);
    const [suggestions, setSuggestions] = useState<ImageSearchResult[]>([]);
    const [typingQuery, setTypingQuery] = useState('');
    const [error, setError] = useState<string>('');
    const [loadingLabel, setLoadingLabel] = useState('Minerando...');
    const [stream, setStream] = useState<MediaStream | null>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (modalState === 'camera' && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
        }
    }, [modalState, stream]);

    const cleanupCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleClose = () => {
        cleanupCamera();
        setModalState('idle');
        setImageData(null);
        setSearchResult(null);
        setSuggestions([]);
        setTypingQuery('');
        setError('');
        onClose();
    };

    const startCamera = async () => {
        setError('');
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setStream(s);
            setModalState('camera');
        } catch (err) {
            setError("Habilite a câmera para escanear.");
            setModalState('error');
        }
    };

    const takePicture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setImageData(canvas.toDataURL('image/jpeg', 0.85));
                setModalState('preview');
                cleanupCamera();
            }
        }
    };

    const executeSearch = async () => {
        if (!imageData) return;
        setModalState('loading');
        setLoadingLabel('Auditando Visualmente...');
        try {
            const [header, base64Data] = imageData.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
            const result = await findProductByImage(base64Data, mimeType, settings);
            if (result && result.productName) {
                setSearchResult(result);
                setModalState('success');
            } else {
                throw new Error("Não identificado");
            }
        } catch (err) {
            setError('IA não conseguiu identificar. Tente outra foto ou digite o nome.');
            setModalState('error');
        }
    };

    const handleTextSearch = async () => {
        if (!typingQuery.trim()) return;
        setModalState('loading');
        setLoadingLabel('Buscando Mercado...');
        try {
            const results = await findProductByText(typingQuery, settings);
            setSuggestions(results || []);
            setModalState('typing');
        } catch (err) {
            setError('Erro na pesquisa por texto.');
            setModalState('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-secondary/80 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={handleClose}>
             <div className="bg-card-light dark:bg-card-dark rounded-[2.5rem] border border-border-light dark:border-border-dark shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-8 relative">
                    <button onClick={handleClose} className="absolute top-6 right-6 size-12 flex items-center justify-center rounded-full hover:bg-gray-100 z-20 text-secondary"><span className="material-symbols-outlined">close</span></button>
                    
                    {(modalState === 'idle' || modalState === 'typing') && (
                        <div className="text-center animate-fade-in-up">
                            <h2 className="text-2xl font-black mb-2 text-primary uppercase tracking-tighter">Garimpo Digital IA</h2>
                            <div className="relative mb-8">
                                <input 
                                    type="text" 
                                    value={typingQuery} 
                                    onChange={e => setTypingQuery(e.target.value)} 
                                    onKeyDown={e => e.key === 'Enter' && handleTextSearch()}
                                    placeholder="Nome do produto..." 
                                    className="w-full h-16 pl-6 pr-16 rounded-2xl border-2 border-border-light bg-background-light font-extrabold text-lg outline-none focus:border-primary transition-all"
                                />
                                <button onClick={handleTextSearch} className="absolute right-3 top-3 size-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg"><span className="material-symbols-outlined">search</span></button>
                            </div>

                            {modalState === 'typing' && suggestions.length > 0 && (
                                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto scrollbar-hide p-1">
                                    {suggestions.map((s, i) => (
                                        <button key={i} onClick={() => { setSearchResult(s); setModalState('success'); }} className="w-full p-4 bg-white border border-border-light rounded-2xl flex gap-4 items-center hover:border-primary transition-all text-left">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black uppercase truncate">{s.productName}</p>
                                                <p className="text-sm font-black text-primary mt-1">{formatCurrency(s.sellPrice || 0)}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-primary">arrow_forward</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={startCamera} className="flex flex-col items-center justify-center gap-3 p-8 bg-background-light rounded-[2rem] border border-border-light hover:border-primary transition-all group">
                                    <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">photo_camera</span>
                                    <span className="font-black uppercase text-[9px]">Câmera</span>
                                </button>
                                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-3 p-8 bg-background-light rounded-[2rem] border border-border-light hover:border-primary transition-all group">
                                    <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">upload_file</span>
                                    <span className="font-black uppercase text-[9px]">Enviar Foto</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {modalState === 'camera' && (
                        <div className="flex flex-col gap-6 items-center">
                            <div className="w-full aspect-square bg-black rounded-3xl overflow-hidden relative border-4 border-primary">
                                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted></video>
                            </div>
                            <button onClick={takePicture} className="size-20 rounded-full bg-primary border-8 border-white shadow-2xl flex items-center justify-center"><span className="material-symbols-outlined text-white text-4xl">photo_camera</span></button>
                        </div>
                    )}

                    {modalState === 'preview' && imageData && (
                        <div className="text-center space-y-6 animate-fade-in-up">
                            <h2 className="text-xl font-black uppercase text-secondary">Confirmar Imagem</h2>
                            <div className="w-full aspect-square rounded-[2rem] overflow-hidden border-2 border-primary shadow-xl">
                                <img src={imageData} className="w-full h-full object-cover" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setModalState('idle')} className="py-4 bg-gray-100 rounded-xl font-black uppercase text-xs">Cancelar</button>
                                <button onClick={executeSearch} className="py-4 bg-primary text-secondary font-black rounded-xl uppercase text-xs shadow-lg">Iniciar Busca IA</button>
                            </div>
                        </div>
                    )}

                    {modalState === 'loading' && (
                        <div className="text-center p-20">
                             <div className="size-20 mx-auto border-t-4 border-primary rounded-full animate-spin"></div>
                             <h2 className="text-2xl font-black mt-6 uppercase tracking-tighter text-primary">{loadingLabel}</h2>
                             <p className="text-xs font-bold text-gray-400 mt-2">Nossa IA está cruzando dados de mercado...</p>
                        </div>
                    )}

                    {modalState === 'success' && searchResult && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-2xl font-black mb-6 text-center uppercase text-primary">Produto Identificado!</h2>
                            <div className="bg-white p-6 rounded-[2rem] border-2 border-primary/30 space-y-5 mb-8">
                                <p className="text-xl font-black uppercase text-secondary leading-tight">{searchResult.productName}</p>
                                <div className="flex justify-between items-center border-t border-dashed border-primary/20 pt-5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Preço Estimado Meli:</p>
                                    <p className="text-4xl font-black text-primary">{formatCurrency(searchResult.sellPrice || 0)}</p>
                                </div>
                            </div>
                            <button onClick={() => { onDataFound({ ...searchResult, imageUrl: imageData || undefined }); handleClose(); }} className="w-full py-6 bg-primary text-secondary font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all uppercase text-lg tracking-tighter">USAR NA CALCULADORA</button>
                        </div>
                    )}

                    {modalState === 'error' && (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-7xl text-red-500 mb-6">info</span>
                            <h2 className="text-xl font-black uppercase mb-4 leading-tight">{error}</h2>
                            <button onClick={() => setModalState('idle')} className="px-12 py-5 bg-secondary text-white font-black rounded-2xl shadow-lg">Tentar Novamente</button>
                        </div>
                    )}

                    <input type="file" ref={fileInputRef} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => { setImageData(ev.target?.result as string); setModalState('preview'); };
                            reader.readAsDataURL(file);
                        }
                    }} accept="image/*" className="hidden" />
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            </div>
        </div>
    );
};
