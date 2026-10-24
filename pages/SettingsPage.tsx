
import React, { useState, useEffect } from 'react';
import type { UserSettings } from '../types';

interface SettingsTextInputProps {
    label: string;
    name: keyof UserSettings;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingsTextInput: React.FC<SettingsTextInputProps> = ({ label, name, value, type = 'text', onChange }) => (
    <label className="block">
        <span className="text-sm font-semibold text-text-light-secondary dark:text-text-dark-secondary">{label}</span>
        <input 
            name={name as string}
            value={value}
            onChange={onChange}
            className="form-input mt-1 block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark focus:ring-primary/20 focus:border-primary h-12 text-base px-4"
            type={type}
        />
    </label>
);

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSave }) => {
    const [formState, setFormState] = useState<UserSettings>(settings);

    useEffect(() => {
        setFormState(settings);
    }, [settings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState(prev => ({ ...prev, profilePictureUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveClick = () => {
        onSave(formState);
    };

    const handleCalculatorPreference = (pref: 'meli' | 'ecommerce') => {
        setFormState(prev => ({ ...prev, preferredCalculator: pref }));
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-20 p-6">
            <div>
                <h1 className="text-3xl font-black">Meu Perfil & Configurações</h1>
                <p className="mt-1 text-text-light-secondary dark:text-text-dark-secondary font-bold">
                    Personalize suas informações e ajuste o seu ambiente de trabalho favorito.
                </p>
            </div>

            {/* Seletor de Ambiente */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border-2 border-primary/20">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">apps</span>
                    Ambiente de Trabalho Favorito
                </h2>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-6">Escolha qual interface deve abrir automaticamente ao acessar o Garimpo.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleCalculatorPreference('meli')}
                        className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${formState.preferredCalculator === 'meli' ? 'border-primary bg-primary/5' : 'border-border-light dark:border-border-dark grayscale hover:grayscale-0'}`}
                    >
                        <div className={`size-12 rounded-xl flex items-center justify-center flex-shrink-0 ${formState.preferredCalculator === 'meli' ? 'bg-primary text-text-light-primary' : 'bg-gray-100 text-gray-400'}`}>
                             <span className="material-symbols-outlined">shopping_cart</span>
                        </div>
                        <div>
                            <p className="font-black text-base">Modo Mercado Livre</p>
                            <p className="text-xs text-text-light-secondary font-bold mt-1">Focado em taxas Meli, anúncios Clássico/Premium e logística FULL.</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleCalculatorPreference('ecommerce')}
                        className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${formState.preferredCalculator === 'ecommerce' ? 'border-primary bg-primary/5' : 'border-border-light dark:border-border-dark grayscale hover:grayscale-0'}`}
                    >
                        <div className={`size-12 rounded-xl flex items-center justify-center flex-shrink-0 ${formState.preferredCalculator === 'ecommerce' ? 'bg-primary text-text-light-primary' : 'bg-gray-100 text-gray-400'}`}>
                             <span className="material-symbols-outlined">storefront</span>
                        </div>
                        <div>
                            <p className="font-black text-base">Modo E-commerce Geral</p>
                            <p className="text-xs text-text-light-secondary font-bold mt-1">Para sites próprios ou outros marketplaces com taxas personalizáveis.</p>
                        </div>
                    </button>
                </div>
            </div>

             <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                <h2 className="text-xl font-bold mb-1">Dados Pessoais</h2>
                 <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-6">Suas informações para personalizar relatórios.</p>
                
                <div className="flex items-center gap-6 mb-8">
                    {formState.profilePictureUrl ? (
                        <img src={formState.profilePictureUrl} alt="Foto de Perfil" className="size-20 rounded-full object-cover border-2 border-primary/50" />
                    ) : (
                        <div className="size-20 rounded-full bg-background-light dark:bg-background-dark flex items-center justify-center border border-dashed border-border-light dark:border-border-dark">
                            <span className="material-symbols-outlined text-4xl text-text-light-secondary dark:text-text-dark-secondary">person</span>
                        </div>
                    )}
                    <div>
                        <input type="file" id="profilePicUpload" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <label htmlFor="profilePicUpload" className="cursor-pointer font-bold text-primary hover:underline">Trocar foto</label>
                        <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1 font-bold italic">PNG ou JPG até 5MB</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingsTextInput 
                        label="Seu Nome (para relatórios)"
                        name="userName"
                        value={formState.userName}
                        onChange={handleInputChange}
                    />
                     <SettingsTextInput 
                        label="Nome da Empresa"
                        name="companyName"
                        value={formState.companyName}
                        onChange={handleInputChange}
                    />
                    <SettingsTextInput 
                        label="Seu Telefone (opcional)"
                        name="userPhone"
                        value={formState.userPhone}
                        onChange={handleInputChange}
                    />
                     <SettingsTextInput 
                        label="Seu E-mail"
                        name="email"
                        value={formState.email}
                        type="email"
                        onChange={handleInputChange}
                    />
                </div>
            </div>
           
            <div className="flex justify-end">
                <button 
                    onClick={handleSaveClick}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-text-light-primary font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                    <span className="material-symbols-outlined">save</span>
                    Salvar Perfil e Preferências
                </button>
            </div>
        </div>
    );
};

interface SettingsPageProps {
    settings: UserSettings;
    onSave: (newSettings: UserSettings) => void;
}
