
import React from 'react';

interface MobileNavItemProps {
    icon: string;
    label: string;
    viewName: string;
    activeView: string;
    onClick: (view: string) => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ icon, label, viewName, activeView, onClick }) => {
    const isActive = activeView === viewName;
    return (
        <a 
            href="#"
            onClick={(e) => { e.preventDefault(); onClick(viewName); }}
            className={`flex items-center gap-4 px-6 py-3.5 text-base font-black transition-colors ${isActive ? 'text-primary bg-primary/5 border-l-4 border-primary' : 'text-text-light-primary dark:text-text-dark-primary border-l-4 border-transparent'}`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            <span>{label}</span>
        </a>
    );
};

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    activeView: string;
    setActiveView: (view: string) => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    onLogout: () => void;
    onOpenSearchByImage: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, activeView, setActiveView, isAuthenticated, isAdmin, onLogout, onOpenSearchByImage }) => {
    if (!isOpen) return null;
    
    const handleNavClick = (view: string) => {
        setActiveView(view);
        onClose();
    };

    const handleSearchClick = () => {
        onOpenSearchByImage();
        onClose();
    };


    const renderNavItems = () => {
        if (!isAuthenticated) return <MobileNavItem icon="home" label="Início" viewName="login" activeView={activeView} onClick={handleNavClick} />;

        return (
            <>
                {isAdmin && (
                    <MobileNavItem icon="admin_panel_settings" label="Dashboard Master" viewName="adminDashboard" activeView={activeView} onClick={handleNavClick} />
                )}
                <MobileNavItem icon="home" label="Início" viewName="home" activeView={activeView} onClick={handleNavClick} />
                <MobileNavItem icon="calculate" label="Calculadora Mercado Livre" viewName="calculator" activeView={activeView} onClick={handleNavClick} />
                <a href="#" onClick={(e) => { e.preventDefault(); handleSearchClick(); }} className="flex items-center gap-4 px-6 py-3.5 text-base font-black text-text-light-primary dark:text-text-dark-primary border-l-4 border-transparent">
                    <span className="material-symbols-outlined">photo_camera</span>
                    <span>Garimpo Digital IA</span>
                </a>
                <MobileNavItem icon="group_work" label="Lista de produtos e fornecedores" viewName="suppliers" activeView={activeView} onClick={handleNavClick} />
                <MobileNavItem icon="inventory_2" label="Portfólio Mercado Livre" viewName="portfolio" activeView={activeView} onClick={handleNavClick} />
                <MobileNavItem icon="psychology" label="Estratégia IA" viewName="strategy" activeView={activeView} onClick={handleNavClick} />
                <MobileNavItem icon="credit_score" label="Crédito Mercado Livre" viewName="loan-calculator" activeView={activeView} onClick={handleNavClick} />
                <MobileNavItem icon="dashboard" label="Performance" viewName="userDashboard" activeView={activeView} onClick={handleNavClick} />
                
                <hr className="my-2 opacity-10" />
                <MobileNavItem icon="point_of_sale" label="Painel de Revendedor" viewName="affiliates" activeView={activeView} onClick={handleNavClick} />
                
                <hr className="my-2 opacity-10" />
                <MobileNavItem icon="tune" label="Engines de IA" viewName="aiSettings" activeView={activeView} onClick={handleNavClick} />
                <MobileNavItem icon="person" label="Meu Perfil" viewName="profile" activeView={activeView} onClick={handleNavClick} />
            </>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-card-light dark:bg-card-dark z-50 md:hidden flex flex-col" role="dialog" aria-modal="true">
            <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
                 <div className="flex items-center gap-4 text-text-light-primary dark:text-text-dark-primary">
                    <h2 className="text-xl font-black">Navegação</h2>
                </div>
                <button onClick={onClose} className="size-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800" aria-label="Fechar menu">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            <nav className="flex-grow py-4 overflow-y-auto">
                {renderNavItems()}
            </nav>
            <div className="p-6 mt-auto border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                {isAuthenticated ? (
                    <button onClick={onLogout} className="w-full text-center px-6 py-4 bg-red-500/10 text-red-500 font-black rounded-xl">Encerrar Sessão</button>
                ) : (
                    <button onClick={() => handleNavClick('login')} className="w-full text-center px-6 py-4 bg-primary text-text-light-primary font-black rounded-xl shadow-lg shadow-primary/20">Entrar</button>
                )}
            </div>
        </div>
    );
};
