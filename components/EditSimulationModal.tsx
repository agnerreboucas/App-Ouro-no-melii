
import React, { useState, useEffect } from 'react';
import type { SavedSimulation, CalculatorInputs, CalculationOutputs } from '../types';
import { InputPanel } from './InputPanel';
import { calculateMetrics } from '../services/calculationService';

interface EditSimulationModalProps {
    simulation: SavedSimulation;
    onClose: () => void;
    onSave: (id: string, newInputs: CalculatorInputs) => void;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const formatPercentage = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(value);


export const EditSimulationModal: React.FC<EditSimulationModalProps> = ({ simulation, onClose, onSave }) => {
    const [currentInputs, setCurrentInputs] = useState<CalculatorInputs>(simulation.inputs);
    const [currentOutputs, setCurrentOutputs] = useState<CalculationOutputs>(simulation.outputs);

    useEffect(() => {
        const newOutputs = calculateMetrics(currentInputs);
        setCurrentOutputs(newOutputs);
    }, [currentInputs]);

    const handleSave = () => {
        onSave(simulation.id, currentInputs);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-background-light dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-border-light dark:border-border-dark sticky top-0 bg-background-light dark:bg-background-dark z-10">
                    <h2 className="text-xl font-bold">Edição Rápida: <span className="text-primary">{simulation.name}</span></h2>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Altere os valores e veja o impacto no lucro em tempo real.</p>
                </div>

                <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-full">
                        <InputPanel inputs={currentInputs} setInputs={setCurrentInputs} />
                    </div>
                    <div className="flex flex-col gap-4 sticky top-0">
                         <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col items-center text-center">
                            <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-bold uppercase tracking-wider mb-2">Lucro Líquido / Un</p>
                            <p className="text-4xl font-black text-primary">{formatCurrency(currentOutputs.netProfitPerUnit)}</p>
                        </div>
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col items-center text-center">
                            <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-bold uppercase tracking-wider mb-2">Margem Líquida</p>
                            <p className="text-4xl font-black">{formatPercentage(currentOutputs.netMarginPercentage)}</p>
                        </div>
                         <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">request_quote</span>
                                Detalhes das Taxas
                            </h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-[#0d1b13]">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Promoção Central</p>
                                        <p className="text-lg font-bold">{formatCurrency(currentInputs.sellPrice * currentInputs.promotionPercentage)}</p>
                                    </div>
                                    <span className="font-bold text-primary">{formatPercentage(currentInputs.promotionPercentage)}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-[#0d1b13]">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Pró-labore</p>
                                        <p className="text-lg font-bold">{formatCurrency(currentInputs.sellPrice * currentInputs.proLaborePercentage)}</p>
                                    </div>
                                    <span className="font-bold text-primary">{formatPercentage(currentInputs.proLaborePercentage)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">add_card</span>
                                Detalhes das Taxas Adicionais
                            </h3>
                            <div className="flex flex-col gap-4">
                                {(currentInputs.additionalFees || []).length > 0 ? (
                                    currentInputs.additionalFees.map(fee => (
                                        <div key={fee.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-[#0d1b13]">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{fee.name}</p>
                                                <p className="text-lg font-bold">{formatCurrency(currentInputs.sellPrice * fee.percentage)}</p>
                                            </div>
                                            <span className="font-bold text-primary">{formatPercentage(fee.percentage)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-center text-text-light-secondary dark:text-text-dark-secondary">Nenhuma taxa adicional configurada.</p>
                                )}
                            </div>
                        </div>
                         <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border-2 border-dashed border-primary/20">
                            <p className="text-xs text-center text-text-light-secondary dark:text-text-dark-secondary">
                                Qualquer alteração aqui será salva nesta simulação específica. A simulação original será substituída.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-border-light dark:border-border-dark flex justify-end gap-3 sticky bottom-0 bg-background-light dark:bg-background-dark z-10">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-text-light-primary dark:text-text-dark-primary font-bold rounded-lg hover:opacity-90 transition-opacity">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-8 py-2 bg-primary text-text-light-primary font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center gap-2">
                         <span className="material-symbols-outlined text-sm">save</span>
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};