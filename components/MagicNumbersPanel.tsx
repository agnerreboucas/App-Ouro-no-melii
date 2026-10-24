
import React from 'react';
import type { CalculationOutputs } from '../types';

interface MagicNumbersPanelProps {
  outputs: CalculationOutputs;
}

const formatCurrency = (value: number) => {
    if (!isFinite(value)) return "N/A";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export const MagicNumbersPanel: React.FC<MagicNumbersPanelProps> = ({ outputs }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border-2 border-primary/20">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-ml-yellow">auto_awesome</span>
            Números Mágicos
        </h3>
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-[#0d1b13]">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Break-even Point</p>
                    <p className="text-lg font-bold">{formatCurrency(outputs.breakEvenPrice)}</p>
                </div>
                <span className="material-symbols-outlined text-gray-400" title="Preço mínimo de venda para não ter prejuízo.">info</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-[#0d1b13]">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Preço Máx. Compra (p/ Margem Alvo)</p>
                    <p className="text-lg font-bold text-primary">{formatCurrency(outputs.maxPurchasePriceForMargin)}</p>
                </div>
                <span className="material-symbols-outlined text-gray-400" title="Preço máximo a pagar no fornecedor para atingir sua margem alvo.">shopping_cart</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-[#0d1b13]">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Preço Máx. Compra (p/ ROI Alvo)</p>
                    <p className="text-lg font-bold text-primary">{formatCurrency(outputs.maxPurchasePriceForRoi)}</p>
                </div>
                <span className="material-symbols-outlined text-gray-400" title="Preço máximo a pagar no fornecedor para atingir seu ROI alvo.">rocket_launch</span>
            </div>
        </div>
    </div>
  );
};