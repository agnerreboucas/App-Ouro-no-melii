
import React, { useState, useMemo, useEffect } from 'react';
import type { Partner, PartnerCategory, Supplier, AudienceAnalysis, UserSettings } from '../../types';
import { dbGetAllPartners, dbGetClickCounts } from '../../services/persistenceService';
import { suppliersData } from '../../data/suppliersData';
import { SupplierAuditModal } from '../../components/SupplierAuditModal';

const StatCard = ({ icon, label, value, color = "primary", sub }: any) => (
    <div className="bg-card-light dark:bg-card-dark p-8 rounded-[2rem] border border-border-light dark:border-border-dark shadow-sm group hover:border-primary transition-all">
        <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 bg-${color}/10 text-${color} group-hover:scale-110 transition-transform`}>
            <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
        <p className="text-3xl font-black mt-2">{value}</p>
        {sub && <p className="text-[9px] font-bold text-gray-500 uppercase mt-2">{sub}</p>}
    </div>
);

export const AdminDashboardPage: React.FC<{ 
    onNavigate?: (v: string) => void;
    onNavigateToSupplierDashboard?: (sid: string) => void;
}> = ({ onNavigate, onNavigateToSupplierDashboard }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'affiliates' | 'suppliers' | 'ecosystem'>('overview');
    const [partners, setPartners] = useState<Partner[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const p = await dbGetAllPartners();
            setPartners(p);
        };
        fetch();
    }, []);

    const globalMetrics = useMemo(() => {
        let totalEarned = 0;
        let totalReach = 0;
        partners.forEach(p => {
            totalEarned += p.stats.totalEarned;
            totalReach += p.audienceAnalysis?.reachEstimate || 0;
        });
        return { totalEarned, totalReach };
    }, [partners]);

    // Mock settings para o modal (já que é admin)
    const adminSettings: UserSettings = {
        email: 'admin@garimpo.com',
        userName: 'Admin Master',
        subscriptionLevel: 'annual'
    } as any;

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-10 p-6 pb-40 animate-fade-in-up">
            <header className="bg-card-light p-10 rounded-[3rem] border border-border-light shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight uppercase leading-none">Governança <span className="text-primary italic">Deep Data</span></h1>
                    <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-[0.2em] opacity-60">Painel de Gestão e Auditoria de Ativos</p>
                </div>
                <div className="flex border border-border-light rounded-[1.5rem] p-1.5 bg-background-light overflow-x-auto scrollbar-hide">
                    <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-primary text-secondary shadow-lg' : 'text-gray-400 hover:text-secondary'}`}>Geral</button>
                    <button onClick={() => setActiveTab('affiliates')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'affiliates' ? 'bg-primary text-secondary shadow-lg' : 'text-gray-400 hover:text-secondary'}`}>Sócios</button>
                    <button onClick={() => setActiveTab('suppliers')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'suppliers' ? 'bg-primary text-secondary shadow-lg' : 'text-gray-400 hover:text-secondary'}`}>Fornecedores</button>
                    <button onClick={() => setActiveTab('ecosystem')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'ecosystem' ? 'bg-primary text-secondary shadow-lg' : 'text-gray-400 hover:text-secondary'}`}>Afinidades</button>
                </div>
            </header>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon="hub" label="Alcance Agregado" value={globalMetrics.totalReach > 1000000 ? `${(globalMetrics.totalReach/1000000).toFixed(1)}M` : globalMetrics.totalReach.toLocaleString()} sub="Pessoas Impactadas" />
                    <StatCard icon="groups" label="Parceiros Ativos" value={partners.length} sub="Time Verificado" color="ml-yellow" />
                    <StatCard icon="payments" label="Comissões Pagas" value={`R$ ${globalMetrics.totalEarned.toFixed(2)}`} sub="Volume Global" color="primary" />
                    <StatCard icon="ads_click" label="Cliques Totais" value="4.8k" sub="UTM do Mês" color="secondary" />
                </div>
            )}

            {activeTab === 'suppliers' && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="bg-primary/5 p-8 rounded-[3rem] border-2 border-dashed border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h2 className="text-2xl font-black uppercase">Central de Carga de Tabelas</h2>
                            <p className="text-sm font-bold text-gray-500 max-w-xl">Recebeu uma planilha nova de um fornecedor? Use a IA para descobrir quais produtos valem a pena publicar na Biblioteca.</p>
                        </div>
                        <button 
                            onClick={() => setIsAuditModalOpen(true)}
                            className="px-10 py-5 bg-primary text-secondary font-black rounded-2xl uppercase text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined">description</span>
                            Auditar Tabela IA
                        </button>
                    </div>

                    <div className="bg-card-light rounded-[2.5rem] border border-border-light overflow-hidden shadow-sm">
                         <div className="p-6 border-b border-border-light flex justify-between items-center">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary">Fornecedores na Rede</h3>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Total: {suppliersData.length}</span>
                         </div>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 border-b">
                                    <tr>
                                        <th className="px-6 py-4">Fornecedor</th>
                                        <th className="px-6 py-4">Categoria</th>
                                        <th className="px-6 py-4">Vendedor</th>
                                        <th className="px-6 py-4">Produtos</th>
                                        <th className="px-6 py-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light">
                                    {suppliersData.map(sup => (
                                        <tr key={sup.id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-black uppercase leading-tight">{sup.name}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase truncate max-w-[200px]">{sup.address}</p>
                                            </td>
                                            <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded-md text-[9px] font-black text-gray-500 uppercase">{sup.category}</span></td>
                                            <td className="px-6 py-4 font-bold text-xs">{sup.salesperson?.name || "Geral"}</td>
                                            <td className="px-6 py-4 font-black text-primary">{sup.highlightedProducts.length} itens</td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => onNavigateToSupplierDashboard?.(sup.id)}
                                                    className="px-4 py-2 bg-secondary text-white text-[10px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-primary"
                                                >
                                                    Performance
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'affiliates' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 bg-card-light p-8 rounded-[3rem] border shadow-sm space-y-6 overflow-y-auto max-h-[700px] scrollbar-hide">
                        <div className="space-y-1">
                            <h2 className="text-xs font-black uppercase text-primary tracking-widest">Base de Influência</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Selecione para ver o Raio-X</p>
                        </div>
                        <div className="space-y-3">
                            {partners.map(p => (
                                <button key={p.id} onClick={() => setSelectedPartner(p)} className={`w-full p-6 rounded-2xl border text-left transition-all group ${selectedPartner?.id === p.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                                    <p className="text-sm font-black uppercase truncate group-hover:text-primary transition-colors">{p.name}</p>
                                    <div className="flex justify-between mt-2">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">{p.category}</p>
                                        <p className="text-[9px] font-black text-secondary">{p.audienceAnalysis?.reachLabel || 'Sem Dossiê'}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        {selectedPartner ? (
                            <div className="bg-card-light p-10 rounded-[3rem] border shadow-2xl space-y-10 animate-fade-in-up">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter">{selectedPartner.name}</h2>
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-secondary uppercase"><span className="material-symbols-outlined text-xs">chat</span> {selectedPartner.phone}</span>
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-secondary uppercase"><span className="material-symbols-outlined text-xs">mail</span> {selectedPartner.email}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-gray-400">Conversão Gerada</p>
                                        <p className="text-3xl font-black text-primary">R$ {selectedPartner.stats.totalEarned.toFixed(2)}</p>
                                    </div>
                                </div>

                                {selectedPartner.audienceAnalysis ? (
                                    <div className="space-y-8 pt-8 border-t border-dashed">
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="p-6 bg-background-light rounded-2xl">
                                                <p className="text-[9px] font-black uppercase text-gray-400 mb-2">Engajamento</p>
                                                <p className="text-xl font-black">{selectedPartner.audienceAnalysis.engagementRate}%</p>
                                            </div>
                                            <div className="p-6 bg-background-light rounded-2xl">
                                                <p className="text-[9px] font-black uppercase text-gray-400 mb-2">Público Fem.</p>
                                                <p className="text-xl font-black text-pink-500">{selectedPartner.audienceAnalysis.demographics.gender.female}%</p>
                                            </div>
                                            <div className="p-6 bg-background-light rounded-2xl">
                                                <p className="text-[9px] font-black uppercase text-gray-400 mb-2">Power Score</p>
                                                <p className="text-xl font-black text-primary">{selectedPartner.audienceAnalysis.authorityScore}/100</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-xs font-black uppercase text-secondary flex items-center gap-2"><span className="material-symbols-outlined text-sm">psychology</span> Perfil Comportamental</p>
                                            <p className="text-sm font-medium leading-relaxed italic text-gray-500 bg-gray-50 p-6 rounded-2xl border border-gray-100">"{selectedPartner.audienceAnalysis.psychographics.lifestyle}"</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-24 text-center space-y-4">
                                        <span className="material-symbols-outlined text-6xl text-gray-200">history_edu</span>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Este parceiro ainda não realizou a auditoria de IA.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center border-4 border-dashed rounded-[3rem] text-gray-300 p-20 text-center">
                                <span className="material-symbols-outlined text-8xl mb-4">search_check</span>
                                <p className="text-sm font-black uppercase tracking-[0.2em]">Selecione um Sócio para <br/>Ver o Raio-X Comercial</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <SupplierAuditModal 
                isOpen={isAuditModalOpen} 
                onClose={() => setIsAuditModalOpen(false)} 
                settings={adminSettings} 
                onLoadToCalculator={(name, cost, price) => {
                    // Como é admin, ao auditar enviamos para a calculadora meli normal
                    if(onNavigate) onNavigate('calculator');
                }}
            />
        </div>
    );
};
