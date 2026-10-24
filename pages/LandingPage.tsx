
import React from 'react';
import { Footer } from '../components/Footer';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

const FeatureCard = ({ icon, title, desc, highlight }: { icon: string; title: string; desc: string, highlight?: boolean }) => (
    <div className={`flex flex-col items-start gap-4 p-8 rounded-[2.5rem] border transition-all group ${highlight ? 'bg-primary/5 border-primary shadow-xl scale-105' : 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark shadow-sm hover:border-primary/40'}`}>
        <div className={`size-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${highlight ? 'bg-primary text-text-light-primary' : 'bg-primary/10 text-primary'}`}>
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <h3 className="text-xl font-black uppercase tracking-tighter leading-none">{title}</h3>
        <p className="text-sm text-text-light-secondary dark:text-gray-400 font-bold leading-relaxed">{desc}</p>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <main className="flex-grow overflow-x-hidden text-text-light-primary dark:text-text-dark-primary">
      {/* DOBRA 1: O FOCO CENTRAL - CALCULADORA DE LUCRO */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 bg-gradient-to-br from-primary/15 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-dark text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                    <span className="material-symbols-outlined text-xs text-primary">rocket_launch</span>
                    Ampliação Marketing Digital
                </div>
                
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                      Saiba seu <span className="text-primary italic">Lucro Real</span> por produto.
                    </h1>
                    <p className="text-xl md:text-2xl text-text-light-secondary dark:text-text-dark-secondary font-bold leading-tight border-l-4 border-primary pl-6 max-w-xl">
                      Descubra o lucro exato de cada produto que você vende ou pretende comprar. Calcule, valide e receba o valor real no seu bolso.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => onNavigate('pricing')} 
                        className="px-10 py-6 bg-primary text-text-light-primary font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.05] active:scale-[0.98] transition-all text-xl uppercase tracking-tighter"
                    >
                        Calcular Meu Lucro Agora
                    </button>
                    <button 
                        onClick={() => onNavigate('login')} 
                        className="px-10 py-6 bg-white dark:bg-card-dark border-2 border-border-light dark:border-border-dark font-black rounded-2xl hover:bg-background-light dark:hover:bg-background-dark transition-all text-xl uppercase tracking-tighter"
                    >
                        Entrar no Sistema
                    </button>
                </div>
            </div>

            <div className="relative animate-fade-in-up animation-delay-300">
                <div className="bg-card-light dark:bg-card-dark p-10 rounded-[3rem] border border-border-light dark:border-border-dark shadow-2xl space-y-6 relative z-10 overflow-hidden">
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">calculate</span>
                        Resultado da Auditoria
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-background-light dark:bg-background-dark rounded-xl border border-border-light">
                            <p className="text-[10px] font-black uppercase text-gray-400">Seu Ganho por Unidade</p>
                            <p className="text-4xl font-black text-primary">R$ 42,90</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-background-light dark:bg-background-dark rounded-xl border border-border-light">
                                <p className="text-[10px] font-black uppercase text-gray-400">Margem Líquida</p>
                                <p className="text-xl font-black">28.4%</p>
                            </div>
                            <div className="p-4 bg-background-light dark:bg-background-dark rounded-xl border border-border-light">
                                <p className="text-[10px] font-black uppercase text-gray-400">Status</p>
                                <p className="text-sm font-black text-green-500 uppercase">Validado</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs font-bold text-text-light-secondary italic leading-relaxed">"Você encontra o lucro nos produtos que já vende e descobre novos produtos altamente lucrativos."</p>
                </div>
            </div>
        </div>
      </section>

      {/* SESSÃO: NOSSO GRANDE SEGREDO - LUCRO PRÉ-VALIDADO */}
      <section className="py-24 bg-primary text-text-light-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Nosso Grande <br/><span className="text-white italic">Segredo Revelado.</span></h2>
                <div className="space-y-6">
                    <p className="text-xl font-bold leading-relaxed">
                        Diferente de qualquer outra ferramenta, nossa base de fornecedores tem um diferencial único: <span className="text-white underline decoration-4 underline-offset-4">Lucro Pré-Validado.</span>
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm">
                            <h4 className="font-black text-white text-lg uppercase mb-2">Busca Manual (Risco Alto)</h4>
                            <p className="text-sm font-medium">Ao subir uma foto ou link por conta própria, o resultado pode ser negativo. Você gasta tempo e dinheiro sem garantia.</p>
                        </div>
                        <div className="bg-background-dark/20 p-6 rounded-2xl border-2 border-white/40 shadow-xl scale-[1.02]">
                            <h4 className="font-black text-white text-lg uppercase mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined">verified</span> Base Encontre Ouro (Risco Zero)
                            </h4>
                            <p className="text-sm font-medium">Cada SKU na nossa base já foi cruzado com os custos do Mercado Livre. Se o produto está na nossa lista, ele obrigatoriamente gera lucro para você.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative flex justify-center">
                <div className="size-80 md:size-96 rounded-full bg-white/5 border-4 border-dashed border-white/20 animate-[spin_20s_linear_infinite] absolute"></div>
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 bg-background-dark rounded-[3rem] shadow-2xl border border-white/10 transform -rotate-3">
                    <span className="material-symbols-outlined text-7xl text-primary mb-4">security</span>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Blindagem de <br/>Prejuízo Ativa</h3>
                    <p className="text-sm font-bold text-gray-400 mt-4">Nós fazemos a curadoria financeira pesada para que você só precise escolher o produto e vender.</p>
                </div>
            </div>
        </div>
      </section>

      {/* SESSÃO: CONCEITO DE DADOS E CONEXÃO (NOVA DOBRA) */}
      <section className="py-32 bg-white dark:bg-background-dark border-y border-border-light dark:border-border-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[4rem] border border-primary/20 p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="md:w-2/5 space-y-6 text-center md:text-left">
                    <div className="size-24 rounded-[2rem] bg-primary text-text-light-primary flex items-center justify-center shadow-2xl mx-auto md:mx-0 transform -rotate-6">
                        <span className="material-symbols-outlined text-5xl">hub</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.8]">
                        Ecossistema de <br/><span className="text-primary italic">Inteligência Varejista.</span>
                    </h2>
                </div>
                <div className="md:w-3/5 space-y-8">
                    <p className="text-2xl md:text-3xl font-extrabold text-text-light-secondary dark:text-gray-200 leading-tight">
                        Somos um sistema de <span className="text-primary">inteligência e tratamento de dados</span> que conecta fabricantes, distribuidores e atacadistas ao mercado varejista do Brasil.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-primary/20">
                        <div className="space-y-3">
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">settings_input_component</span> Integração de Cadeia
                            </h4>
                            <p className="text-sm font-bold text-gray-500 leading-relaxed">Eliminamos as barreiras entre a fonte de produção e o vendedor final através de dados validados.</p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">query_stats</span> Análise de Fluxo
                            </h4>
                            <p className="text-sm font-bold text-gray-500 leading-relaxed">Tratamos milhões de pontos de dados de precificação para garantir a sustentabilidade do seu negócio.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Elementos decorativos de dados */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent -translate-x-1/2"></div>
        </div>
      </section>

      {/* DOBRA 4: ENCONTRE PRODUTOS E FORNECEDORES */}
      <section className="py-24 bg-background-dark text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square bg-primary/5 rounded-[4rem] border-4 border-dashed border-primary/20 flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1000&auto=format&fit=crop')] opacity-20 grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"></div>
                <div className="relative z-10 text-center space-y-4 p-8">
                    <span className="material-symbols-outlined text-8xl text-primary animate-pulse">inventory_2</span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Produtos de Ouro</h3>
                    <p className="text-sm font-bold text-gray-400">Nós mineramos o mercado para você.</p>
                </div>
            </div>
            <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.95]">
                    Encontre <span className="text-primary italic">bons produtos</span> e <span className="text-primary italic">fornecedores</span> com a gente.
                </h2>
                <p className="text-xl text-gray-400 font-bold leading-relaxed">
                    Temos uma rede de fornecedores validados e uma lista de produtos prontos para escala. Você não precisa mais procurar no escuro.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-3 items-center">
                        <span className="material-symbols-outlined text-primary">verified</span>
                        <span className="text-sm font-black uppercase">Importadores Diretos</span>
                    </div>
                    <div className="flex gap-3 items-center">
                        <span className="material-symbols-outlined text-primary">trending_up</span>
                        <span className="text-sm font-black uppercase">Alta Rentabilidade</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CTA FINAL PERSUASIVO */}
      <section className="py-32 bg-background-dark text-white text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase">
                Pare de Vender no Escuro. <br/><span className="text-primary">Comece o Garimpo.</span>
            </h2>
            <div className="flex flex-col items-center gap-8">
                <button 
                    onClick={() => onNavigate('pricing')} 
                    className="px-16 py-8 bg-primary text-text-light-primary font-black rounded-3xl text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter"
                >
                    Criar Meu Cadastro Grátis
                </button>
                <div className="space-y-2">
                    <p className="text-xs font-black uppercase opacity-40 tracking-[0.4em]">Ampliação Marketing Digital</p>
                    <a href="https://www.ampliacaomktdigital.com.br" target="_blank" className="text-[10px] font-bold opacity-30 hover:opacity-100 transition-opacity">www.ampliacaomktdigital.com.br</a>
                </div>
            </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </main>
  );
};
