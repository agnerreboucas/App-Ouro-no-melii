
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { SavedSimulation, UserSettings, InvestmentSimulationResult, SavedInsight } from '../types';
import { ResultsPanel } from '../components/ResultsPanel';
import { MagicNumbersPanel } from '../components/MagicNumbersPanel';
import { DrePanel } from '../components/DrePanel';
import { CalculationInfoModal } from '../components/CalculationInfoModal';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';


interface SkuDetailPageProps {
    simulation: SavedSimulation;
    settings: UserSettings;
    onBack: () => void;
    onEdit: (simulation: SavedSimulation) => void;
    insights: SavedInsight[];
    onViewInsightDetail: (insight: SavedInsight) => void;
    onUpdateImage: (id: string, imageUrl: string) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(value);
}

const InvestmentMetric: React.FC<{ label: string; value: string; isPrimary?: boolean }> = ({ label, value, isPrimary }) => (
    <div className="flex justify-between items-baseline text-sm">
        <span className="text-text-light-secondary dark:text-text-dark-secondary">{label}:</span>
        <span className={`font-bold ${isPrimary ? 'text-primary' : ''}`}>{value}</span>
    </div>
);

const InsightAccordionItem: React.FC<{ insight: SavedInsight, onViewDetail: () => void }> = ({ insight, onViewDetail }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border-light dark:border-border-dark">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-3"
            >
                <div className="flex items-center gap-3">
                     <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${insight.type === 'Imagem Gerada' ? 'bg-purple-500/20 text-purple-400' : 'bg-primary/20 text-primary'}`}>{insight.type}</span>
                     <h3 className="text-sm font-bold">{insight.name}</h3>
                </div>
                <span className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                expand_more
                </span>
            </button>
            {isOpen && (
                <div className="pb-4 pt-2">
                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                        {insight.generatedImageUrl ? (
                            <div className="mb-4">
                                <img src={insight.generatedImageUrl} alt={`Imagem gerada para ${insight.name}`} className="rounded-lg w-full max-w-sm mx-auto" />
                            </div>
                        ) : null}
                         <div className="prose prose-sm dark:prose-invert max-w-none">
                             <ReactMarkdown>{insight.content}</ReactMarkdown>
                         </div>
                    </div>
                     <button 
                        onClick={onViewDetail}
                        className="mt-2 text-xs font-bold text-primary hover:underline"
                    >
                        Ver em tela cheia / Editar
                    </button>
                </div>
            )}
        </div>
    );
};


export const SkuDetailPage: React.FC<SkuDetailPageProps> = ({ simulation, settings, onBack, onEdit, insights, onViewInsightDetail, onUpdateImage }) => {
    const { inputs, outputs, name, createdAt } = simulation;
    const [isInfoDrawerOpen, setIsInfoDrawerOpen] = React.useState(false);
    
    const [investmentCapital, setInvestmentCapital] = useState<string>('1000');
    const [salesGoal, setSalesGoal] = useState<string>('');
    const [simulationResult, setSimulationResult] = useState<InvestmentSimulationResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const costPerUnit = useMemo(() => {
        return inputs.productCost + inputs.packagingCost + inputs.shippingCost + inputs.otherCost + (inputs.isFull ? inputs.fullCost : 0);
    }, [inputs]);

    useEffect(() => {
        const capital = parseFloat(investmentCapital);
        if (isNaN(capital) || capital <= 0 || costPerUnit <= 0) {
            setSimulationResult(null);
            if (costPerUnit > 0) {
                setSalesGoal('');
            }
            return;
        }
        
        const purchasableUnits = Math.floor(capital / costPerUnit);
        const totalInvestment = purchasableUnits * costPerUnit;
        const potentialRevenue = purchasableUnits * inputs.sellPrice;
        const potentialProfit = purchasableUnits * outputs.netProfitPerUnit;
        const potentialROI = totalInvestment > 0 ? potentialProfit / totalInvestment : 0;
        
        setSimulationResult({ purchasableUnits, totalInvestment, potentialRevenue, potentialProfit, potentialROI });
        setSalesGoal(purchasableUnits.toString());

    }, [investmentCapital, costPerUnit, inputs.sellPrice, outputs.netProfitPerUnit]);


    const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInvestmentCapital(e.target.value);
    };

    const handleSalesGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const goalValue = e.target.value;
        setSalesGoal(goalValue);

        const goal = parseInt(goalValue, 10);
        if (!isNaN(goal) && goal >= 0 && costPerUnit > 0) {
            const requiredCapital = goal * costPerUnit;
            setInvestmentCapital(requiredCapital.toFixed(2));
        } else {
            setInvestmentCapital('');
        }
    };


    const associatedInsights = useMemo(() => {
        return insights.filter(insight => insight.associatedSkuId === simulation.id)
                       .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [insights, simulation.id]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateImage(simulation.id, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <main className="max-w-[1440px] mx-auto p-6 flex flex-col gap-6 w-full">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{name}</h1>
                        <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
                            Simulação salva em {new Date(createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                         <button onClick={() => onEdit(simulation)} className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary text-sm font-bold rounded-lg border border-primary/30 hover:bg-primary/30 transition-all">
                            <span className="material-symbols-outlined">edit</span>
                            Editar Simulação
                        </button>
                        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary text-sm font-bold rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-all">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Voltar
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div 
                            className="rounded-xl overflow-hidden border border-border-light dark:border-border-dark shadow-sm cursor-pointer group"
                            onClick={handleImageClick}
                            title="Clique para trocar a imagem"
                        >
                             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            {inputs.imageUrl ? (
                                <img src={inputs.imageUrl} alt={name} className="w-full h-auto object-cover aspect-video group-hover:opacity-75 transition-opacity" />
                            ) : (
                                 <div className="aspect-video w-full bg-background-light dark:bg-background-dark flex flex-col items-center justify-center text-text-light-secondary dark:text-text-dark-secondary">
                                    <span className="material-symbols-outlined text-6xl">add_photo_alternate</span>
                                    <span className="text-sm font-bold mt-2">Adicionar Foto de Capa</span>
                                </div>
                            )}
                        </div>
                        
                        <ResultsPanel outputs={outputs} aiInsight={null} isLoading={false} />
                        
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">psychology</span>
                                Insights de Estratégia Salvos
                            </h3>
                            {associatedInsights.length > 0 ? (
                                <div className="flex flex-col">
                                    {associatedInsights.map(insight => (
                                        <InsightAccordionItem 
                                            key={insight.id}
                                            insight={insight}
                                            onViewDetail={() => onViewInsightDetail(insight)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary text-center py-4 bg-background-light dark:bg-background-dark rounded-lg">
                                    Nenhum insight salvo para este produto. Vá para a página de Estratégia para criar.
                                </p>
                            )}
                        </div>

                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">savings</span>
                                Simulador de Vendas e Investimento
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <label>
                                    <span className="text-xs font-bold text-text-light-secondary dark:text-text-dark-secondary">Capital para Investir (R$)</span>
                                    <input 
                                        type="number"
                                        placeholder="Ex: 1000"
                                        value={investmentCapital}
                                        onChange={handleCapitalChange}
                                        className="w-full mt-1 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-11 text-base font-bold"
                                    />
                                </label>
                                <label>
                                    <span className="text-xs font-bold text-text-light-secondary dark:text-text-dark-secondary">Meta de Vendas (unidades)</span>
                                    <input 
                                        type="number"
                                        placeholder="Ex: 100"
                                        value={salesGoal}
                                        onChange={handleSalesGoalChange}
                                        className="w-full mt-1 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-11 text-base font-bold"
                                    />
                                </label>
                            </div>

                            {simulationResult && (
                                <div className="flex flex-col gap-2 pt-4 border-t border-dashed border-border-light dark:border-border-dark">
                                    <InvestmentMetric label="Unidades Compráveis" value={`${simulationResult.purchasableUnits}`} />
                                    <InvestmentMetric label="Invest. Real (Estoque)" value={formatCurrency(simulationResult.totalInvestment)} />
                                    <InvestmentMetric label="Receita Potencial" value={formatCurrency(simulationResult.potentialRevenue)} />
                                    <InvestmentMetric label="Lucro Potencial" value={formatCurrency(simulationResult.potentialProfit)} isPrimary />
                                    <InvestmentMetric label="ROI Potencial" value={formatPercentage(simulationResult.potentialROI)} isPrimary />
                                </div>
                            )}
                        </div>
                        <MagicNumbersPanel outputs={outputs} />
                        <DrePanel 
                            dre={outputs.dre} 
                            outputs={outputs}
                            onOpenInfoModal={() => setIsInfoDrawerOpen(true)}
                            inputs={inputs}
                            settings={settings}
                        />
                    </div>
                </div>
            </main>
            <CalculationInfoModal isOpen={isInfoDrawerOpen} onClose={() => setIsInfoDrawerOpen(false)} />
        </>
    );
};