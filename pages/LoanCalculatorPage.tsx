
import React, { useState, useMemo } from 'react';
import type { SavedSimulation } from '../types';

interface LoanCalculatorPageProps {
    simulations: SavedSimulation[];
}

interface CalculationResult {
    principal: number;
    purchasableUnits: number;
    totalPaid: number;
    totalInterest: number;
    iofValue: number;
    installmentValue: number;
    annualCompoundInterest: number;
    totalRevenue: number;
    totalNetProfit: number;
    finalNetResult: number;
    verdict: 'lucrative' | 'risk' | 'loss';
}

const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const ResultCard: React.FC<{ icon: string; title: string; children: React.ReactNode; isPrimary?: boolean; }> = ({ icon, title, children, isPrimary }) => (
    <div className={`bg-card-light dark:bg-card-dark p-6 rounded-xl border ${isPrimary ? 'border-primary/50' : 'border-border-light dark:border-border-dark'} shadow-sm`}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className={`material-symbols-outlined ${isPrimary ? 'text-primary' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}>{icon}</span>
            {title}
        </h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const ResultMetric: React.FC<{ label: string; value: string | number; isBold?: boolean; isTotal?: boolean; currency?: boolean; }> = ({ label, value, isBold, isTotal, currency = true }) => (
    <div className={`flex justify-between items-baseline text-sm ${isTotal ? 'pt-2 border-t border-dashed border-border-light dark:border-border-dark' : ''}`}>
        <span className={`${isTotal ? 'font-bold' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}>{label}</span>
        <span className={`font-bold ${isBold ? 'text-lg' : ''}`}>{typeof value === 'number' && currency ? formatCurrency(value) : value}</span>
    </div>
);

const VerdictCard: React.FC<{ result: CalculationResult }> = ({ result }) => {
    const config = {
        lucrative: {
            title: "Operação Lucrativa",
            icon: "check_circle",
            color: "text-primary",
            bgColor: "bg-primary/10",
            borderColor: "border-primary/50",
            description: "O lucro gerado pela venda dos produtos é superior ao custo do empréstimo. É um bom indicativo para prosseguir."
        },
        risk: {
            title: "Risco Elevado",
            icon: "warning",
            color: "text-yellow-400",
            bgColor: "bg-yellow-400/10",
            borderColor: "border-yellow-400/50",
            description: "A operação gera lucro, mas a margem sobre o custo do empréstimo é pequena. Qualquer variação nos custos ou vendas pode levar a prejuízo."
        },
        loss: {
            title: "Prejuízo à Vista",
            icon: "cancel",
            color: "text-red-500",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/50",
            description: "O custo do empréstimo é maior do que o lucro que a venda dos produtos pode gerar. Esta operação não é recomendada."
        }
    };
    const currentConfig = config[result.verdict];

    return (
         <div className={`p-6 rounded-xl border-2 border-dashed ${currentConfig.borderColor} ${currentConfig.bgColor}`}>
            <div className="flex flex-col items-center text-center">
                 <span className={`material-symbols-outlined text-6xl ${currentConfig.color}`}>{currentConfig.icon}</span>
                 <h2 className={`text-2xl font-black mt-2 ${currentConfig.color}`}>{currentConfig.title}</h2>
                 <p className="text-3xl font-bold my-4">{formatCurrency(result.finalNetResult)}</p>
                 <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary max-w-md">{currentConfig.description}</p>
            </div>
         </div>
    )
}

export const LoanCalculatorPage: React.FC<LoanCalculatorPageProps> = ({ simulations }) => {
    const [selectedSkuId, setSelectedSkuId] = useState('');
    const [amountToReceive, setAmountToReceive] = useState('1100');
    const [monthlyInterestRate, setMonthlyInterestRate] = useState('5.9');
    const [iofRate, setIofRate] = useState('3.0');
    const [installments, setInstallments] = useState('12');
    const [error, setError] = useState<string | null>(null);

    const selectedSku = useMemo(() => {
        return simulations.find(sim => sim.id === selectedSkuId);
    }, [selectedSkuId, simulations]);

    const result: CalculationResult | null = useMemo(() => {
        setError(null);
        const principal = parseFloat(amountToReceive);
        const monthlyRatePct = parseFloat(monthlyInterestRate);
        const iofRatePct = parseFloat(iofRate);
        const numInstallments = parseInt(installments, 10);

        if (!selectedSku) {
            setError("Por favor, selecione um produto do seu portfólio.");
            return null;
        }

        if (isNaN(principal) || principal <= 0 || isNaN(monthlyRatePct) || monthlyRatePct < 0 || isNaN(iofRatePct) || iofRatePct < 0 || isNaN(numInstallments) || numInstallments <= 0) {
            setError("Por favor, preencha todos os campos com valores válidos e positivos.");
            return null;
        }
        
        const productCost = selectedSku.inputs.productCost;
        if (productCost <= 0) {
            setError("O produto selecionado tem um custo de R$0,00 e não pode ser usado para esta simulação.");
            return null;
        }
        
        const monthlyRate = monthlyRatePct / 100;
        const iofValue = principal * (iofRatePct / 100);
        const financedAmount = principal + iofValue;
        
        // Tabela Price formula for installments
        let installmentValue = 0;
        if (monthlyRate > 0) {
            installmentValue = (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, numInstallments)) / (Math.pow(1 + monthlyRate, numInstallments) - 1);
        } else {
             installmentValue = financedAmount / numInstallments;
        }
       
        const totalPaid = installmentValue * numInstallments;
        const totalInterest = totalPaid - financedAmount;
        const annualCompoundInterest = (Math.pow(1 + monthlyRate, 12) - 1) * 100;

        const purchasableUnits = Math.floor(principal / productCost);
        const totalNetProfit = purchasableUnits * selectedSku.outputs.netProfitPerUnit;
        const totalLoanCost = totalInterest + iofValue;
        const finalNetResult = totalNetProfit - totalLoanCost;
        
        let verdict: 'lucrative' | 'risk' | 'loss' = 'loss';
        if (finalNetResult > 0) {
            if (totalLoanCost > 0 && finalNetResult < (totalLoanCost * 0.2)) {
                 verdict = 'risk';
            } else {
                 verdict = 'lucrative';
            }
        }
        
        return {
            principal,
            purchasableUnits,
            totalPaid,
            totalInterest,
            iofValue,
            installmentValue,
            annualCompoundInterest,
            totalRevenue: purchasableUnits * selectedSku.inputs.sellPrice,
            totalNetProfit,
            finalNetResult,
            verdict
        };
    }, [amountToReceive, monthlyInterestRate, iofRate, installments, selectedSku]);
    
    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">Calculadora de Empréstimo Meli</h1>
                <p className="mt-1 text-text-light-secondary dark:text-text-dark-secondary">
                    Descubra se vale a pena pegar um empréstimo do Mercado Livre para investir em um produto específico do seu portfólio.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-4">
                     <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark space-y-4">
                        <label className="block">
                            <span className="text-sm font-semibold text-text-light-secondary dark:text-text-dark-secondary">1. Selecione o Produto para Comprar</span>
                            <select value={selectedSkuId} onChange={(e) => setSelectedSkuId(e.target.value)} className="mt-1 w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-12 text-base px-4">
                                <option value="">Selecione um produto...</option>
                                {simulations.map(sim => (<option key={sim.id} value={sim.id}>{sim.name} ({formatCurrency(sim.inputs.productCost)}/un)</option>))}
                            </select>
                        </label>
                         <label className="block">
                            <span className="text-sm font-semibold text-text-light-secondary dark:text-text-dark-secondary">2. Quanto você quer receber? (R$)</span>
                             <input type="number" value={amountToReceive} onChange={e => setAmountToReceive(e.target.value)} className="mt-1 w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-12 text-base px-4 font-bold" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-semibold text-text-light-secondary dark:text-text-dark-secondary">3. Juros Mensais (%)</span>
                            <div className="flex items-center gap-3 mt-1">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={monthlyInterestRate}
                                    onChange={e => setMonthlyInterestRate(e.target.value)}
                                    className="w-28 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-12 text-base px-4 font-bold"
                                />
                                <input
                                    type="range"
                                    min="0.1"
                                    max="25"
                                    step="0.1"
                                    value={monthlyInterestRate}
                                    onChange={e => setMonthlyInterestRate(e.target.value)}
                                    className="w-full h-2 bg-[#cfe7d9] dark:bg-[#2a3d32] rounded-full appearance-none cursor-pointer accent-primary flex-1"
                                />
                            </div>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="flex items-center gap-1 text-sm font-semibold text-text-light-secondary dark:text-text-dark-secondary">
                                    4. IOF Total (%)
                                    <span className="material-symbols-outlined text-xs cursor-help" title="Imposto sobre Operações Financeiras. Taxa única cobrada no início sobre o valor financiado.">help</span>
                                </span>
                                <input type="number" value={iofRate} onChange={e => setIofRate(e.target.value)} className="mt-1 w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-12 text-base px-4 font-bold" />
                            </label>
                             <label className="block">
                                <span className="text-sm font-semibold text-text-light-secondary dark:text-text-dark-secondary">5. Parcelas</span>
                                <input type="number" value={installments} onChange={e => setInstallments(e.target.value)} className="mt-1 w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-12 text-base px-4 font-bold" />
                            </label>
                        </div>
                        {error && <p className="text-red-500 text-sm font-semibold text-center pt-2">{error}</p>}
                    </div>
                     {selectedSku && (
                        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border-2 border-dashed border-primary/20 flex items-center gap-4">
                             {selectedSku.inputs.imageUrl ? (
                                <img src={selectedSku.inputs.imageUrl} alt={selectedSku.name} className="size-16 rounded-lg object-cover border border-border-light dark:border-border-dark" />
                            ) : (
                                 <div className="size-16 rounded-lg bg-background-light dark:bg-background-dark flex items-center justify-center border border-dashed border-border-light dark:border-border-dark flex-shrink-0">
                                    <span className="material-symbols-outlined text-3xl text-text-light-secondary dark:text-text-dark-secondary">inventory_2</span>
                                </div>
                            )}
                            <div>
                                <h3 className="text-base font-bold">{selectedSku.name}</h3>
                                <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">Lucro Líquido: <span className="font-bold text-primary">{formatCurrency(selectedSku.outputs.netProfitPerUnit)}</span> /un</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-8">
                     {result ? (
                        <div className="space-y-6 animate-fade-in-up">
                            <VerdictCard result={result} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark space-y-2">
                                        <ResultMetric label="Você recebe" value={result.principal} />
                                        <ResultMetric label="Total de Juros" value={result.totalInterest} />
                                        <ResultMetric label="IOF" value={result.iofValue} />
                                        <ResultMetric label="Você Paga" value={result.totalPaid} isTotal />
                                    </div>
                                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark text-center">
                                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Você pagará</p>
                                        <p className="text-2xl font-bold">{installments}x de {formatCurrency(result.installmentValue)}</p>
                                    </div>
                                     <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark space-y-2">
                                         <ResultMetric label="Juros mensais" value={`${monthlyInterestRate}%`} currency={false} />
                                         <ResultMetric label="Juros anuais (composto)" value={`${result.annualCompoundInterest.toFixed(2)}%`} currency={false} />
                                         <ResultMetric label="IOF" value={`${iofRate}%`} currency={false} />
                                         <ResultMetric label="Total emprestado" value={result.totalPaid} isTotal />
                                     </div>
                                </div>
                                
                                <ResultCard icon="store" title="Potencial da Operação" isPrimary>
                                    <ResultMetric label="Unidades Compráveis" value={`${result.purchasableUnits} un`} currency={false} />
                                    <ResultMetric label="Receita Bruta Total" value={result.totalRevenue} />
                                    <ResultMetric label="Lucro Líquido da Venda" value={result.totalNetProfit} isBold />
                                </ResultCard>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-card-light dark:bg-card-dark rounded-xl border border-dashed border-border-light dark:border-border-dark p-6">
                           <span className="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary">query_stats</span>
                           <h2 className="text-xl font-bold mt-4">Aguardando Simulação</h2>
                           <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1 text-center">Preencha os dados à esquerda para ver a análise de viabilidade.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
