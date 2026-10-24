
import React, { useState, useMemo } from 'react';
import type { SavedSimulation } from '../types';
import { SimulationCard } from '../components/SimulationCard';

interface MySkusPageProps {
    simulations: SavedSimulation[];
    onViewDetail: (simulation: SavedSimulation) => void;
    onDelete: (id: string) => void;
    onUpdateTags: (id: string, tags: string[]) => void;
    onNew: () => void;
}

export const MySkusPage: React.FC<MySkusPageProps> = ({ simulations, onViewDetail, onDelete, onUpdateTags, onNew }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTags, setActiveTags] = useState<string[]>([]);

    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        simulations.forEach(sim => {
            sim.tags?.forEach(tag => tagsSet.add(tag));
        });
        return Array.from(tagsSet).sort();
    }, [simulations]);

    const handleTagClick = (tag: string) => {
        setActiveTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const filteredSimulations = useMemo(() => {
        return simulations.filter(sim => {
            const matchesSearch = sim.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTags = activeTags.length === 0 || activeTags.every(tag => sim.tags?.includes(tag));
            return matchesSearch && matchesTags;
        });
    }, [simulations, searchTerm, activeTags]);

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">search</span>
                    <input 
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-11"
                    />
                </div>
                <div className="w-full md:w-auto flex flex-wrap gap-2 items-center justify-center">
                    {allTags.map(tag => (
                        <button 
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTags.includes(tag) ? 'bg-primary text-text-light-primary' : 'bg-border-light dark:bg-border-dark text-text-light-secondary dark:text-text-dark-secondary'}`}
                        >
                            {tag}
                        </button>
                    ))}
                    {activeTags.length > 0 && (
                        <button onClick={() => setActiveTags([])} className="text-xs text-text-light-secondary dark:text-text-dark-secondary hover:text-primary">Limpar</button>
                    )}
                </div>
            </div>

            {filteredSimulations.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSimulations.map(sim => (
                        <SimulationCard 
                            key={sim.id}
                            simulation={sim}
                            onViewDetail={onViewDetail}
                            onDelete={onDelete}
                            onUpdateTags={onUpdateTags}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-xl bg-card-light dark:bg-card-dark border border-dashed border-border-light dark:border-border-dark mt-6">
                    <span className="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary mb-4">
                        search_off
                    </span>
                    <h2 className="text-xl font-bold">Nenhuma simulação encontrada</h2>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary mt-2 max-w-sm">
                        Tente ajustar sua busca ou filtros. Ou crie uma nova simulação para começar.
                    </p>
                    <button 
                        onClick={onNew}
                        className="mt-6 flex items-center gap-2 px-4 py-3 bg-primary text-text-light-primary text-sm font-bold rounded-lg shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Criar nova simulação
                    </button>
                </div>
            )}
        </div>
    );
};
