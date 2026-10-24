
import React, { useState, useMemo } from 'react';
import type { SavedSimulation, InvestmentSimulationResult, SavedInsight, CalculatorInputs } from '../types';
import { SimulationCard } from '../components/SimulationCard';
import { EditSimulationModal } from '../components/EditSimulationModal';

interface EcommercePortfolioPageProps {
    simulations: SavedSimulation[];
    insights: SavedInsight[];
    onViewDetail: (simulation: SavedSimulation) => void;
    onViewInsightDetail: (insight: SavedInsight) => void;
    onDeleteSimulation: (id: string) => void;
    onDeleteInsight: (id: string) => void;
    onUpdateTags: (id: string, tags: string[]) => void;
    onNew: () => void;
    onEdit: (simulation: SavedSimulation) => void;
    onUpdateImage: (id: string, imageUrl: string) => void;
    onUpdateInPlace: (id: string, newInputs: CalculatorInputs) => void;
    onToggleFavorite: (id: string) => void;
}

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));
}

const InsightCard: React.FC<{ insight: SavedInsight, onViewDetail: (insight: SavedInsight) => void, onDelete: (id: string) => void }> = ({ insight, onViewDetail, onDelete }) => {
    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark flex flex-col justify-between transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-primary/10 p-4">
            <div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full mb-2 inline-block ${insight.type === 'Imagem Gerada' ? 'bg-purple-500/20 text-purple-400' : 'bg-primary/20 text-primary'}`}>{insight.type}</span>
                <h3 className="font-bold text-base leading-tight mb-1">{insight.name}</h3>
                <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">Para: {insight.associatedSkuName}</p>
                {insight.generatedImageUrl && <img src={insight.generatedImageUrl} alt="Preview" className="mt-2 rounded-md aspect-square object-cover w-full"/>}
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-border-light dark:border-border-dark flex justify-between items-center">
                <p className="text-xs text-gray-500">Salvo em {formatDate(insight.createdAt)}</p>
                <div className="flex items-center gap-1">
                     <button 
                        onClick={() => onDelete(insight.id)} 
                        className="size-8 flex items-center justify-center text-gray-500 hover:text-red-500 rounded-md hover:bg-red-500/10" 
                        aria-label={`Excluir insight ${insight.name}`}
                        title="Excluir"
                    >
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                     <button 
                        onClick={() => onViewDetail(insight)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-border-light dark:bg-border-dark text-text-light-primary dark:text-text-dark-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors"
                        aria-label={`Ver detalhes do insight ${insight.name}`}
                    >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Detalhes
                    </button>
                </div>
            </div>
        </div>
    )
};

export const EcommercePortfolioPage: React.FC<EcommercePortfolioPageProps> = ({ simulations, insights, onViewDetail, onViewInsightDetail, onDeleteSimulation, onDeleteInsight, onUpdateTags, onNew, onEdit, onUpdateImage, onUpdateInPlace, onToggleFavorite }) => {
    const [activeTab, setActiveTab] = useState<'skus' | 'insights'>('skus');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [simulationMode, setSimulationMode] = useState<'capital' | 'goal'>('capital');
    const [simulationInput, setSimulationInput] = useState<string>('1000');
    const [simulationResults, setSimulationResults] = useState<{[key: string]: InvestmentSimulationResult} | null>(null);
    const [editingSimulation, setEditingSimulation] = useState<SavedSimulation | null>(null);

    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        simulations.forEach(sim => {
            if (sim.simulationType === 'ecommerce') {
                sim.tags?.forEach(tag => tagsSet.add(tag));
            }
        });
        return Array.from(tagsSet).sort();
    }, [simulations]);

    const handleTagClick = (tag: string) => {
        setActiveTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSimulation = () => {
        const inputValue = parseFloat(simulationInput);
        if (isNaN(inputValue) || inputValue <= 0) {
            setSimulationResults(null);
            return;
        }

        const results: {[key: string]: InvestmentSimulationResult} = {};
        simulations.forEach(sim => {
            const { inputs, outputs } = sim;
            const costPerUnit = inputs.productCost + inputs.packagingCost + inputs.shippingCost + inputs.otherCost + (inputs.isFull ? inputs.fullCost : 0);
            
            if (costPerUnit <= 0) {
                results[sim.id] = { purchasableUnits: 0, totalInvestment: 0, potentialRevenue: 0, potentialProfit: 0, potentialROI: 0 };
                return;
            }

            let simResult: InvestmentSimulationResult;

            if (simulationMode === 'capital') {
                const capital = inputValue;
                const purchasableUnits = Math.floor(capital / costPerUnit);
                const totalInvestment = purchasableUnits * costPerUnit;
                const potentialRevenue = purchasableUnits * inputs.sellPrice;
                const potentialProfit = purchasableUnits * outputs.netProfitPerUnit;
                const potentialROI = totalInvestment > 0 ? potentialProfit / totalInvestment : 0;
                simResult = { purchasableUnits, totalInvestment, potentialRevenue, potentialProfit, potentialROI };
            } else { // 'goal' mode
                const salesGoal = inputValue;
                const requiredInvestment = salesGoal * costPerUnit;
                const potentialRevenue = salesGoal * inputs.sellPrice;
                const potentialProfit = salesGoal * outputs.netProfitPerUnit;
                const potentialROI = requiredInvestment > 0 ? potentialProfit / requiredInvestment : 0;
                simResult = { 
                    purchasableUnits: salesGoal,
                    totalInvestment: requiredInvestment, 
                    potentialRevenue, 
                    potentialProfit, 
                    potentialROI
                };
            }
            results[sim.id] = simResult;
        });
        setSimulationResults(results);
    };


    const handleOpenEditModal = (simulation: SavedSimulation) => {
        setEditingSimulation(simulation);
    };

    const handleSaveSimulationUpdate = (id: string, newInputs: CalculatorInputs) => {
        onUpdateInPlace(id, newInputs);
        setEditingSimulation(null);
    };


    const filteredSimulations = useMemo(() => {
        return simulations.filter(sim => {
            if (sim.simulationType !== 'ecommerce') return false;

            const matchesSearch = sim.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTags = activeTags.length === 0 || activeTags.every(tag => sim.tags?.includes(tag));
            const matchesFavorites = !showOnlyFavorites || sim.isFavorite;
            return matchesSearch && matchesTags && matchesFavorites;
        });
    }, [simulations, searchTerm, activeTags, showOnlyFavorites]);
    
    const filteredInsights = useMemo(() => {
        return insights.filter(insight => insight.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [insights, searchTerm]);

    const renderContent = () => {
        if (activeTab === 'skus') {
            return filteredSimulations.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSimulations.map(sim => (
                        <SimulationCard 
                            key={sim.id}
                            simulation={sim}
                            investmentResult={simulationResults ? simulationResults[sim.id] : undefined}
                            onViewDetail={onViewDetail}
                            onDelete={onDeleteSimulation}
                            onUpdateTags={onUpdateTags}
                            onEdit={handleOpenEditModal}
                            onUpdateImage={onUpdateImage}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-xl bg-card-light dark:bg-card-dark border border-dashed border-border-light dark:border-border-dark mt-6">
                    <span className="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary mb-4">search_off</span>
                    <h2 className="text-xl font-bold">Nenhuma simulação de E-commerce encontrada</h2>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary mt-2 max-w-sm">Use a Calculadora Multicanal para criar e salvar seus produtos de e-commerce.</p>
                    <button onClick={onNew} className="mt-6 flex items-center gap-2 px-4 py-3 bg-primary text-text-light-primary text-sm font-bold rounded-lg shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined">add</span> Criar nova simulação
                    </button>
                </div>
            )
        }
        
        if (activeTab === 'insights') {
            return filteredInsights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {filteredInsights.map(insight => (
                       <InsightCard key={insight.id} insight={insight} onViewDetail={onViewInsightDetail} onDelete={onDeleteInsight} />
                   ))}
               </div>
           ) : (
               <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-xl bg-card-light dark:bg-card-dark border border-dashed border-border-light dark:border-border-dark mt-6">
                   <span className="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary mb-4">tips_and_updates_off</span>
                   <h2 className="text-xl font-bold">Nenhum insight salvo</h2>
                   <p className="text-text-light-secondary dark:text-text-dark-secondary mt-2 max-w-sm">Vá para a página de Estratégia, gere um conteúdo com a IA e salve-o para vê-lo aqui.</p>
               </div>
           )
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-3xl font-bold">Portfólio E-commerce</h1>
                <p className="mt-1 text-text-light-secondary dark:text-text-dark-secondary">
                    Gerencie seus produtos de lojas próprias, outros marketplaces e canais de venda direta.
                </p>
            </div>
             <div className="bg-card-light dark:bg-card-dark p-5 rounded-xl border-2 border-primary/20 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                     <h2 className="text-lg font-bold flex items-center gap-2 mb-1"><span className="material-symbols-outlined text-primary">savings</span> Simulador de Vendas e Investimento</h2>
                     <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mb-3">Calcule o potencial de compra ou o investimento necessário para sua meta.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-end gap-3 w-full md:w-auto">
                    <div className="flex-1">
                        <span className="text-xs font-bold text-text-light-secondary dark:text-text-dark-secondary">Simular por:</span>
                        <div className="flex border border-border-light dark:border-border-dark rounded-lg p-1 mt-1 bg-background-light dark:bg-background-dark">
                            <button onClick={() => { setSimulationMode('capital'); setSimulationInput('1000'); setSimulationResults(null); }} className={`px-3 py-1.5 text-xs font-bold rounded-md flex-1 ${simulationMode === 'capital' ? 'bg-primary text-text-light-primary' : ''}`}>Capital</button>
                            <button onClick={() => { setSimulationMode('goal'); setSimulationInput('100'); setSimulationResults(null); }} className={`px-3 py-1.5 text-xs font-bold rounded-md flex-1 ${simulationMode === 'goal' ? 'bg-primary text-text-light-primary' : ''}`}>Meta de Vendas</button>
                        </div>
                    </div>
                    <label className="flex-1">
                        <span className="text-xs font-bold text-text-light-secondary dark:text-text-dark-secondary">
                            {simulationMode === 'capital' ? 'Capital para Investir (R$)' : 'Meta de Vendas (unidades)'}
                        </span>
                         <input 
                            type="number"
                            placeholder={simulationMode === 'capital' ? 'Ex: 1000' : 'Ex: 100'}
                            value={simulationInput}
                            onChange={e => setSimulationInput(e.target.value)}
                            className="w-full mt-1 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-12 text-lg font-bold"
                        />
                    </label>
                    <button onClick={handleSimulation} className="h-12 px-6 bg-primary text-text-light-primary font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">Simular</button>
                </div>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark flex flex-col md:flex-row gap-4 items-center">
                 <div className="flex border border-border-light dark:border-border-dark rounded-lg p-1">
                    <button onClick={() => setActiveTab('skus')} className={`px-4 py-2 text-sm font-bold rounded-md ${activeTab === 'skus' ? 'bg-primary text-text-light-primary' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}>Meus SKUs</button>
                    <button onClick={() => setActiveTab('insights')} className={`px-4 py-2 text-sm font-bold rounded-md ${activeTab === 'insights' ? 'bg-primary text-text-light-primary' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}>Insights Salvos</button>
                </div>
                <div className="relative w-full md:flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">search</span>
                    <input 
                        type="text"
                        placeholder={activeTab === 'skus' ? "Buscar por nome do SKU..." : "Buscar por nome do Insight..."}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-11"
                    />
                </div>
                {activeTab === 'skus' && (
                    <div className="w-full md:w-auto flex flex-wrap gap-2 items-center justify-center">
                        <button 
                            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showOnlyFavorites ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-border-light dark:bg-border-dark text-text-light-secondary dark:text-text-dark-secondary'}`}
                        >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: `'FILL' ${showOnlyFavorites ? 1 : 0}` }}>favorite</span>
                            Favoritos
                        </button>
                        <div className="h-6 w-px bg-border-light dark:bg-border-dark mx-1 hidden sm:block"></div>
                        {allTags.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTags.includes(tag) ? 'bg-primary text-text-light-primary' : 'bg-border-light dark:bg-border-dark text-text-light-secondary dark:text-text-dark-secondary'}`}
                            >
                                {tag}
                            </button>
                        ))}
                        {activeTags.length > 0 && (
                            <button onClick={() => setActiveTags([])} className="text-xs text-text-light-secondary dark:text-text-dark-secondary hover:text-primary">Limpar Tags</button>
                        )}
                    </div>
                )}
            </div>

            {renderContent()}

            {editingSimulation && (
                <EditSimulationModal 
                    simulation={editingSimulation}
                    onClose={() => setEditingSimulation(null)}
                    onSave={handleSaveSimulationUpdate}
                />
            )}
        </div>
    );
};
