
import React from 'react';
import type { AiInsight } from '../types';

interface AiAnalysisPanelProps {
  aiInsight: AiInsight | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse flex flex-col gap-4">
    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
    <div className="h-8 bg-gray-700 rounded w-full"></div>
    <div className="h-4 bg-gray-700 rounded w-1/4 mt-4"></div>
    <div className="h-8 bg-gray-700 rounded w-full"></div>
    <div className="h-8 bg-gray-700 rounded w-4/5"></div>
  </div>
);

const ImpactTag: React.FC<{ impacto: 'alto' | 'medio' | 'baixo' }> = ({ impacto }) => {
  const config = {
    alto: 'bg-red-500/20 text-red-500',
    medio: 'bg-yellow-400/20 text-yellow-400',
    baixo: 'bg-gray-500/20 text-gray-500'
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full whitespace-nowrap ${config[impacto]}`}>
      {impacto.toUpperCase()}
    </span>
  );
};

export const AiAnalysisPanel: React.FC<AiAnalysisPanelProps> = ({ aiInsight, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--accent-green)] animate-pulse">psychology</span>
            Análise do Copiloto
        </h3>
        <SkeletonLoader />
      </div>
    );
  }

  const hasContent = aiInsight && (aiInsight.o_que_mais_pesou?.length || aiInsight.ajustes_recomendados?.length || aiInsight.alertas?.length || aiInsight.proximos_passos?.length);

  if (!hasContent) {
    return null; // Don't render if there's nothing actionable to show
  }

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--accent-green)]">psychology</span>
            Análise do Copiloto
        </h3>

        <div className="flex flex-col gap-6">
            {aiInsight.alertas && aiInsight.alertas.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-yellow-400"><span className="material-symbols-outlined">warning</span> Alertas Importantes</h4>
                    <div className="flex flex-col gap-2">
                        {aiInsight.alertas.map((alerta, index) => (
                            <div key={index} className="bg-[var(--bg-primary)] p-3 rounded-lg text-sm text-yellow-300 flex items-start gap-3 border-l-2 border-yellow-400">
                                <span className="material-symbols-outlined text-base mt-0.5">info</span>
                                <span>{alerta}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {aiInsight.o_que_mais_pesou && aiInsight.o_que_mais_pesou.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2"><span className="material-symbols-outlined">scale</span> O que mais pesou?</h4>
                    <div className="flex flex-col gap-2">
                        {aiInsight.o_que_mais_pesou.map((item, index) => (
                            <div key={index} className="bg-[var(--bg-primary)] p-3 rounded-lg flex justify-between items-center text-sm gap-4">
                                <div>
                                    <p className="font-semibold">{item.item}</p>
                                    <p className="text-xs text-gray-400 italic">"{item.nota}"</p>
                                </div>
                                <ImpactTag impacto={item.impacto} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {aiInsight.ajustes_recomendados && aiInsight.ajustes_recomendados.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2"><span className="material-symbols-outlined">tips_and_updates</span> Ajustes Recomendados</h4>
                    <div className="flex flex-col gap-2">
                        {aiInsight.ajustes_recomendados.map((rec, index) => (
                            <div key={index} className="border border-dashed border-[var(--border-color)] p-3 rounded-lg text-sm">
                                <p className="font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[var(--accent-green)] text-base">arrow_forward</span> {rec.acao}</p>
                                <p className="text-xs text-gray-400 mt-1 pl-5">{rec.efeito_esperado}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             {aiInsight.proximos_passos && aiInsight.proximos_passos.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2"><span className="material-symbols-outlined">next_plan</span> Próximos Passos</h4>
                    <div className="flex flex-wrap gap-2">
                        {aiInsight.proximos_passos.map((step, index) => (
                            <button key={index} className="border border-[var(--accent-green)] text-[var(--accent-green)] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[var(--accent-green)]/10 transition-colors">
                                {step}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
