
import React from 'react';

interface ForgotPasswordPageProps {
  onNavigate: (view: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Se uma conta com este e-mail existir, um link de recuperação foi enviado.');
    onNavigate('login');
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl border border-border-light dark:border-border-dark shadow-lg animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Recuperar Senha</h1>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Digite seu e-mail para receber as instruções.</p>
          </div>
          <form className="space-y-6" onSubmit={handleResetRequest}>
            <div>
              <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-2">E-mail</label>
              <input 
                type="email" 
                className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-primary/20 focus:border-primary h-12 text-base px-4"
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-text-light-primary text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
            >
              Enviar Link de Recuperação
            </button>
          </form>
           <div className="text-center mt-6">
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    Lembrou a senha? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="font-bold text-primary hover:underline">Voltar para o Login</a>
                </p>
            </div>
        </div>
      </div>
    </main>
  );
};
