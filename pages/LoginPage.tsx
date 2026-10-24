import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (user?: any, rememberMe?: boolean) => void;
  onNavigate: (view: string) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, showToast }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalize = () => {
    if (!formData.name || !formData.email) {
        showToast("Preencha ao menos Nome e E-mail", "error");
        return;
    }
    // A lógica de `onLogin` em App.tsx já lida com a criação de um usuário básico
    onLogin({ userName: formData.name, email: formData.email }, rememberMe);
  };

  const Benefit = ({ icon, text }: { icon: string, text: string }) => (
    <div className="flex items-center gap-3 bg-white/50 dark:bg-card-dark/50 p-3 rounded-xl border border-border-light dark:border-border-dark transition-all hover:scale-[1.02] hover:bg-white">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <span className="text-xs font-black uppercase tracking-tighter">{text}</span>
    </div>
  );

  const inputClasses = "w-full h-12 px-4 rounded-xl border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 transform focus:scale-[1.01] outline-none";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Lado Esquerdo - Info */}
        <div className="space-y-8 p-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Encontre Ouro <br/><span className="text-primary">no Mercado Livre.</span>
            </h1>
            <p className="text-lg font-bold text-text-light-secondary dark:text-text-dark-secondary">
                A ferramenta definitiva para validar produtos, auditar fornecedores e garantir seu lucro real.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Benefit icon="payments" text="Lucro Efetivo por Venda" />
                <Benefit icon="trending_up" text="ROI Real do Estoque" />
                <Benefit icon="visibility" text="Custo de Visibilidade" />
                <Benefit icon="ads_click" text="Decisão de Compra Ninja" />
            </div>
        </div>

        {/* Lado Direito - Form */}
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl border border-border-light dark:border-border-dark shadow-2xl relative overflow-hidden">
            {!isRegistering ? (
                <div className="space-y-6 animate-fade-in-up">
                    <h2 className="text-2xl font-black">Bem-vindo de volta!</h2>
                    <div className="space-y-4">
                        <input type="email" placeholder="Seu e-mail" className={inputClasses} />
                        <input type="password" placeholder="Sua senha" className={inputClasses} />
                        
                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe} 
                                        onChange={e => setRememberMe(e.target.checked)} 
                                        className="sr-only peer" 
                                    />
                                    <div className="size-5 border-2 border-border-light dark:border-border-dark rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[14px] text-text-light-primary font-black scale-0 peer-checked:scale-100 transition-transform">check</span>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-text-light-secondary dark:text-text-dark-secondary group-hover:text-primary transition-colors">Manter conectado</span>
                            </label>
                        </div>

                        <button onClick={() => onLogin(undefined, rememberMe)} className="w-full py-4 bg-primary text-text-light-primary font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-0.98 transition-all">Entrar no Garimpo</button>
                    </div>
                    <div className="text-center">
                        <button onClick={() => setIsRegistering(true)} className="text-sm font-black text-primary hover:underline">Não tem conta? Crie agora grátis</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in-up">
                    <h2 className="text-2xl font-black">Criar Conta Grátis</h2>
                    <div className="space-y-4">
                        <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Nome Completo" className={inputClasses} />
                        <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="E-mail profissional" className={inputClasses} />
                        <input name="password" type="password" placeholder="Crie uma senha" className={inputClasses} />
                        <button onClick={handleFinalize} className="w-full py-4 bg-primary text-text-light-primary font-black rounded-xl shadow-lg hover:scale-[1.02] transition-all">Finalizar e Entrar</button>
                    </div>
                    <div className="text-center pt-4 border-t border-dashed border-border-light dark:border-border-dark">
                        <button onClick={() => setIsRegistering(false)} className="text-xs font-black text-gray-400 hover:text-primary transition-colors">Já tenho conta, quero entrar</button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};