import React from 'react';
import type { CalculationOutputs, AiInsight } from '../types';

interface ResultsPanelProps {
  outputs: CalculationOutputs;
  aiInsight: AiInsight | null;
  isLoading: boolean;
  productName?: string;
  onNavigateToStrategy?: () => void;
  onSave?: () => void;
}

const formatCurrency = (value: number) => {
    const isNegative = value < 0;
    const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(value));
    return isNegative ? `- ${formatted}` : formatted;
}

const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(value);
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ outputs, aiInsight, isLoading, productName, onNavigateToStrategy, onSave }) => {
  const isHealthy = outputs.healthStatus === 'Saudável';

  const otherMarketplaces = [
    { name: 'Amazon', factor: 1.08 },
    { name: 'Magazine Luiza', factor: 1.05 },
    { name: 'Casas Bahia', factor: 1.04 },
    { name: 'TikTok Shop', factor: 1.02 },
    { name: 'Kwai Shop', factor: 1.01 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col items-center text-center">
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-bold uppercase tracking-wider mb-2">Lucro Líquido / Un</p>
          <p className={`text-4xl font-black ${outputs.netProfitPerUnit < 0 ? 'text-red-600' : 'text-primary'}`}>{formatCurrency(outputs.netProfitPerUnit)}</p>
          <div className="mt-2 text-[10px] text-gray-400">Após todas as taxas e impostos</div>
      </div>

      {onSave && (
        <button 
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-border-light dark:border-border-dark text-text-light-secondary dark:text-text-dark-secondary font-black rounded-xl text-xs uppercase hover:border-primary hover:text-primary transition-all"
        >
            <span className="material-symbols-outlined text-sm">save</span>
            Salvar no Portfólio
        </button>
      )}

      <div className="bg-primary/10 border-2 border-primary/30 p-6 rounded-[2rem] shadow-lg animate-pulse hover:animate-none transition-all">
          <h4 className="text-sm font-black uppercase text-text-light-primary leading-tight text-center mb-4">
              Você deseja criar a sua estratégia? <br/> Deseja criar sugestões de kits para lucrar mais?
          </h4>
          <button 
            onClick={onNavigateToStrategy}
            className="w-full py-4 bg-primary text-text-light-primary font-black rounded-xl uppercase tracking-tighter shadow-xl hover:scale-105 transition-all"
          >
              Sim, clique aqui
          </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col items-center text-center">
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-bold uppercase tracking-wider mb-2">Margem Líquida</p>
            <p className={`text-3xl font-black ${outputs.netMarginPercentage < 0 ? 'text-red-600' : ''}`}>{formatPercentage(outputs.netMarginPercentage)}</p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col items-center text-center">
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-bold uppercase tracking-wider mb-2">ROI</p>
            <p className={`text-3xl font-black ${outputs.roiPercentage < 0 ? 'text-red-600' : ''}`}>{formatPercentage(outputs.roiPercentage)}</p>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
          <div className="flex justify-between items-center mb-2">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">visibility</span> Preços de Referência
              </h4>
          </div>
          <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-dashed border-primary/20">
            <p className="text-[10px] text-text-light-secondary dark:text-text-dark-secondary font-bold leading-snug">
                <strong className="text-primary uppercase">O que é isso?</strong><br/>
                É o preço médio que outros marketplaces praticam para produtos da mesma categoria, calculado a partir de valores ligeiramente acima e abaixo do seu preço de venda.
                <br/><br/>
                <strong className="text-primary uppercase">Estratégia:</strong> Use este valor como base para se posicionar no Mercado Livre ou, para lucrar mais, crie kits com EAN único e fuja da guerra de preços.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {otherMarketplaces.map(m => (
              <div key={m.name} className="flex items-center justify-between p-3 bg-background-light dark:bg-background-dark rounded-xl border border-border-light/40 opacity-70">
                 <span className="text-xs font-bold">{m.name}</span>
                 <div className="flex items-center gap-2"><span className="text-sm font-black">{formatCurrency(outputs.dre.grossRevenue * m.factor)}</span><span className="material-symbols-outlined text-xs text-gray-300">lock</span></div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[9px] font-bold text-primary uppercase text-center bg-primary/5 p-2 rounded-lg leading-tight">
            Links ativos e cotações dinâmicas disponíveis exclusivamente no Dossiê Estratégico (PDF).
          </p>
      </div>
    </div>
  );
};