
import React from 'react';

interface SidebarNavItemProps {
    icon: string;
    label: string;
    viewName: string;
    activeView: string;
    isCollapsed: boolean;
    onClick: (view: string) => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ icon, label, viewName, activeView, isCollapsed, onClick }) => {
    const isActive = activeView === viewName;
    return (
        <a 
            href="#"
            onClick={(e) => { e.preventDefault(); onClick(viewName); }}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title={isCollapsed ? label : undefined}
        >
            <span className="material-symbols-outlined">{icon}</span>
            {!isCollapsed && <span className="text-sm font-bold">{label}</span>}
        </a>
    );
};


interface SidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    onOpenSearchByImage: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isCollapsed, setIsCollapsed, isAuthenticated, isAdmin, onOpenSearchByImage }) => {
    
    const renderNavItems = () => {
        if (!isAuthenticated) return null;

        return (
            <div className="flex flex-col gap-1">
                {/* GESTÃO (APENAS ADMIN) */}
                {isAdmin && (
                    <>
                        <SidebarNavItem icon="admin_panel_settings" label="Dashboard Master" viewName="adminDashboard" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                        <hr className="my-3 border-border-light dark:border-border-dark opacity-30" />
                    </>
                )}

                {/* OPERAÇÃO (COMUM) */}
                <SidebarNavItem icon="home" label="Início" viewName="home" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                <SidebarNavItem icon="calculate" label="Calculadora Mercado Livre" viewName="calculator" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                <a 
                    href="#"
                    onClick={(e) => { e.preventDefault(); onOpenSearchByImage(); }}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
                    title={isCollapsed ? "Garimpo Digital IA" : undefined}
                >
                    <span className="material-symbols-outlined">photo_camera</span>
                    {!isCollapsed && <span className="text-sm font-bold">Garimpo Digital IA</span>}
                </a>
                <SidebarNavItem icon="group_work" label="Lista de produtos e fornecedores" viewName="suppliers" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                <SidebarNavItem icon="inventory_2" label="Portfólio Mercado Livre" viewName="portfolio" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                <SidebarNavItem icon="psychology" label="Estratégia IA" viewName="strategy" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                <SidebarNavItem icon="credit_score" label="Crédito Mercado Livre" viewName="loan-calculator" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                <SidebarNavItem icon="dashboard" label="Performance" viewName="userDashboard" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                
                {/* PROGRAMA DE REVENDEDORES / PARCEIROS */}
                <hr className="my-3 border-border-light dark:border-border-dark opacity-30" />
                <SidebarNavItem icon="point_of_sale" label="Painel de Revendedor" viewName="affiliates" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                
                <div className="mt-6">
                    <hr className="my-3 border-border-light dark:border-border-dark opacity-30" />
                    <SidebarNavItem icon="tune" label="Config. IA" viewName="aiSettings" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                    <SidebarNavItem icon="person" label="Meu Perfil" viewName="profile" activeView={activeView} onClick={setActiveView} isCollapsed={isCollapsed} />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <aside className={`hidden md:flex flex-col bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark p-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-64'}`}>
            <nav className="flex-grow space-y-1 overflow-y-auto scrollbar-hide">
                {renderNavItems()}
            </nav>
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="mt-4 flex items-center gap-4 px-4 py-3 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
                <span className={`material-symbols-outlined transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>chevron_left</span>
                {!isCollapsed && <span className="text-sm font-bold">Recolher</span>}
            </button>
        </aside>
    );
};
