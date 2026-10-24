
import React, { useState } from 'react';
import type { CalculatorInputs, AdditionalFee } from '../types';

interface InputPanelProps {
  inputs: CalculatorInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculatorInputs>>;
  isEcommerce?: boolean;
  isPhysical?: boolean;
}

const Accordion: React.FC<{ title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="group">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-xl border transition-all duration-300 text-left ${isOpen ? 'border-primary shadow-sm bg-primary/5' : 'border-border-light dark:border-border-dark hover:border-primary/50'}`}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 text-sm font-bold">
          <span className={`material-symbols-outlined text-sm transition-colors ${isOpen ? 'text-primary' : ''}`}>{icon}</span> {title}
        </span>
        <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-gray-400'}`}>expand_more</span>
      </button>
      {isOpen && (
        <div className="px-4 py-4 mt-2 bg-card-light/50 dark:bg-card-dark/50 rounded-xl border border-dashed border-border-light dark:border-border-dark animate-fade-in-up">
          {children}
        </div>
      )}
    </div>
  );
};

export const InputPanel: React.FC<InputPanelProps> = ({ inputs, setInputs, isEcommerce, isPhysical }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'productName' || name === 'category' || name === 'productDescription') {
        setInputs(prev => ({ ...prev, [name]: value }));
        return;
    }
    
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : false;
    
    setInputs(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : parseFloat(value) || 0,
    }));
  };
  
  const handlePercentageChange = (name: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
        ...prev,
        [name]: value / 100,
    }));
  };

  const inputClasses = "form-input w-full rounded-xl border-border-light dark:border-border-dark bg-background-light dark:bg-[#0a141a] focus:ring-4 focus:ring-primary/10 focus:border-primary h-12 text-base transition-all duration-300 transform focus:scale-[1.01] hover:border-primary/50 px-4";

  return (
    <div className="flex flex-col gap-4">
      {/* CARD PRINCIPAL */}
      <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-border-light dark:border-border-dark">
        <h3 className="text-text-light-primary dark:text-text-dark-primary text-xl font-extrabold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">{isPhysical ? 'storefront' : 'edit_note'}</span>
          {isPhysical ? 'Calculadora Loja Física' : 'Calculadora Mercado Livre'}
        </h3>
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <p className="text-xs font-black uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">Nome do Produto</p>
            <input name="productName" value={inputs.productName} onChange={handleInputChange} className={inputClasses} type="text" placeholder={isPhysical ? "Ex: Produto da Loja" : "Ex: Cadeira Gamer XYZ"} />
          </label>
          <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <p className="text-[10px] font-black uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">Custo de Compra (R$)</p>
                <input name="productCost" value={inputs.productCost || ''} onChange={handleInputChange} className={inputClasses} type="number" step="0.01" />
              </label>
               <label className="flex flex-col gap-1.5">
                <p className="text-[10px] font-black uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">{isPhysical ? 'Preço de Prateleira (R$)' : 'Preço de Venda Meli (R$)'}</p>
                <input name="sellPrice" value={inputs.sellPrice || ''} onChange={handleInputChange} className={`${inputClasses} font-black text-primary`} type="number" step="0.01" />
              </label>
          </div>
          
          {isPhysical ? (
             <label className="flex flex-col gap-1.5">
                <p className="text-[10px] font-black uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">Taxa Maquininha / Comissões (%)</p>
                <input name="mlFeePercentage" value={(inputs.mlFeePercentage * 100) || ''} onChange={e => handlePercentageChange('mlFeePercentage', parseFloat(e.target.value) || 0)} className={inputClasses} type="number" placeholder="Digite sua taxa (ex: 3.5)" />
             </label>
          ) : (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-xs font-black uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">Tipo de Anúncio</p>
                <div className="flex gap-2">
                    <button onClick={() => setInputs(p => ({...p, mlFeeType: 'classic', mlFeePercentage: 0.11}))} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${inputs.mlFeeType === 'classic' ? 'bg-primary text-text-light-primary shadow-lg' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>Clássico (11%)</button>
                    <button onClick={() => setInputs(p => ({...p, mlFeeType: 'premium', mlFeePercentage: 0.16}))} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${inputs.mlFeeType === 'premium' ? 'bg-primary text-text-light-primary shadow-lg' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>Premium (16%)</button>
                </div>
              </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Accordion title="Impostos e Divulgação (%)" icon="percent" defaultOpen={true}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-text-light-secondary">Imposto (%)</span>
                      <input name="taxPercentage" value={(inputs.taxPercentage * 100) || ''} onChange={e => handlePercentageChange('taxPercentage', parseFloat(e.target.value) || 0)} className={inputClasses + " mt-1 h-11"} type="number" placeholder="0.0" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-text-light-secondary">{isPhysical ? 'Mkt Local (%)' : 'Ads (%)'}</span>
                      <input name="adsPercentage" value={(inputs.adsPercentage * 100) || ''} onChange={e => handlePercentageChange('adsPercentage', parseFloat(e.target.value) || 0)} className={inputClasses + " mt-1 h-11"} type="number" placeholder="0.0" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-text-light-secondary">Promos (%)</span>
                      <input name="promotionPercentage" value={(inputs.promotionPercentage * 100) || ''} onChange={e => handlePercentageChange('promotionPercentage', parseFloat(e.target.value) || 0)} className={inputClasses + " mt-1 h-11"} type="number" placeholder="0.0" />
                    </label>
                </div>
                <div className="pt-4 border-t border-dashed border-border-light">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase text-text-light-secondary">Retirada / Pró-labore (%)</span>
                        <span className="text-primary font-black text-xs">{Math.round(inputs.proLaborePercentage * 100)}%</span>
                    </div>
                    <input type="range" min="0" max="50" step="1" value={inputs.proLaborePercentage * 100} onChange={e => handlePercentageChange('proLaborePercentage', parseFloat(e.target.value) || 0)} className="w-full h-3 bg-secondary/10 rounded-full appearance-none cursor-pointer accent-primary"/>
                </div>
            </div>
        </Accordion>
        
        <Accordion title={isPhysical ? "Custos de Ocupação e Logística (R$)" : "Frete e Custos Fixos (R$)"} icon="payments" defaultOpen={true}>
            <div className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-text-light-secondary">{isPhysical ? 'Sacola/Emb. (R$)' : 'Emb. (R$)'}</span>
                      <input name="packagingCost" value={inputs.packagingCost || ''} onChange={handleInputChange} className={inputClasses + " mt-1 h-11"} type="number" step="0.01" placeholder="0.00" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-text-light-secondary">{isPhysical ? 'Delivery (R$)' : 'Frete (R$)'}</span>
                      <input name="shippingCost" value={inputs.shippingCost || ''} onChange={handleInputChange} className={inputClasses + " mt-1 h-11"} type="number" step="0.01" placeholder="0.00" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-text-light-secondary">Outros (R$)</span>
                      <input name="otherCost" value={inputs.otherCost || ''} onChange={handleInputChange} className={inputClasses + " mt-1 h-11"} type="number" step="0.01" placeholder="0.00" />
                    </label>
                </div>
                {!isPhysical && (
                    <div className="p-3 bg-background-light dark:bg-background-dark rounded-lg border border-border-light flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isFull" checked={inputs.isFull} onChange={handleInputChange} className="rounded text-primary focus:ring-primary" />
                            <span className="text-[10px] font-black uppercase text-text-light-secondary">Custo Full?</span>
                        </label>
                        {inputs.isFull && (
                            <input name="fullCost" value={inputs.fullCost || ''} onChange={handleInputChange} className="h-8 flex-1 rounded-lg border-border-light text-xs" placeholder="R$ por un." type="number" />
                        )}
                    </div>
                )}
            </div>
        </Accordion>
      </div>
    </div>
  );
};
