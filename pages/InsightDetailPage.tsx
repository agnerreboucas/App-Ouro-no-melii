
import React, { useState, useEffect, useMemo } from 'react';
import type { SavedInsight } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import { promptCategories } from '../data/promptTemplates';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDFWithAutoTable;
};

interface InsightDetailPageProps {
    insight: SavedInsight;
    onBack: () => void;
    onUpdate: (insightId: string, newContent: string) => void;
    onRefine: (insight: SavedInsight) => void;
    onUseAsBase: (insight: SavedInsight, templateId: string) => void;
}

const UseAsBaseModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (templateId: string) => void;
}> = ({ isOpen, onClose, onSelectTemplate }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-lg font-bold">Usar como Base para...</h2>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Selecione o tipo de conteúdo a ser gerado usando o insight atual como briefing.</p>
                </div>
                <div className="p-4 overflow-y-auto space-y-4">
                     <div>
                        <h3 className="text-xs font-bold uppercase text-text-light-secondary dark:text-text-dark-secondary mb-2">✨ Ideias Rápidas</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {promptCategories.quickIdeas.map(template => (
                                <button key={template.id} onClick={() => onSelectTemplate(template.id)} className="flex items-center gap-2 p-3 text-left text-sm font-bold w-full rounded-lg hover:bg-primary/10 transition-colors">
                                    <span className="material-symbols-outlined text-primary text-base">{template.icon}</span>
                                    {template.name}
                                </button>
                            ))}
                        </div>
                     </div>
                     <div>
                        <h3 className="text-xs font-bold uppercase text-text-light-secondary dark:text-text-dark-secondary mb-2">🚀 Marketing Avançado</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {promptCategories.advancedMarketing.map(template => (
                                <button key={template.id} onClick={() => onSelectTemplate(template.id)} className="flex items-center gap-2 p-3 text-left text-sm font-bold w-full rounded-lg hover:bg-primary/10 transition-colors">
                                     <span className="material-symbols-outlined text-primary text-base">{template.icon}</span>
                                    {template.name}
                                </button>
                            ))}
                        </div>
                     </div>
                </div>
                 <div className="p-4 border-t border-border-light dark:border-border-dark flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-text-light-primary dark:text-text-dark-primary font-bold rounded-lg hover:opacity-90 transition-opacity text-sm">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

const parseMarkdownToTableData = (markdown: string): { title: string; content: string }[] => {
    if (!markdown) return [];

    const sections = markdown.split(/\n(?=\*\*|#)/).filter(s => s.trim() !== '');
    
    if (sections.length <= 1 && !markdown.match(/^(\*\*|#)/)) {
        return [{ title: 'Conteúdo Principal', content: markdown.trim() }];
    }

    return sections.map(section => {
        const lines = section.trim().split('\n');
        let title = lines[0].replace(/(\*\*|#+\s*)/g, '').replace(/:$/, '').trim();
        let content = lines.slice(1).join('\n').trim();

        if (!content && lines.length > 0) {
            const match = section.match(/(?:\*\*|#+\s*)(.*?):(.*)/s);
            if (match) {
                title = match[1].trim();
                content = match[2].trim();
            }
        }
        
        return { title, content };
    }).filter(item => item.title || item.content);
};

export const InsightDetailPage: React.FC<InsightDetailPageProps> = ({ insight, onBack, onUpdate, onRefine, onUseAsBase }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(insight.content);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setEditedContent(insight.content);
        setIsEditing(false);
    }, [insight]);

    const handleSave = () => {
        onUpdate(insight.id, editedContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(insight.content);
        setIsEditing(false);
    };

    const handleSelectTemplate = (templateId: string) => {
        onUseAsBase(insight, templateId);
        setIsModalOpen(false);
    };

    const tableData = useMemo(() => parseMarkdownToTableData(insight.content), [insight.content]);

    const handleDownloadPdf = () => {
        const doc = new jsPDF() as jsPDFWithAutoTable;
        doc.text(`Estratégia: ${insight.name}`, 14, 15);
        doc.autoTable({
            head: [['Parte da Estratégia', 'Conteúdo Gerado']],
            body: tableData.map(row => [row.title, row.content]),
            startY: 20,
            styles: {
                cellPadding: 3,
                fontSize: 10,
            },
            headStyles: {
                fillColor: [43, 238, 124]
            }
        });
        doc.save(`${insight.name.replace(/ /g, '_')}.pdf`);
    };
    
    const handleDownloadXlsx = () => {
        const escapeCsvCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
        const headers = ['Parte da Estratégia', 'Conteúdo Gerado'];
        const rows = tableData.map(row => [escapeCsvCell(row.title), escapeCsvCell(row.content)]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
        
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `${insight.name.replace(/ /g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadWord = () => {
        let htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>Export HTML to Word</title></head>
            <body>
            <h1>${insight.name}</h1>
            <table border="1">
            <thead>
                <tr>
                    <th>Parte da Estratégia</th>
                    <th>Conteúdo Gerado</th>
                </tr>
            </thead>
            <tbody>
        `;
        tableData.forEach(row => {
            htmlContent += `<tr><td>${row.title}</td><td>${row.content.replace(/\n/g, '<br/>')}</td></tr>`;
        });
        htmlContent += '</tbody></table></body></html>';
        
        const blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
        });
        
        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(htmlContent);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${insight.name.replace(/ /g, '_')}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <>
            <main className="max-w-4xl mx-auto p-6 flex flex-col gap-6 w-full">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{insight.name}</h1>
                        <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
                            Insight do tipo "{insight.type}" para "{insight.associatedSkuName}", salvo em {new Date(insight.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                     <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary text-sm font-bold rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-all">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Voltar
                    </button>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                     <div className="flex items-center flex-wrap justify-between gap-4 mb-6">
                         <h2 className="text-xl font-bold">Conteúdo da Estratégia</h2>
                         {isEditing ? (
                             <div className="flex justify-end gap-2">
                                <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-text-light-primary dark:text-text-dark-primary font-bold rounded-lg hover:opacity-90 transition-opacity">
                                    Cancelar
                                </button>
                                <button onClick={handleSave} className="px-6 py-2 bg-primary text-text-light-primary font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">save</span>
                                    Salvar Alterações
                                </button>
                            </div>
                         ) : (
                             <div className="flex items-center flex-wrap justify-end gap-2">
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-2 bg-primary/20 text-primary text-xs font-bold rounded-lg border border-primary/30 hover:bg-primary/30 transition-all">
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    Editar
                                </button>
                                <button onClick={() => onRefine(insight)} className="flex items-center gap-2 px-3 py-2 bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary text-xs font-bold rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-all">
                                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                    Gerar Nova Versão (IA)
                                </button>
                                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-primary text-text-light-primary text-xs font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                                    <span className="material-symbols-outlined text-sm">lightbulb</span>
                                    Usar como Base...
                                </button>
                             </div>
                         )}
                     </div>

                    {isEditing ? (
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full h-[60vh] p-3 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary text-base font-mono"
                            aria-label="Editor de conteúdo do insight"
                        />
                    ) : (
                        <div>
                            {insight.generatedImageUrl && (
                                <div className="mb-6">
                                    <img src={insight.generatedImageUrl} alt={`Imagem para ${insight.name}`} className="w-full max-w-lg mx-auto rounded-lg border border-border-light dark:border-border-dark" />
                                </div>
                            )}
                            <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark">
                                 <table className="w-full text-sm text-left">
                                    <thead className="bg-background-light dark:bg-background-dark text-xs uppercase text-text-light-secondary dark:text-text-dark-secondary">
                                        <tr>
                                            <th className="px-4 py-3 w-1/4">Parte da Estratégia</th>
                                            <th className="px-4 py-3">Conteúdo Gerado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                        {tableData.map((row, index) => (
                                            <tr key={index} className="bg-card-light dark:bg-card-dark">
                                                <td className="px-4 py-3 font-bold align-top">{row.title}</td>
                                                <td className="px-4 py-3 prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown>{row.content}</ReactMarkdown></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-2 justify-end">
                                <button onClick={handleDownloadXlsx} className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-xs font-bold rounded-lg border border-border-light dark:border-border-dark"><span className="material-symbols-outlined text-sm">table_rows</span> Baixar XLSX</button>
                                <button onClick={handleDownloadWord} className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-xs font-bold rounded-lg border border-border-light dark:border-border-dark"><span className="material-symbols-outlined text-sm">description</span> Baixar Word</button>
                                <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-xs font-bold rounded-lg border border-border-light dark:border-border-dark"><span className="material-symbols-outlined text-sm">picture_as_pdf</span> Baixar PDF</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <UseAsBaseModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectTemplate={handleSelectTemplate}
            />
        </>
    );
};
