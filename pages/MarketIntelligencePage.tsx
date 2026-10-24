
import React from 'react';
import type { MarketIntelligence } from '../types';

interface MarketIntelligencePageProps {
    mi: MarketIntelligence;
    imageUrl: string;
    onBack: () => void;
    onUseInCalculator: (name: string, price: number) => void;
}

const SectionTitle: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase tracking-tighter">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        {title}
    </h3>
);

const MetricBox: React.FC<{ label: string; value: string | number; sub?: string; color?: string }> = ({ label, value, sub, color = 'text-text-light-primary dark:text-text-dark-primary' }) => (
    <div className="bg-background-light dark:bg-background-dark p-4 rounded-xl border border-border-light dark:border-border-dark flex flex-col gap-1">
        <p className="text-[10px] font-bold text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-widest">{label}</p>
        <p className={`text-xl font-black ${color}`}>{value}</p>
        {sub && <p className="text-[10px] text-gray-400 italic mt-1">{sub}</p>}
    </div>
);

const Badge: React.FC<{ text: string; type?: 'info' | 'success' | 'warning' | 'error' }> = ({ text, type = 'info' }) => {
    const config = {
        info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        success: 'bg-primary/10 text-primary border-primary/20',
        warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        error: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${config[type]}`}>
            {text}
        </span>
    );
};

export const MarketIntelligencePage: React.FC<MarketIntelligencePageProps> = ({ mi, imageUrl, onBack, onUseInCalculator }) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <main className="max-w-[1200px] mx-auto p-6 space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-4xl">explore</span>
                        Auditoria de Inteligência de Mercado
                    </h1>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1 max-w-2xl">
                        Análise automatizada de concorrência, precificação e viabilidade baseada em reconhecimento visual e busca em tempo real.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onBack} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 font-bold rounded-xl text-sm transition-all hover:bg-gray-200">
                        Voltar
                    </button>
                    <button 
                        onClick={() => onUseInCalculator(mi.identificacao.nome, mi.mercado.faixa_preco.medio)}
                        className="px-6 py-2.5 bg-primary text-text-light-primary font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">calculate</span>
                        Usar na Calculadora
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Lateral Esquerda - Resumo do Produto */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden border border-border-light dark:border-border-dark shadow-sm">
                        <div className="aspect-square w-full relative">
                            <img src={imageUrl} alt="Identificação do Produto" className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4">
                                <Badge text="Auditoria Ativa" type="success" />
                            </div>
                        </div>
                        <div className="p-6">
                            <SectionTitle icon="label" title="Reconhecimento Visual" />
                            <p className="text-xl font-black mb-3">{mi.identificacao.nome}</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {mi.identificacao.atributos.map((attr, i) => <Badge key={i} text={attr} />)}
                            </div>
                            <div className="space-y-4 pt-6 border-t border-dashed border-border-light dark:border-border-dark">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Categoria Sugerida</p>
                                    <p className="text-sm font-bold text-text-light-secondary dark:text-text-dark-secondary">{mi.identificacao.categoria}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Subcategoria (Nicho)</p>
                                    <p className="text-sm font-bold text-text-light-secondary dark:text-text-dark-secondary">{mi.identificacao.subcategoria}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Central - Métricas de Mercado */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Panorama de Preço e Concorrência */}
                    <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
                        <SectionTitle icon="monitoring" title="Inteligência Competitiva" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            <MetricBox label="Preço Médio Meli" value={formatCurrency(mi.mercado.faixa_preco.medio)} sub={`Min: ${formatCurrency(mi.mercado.faixa_preco.min)} | Max: ${formatCurrency(mi.mercado.faixa_preco.max)}`} />
                            <MetricBox label="Competitividade" value={mi.mercado.competitividade} color={mi.mercado.competitividade === 'Baixa' ? 'text-primary' : mi.mercado.competitividade === 'Media' ? 'text-yellow-500' : 'text-red-500'} />
                            <MetricBox label="Presença no Full" value={mi.mercado.presença_full} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="p-5 bg-background-light dark:bg-background-dark rounded-xl">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Saturação da Categoria</p>
                                <p className="text-sm font-medium leading-relaxed">{mi.mercado.saturacao}</p>
                            </div>
                            <div className="p-5 bg-background-light dark:bg-background-dark rounded-xl">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Concentração de Vendedores</p>
                                <p className="text-sm font-medium leading-relaxed">{mi.mercado.concentracao_vendedores}</p>
                            </div>
                        </div>
                    </div>

                    {/* Viabilidade e Fornecedores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-border-light dark:border-border-dark">
                            <SectionTitle icon="verified" title="Viabilidade Estimada" />
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-400">Margem Estimada</span>
                                    <span className="text-2xl font-black text-primary">{(mi.viabilidade.margem_estimada * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-400">Risco Operacional</span>
                                    <Badge text={mi.viabilidade.risco_operacional} type={mi.viabilidade.risco_operacional === 'Baixo' ? 'success' : 'warning'} />
                                </div>
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <p className="text-xs font-bold text-primary uppercase mb-1">Status do Garimpo</p>
                                    <p className="text-sm font-medium italic">"{mi.viabilidade.status_geral}"</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-border-light dark:border-border-dark">
                            <SectionTitle icon="factory" title="Análise de Fornecimento" />
                            <div className="space-y-4">
                                {mi.fornecedores.map((f, i) => (
                                    <div key={i} className="pb-3 border-b border-dashed border-border-light last:border-0 last:pb-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-sm font-black">{f.tipo}</p>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Risco: {f.risco}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-text-light-secondary">
                                            <span>Custo Est.: {f.custo_estimado}</span>
                                            <span>MOQ: {f.moq}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Oportunidades e Canais de Entrada */}
                    <div className="bg-primary/10 p-8 rounded-2xl border-2 border-dashed border-primary/30">
                        <SectionTitle icon="auto_awesome" title="Canais e Oportunidades de Ouro" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mi.oportunidades.map((op, i) => (
                                <div key={i} className="bg-white dark:bg-card-dark p-5 rounded-xl border border-primary/20 shadow-sm flex flex-col gap-2">
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-black leading-tight">{op.titulo}</p>
                                        <span className="material-symbols-outlined text-primary text-sm">stars</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">{op.canal_nicho}</p>
                                    <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1">{op.estrategia}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
