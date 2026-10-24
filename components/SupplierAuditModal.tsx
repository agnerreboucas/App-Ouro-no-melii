
import React, { useState, useRef } from 'react';
import type { UserSettings, Supplier } from '../types';
import { GoogleGenAI } from "@google/genai";

interface SupplierAuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: UserSettings;
    onLoadToCalculator: (name: string, cost: number, price: number) => void;
}

interface AuditedItem {
    name: string;
    cost: number;
    marketPrice: number;
    margin: number;
    status: 'ouro' | 'morno' | 'frio';
}

export const SupplierAuditModal: React.FC<SupplierAuditModalProps> = ({ isOpen, onClose, settings, onLoadToCalculator }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<AuditedItem[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) setFile(selectedFile);
    };

    const processAudit = async () => {
        if (!file) return;
        setIsLoading(true);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        try {
            // Se for PDF/Imagem, usamos visão computacional. Se for CSV, lemos texto.
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const base64 = (ev.target?.result as string).split(',')[1];
                const mimeType = file.type;

                const prompt = `Analise esta lista de preços de fornecedor. 
                1. Extraia o NOME do produto e o PREÇO DE CUSTO.
                2. ESTIME o preço médio de venda atual no Mercado Livre Brasil para cada item.
                3. Calcule a margem bruta estimada.
                Retorne APENAS um JSON array de objetos: [{"name": string, "cost": number, "marketPrice": number, "margin": number, "status": "ouro"|"morno"|"frio"}]
                Status: 'ouro' se margem > 30%, 'morno' se 15-30%, 'frio' se < 15%.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: [{
                        parts: [
                            { inlineData: { data: base64, mimeType } },
                            { text: prompt }
                        ]
                    }],
                    config: { responseMimeType: "application/json" }
                });

                const data = JSON.parse(response.text || "[]");
                setResults(data);
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            alert("Erro ao processar tabela. Tente um arquivo menor ou mais nítido.");
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-secondary/90 backdrop-blur-xl z-[150] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark rounded-[2.5rem] border border-border-light w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-8 border-b border-border-light flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-primary leading-none">Auditoria de Tabela IA</h2>
                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Cruze listas de fornecedores com o Mercado Livre</p>
                    </div>
                    <button onClick={onClose} className="size-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {!results.length && !isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20">
                            <div className="size-24 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase">Suba o PDF ou CSV do Fornecedor</h3>
                                <p className="text-sm text-gray-500 font-bold max-w-md">Nossa IA lerá a tabela, extrairá os custos e fará um paralelo com os preços do Meli automaticamente.</p>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.csv,.xlsx,.jpg,.png" />
                            <div className="flex flex-col gap-4 w-full max-w-xs">
                                <button onClick={() => fileInputRef.current?.click()} className="py-4 bg-gray-100 rounded-2xl font-black uppercase text-xs hover:bg-gray-200 transition-all">
                                    {file ? file.name : "Selecionar Arquivo"}
                                </button>
                                {file && (
                                    <button onClick={processAudit} className="py-5 bg-primary text-secondary font-black rounded-2xl uppercase text-sm shadow-xl animate-bounce">Iniciar Mineração Neural</button>
                                )}
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="size-20 border-t-4 border-primary rounded-full animate-spin"></div>
                            <div className="text-center">
                                <h3 className="text-xl font-black uppercase text-primary">Auditando Oportunidades...</h3>
                                <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">A IA está cruzando milhares de preços agora.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
                                    <p className="text-[10px] font-black text-primary uppercase">Itens Mapeados</p>
                                    <p className="text-2xl font-black">{results.length}</p>
                                </div>
                                <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/20">
                                    <p className="text-[10px] font-black text-green-500 uppercase">Produtos Ouro</p>
                                    <p className="text-2xl font-black">{results.filter(r => r.status === 'ouro').length}</p>
                                </div>
                                <button onClick={() => setResults([])} className="text-[10px] font-black uppercase text-gray-400 hover:text-primary">Limpar e Novo Upload</button>
                            </div>

                            <div className="overflow-x-auto rounded-3xl border border-border-light">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 border-b">
                                        <tr>
                                            <th className="px-6 py-4">Produto</th>
                                            <th className="px-6 py-4 text-center">Custo (Forn)</th>
                                            <th className="px-6 py-4 text-center">Meli (Mercado)</th>
                                            <th className="px-6 py-4 text-center">Margem</th>
                                            <th className="px-6 py-4 text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-light">
                                        {results.map((item, i) => (
                                            <tr key={i} className="hover:bg-primary/5 transition-all group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`size-2 rounded-full ${item.status === 'ouro' ? 'bg-primary animate-pulse' : item.status === 'morno' ? 'bg-yellow-400' : 'bg-gray-300'}`}></span>
                                                        <span className="text-xs font-black uppercase truncate max-w-[200px]">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-xs text-gray-500">R$ {item.cost.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-center font-black text-xs">R$ {item.marketPrice.toFixed(2)}</td>
                                                <td className={`px-6 py-4 text-center font-black text-xs ${item.status === 'ouro' ? 'text-primary' : ''}`}>{item.margin.toFixed(1)}%</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => { onLoadToCalculator(item.name, item.cost, item.marketPrice); onClose(); }}
                                                        className="px-4 py-2 bg-secondary text-white text-[10px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary"
                                                    >
                                                        Auditar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
