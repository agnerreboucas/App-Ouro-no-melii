import React from 'react';
import type { UserSettings } from '../types';

interface HomeHubPageProps {
  onNavigate: (view: string) => void;
  onOpenSearchByImage: () => void;
  settings: UserSettings;
}

const ToolCard: React.FC<{ 
  icon: string; 
  title: string; 
  desc: string; 
  onClick: () => void; 
  color?: string;
  isNew?: boolean;
  limitLabel?: string;
}> = ({ icon, title, desc, onClick, color = "primary", isNew, limitLabel }) => (
  <button 
    onClick={onClick} 
    className="group bg-card-light dark:bg-card-dark p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-border-light dark:border-border-dark shadow-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all text-left flex flex-col h-full relative overflow-hidden"
  >
    {isNew && (
      <span className="absolute top-4 right-4 bg-primary text-text-light-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">
        Novo
      </span>
    )}
    <div className={`size-12 md:size-14 rounded-2xl bg-${color}/10 flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
      <span className={`material-symbols-outlined text-2xl md:text-3xl text-${color}`}>{icon}</span>
    </div>
    <h3 className="text-lg md:text-xl font-extrabold mb-2 md:mb-3 group-hover:text-primary transition-colors uppercase tracking-tighter">{title}</h3>
    <p className="text-xs md:text-sm text-text-light-secondary dark:text-gray-400 font-bold leading-relaxed flex-grow">
      {desc}
    </p>
    {limitLabel && (
        <p className="mt-4 text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs">info</span>
            {limitLabel}
        </p>
    )}
    <div className="mt-4 md:mt-6 flex items-center gap-2 text-primary font-black text-[10px] md:text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
      Acessar Inteligência
      <span className="material-symbols-outlined text-sm">arrow_forward</span>
    </div>
  </button>
);

export const HomeHubPage: React.FC<HomeHubPageProps> = ({ onNavigate, onOpenSearchByImage, settings }) => {
  const dailyLimit = { free: 2, basic: 5, pro: 10, annual: 9999 }[settings.subscriptionLevel] || 2;
  const searchesLeft = Math.max(0, dailyLimit - settings.searchesToday);

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-8 md:space-y-12 animate-fade-in-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                <span className="material-symbols-outlined text-xs">verified</span>
                Foco em Lucro Real
            </div>
            <h1 className="text-3xl md:text-6xl font-extrabold tracking-tighter leading-none">
            Olá, <span className="text-primary">{settings.userName}</span>. <br />
            Qual <span className="italic text-text-light-primary dark:text-white">lucro real</span> <br className="hidden md:block"/> vamos validar hoje?
            </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <div className="bg-card-light dark:bg-card-dark p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-border-light dark:border-border-dark shadow-xl flex-1 sm:min-w-[200px]">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Ativos em Carteira</p>
                    <div className="px-1.5 py-0.5 bg-primary/20 rounded-md text-[8px] md:text-[9px] font-black text-primary uppercase">{settings.subscriptionLevel}</div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl md:text-4xl font-black">{settings.savesCount}</span>
                    <span className="text-xs md:text-sm font-bold text-gray-400">/ {settings.savesLimit}</span>
                </div>
                <div className="w-full h-1.5 md:h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(settings.savesCount / settings.savesLimit) * 100}%` }}></div>
                </div>
                <p className="text-[8px] md:text-[9px] font-black text-text-light-secondary mt-3 uppercase tracking-widest">Portfólio de Elite</p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <ToolCard 
          icon="photo_camera"
          title="Garimpo Digital IA"
          desc="Tire uma foto ou digite o nome. Nossa IA reconhece o produto e busca o preço médio no mercado."
          onClick={onOpenSearchByImage}
          isNew
        />
        <ToolCard 
          icon="calculate"
          title="Calculadora Pro Meli"
          desc="Descubra o lucro real após taxas e impostos do Mercado Livre. Gere dossiês profissionais."
          onClick={() => onNavigate('calculator')}
        />
        <ToolCard 
          icon="storefront"
          title="Calculadora Loja Física"
          desc="Para varejistas físicos. Inicie com custos zerados e insira seus impostos e custos operacionais personalizados."
          onClick={() => onNavigate('calculator_physical')}
          color="ml-yellow"
          isNew
        />
        <ToolCard 
          icon="psychology"
          title="Estratégia de Kits"
          desc="Crie anúncios, combos exclusivos e briefings de venda usando IA aplicada ao seu estoque."
          onClick={() => onNavigate('strategy')}
        />
        <ToolCard 
          icon="group_work"
          title="Biblioteca de Ouro"
          desc="Acesse fornecedores validados e produtos minerados com lucro pré-aprovado."
          onClick={() => onNavigate('suppliers')}
        />
        <ToolCard 
          icon="inventory_2"
          title="Meu Portfólio"
          desc="Gerencie seus produtos salvos e simule escalas de investimento."
          onClick={() => onNavigate('portfolio')}
        />
      </div>

      <div className="bg-primary/5 border border-primary/20 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div className="space-y-1 md:space-y-2 text-center md:text-left">
          <h4 className="text-lg md:text-xl font-extrabold">Deseja simular um empréstimo?</h4>
          <p className="text-xs md:text-sm font-bold text-text-light-secondary dark:text-gray-400">Calcule se os juros do Meli valem a pena para seu estoque.</p>
        </div>
        <button 
          onClick={() => onNavigate('loan-calculator')}
          className="px-8 py-3 bg-background-dark text-white text-xs font-black rounded-xl hover:bg-black transition-all uppercase tracking-widest flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">credit_score</span>
          Simular Crédito
        </button>
      </div>
    </main>
  );
};