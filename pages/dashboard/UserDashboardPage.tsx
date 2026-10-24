
import React, { useMemo } from 'react';
import type { SavedSimulation } from '../../types';

const formatCurrency = (value: number) => {
    if (isNaN(value)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const StatCard: React.FC<{ icon: string; label: string; value: string; color?: string; sub?: string }> = ({ icon, label, value, color = "primary", sub }) => (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-sm group hover:border-primary transition-all">
        <div className="flex items-center gap-4">
            <div className={`size-12 rounded-2xl flex items-center justify-center bg-${color}/10 text-${color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
                <p className="text-2xl font-black mt-0.5">{value}</p>
                {sub && <p className="text-[9px] font-bold text-gray-500 uppercase mt-1">{sub}</p>}
            </div>
        </div>
    </div>
);

export const UserDashboardPage: React.FC<{ simulations: SavedSimulation[] }> = ({ simulations }) => {
    
    const stats = useMemo(() => {
        const total = simulations.length;
        if (total === 0) return null;

        const avgMargin = simulations.reduce((acc, s) => acc + s.outputs.netMarginPercentage, 0) / total;
        const totalProfitUnit = simulations.reduce((acc, s) => acc + s.outputs.netProfitPerUnit, 0);
        
        // Advanced Insights Aggregation
        const avgCac = simulations.reduce((acc, s) => acc + (s.outputs.advanced?.maxCacAllowed || 0), 0) / total;
        const robustSkus = simulations.filter(s => s.outputs.advanced?.sensitivityAnalysis.costIncreaseImpact === 0).length;

        return { total, avgMargin, totalProfitUnit, avgCac, robustSkus };
    }, [simulations]);

    if (!stats) return <div className="p-20 text-center opacity-30">Sem dados suficientes para inteligência profunda.</div>;

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 p-6 pb-32 animate-fade-in-up">
            <header className="bg-card-light dark:bg-card-dark p-8 rounded-[2.5rem] border border-border-light dark:border-border-dark shadow-xl">
                <h1 className="text-4xl font-extrabold tracking-tighter">Business <span className="text-primary italic">Intelligence</span></h1>
                <p className="text-gray-400 font-bold mt-2 uppercase text-xs tracking-widest">Análise Preditiva e Blindagem de Lucro</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="shield_moon" label="SKUs Robustos" value={`${stats.robustSkus}`} sub="Resistentes a inflação 10%" />
                <StatCard icon="ads_click" label="CAC Limite Médio" value={formatCurrency(stats.avgCac)} sub="Teto de gasto p/ Ads" color="ml-yellow" />
                <StatCard icon="trending_up" label="Poder de Caixa" value={`${(stats.avgMargin * 100).toFixed(1)}%`} sub="Margem Líquida Global" />
                <StatCard icon="receipt_long" label="Fator de Lucro" value={formatCurrency(stats.totalProfitUnit * 100)} sub="Lucro a cada 100 vendas" color="primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-8 bg-card-light dark:bg-card-dark p-8 rounded-[2.5rem] border border-border-light dark:border-border-dark shadow-sm">
                    <h2 className="text-xl font-extrabold uppercase tracking-tighter mb-8 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">scale</span> Auditoria de Risco de Portfólio
                    </h2>
                    <div className="space-y-6">
                        <div className="p-6 bg-background-light dark:bg-background-dark rounded-3xl border border-border-light">
                            <h3 className="text-sm font-black uppercase mb-4">O que acontece se...</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase">O Custo do Fornecedor subir 10%?</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${(stats.robustSkus / stats.total) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs font-black">{Math.round((stats.robustSkus / stats.total) * 100)}% dos SKUs sobrevivem</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase">O Preço no Meli cair 5% (Guerra de Preço)?</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500" style={{ width: '40%' }}></div>
                                        </div>
                                        <span className="text-xs font-black">40% do Portfólio entra em risco</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 bg-primary p-8 rounded-[3rem] text-text-light-primary relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-[-20px] right-[-20px] size-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-6">Ação <br/>Recomendada</h3>
                    <p className="text-sm font-bold opacity-80 mb-8 leading-relaxed">"Seu portfólio está concentrado em produtos de baixa margem. Recomenda-se diversificar com itens de maior ticket para blindar o lucro contra variações logísticas."</p>
                    <button className="w-full py-4 bg-background-dark text-white font-black rounded-2xl uppercase text-xs tracking-widest">Ver Novos Fornecedores</button>
                 </div>
            </div>
        </div>
    );
};
