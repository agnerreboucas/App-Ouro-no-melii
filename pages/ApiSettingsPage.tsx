
import React, { useState } from 'react';
import type { UserSettings, AiProvider } from '../types';

interface AiSettingsPageProps {
    settings: UserSettings;
    onSave: (newSettings: UserSettings) => void;
}

export const ApiSettingsPage: React.FC<AiSettingsPageProps> = ({ settings, onSave }) => {
    const [currentSettings, setCurrentSettings] = useState<UserSettings>(settings);
    
    const handleProviderChange = (provider: AiProvider) => {
        setCurrentSettings(prev => ({
            ...prev,
            apiSettings: {
                ...prev.apiSettings!,
                provider: provider,
                model: provider === 'google' ? 'gemini-3-flash-preview' : 'gpt-4o',
            }
        }));
    };

    const handleSave = () => {
        onSave(currentSettings);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <header>
                <h1 className="text-2xl font-black text-primary uppercase">Cérebro do Sistema</h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Inteligência Artificial Ativa e Validada.</p>
            </header>

            <section className="bg-card-light dark:bg-card-dark p-8 rounded-2xl border border-border-light dark:border-border-dark space-y-6">
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <span className="material-symbols-outlined text-3xl text-primary">verified_user</span>
                    <div>
                        <p className="font-black text-sm uppercase">Conexão Segura</p>
                        <p className="text-[10px] text-gray-400 font-bold">O sistema está operando com chaves privadas de alta performance.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleProviderChange('google')}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${currentSettings.apiSettings?.provider === 'google' ? 'border-primary bg-primary/5' : 'border-border-light opacity-50'}`}
                    >
                        <p className="font-black text-xs uppercase">Google Gemini</p>
                        <p className="text-[8px] font-bold uppercase mt-1">Visão Computacional Ativa</p>
                    </button>
                    <button 
                        onClick={() => handleProviderChange('openai')}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${currentSettings.apiSettings?.provider === 'openai' ? 'border-primary bg-primary/5' : 'border-border-light opacity-50'}`}
                    >
                        <p className="font-black text-xs uppercase">OpenAI GPT-4</p>
                        <p className="text-[8px] font-bold uppercase mt-1">Processamento de Texto</p>
                    </button>
                </div>
            </section>

            <div className="flex justify-end">
                <button 
                    onClick={handleSave}
                    className="px-8 py-3 bg-primary text-text-light-primary font-black rounded-xl shadow-lg hover:scale-105 transition-all uppercase text-xs"
                >
                    Salvar
                </button>
            </div>
        </div>
    );
};
