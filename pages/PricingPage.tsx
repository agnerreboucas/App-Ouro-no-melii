
import React from 'react';

interface PlanProps {
    plan: string;
    price: string;
    oldPrice?: string;
    period: string;
    desc: string;
    features: string[];
    isFeatured?: boolean;
    onSelect: () => void;
}

const PlanCard = ({ plan, price, oldPrice, period, desc, features, isFeatured, onSelect }: PlanProps) => (
    <div className={`p-8 rounded-3xl border flex flex-col transition-all duration-500 ${isFeatured ? 'border-primary bg-primary/5 shadow-2xl scale-105 z-10' : 'border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:border-primary/30'}`}>
        <h3 className="text-2xl font-black text-center uppercase tracking-tighter">{plan}</h3>
        <p className="text-center text-xs font-bold text-gray-400 mt-2 min-h-[32px]">{desc}</p>
        
        <div className="text-center my-8">
            {oldPrice && (
                <p className="text-sm font-bold text-red-500 line-through opacity-60 mb-1">{oldPrice}</p>
            )}
            <span className="text-5xl font-black tracking-tighter">{price}</span>
            <span className="text-xs font-bold text-gray-400 block mt-1">{period}</span>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
            {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                    <span className="text-xs font-bold leading-tight">{f}</span>
                </li>
            ))}
        </ul>
        
        <button 
            onClick={onSelect} 
            className={`w-full py-5 font-black rounded-2xl transition-all uppercase tracking-widest text-xs ${isFeatured ? 'bg-primary text-text-light-primary shadow-lg shadow-primary/20 hover:scale-[1.02]' : 'bg-background-dark text-white hover:opacity-90'}`}
        >
            {plan === 'Gratuito' ? 'Começar Grátis' : 'Assinar Plano'}
        </button>
    </div>
);

export const PricingPage: React.FC<{ onNavigate: (v: string) => void, currentLevel?: string }> = ({ onNavigate }) => {
  const handlePayment = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <main className="py-20 px-4 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="material-symbols-outlined text-xs">rocket_launch</span>
                Ampliação Marketing Digital
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                O Preço do <span className="text-primary italic">Seu Sucesso.</span>
            </h1>
            <p className="text-lg text-text-light-secondary dark:text-gray-400 font-bold max-w-2xl mx-auto">
                Escolha o nível de inteligência que sua empresa precisa para nunca mais vender no escuro.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto px-4">
            <PlanCard 
                plan="Gratuito"
                price="Grátis"
                period="Acesso limitado"
                desc="Para validar seus primeiros garimpos hoje."
                features={[
                    '2 buscas por dia', 
                    'Cálculo de Lucro Unitário', 
                    'Acesso à Central de Garimpo',
                    '1 SKU salvo no portfólio'
                ]}
                onSelect={() => onNavigate('login')}
            />
            <PlanCard 
                plan="Básico"
                price="R$ 49"
                period="por mês"
                desc="Ideal para pequenos vendedores."
                features={[
                    '5 buscas por dia', 
                    'Cálculo de Lucro e ROI', 
                    'Dashboard de Lucratividade',
                    'Suporte via e-mail corporativo'
                ]}
                onSelect={() => handlePayment('https://mpago.la/1RE3XXu')}
            />
            <PlanCard 
                plan="Pro Mensal"
                price="R$ 99"
                period="por mês"
                desc="Para quem busca escala diária."
                features={[
                    '10 buscas por dia', 
                    'Garimpo por Foto/Print/Link', 
                    'Dossiê Completo com Fornecedor', 
                    'Portfólio de SKUs Ilimitado',
                    'Acesso à Estratégia de IA'
                ]}
                isFeatured
                onSelect={() => handlePayment('https://mpago.la/2vbH1tV')}
            />
            <PlanCard 
                plan="Elite Anual"
                oldPrice="R$ 1.207,80"
                price="R$ 790"
                period="valor anual único"
                desc="A melhor escolha para empresários de elite."
                features={[
                    'Buscas ILIMITADAS', 
                    'Dossiê de Fornecedores liberado', 
                    'CFO IA Estratégico Mensal', 
                    'Suporte VIP via WhatsApp',
                    'Acesso prioritário a novos recursos',
                    'Economia de R$ 417,80/ano'
                ]}
                onSelect={() => handlePayment('https://mpago.la/13ufYTY')}
            />
        </div>

        <div className="mt-24 text-center space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                    <span className="text-xs font-black uppercase">Pagamento 100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl">bolt</span>
                    <span className="text-xs font-black uppercase">Liberação Imediata</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl">support_agent</span>
                    <span className="text-xs font-black uppercase">Suporte Especializado</span>
                </div>
            </div>
            
            <div className="pt-10 border-t border-border-light dark:border-border-dark max-w-xl mx-auto">
                <p className="text-sm font-bold text-text-light-secondary dark:text-gray-500">
                    A Ampliação Marketing Digital utiliza o Mercado Pago para garantir a segurança dos seus dados financeiros. 
                    <br/><br/>
                    Dúvidas? <a href="mailto:contato@ampliacaomktdigital.com.br" className="text-primary hover:underline font-black">Fale com nosso suporte</a>
                </p>
            </div>
        </div>
      </div>
    </main>
  );
};
