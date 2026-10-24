
import React, { useState, useCallback } from 'react';

export const ImportPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if(e.dataTransfer.files[0].type === "text/csv" || e.dataTransfer.files[0].name.endsWith('.csv')) {
                setFile(e.dataTransfer.files[0]);
            } else {
                alert("Por favor, envie apenas arquivos no formato .CSV");
            }
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);
    
    const handleImport = () => {
        if (!file) {
            alert("Por favor, selecione um arquivo para importar.");
            return;
        }
        alert(`Arquivo "${file.name}" pronto para ser processado. A lógica de importação será implementada aqui.`);
    };

    const handleDownloadTemplate = () => {
        const header = "nome_produto,custo,preco_venda,taxa_ml_pct,imposto_pct,ads_pct,custo_embalagem,custo_frete,outros_custos\n";
        const example1 = "Fone de Ouvido TWS Pro,55.00,149.90,16,8,10,2.50,4.00,0\n";
        const example2 = "Garrafa Térmica 1L,38.50,89.00,11,6,12,3.00,5.00,0.50\n";
        const example3 = "Kit 10 Pincéis Maquiagem,25.00,79.99,11,7,15,2.00,3.50,0\n";
        
        const csvContent = header + example1 + example2 + example3;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "exemplo_importacao_produtos.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">Importar Produtos</h1>
                <p className="mt-1 text-text-light-secondary dark:text-text-dark-secondary">
                    Adicione múltiplos produtos de uma só vez enviando uma planilha no formato CSV.
                </p>
            </div>
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                 <h2 className="text-xl font-bold">1. Envie seu arquivo .CSV</h2>
                 <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">Arraste seu arquivo para a área abaixo ou clique para selecionar.</p>

                 <div className={`mt-6 p-8 border-2 border-dashed rounded-xl text-center transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50'}`}
                     onDrop={handleDrop}
                     onDragOver={handleDragOver}
                     onDragEnter={handleDragEnter}
                     onDragLeave={handleDragLeave}
                 >
                     <input 
                         type="file" 
                         id="fileUpload" 
                         className="hidden" 
                         accept=".csv"
                         onChange={handleFileChange}
                     />
                     <span className="material-symbols-outlined text-5xl text-text-light-secondary dark:text-text-dark-secondary">upload_file</span>
                     <p className="mt-4 font-bold">Arraste e solte seu arquivo aqui</p>
                     <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">ou</p>
                     <label htmlFor="fileUpload" className="mt-2 inline-block cursor-pointer font-bold text-primary hover:underline">
                         selecione um arquivo do seu computador
                     </label>
                     <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-2">Apenas arquivos .CSV são suportados. O sistema não aceita .XLSX (Excel) diretamente.</p>
                 </div>
                 
                 {file && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg flex items-center justify-between animate-fade-in-up">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">description</span>
                            <span className="font-bold text-sm">{file.name}</span>
                        </div>
                         <button onClick={() => setFile(null)} className="text-text-light-secondary dark:text-text-dark-secondary hover:text-red-500" title="Remover arquivo">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                 )}

                 <div className="mt-8">
                    <h2 className="text-xl font-bold">2. Verifique a estrutura</h2>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-2">
                        Sua planilha deve ter a seguinte estrutura de colunas. O arquivo .CSV baixado abrirá corretamente no Excel, Google Sheets ou outro editor de planilhas.
                    </p>
                    <div className="mt-4 overflow-x-auto rounded-lg border border-border-light dark:border-border-dark">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-background-light dark:bg-background-dark text-xs uppercase text-text-light-secondary dark:text-text-dark-secondary">
                                <tr>
                                    <th className="px-4 py-2">nome_produto</th>
                                    <th className="px-4 py-2">custo</th>
                                    <th className="px-4 py-2">preco_venda</th>
                                    <th className="px-4 py-2">taxa_ml_pct</th>
                                    <th className="px-4 py-2">imposto_pct</th>
                                    <th className="px-4 py-2">... (outras colunas)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                <tr className="bg-card-light dark:bg-card-dark">
                                    <td className="px-4 py-2 font-mono text-xs">Fone de Ouvido TWS Pro</td>
                                    <td className="px-4 py-2 font-mono text-xs">55.00</td>
                                    <td className="px-4 py-2 font-mono text-xs">149.90</td>
                                    <td className="px-4 py-2 font-mono text-xs">16</td>
                                    <td className="px-4 py-2 font-mono text-xs">8</td>
                                    <td className="px-4 py-2 font-mono text-xs">...</td>
                                </tr>
                                 <tr className="bg-card-light dark:bg-card-dark">
                                    <td className="px-4 py-2 font-mono text-xs">Garrafa Térmica 1L</td>
                                    <td className="px-4 py-2 font-mono text-xs">38.50</td>
                                    <td className="px-4 py-2 font-mono text-xs">89.00</td>
                                    <td className="px-4 py-2 font-mono text-xs">11</td>
                                    <td className="px-4 py-2 font-mono text-xs">6</td>
                                    <td className="px-4 py-2 font-mono text-xs">...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex items-start gap-4">
                        <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined">download</span>
                            Baixar Planilha de Exemplo
                        </button>
                        <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary flex-1 mt-1">
                            * Use ponto (.) como separador decimal. As porcentagens devem ser números (ex: 11 para 11%). As colunas são opcionais, mas `nome_produto`, `custo` e `preco_venda` são recomendadas.
                        </p>
                    </div>
                 </div>

                 <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleImport}
                        disabled={!file}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-text-light-primary text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined">file_upload</span>
                        Importar Produtos
                    </button>
                 </div>
            </div>
        </div>
    );
};
