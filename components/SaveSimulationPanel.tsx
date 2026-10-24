
import React from 'react';

interface SaveSimulationPanelProps {
  onSave: (details: { name: string, tags: string[] }) => void;
}

// NOTE: This component is temporarily unused in the new UI but kept for its logic.
export const SaveSimulationPanel: React.FC<SaveSimulationPanelProps> = ({ onSave }) => {
  const handleSaveClick = () => {
    const name = window.prompt("Digite um nome para salvar esta simulação (ex: Produto X - Fornecedor Y):");
    if (name && name.trim() !== '') {
      const tagsString = window.prompt("Adicione tags separadas por vírgula (ex: comprar, analisar, fornecedor a)");
      const tags = tagsString ? tagsString.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean) : [];
      onSave({ name: name.trim(), tags });
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-color)] flex items-center justify-between">
      <p className="text-sm font-bold text-gray-300">Gostou do resultado?</p>
      <button 
        onClick={handleSaveClick}
        className="btn-primary flex items-center gap-2 px-4 py-2 bg-[var(--accent-green)] text-black text-sm font-bold rounded-md shadow-lg shadow-[var(--accent-green)]/10 hover:shadow-[var(--accent-green)]/20 transition-all"
        aria-label="Salvar simulação atual"
      >
        <span className="material-symbols-outlined">save</span>
        Salvar Simulação
      </button>
    </div>
  );
};
