
import React from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const config = {
        success: {
            icon: 'check_circle',
            bg: 'bg-primary',
            text: 'text-text-light-primary',
            border: 'border-primary/50'
        },
        error: {
            icon: 'error',
            bg: 'bg-red-500',
            text: 'text-white',
            border: 'border-red-500/50'
        }
    };

    const currentConfig = config[type];

    return (
        <div 
            className={`fixed bottom-6 right-6 z-50 w-full max-w-sm p-4 rounded-xl border ${currentConfig.border} bg-card-light dark:bg-card-dark shadow-2xl animate-fade-in-up flex items-start gap-4`}
            role="alert"
        >
            <div className={`flex-shrink-0 size-8 rounded-lg ${currentConfig.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-lg ${currentConfig.text}`}>{currentConfig.icon}</span>
            </div>
            <div className="flex-grow">
                <p className="text-sm font-bold">{type === 'success' ? 'Sucesso!' : 'Erro!'}</p>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{message}</p>
            </div>
            <button onClick={onClose} className="flex-shrink-0 size-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Fechar notificação">
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
    );
};
