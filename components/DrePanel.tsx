import React from 'react';
import type { DRE, CalculatorInputs, CalculationOutputs, Supplier, UserSettings, SavedReport } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface DrePanelProps {
    dre: DRE;
    outputs: CalculationOutputs;
    onOpenInfoModal: () => void;
    inputs: CalculatorInputs;
    settings: UserSettings;
    activeSupplier?: Supplier;
    onSaveReportLog?: (report: SavedReport) => void;
    onSave?: () => void;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const formatPercentage = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(value);

const DreRow: React.FC<{ 
    label: string; 
    value: number; 
    percentage: string; 
    isNegative?: boolean; 
    isTotal?: boolean;
}> = ({ label, value, percentage, isNegative, isTotal }) => {
    const isActuallyNegative = value < 0 || (isNegative && value !== 0);
    const displayValue = Math.abs(value);
    
    return (
        <tr className={`border-b border-gray-100 dark:border-gray-800 ${isTotal ? 'bg-gray-50/50 dark:bg-white/5 font-black' : ''}`}>
            <td className={`px-2 md:px-4 py-2.5 md:py-3 text-[11px] md:text-xs font-bold ${isTotal ? 'text-text-light-primary' : isNegative ? 'text-red-500' : 'text-text-light-primary dark:text-gray-300'}`}>
                {label}
            </td>
            <td className="px-2 md:px-4 py-2.5 md:py-3 text-right text-[9px] md:text-[10px] font-black text-gray-400">
                {percentage}
            </td>
            <td className={`px-2 md:px-4 py-2.5 md:py-3 text-right text-[11px] md:text-xs font-black ${isTotal ? 'text-primary' : isActuallyNegative ? 'text-gray-600 dark:text-gray-400' : ''}`}>
                {isActuallyNegative ? `- ${formatCurrency(displayValue)}` : formatCurrency(displayValue)}
            </td>
        </tr>
    );
};

export const DrePanel: React.FC<DrePanelProps> = ({ dre, outputs, onOpenInfoModal, inputs, settings, activeSupplier, onSaveReportLog, onSave }) => {
    
    const calcPct = (val: number) => {
        if (dre.grossRevenue === 0) return '0.0%';
        return `${((Math.abs(val) / dre.grossRevenue) * 100).toFixed(1)}%`;
    };

    const handleExportExcel = () => {
        const data = [
            ["RELATÓRIO ESTRATÉGICO / INTELIGÊNCIA DE DADOS"],
            ["Produto:", inputs.productName],
            ["Data:", new Date().toLocaleDateString('pt-BR')],
            [],
            ["1. FONTE E LINKS"],
            ["Fornecedor", activeSupplier?.name || "Base Garimpo"],
            ["Link Original", inputs.productUrl || activeSupplier?.website || "N/A"],
            [],
            ["2. DEMONSTRATIVO DE RESULTADOS (DRE)"],
            ["Descrição", "Representatividade (%)", "Valor Unitário (R$)"],
            ["Receita Bruta", "100%", dre.grossRevenue],
            ["Impostos", calcPct(dre.taxes), dre.taxes],
            ["Taxas Mercado Livre", calcPct(dre.mlFee), dre.mlFee],
            ["Ads / Visibilidade", calcPct(dre.ads), dre.ads],
            ["Promoções", calcPct(dre.promotion), dre.promotion],
            ["Pró-labore", calcPct(dre.proLabore), dre.proLabore],
            ["Custos Fixos / Logística", calcPct(dre.fixedCosts), dre.fixedCosts],
            ["Custo de Compra (Produto)", calcPct(dre.productCost), dre.productCost],
            ["LUCRO LÍQUIDO REAL", formatPercentage(outputs.netMarginPercentage), dre.netProfit],
            [],
            ["3. MÉTRICAS DE PERFORMANCE"],
            ["ROI", formatPercentage(outputs.roiPercentage)],
            ["Break-even Price", outputs.breakEvenPrice]
        ];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inteligência de Dados");
        XLSX.writeFile(wb, `Relatorio_Estrategico_${inputs.productName.replace(/ /g, '_')}.xlsx`);
    };

    const handleExportPdf = () => {
        const doc = new jsPDF() as any;
        const query = encodeURIComponent(inputs.productName);
        
        // Header
        doc.setFillColor(43, 238, 124);
        doc.rect(0, 0, 210, 35, 'F');
        doc.setTextColor(13, 27, 19);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text("RELATÓRIO ESTRATÉGICO / INTELIGÊNCIA DE DADOS", 15, 20);
        doc.setFontSize(9);
        doc.text(`PRODUTO: ${inputs.productName.toUpperCase()}`, 15, 28);
        doc.text(`DATA: ${new Date().toLocaleDateString('pt-BR')}`, 170, 28);

        // FORNECEDOR E LINKS ATIVOS
        doc.setTextColor(40);
        doc.setFontSize(12);
        doc.text("1. FONTE DE ORIGEM E LINKS EM TEMPO REAL", 15, 50);
        
        const supplierTable = [
            ["Loja/Fornecedor", activeSupplier?.name || "Fornecedor da Base Garimpo"],
            ["Link do Fornecedor", inputs.productUrl || activeSupplier?.website || "Acessar via Hub"],
            ["Buscar no Mercado Livre", `https://lista.mercadolivre.com.br/${query}`],
            ["Buscar na Amazon Brasil", `https://www.amazon.com.br/s?k=${query}`],
            ["Buscar na Shopee", `https://shopee.com.br/search?keyword=${query}`]
        ];

        doc.autoTable({
            startY: 55,
            body: supplierTable,
            theme: 'plain',
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: { 
                0: { fontStyle: 'bold', width: 45 },
                1: { textColor: [0, 0, 255] } 
            }
        });

        // DRE
        let currentY = (doc as any).lastAutoTable.finalY + 15;
        doc.text("2. DEMONSTRATIVO DE RESULTADOS (DRE UNITÁRIO)", 15, currentY);

        const dreTable = [
            ["RECEITA BRUTA", "100%", formatCurrency(dre.grossRevenue)],
            ["Impostos", calcPct(dre.taxes), `-${formatCurrency(Math.abs(dre.taxes))}`],
            ["Taxas ML", calcPct(dre.mlFee), `-${formatCurrency(Math.abs(dre.mlFee))}`],
            ["Custo Visibilidade (ACOS)", calcPct(dre.ads), `-${formatCurrency(Math.abs(dre.ads))}`],
            ["Custos Fixos/Logística", calcPct(dre.fixedCosts), `-${formatCurrency(Math.abs(dre.fixedCosts))}`],
            ["CUSTO DE COMPRA", calcPct(dre.productCost), `-${formatCurrency(Math.abs(dre.productCost))}`],
            ["LUCRO LÍQUIDO REAL", formatPercentage(outputs.netMarginPercentage), formatCurrency(dre.netProfit)]
        ];

        doc.autoTable({
            startY: currentY + 5,
            head: [['DESCRIÇÃO', 'REP. (%)', 'UNIT. (R$)']],
            body: dreTable,
            theme: 'grid',
            headStyles: { fillColor: [13, 27, 19] },
            didParseCell: (data: any) => {
                if (data.row.index === 6) {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.fillColor = [43, 238, 124];
                }
            }
        });

        doc.save(`Relatorio_Estrategico_${inputs.productName.replace(/ /g, '_')}.pdf`);

        // SALVAR LOG DE RELATÓRIO NO PORTFÓLIO
        if (onSaveReportLog) {
            onSaveReportLog({
                id: `rep-${Date.now()}`,
                productName: inputs.productName,
                category: inputs.category || 'Geral',
                createdAt: new Date().toISOString(),
                inputsSnapshot: inputs,
                outputsSnapshot: outputs
            });
        }
    };

    return (
        <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                <h3 className="font-black text-[9px] md:text-[10px] uppercase tracking-widest text-text-light-primary">Inteligência de Dados / DRE</h3>
                <button onClick={onOpenInfoModal} className="text-gray-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">help</span></button>
            </div>
            
            <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left min-w-[300px]">
                    <thead className="bg-gray-50/50 dark:bg-white/5 text-[8px] md:text-[9px] uppercase text-gray-400 font-black">
                        <tr>
                            <th className="px-2 md:px-4 py-3">Descrição</th>
                            <th className="px-2 md:px-4 py-3 text-right">Rep. (%)</th>
                            <th className="px-2 md:px-4 py-3 text-right">Unit. (R$)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        <DreRow label="Receita Bruta" value={dre.grossRevenue} percentage="100.0%" />
                        <DreRow label="Impostos" value={dre.taxes} percentage={calcPct(dre.taxes)} isNegative />
                        <DreRow label="Taxas ML" value={dre.mlFee} percentage={calcPct(dre.mlFee)} isNegative />
                        <DreRow label="Custo Visibilidade" value={dre.ads} percentage={calcPct(dre.ads)} isNegative />
                        <DreRow label="Promoções" value={dre.promotion} percentage={calcPct(dre.promotion)} isNegative />
                        <DreRow label="Pró-labore" value={dre.proLabore} percentage={calcPct(dre.proLabore)} isNegative />
                        <DreRow label="Custos Fixos" value={dre.fixedCosts} percentage={calcPct(dre.fixedCosts)} isNegative />
                        <DreRow label="Custo de Compra" value={dre.productCost} percentage={calcPct(dre.productCost)} isNegative />
                        <DreRow label="LUCRO LÍQUIDO" value={dre.netProfit} percentage={formatPercentage(outputs.netMarginPercentage)} isTotal />
                    </tbody>
                </table>
            </div>

            <div className="p-3 md:p-4 bg-white dark:bg-card-dark border-t border-border-light space-y-3">
                {onSave && (
                     <button onClick={onSave} className="w-full py-4 bg-primary text-text-light-primary rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        <span className="material-symbols-outlined text-base">save</span>
                        Salvar Produto no Portfólio
                    </button>
                )}
                <div className="flex gap-2">
                    <button onClick={handleExportPdf} className="flex-1 py-2.5 md:py-3 bg-primary text-text-light-primary rounded-xl flex items-center justify-center gap-2 font-black text-[9px] md:text-[10px] uppercase shadow-lg hover:scale-105 transition-all">
                        <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                        Dossiê PDF
                    </button>
                    <button onClick={handleExportExcel} className="flex-1 py-2.5 md:py-3 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 font-black text-[9px] md:text-[10px] uppercase shadow-lg hover:scale-105 transition-all">
                        <span className="material-symbols-outlined text-sm">table_view</span>
                        Excel
                    </button>
                </div>
                <p className="text-[8px] text-center text-gray-400 font-bold uppercase mt-2 tracking-widest italic leading-tight">
                    Relatório salvo automaticamente no portfólio.
                </p>
            </div>
        </div>
    );
};