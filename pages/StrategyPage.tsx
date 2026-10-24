
import React, { useState, useEffect, useRef } from 'react';
import type { SavedSimulation, UserSettings } from '../types';
import { getAiStrategyContent } from '../services/aiService';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import { ImageGenModal } from '../components/ImageGenModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface StrategyPageProps {
    simulations: SavedSimulation[];
    settings: UserSettings;
    onNavigate: (view: string) => void;
    onSaveInsight: (content: string, type: string, associatedSkuId: string, imageUrl?: string) => void;
    initialState: { skuId: string; prompt: string } | null;
    onInitialStateConsumed: () => void;
}

export const StrategyPage: React.FC<StrategyPageProps> = ({ 
    simulations, 
    settings, 
    onNavigate, 
    onSaveInsight, 
    initialState, 
    onInitialStateConsumed 
}) => {
    const [selectedSkuId, setSelectedSkuId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'kits' | 'copy' | 'description'>('kits');
    const [generatedContent, setGeneratedContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    
    const selectedSimulation = simulations.find(s => s.id === selectedSkuId);

    useEffect(() => {
        if (initialState) {
            setSelectedSkuId(initialState.skuId);
            onInitialStateConsumed();
        }
    }, [initialState, onInitialStateConsumed]);

    const handleGenerate = async () => {
        if (!selectedSimulation) return;
        setIsLoading(true);
        setGeneratedContent('');
        try {
            const content = await getAiStrategyContent(selectedSimulation, activeTab, settings);
            setGeneratedContent(content);
        } catch (e) {
            console.error(e);
            setGeneratedContent("Erro ao gerar conteúdo. Verifique sua conexão e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadResultPdf = () => {
        if (!generatedContent || !selectedSimulation) return;

        const doc = new jsPDF() as any;
        const typeLabel = activeTab === 'kits' ? 'Sugestão de Kits' : activeTab === 'copy' ? 'Copy de Anúncio' : 'Descrição Mercado Livre';
        
        doc.setFillColor(26, 61, 91);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text("ENCONTRE OURO NO MELI", 15, 20);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text("ESTRÚDIO DE INTELIGÊNCIA VAREJISTA", 15, 28);
        doc.text(`DATA: ${new Date().toLocaleDateString('pt-BR')}`, 160, 28);

        doc.setTextColor(40);
        doc.setFontSize(14);
        doc.text(`PRODUTO: ${selectedSimulation.name.toUpperCase()}`, 15, 55);
        doc.setFontSize(11);
        doc.setTextColor(0, 150, 204);
        doc.text(`Estratégia: ${typeLabel}`, 15, 62);

        doc.autoTable({
            startY: 70,
            body: [[generatedContent.replace(/[*#]/g, '')]],
            theme: 'plain',
            styles: { 
                fontSize: 10, 
                cellPadding: 5, 
                lineColor: [230, 230, 230],
                lineWidth: 0.1,
                font: 'helvetica'
            },
        });

        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("Gerado por Encontre Ouro no Meli - Ampliação Marketing Digital", 15, 285);
        }

        doc.save(`Estrategia_${activeTab}_${selectedSimulation.name.replace(/\s/g, '_')}.pdf`);
    };

    const handleDownloadResultDoc = () => {
        if (!generatedContent || !selectedSimulation) return;
        const typeLabel = activeTab === 'kits' ? 'Sugestão de Kits' : activeTab === 'copy' ? 'Copy de Anúncio' : 'Descrição Mercado Livre';
        
        // Criando estrutura HTML básica que o Word entende
        const htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>${typeLabel}</title></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <div style="background-color: #1a3d5b; color: white; padding: 20px;">
                    <h1 style="margin: 0;">ENCONTRE OURO NO MELI</h1>
                    <p style="margin: 0; font-size: 12px;">ESTRÚDIO DE INTELIGÊNCIA VAREJISTA</p>
                </div>
                <div style="padding: 20px;">
                    <h2 style="color: #1a3d5b;">${typeLabel}</h2>
                    <p><strong>Produto:</strong> ${selectedSimulation.name}</p>
                    <p><strong>Data de Emissão:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
                    <hr/>
                    <div style="margin-top: 20px; white-space: pre-wrap;">
                        ${generatedContent}
                    </div>
                </div>
                <div style="margin-top: 50px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 10px; color: #888;">
                    Gerado automaticamente via Estúdio IA - Ampliação Marketing Digital
                </div>
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
        });
        
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Estrategia_${activeTab}_${selectedSimulation.name.replace(/\s/g, '_')}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32 p-6 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-secondary uppercase tracking-tighter">Estúdio de <span className="text-primary italic">Conteúdo Meli</span></h1>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">IA aplicada para aumentar seu faturamento no Mercado Livre</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setIsImageModalOpen(true)} className="px-6 py-4 bg-secondary text-white font-black rounded-2xl text-xs uppercase shadow-xl flex items-center gap-2 hover:bg-primary hover:text-secondary transition-all">
                        <span className="material-symbols-outlined text-lg">auto_awesome</span> Criar Fotos p/ Kit
                    </button>
                    <button onClick={() => onNavigate('portfolio')} className="px-6 py-4 bg-white border border-border-light font-black rounded-2xl text-xs uppercase hover:bg-gray-50 transition-all">Ver Portfólio</button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-card-light p-8 rounded-[2.5rem] border border-border-light shadow-sm space-y-6">
                        <label className="block">
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">1. Selecione o Produto</span>
                            <select 
                                value={selectedSkuId} 
                                onChange={e => setSelectedSkuId(e.target.value)}
                                className="w-full mt-2 h-14 rounded-2xl bg-background-light border-border-light font-bold px-4 focus:ring-4 focus:ring-primary/10 outline-none"
                            >
                                <option value="">Escolher SKU salvo...</option>
                                {simulations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </label>

                        {selectedSimulation && (
                            <div className="p-4 bg-primary/5 rounded-3xl border border-primary/20 space-y-4 animate-fade-in-up">
                                <p className="text-[10px] font-black uppercase text-primary">Preview do Ativo</p>
                                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-white shadow-md">
                                    <img src={selectedSimulation.inputs.imageUrl || 'https://via.placeholder.com/400?text=Sem+Foto'} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase truncate">{selectedSimulation.name}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase">Preço: R$ {selectedSimulation.inputs.sellPrice.toFixed(2)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-card-light p-2 rounded-[2rem] border border-border-light shadow-xl overflow-hidden">
                        <div className="flex bg-background-light rounded-[1.5rem] p-1.5 overflow-x-auto scrollbar-hide">
                            <button 
                                onClick={() => setActiveTab('kits')}
                                className={`flex-1 min-w-[120px] py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'kits' ? 'bg-white text-primary shadow-md' : 'text-gray-400'}`}
                            >
                                <span className="material-symbols-outlined text-lg">inventory_2</span> Ideias de Kits
                            </button>
                            <button 
                                onClick={() => setActiveTab('copy')}
                                className={`flex-1 min-w-[120px] py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'copy' ? 'bg-white text-primary shadow-md' : 'text-gray-400'}`}
                            >
                                <span className="material-symbols-outlined text-lg">campaign</span> Títulos & Copy
                            </button>
                            <button 
                                onClick={() => setActiveTab('description')}
                                className={`flex-1 min-w-[120px] py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'description' ? 'bg-white text-primary shadow-md' : 'text-gray-400'}`}
                            >
                                <span className="material-symbols-outlined text-lg">description</span> Descrição Meli
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="bg-primary/5 p-6 rounded-3xl border border-dashed border-primary/30">
                                <p className="text-sm font-bold text-secondary leading-relaxed">
                                    {activeTab === 'kits' && "Crie combos inteligentes para ter um EAN exclusivo e dominar a primeira página do catálogo."}
                                    {activeTab === 'copy' && "Gere títulos matadores para SEO e textos persuasivos para atrair cliques em massa."}
                                    {activeTab === 'description' && "Crie a descrição mestre do Mercado Livre: Benefícios + Ficha Técnica + FAQ para converter."}
                                </p>
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={isLoading || !selectedSkuId}
                                className="w-full py-6 bg-primary text-secondary font-black rounded-2xl text-lg uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <><div className="size-6 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div> Criando Conteúdo...</>
                                ) : (
                                    <><span className="material-symbols-outlined">rocket_launch</span> Gerar Inteligência</>
                                )}
                            </button>
                        </div>
                    </div>

                    {generatedContent && (
                        <div className="bg-card-light p-10 rounded-[3rem] border-2 border-primary/20 shadow-2xl animate-fade-in-up space-y-8 relative">
                            <div className="flex flex-wrap justify-between items-center border-b border-border-light pb-4 gap-4">
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Resultado do Estúdio IA</span>
                                <div className="flex flex-wrap gap-2">
                                    <button 
                                        onClick={() => { navigator.clipboard.writeText(generatedContent); alert("Copiado para o Ctrl+V!"); }}
                                        className="px-4 py-2 bg-gray-100 rounded-xl text-[10px] font-black uppercase hover:bg-gray-200 transition-all flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">content_copy</span> Copiar
                                    </button>
                                    <button 
                                        onClick={handleDownloadResultDoc}
                                        className="px-4 py-2 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase hover:bg-blue-500/20 transition-all flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">description</span> Baixar Word
                                    </button>
                                    <button 
                                        onClick={handleDownloadResultPdf}
                                        className="px-4 py-2 bg-red-500/10 text-red-600 border border-red-500/20 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/20 transition-all flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">picture_as_pdf</span> Baixar PDF
                                    </button>
                                    <button 
                                        onClick={() => onSaveInsight(generatedContent, activeTab === 'kits' ? 'Sugestão de Kits' : activeTab === 'copy' ? 'Copy de Anúncio' : 'Descrição Mercado Livre', selectedSkuId)}
                                        className="px-6 py-2 bg-secondary text-white font-black rounded-xl text-[10px] uppercase shadow-lg hover:bg-primary transition-all flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">save</span> Salvar no Portfólio
                                    </button>
                                </div>
                            </div>
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-secondary prose-strong:text-primary">
                                <ReactMarkdown>{generatedContent}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ImageGenModal 
                isOpen={isImageModalOpen} 
                onClose={() => setIsImageModalOpen(false)} 
                settings={settings}
                onGenerated={(url) => {
                    if(selectedSkuId) onSaveInsight("Imagem ambientada profissional para o SKU.", "Foto de Catálogo", selectedSkuId, url);
                    setIsImageModalOpen(false);
                }}
            />
        </div>
    );
};
