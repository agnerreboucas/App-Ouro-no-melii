
import React from 'react';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto py-20 px-6 border-t border-border-light dark:border-border-dark bg-card-light/30 dark:bg-card-dark/30">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                <div className="md:col-span-6 space-y-6">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                        <h4 className="font-black uppercase text-xl tracking-tighter text-text-light-primary dark:text-white">Ampliação Marketing Digital</h4>
                    </div>
                    <p className="text-lg font-bold text-text-light-secondary dark:text-gray-400 leading-relaxed">
                        Desenvolvedores do projeto <span className="text-primary italic">Encontre Ouro no Meli</span>. Nosso escritório foca em transformar vendedores em empresários lucrativos através de tecnologia e dados reais.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a href="https://ampliacaomktdigital.com.br" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary/10 rounded-lg text-[10px] font-black uppercase text-primary border border-primary/20 hover:bg-primary/20 transition-colors">Nosso Site Oficial</a>
                        <div className="px-4 py-2 bg-background-dark text-white rounded-lg text-[10px] font-black uppercase border border-white/10">Engine do Varejo v2.5</div>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-4">
                    <h4 className="font-black text-primary uppercase text-xs tracking-widest">Navegação</h4>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => onNavigate?.('home')} className="text-sm font-bold text-text-light-secondary hover:text-primary transition-colors text-left">Início / Dashboard</button>
                        <button onClick={() => onNavigate?.('guide')} className="text-sm font-bold text-text-light-secondary hover:text-primary transition-colors text-left">Guia do Sistema</button>
                        <button onClick={() => onNavigate?.('pricing')} className="text-sm font-bold text-text-light-secondary hover:text-primary transition-colors text-left">Nossos Planos</button>
                        <button onClick={() => onNavigate?.('suppliers')} className="text-sm font-bold text-text-light-secondary hover:text-primary transition-colors text-left">Fornecedores Validados</button>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-4">
                    <h4 className="font-black text-primary uppercase text-xs tracking-widest">Contato & Suporte</h4>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary leading-relaxed">
                            Ampliação MKT Digital
                        </p>
                        <a href="mailto:contato@ampliacaomktdigital.com.br" className="text-sm font-bold text-text-light-secondary hover:text-primary transition-colors break-all">contato@ampliacaomktdigital.com.br</a>
                        <a href="https://ampliacaomktdigital.com.br" target="_blank" rel="noopener noreferrer" className="text-sm font-black text-primary hover:underline">www.ampliacaomktdigital.com.br</a>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <a href="https://instagram.com/ampliacaomkt" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark flex items-center justify-center text-text-light-secondary hover:text-primary transition-all hover:scale-110">
                            <span className="material-symbols-outlined">brand_awareness</span>
                        </a>
                        <a href="https://wa.me/551132284444" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark flex items-center justify-center text-text-light-secondary hover:text-primary transition-all hover:scale-110">
                            <span className="material-symbols-outlined">chat</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-20 pt-8 border-t border-border-light dark:border-border-dark flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    © {new Date().getFullYear()} Ampliação Marketing Digital — Projeto Encontro Ouro.
                </p>
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Segurança de Dados 256-bit</span>
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-sm">verified_user</span></div>
                </div>
            </div>
        </div>
    </footer>
  );
};
