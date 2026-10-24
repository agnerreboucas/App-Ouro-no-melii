
import React, { useState, useMemo } from 'react';
import type { SavedSimulation, SavedInsight, CalculatorInputs, SavedReport } from '../types';
import { SimulationCard } from '../components/SimulationCard';
import { EditSimulationModal } from '../components/EditSimulationModal';

interface PortfolioPageProps {
    simulations: SavedSimulation[];
    insights: SavedInsight[];
    reports: SavedReport[];
    onViewDetail: (simulation: SavedSimulation) => void;
    onViewInsightDetail: (insight: SavedInsight) => void;
    onDeleteSimulation: (id: string) => void;
    onDeleteInsight: (id: string) => void;
    onUpdateTags: (id: string, tags: string[]) => void;
    onNew: () => void;
    onEdit: (simulation: SavedSimulation) => void;
    onUpdateImage: (id: string, imageUrl: string) => void;
    onUpdateInPlace: (id: string, newInputs: CalculatorInputs) => void;
    onToggleFavorite: (id: string) => void;
    onNavigate?: (view: string) => void;
    onRedoReport: (report: SavedReport) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ 
    simulations, 
    insights, 
    reports,
    onViewDetail, 
    onViewInsightDetail, 
    onDeleteSimulation, 
    onDeleteInsight, 
    onUpdateTags, 
    onNew, 
    onEdit, 
    onUpdateImage, 
    onUpdateInPlace, 
    onToggleFavorite, 
    onNavigate,
    onRedoReport
}) => {
    const [activeTab, setActiveTab] = useState<'skus' | 'insights' | 'reports'>('skus');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState(''); // Formato YYYY-MM
    const [editingSimulation, setEditingSimulation] = useState<SavedSimulation | null>(null);

    const categories = useMemo(() => {
        const cats = new Set(reports.map(r => r.category).filter(Boolean));
        return Array.from(cats).sort();
    }, [reports]);

    const filteredSimulations = useMemo(() => {
        return simulations.filter(sim => sim.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [simulations, searchTerm]);

    const filteredReports = useMemo(() => {
        return reports.filter(rep => {
            const matchesName = rep.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = categoryFilter === '' || rep.category === categoryFilter;
            const matchesDate = dateFilter === '' || rep.createdAt.startsWith(dateFilter);
            return matchesName && matchesCat && matchesDate;
        });
    }, [reports, searchTerm, categoryFilter, dateFilter]);

    return (
        <div className="flex flex-col gap-6 p-6 pb-32">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Gestão de <span className="text-primary italic">Ativos</span></h1>
                    <p className="text-sm font-bold text-gray-400 mt-2">SKUs, Estratégias e Histórico de Relatórios.</p>
                </div>
                <button 
                    onClick={() => onNavigate?.('calculator')}
                    className="flex items-center gap-2 px-6 py-4 bg-primary text-text-light-primary font-black rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-tighter"
                >
                    <span className="material-symbols-outlined">calculate</span>
                    Nova Auditoria
                </button>
            </header>

            <div className="bg-card-light dark:bg-card-dark p-4 rounded-[2rem] border border-border-light dark:border-border-dark flex flex-col md:flex-row gap-4 items-center">
                 <div className="flex border border-border-light dark:border-border-dark rounded-xl p-1 bg-background-light dark:bg-background-dark w-full md:w-auto">
                    <button onClick={() => setActiveTab('skus')} className={`px-4 py-2 text-[10px] flex-1 md:flex-none font-black uppercase rounded-lg ${activeTab === 'skus' ? 'bg-primary text-text-light-primary shadow-sm' : 'text-gray-400'}`}>Meus SKUs</button>
                    <button onClick={() => setActiveTab('insights')} className={`px-4 py-2 text-[10px] flex-1 md:flex-none font-black uppercase rounded-lg ${activeTab === 'insights' ? 'bg-primary text-text-light-primary shadow-sm' : 'text-gray-400'}`}>Kits/IA</button>
                    <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 text-[10px] flex-1 md:flex-none font-black uppercase rounded-lg ${activeTab === 'reports' ? 'bg-primary text-text-light-primary shadow-sm' : 'text-gray-400'}`}>Relatórios</button>
                </div>
                
                <div className="relative w-full md:flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 h-12 rounded-xl bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark focus:ring-primary font-bold" />
                </div>

                {activeTab === 'reports' && (
                    <div className="flex gap-2 w-full md:w-auto">
                        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="h-12 rounded-xl bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-[10px] font-black uppercase">
                            <option value="">Categorias</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="month" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="h-12 rounded-xl bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-[10px] font-black uppercase" />
                    </div>
                )}
            </div>

            {activeTab === 'skus' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSimulations.map(sim => (
                        <SimulationCard key={sim.id} simulation={sim} onViewDetail={onViewDetail} onDelete={onDeleteSimulation} onUpdateTags={onUpdateTags} onEdit={(s) => setEditingSimulation(s)} onUpdateImage={onUpdateImage} onToggleFavorite={onToggleFavorite} />
                    ))}
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="bg-card-light dark:bg-card-dark rounded-3xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-border-light">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Data / Mês</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Produto Auditado</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Categoria</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Lucro Unitário</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-gray-400">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                {filteredReports.map(rep => (
                                    <tr key={rep.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-black uppercase text-gray-500">{new Date(rep.createdAt).toLocaleDateString('pt-BR')}</p>
                                            <p className="text-[10px] font-bold text-gray-400">{new Date(rep.createdAt).toLocaleTimeString('pt-BR')}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"><span className="material-symbols-outlined text-sm">picture_as_pdf</span></div>
                                                <span className="text-sm font-black uppercase tracking-tighter">{rep.productName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-[10px] font-black text-gray-400 uppercase">{rep.category}</span></td>
                                        <td className="px-6 py-4"><span className="text-sm font-black text-primary">R$ {rep.outputsSnapshot.netProfitPerUnit.toFixed(2)}</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => onRedoReport(rep)} className="px-4 py-2 bg-background-dark text-white text-[10px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary">Refazer Auditoria</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredReports.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-20 text-center text-xs font-black uppercase text-gray-400 italic">Nenhum relatório encontrado para este filtro.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {editingSimulation && (
                <EditSimulationModal simulation={editingSimulation} onClose={() => setEditingSimulation(null)} onSave={(id, ni) => { onUpdateInPlace(id, ni); setEditingSimulation(null); }} />
            )}
        </div>
    );
};
