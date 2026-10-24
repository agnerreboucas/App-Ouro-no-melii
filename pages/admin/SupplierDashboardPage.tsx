import React, { useState, useEffect, useMemo } from 'react';
import type { Supplier } from '../../types';
import { dbGetSupplierStats } from '../../services/persistenceService';
import { suppliersData } from '../../data/suppliersData';

interface SupplierDashboardPageProps {
    supplierId: string;
    onBack: () => void;
}

const StatCard = ({ icon, label, value, color = "primary", sub }: any) => (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-sm group hover:border-primary transition-all">
        <div className={`size-10 rounded-xl flex items-center justify-center mb-4 bg-${color}/10 text-${color} group-hover:scale-110 transition-transform`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
        <p className="text-2xl font-black mt-1">{value}</p>
        {sub && <p className="text-[9px] font-bold text-gray-500 uppercase mt-1">{sub}</p>}
    </div>
);


export const SupplierDashboardPage: React.FC<SupplierDashboardPageProps> = ({ supplierId, onBack }) => {
    const [stats, setStats] = useState<any | null>(null);

    const supplier = useMemo(() => {
        return suppliersData.find(s => s.id === supplierId);
    }, [supplierId]);

    useEffect(() => {
        const fetchData = async () => {
            const s = await dbGetSupplierStats(supplierId);
            setStats(s);
        };
        fetchData();
    }, [supplierId]);

    if (!supplier || !stats) {
        return <div className="p-20 text-center font-black animate-pulse uppercase tracking-widest text-xs">Carregando Dados do Fornecedor...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 p-6 pb-32 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <button onClick={onBack} className="flex items-center gap-1 text-gray-500 font-black uppercase text-[10px] tracking-widest mb-4">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> Voltar para Gestão
                    </button>
                    <h1 className="text-4xl font-black tracking-tight leading-none uppercase">{supplier.name}</h1>
                    <p className="text-text-light-secondary font-bold mt-1 uppercase text-xs tracking-widest opacity-60">Dashboard de Performance B2B</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="visibility" label="Visualizações de Produtos" value={stats.productViews} sub="Na Biblioteca de Ouro" />
                <StatCard icon="ads_click" label="Cliques na Oferta" value={stats.offerClicks} sub="UTM do Banner" color="ml-yellow"/>
                <StatCard icon="chat" label="Cliques de Contato" value={stats.contactClicks} sub="WhatsApp e Site" />
                <StatCard icon="calculate" label="Auditorias Realizadas" value={stats.calculations} sub="Produtos na Calculadora" color="primary" />
            </div>

            <div className="bg-card-light dark:bg-card-dark p-6 rounded-[2rem] border border-border-light shadow-sm">
                <h2 className="text-lg font-black uppercase mb-6">Produtos Mais Auditados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px]">
                        <thead className="text-[8px] font-black uppercase text-gray-400 border-b pb-2">
                            <tr>
                                <th className="p-2">Produto</th>
                                <th className="p-2">Auditorias</th>
                                <th className="p-2">Margem Média Encontrada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topProducts.map((p: any) => (
                                <tr key={p.name} className="border-b last:border-0">
                                    <td className="p-2 font-bold">{p.name}</td>
                                    <td className="p-2">{p.calculations}</td>
                                    <td className="p-2 font-black text-primary">{p.avgMargin}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};