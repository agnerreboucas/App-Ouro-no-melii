
import React, { useRef } from 'react';
import type { SavedSimulation, InvestmentSimulationResult } from '../types';

interface SimulationCardProps {
    simulation: SavedSimulation;
    investmentResult?: InvestmentSimulationResult;
    onViewDetail: (simulation: SavedSimulation) => void;
    onDelete: (id: string) => void;
    onUpdateTags: (id: string, tags: string[]) => void;
    onEdit: (simulation: SavedSimulation) => void;
    onUpdateImage: (id: string, imageUrl: string) => void;
    onToggleFavorite: (id: string) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(value);
}

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));
}

const HealthStatus: React.FC<{ status: 'Saudável' | 'Ajustável' | 'Prejuízo' }> = ({ status }) => {
    const config = {
        'Saudável': 'bg-primary/20 text-primary',
        'Ajustável': 'bg-yellow-400/20 text-yellow-400',
        'Prejuízo': 'bg-red-500/20 text-red-500'
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${config[status]}`}>
            {status}
        </span>
    );
};

const InvestmentMetric: React.FC<{ label: string; value: string; isPrimary?: boolean }> = ({ label, value, isPrimary }) => (
    <div className="flex justify-between items-baseline text-sm">
        <span className="text-text-light-secondary dark:text-text-dark-secondary">{label}:</span>
        <span className={`font-bold ${isPrimary ? 'text-primary' : ''}`}>{value}</span>
    </div>
);


export const SimulationCard: React.FC<SimulationCardProps> = ({ simulation, investmentResult, onViewDetail, onDelete, onUpdateTags, onEdit, onUpdateImage, onToggleFavorite }) => {
    const { id, name, createdAt, outputs, inputs, tags, isFavorite } = simulation;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditTags = () => {
        const currentTags = tags?.join(', ') || '';
        const newTagsString = window.prompt('Editar tags (separadas por vírgula):', currentTags);
        if (newTagsString !== null) {
            const newTags = newTagsString.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
            onUpdateTags(id, newTags);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateImage(id, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const hasSecondaryFees = inputs.promotionPercentage > 0 || inputs.proLaborePercentage > 0 || (inputs.additionalFees || []).some(fee => fee.percentage > 0);

    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark flex flex-col justify-between transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-primary/10">
            <div>
                 <div 
                    className="aspect-[4/3] w-full rounded-t-lg bg-background-light dark:bg-background-dark flex items-center justify-center overflow-hidden border-b border-border-light dark:border-border-dark cursor-pointer group relative"
                 >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    
                    {/* Botão de Favoritar Overlay */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(id); }}
                        className={`absolute top-2 right-2 size-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 ${isFavorite ? 'bg-primary/20 text-primary' : 'bg-black/20 text-white hover:bg-black/40'}`}
                        title={isFavorite ? "Remover dos favoritos" : "Marcar como favorito"}
                    >
                        <span className={`material-symbols-outlined text-2xl ${isFavorite ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${isFavorite ? 1 : 0}` }}>
                            {isFavorite ? 'favorite' : 'favorite'}
                        </span>
                    </button>

                    <div className="w-full h-full" onClick={handleImageClick}>
                        {inputs.imageUrl ? (
                            <img src={inputs.imageUrl} alt={name} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-text-light-secondary dark:text-text-dark-secondary">
                                <span className="material-symbols-outlined text-5xl">add_photo_alternate</span>
                                <span className="text-xs font-bold">Adicionar Foto</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-base pr-2 leading-tight">{name}</h3>
                        <HealthStatus status={outputs.healthStatus} />
                    </div>
                     {tags && tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap mb-4">
                            {tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-border-light dark:bg-border-dark text-text-light-secondary dark:text-text-dark-secondary">{tag}</span>
                            ))}
                             <button onClick={handleEditTags} className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary" title="Editar tags">
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                        </div>
                    )}
                    
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between items-center text-sm p-2 bg-background-light dark:bg-background-dark rounded-md border border-border-light dark:border-border-dark">
                            <span className="font-semibold text-text-light-secondary dark:text-text-dark-secondary">Custo de Compra /un:</span>
                            <span className="font-bold text-base">{formatCurrency(inputs.productCost)}</span>
                        </div>
                        
                        <div className="pt-3 border-t border-dashed border-border-light dark:border-border-dark space-y-2">
                             <div className="flex justify-between items-center text-lg">
                                <span className="font-medium text-text-light-secondary dark:text-text-dark-secondary">Lucro Líquido /un:</span>
                                <span className="font-black text-primary">{formatCurrency(outputs.netProfitPerUnit)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-medium text-text-light-secondary dark:text-text-dark-secondary">Margem Líquida:</span>
                                <span className="font-black">{formatPercentage(outputs.netMarginPercentage)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-medium text-text-light-secondary dark:text-text-dark-secondary">ROI:</span>
                                <span className="font-black">{formatPercentage(outputs.roiPercentage)}</span>
                            </div>
                        </div>

                        {hasSecondaryFees && (
                            <div className="pt-2 border-t border-dashed border-border-light dark:border-border-dark mt-2 text-xs space-y-1">
                                <h4 className="font-bold text-text-light-secondary dark:text-text-dark-secondary mb-1">Outras Taxas (% Venda):</h4>
                                {inputs.promotionPercentage > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-light-secondary dark:text-text-dark-secondary">Promoção:</span>
                                        <div className="font-bold text-right">
                                            <span>{formatPercentage(inputs.promotionPercentage)}</span>
                                            <span className="text-text-light-secondary dark:text-text-dark-secondary"> / {formatCurrency(inputs.sellPrice * inputs.promotionPercentage)}</span>
                                        </div>
                                    </div>
                                )}
                                {inputs.proLaborePercentage > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-light-secondary dark:text-text-dark-secondary">Pró-labore:</span>
                                        <div className="font-bold text-right">
                                            <span>{formatPercentage(inputs.proLaborePercentage)}</span>
                                            <span className="text-text-light-secondary dark:text-text-dark-secondary"> / {formatCurrency(inputs.sellPrice * inputs.proLaborePercentage)}</span>
                                        </div>
                                    </div>
                                )}
                                {(inputs.additionalFees || []).map(fee => (
                                    fee.percentage > 0 && (
                                        <div key={fee.id} className="flex justify-between items-center">
                                            <span className="text-text-light-secondary dark:text-text-dark-secondary truncate pr-2" title={fee.name}>{fee.name}:</span>
                                            <div className="font-bold text-right">
                                                <span>{formatPercentage(fee.percentage)}</span>
                                                <span className="text-text-light-secondary dark:text-text-dark-secondary"> / {formatCurrency(inputs.sellPrice * fee.percentage)}</span>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>


                    {investmentResult && (
                        <div className="mt-4 pt-4 border-t border-dashed border-border-light dark:border-border-dark">
                             <h4 className="text-xs font-bold text-text-light-secondary dark:text-text-dark-secondary uppercase mb-3">Simulação de Investimento</h4>
                             <div className="flex flex-col gap-2">
                                <InvestmentMetric label="Unidades Compráveis" value={`${investmentResult.purchasableUnits}`} />
                                <InvestmentMetric label="Invest. Total" value={formatCurrency(investmentResult.totalInvestment)} />
                                <InvestmentMetric label="Receita Potencial" value={formatCurrency(investmentResult.potentialRevenue)} />
                                <InvestmentMetric label="Lucro Potencial" value={formatCurrency(investmentResult.potentialProfit)} isPrimary />
                                <InvestmentMetric label="ROI Potencial" value={formatPercentage(investmentResult.potentialROI)} isPrimary />
                             </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-dashed border-border-light dark:border-border-dark">
                <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Salvo em {formatDate(createdAt)}</p>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => onDelete(id)} 
                            className="size-8 flex items-center justify-center text-gray-500 hover:text-red-500 rounded-md hover:bg-red-500/10" 
                            aria-label={`Excluir simulação ${name}`}
                            title="Excluir"
                        >
                            <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                        <button 
                            onClick={() => onEdit(simulation)}
                            className="size-8 flex items-center justify-center text-gray-500 hover:text-primary rounded-md hover:bg-primary/10" 
                            aria-label={`Editar simulação ${name}`}
                            title="Editar"
                        >
                            <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button 
                            onClick={() => onViewDetail(simulation)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-border-light dark:bg-border-dark text-text-light-primary dark:text-text-dark-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors"
                            aria-label={`Ver detalhes da simulação ${name}`}
                        >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Detalhes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
