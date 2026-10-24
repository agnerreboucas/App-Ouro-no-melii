
import React from 'react';

interface CalculationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormulaItem: React.FC<{ icon:string; title: string; description: string; formula: string }> = ({ icon, title, description, formula }) => (
    <section>
        <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-primary/10 text-text-light-secondary dark:text-text-dark-secondary flex items-center justify-center">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <div className="bg-background-light dark:bg-background-dark/50 p-4 rounded-xl border border-border-light dark:border-border-dark">
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-3 leading-relaxed">{description}</p>
            <div className="bg-card-light dark:bg-card-dark p-3 rounded border border-border-light dark:border-border-dark font-mono text-sm">
                <span className="font-bold text-primary">Fórmula:</span> {formula}
            </div>
        </div>
    </section>
);

export const CalculationInfoModal: React.FC<CalculationInfoModalProps> = ({ isOpen, onClose }) => {
  return (
    <>
        {isOpen && <div className="fixed inset-0 bg-[#0d1b13]/40 backdrop-blur-sm z-40" onClick={onClose}></div>}
        <div 
            className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-card-light dark:bg-card-dark shadow-2xl z-50 overflow-y-auto flex flex-col border-l border-border-light dark:border-border-dark transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
        >
            <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between sticky top-0 bg-card-light dark:bg-card-dark z-10">
                <div className="flex flex-col">
                    <h1 id="drawer-title" className="text-2xl font-bold tracking-tight">Como calculamos?</h1>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-medium">Memória de cálculo detalhada para transparência total.</p>
                </div>
                <button onClick={onClose} className="size-10 flex items-center justify-center rounded-lg bg-[#e7f3ec] dark:bg-[#2a3c31] hover:bg-primary/20 transition-colors" aria-label="Fechar">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div className="flex-1 p-6 space-y-8">
                <FormulaItem 
                    icon="percent"
                    title="% Total (Custos Variáveis)"
                    description="Soma de todas as porcentagens que incidem diretamente sobre o valor da venda bruta."
                    formula="Taxa ML + Imposto + Visibilidade + Frete(%)"
                />
                <FormulaItem 
                    icon="account_balance_wallet"
                    title="Lucro Líquido"
                    description="O que sobra de fato no seu bolso após deduzir todos os custos operacionais."
                    formula="Venda - (Venda * %Total) - Custos Fixos - Custo Produto"
                />
                 <FormulaItem 
                    icon="sell"
                    title="Promoção Central"
                    description="Refere-se a descontos oferecidos pela própria plataforma (ex: Mercado Livre) em que o vendedor participa, dividindo o custo do desconto."
                    formula="Preço de Venda * % Promoção"
                />
                <FormulaItem 
                    icon="pie_chart"
                    title="Pró-labore"
                    description="Um valor percentual reservado como remuneração do sócio/vendedor. É o 'salário' que você retira da venda de cada unidade."
                    formula="Preço de Venda * % Pró-labore"
                />
                <FormulaItem 
                    icon="balance"
                    title="Break-even (Ponto de Equilíbrio)"
                    description="O preço mínimo de venda para que você não tenha prejuízo, cobrindo todos os custos."
                    formula="Custos Fixos / (1 - %Total)"
                />
                 <FormulaItem 
                    icon="shopping_cart_checkout"
                    title="Preço Máximo de Compra"
                    description="Calcula o valor limite que você pode pagar no fornecedor para manter sua margem alvo."
                    formula="Preço * (1 - %Total - Margem%)"
                />
            </div>

            <div className="p-6 border-t border-border-light dark:border-border-dark">
                <button onClick={onClose} className="w-full bg-primary hover:opacity-90 text-text-light-primary font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    <span>Entendi, fechar</span>
                </button>
            </div>
        </div>
    </>
  );
};