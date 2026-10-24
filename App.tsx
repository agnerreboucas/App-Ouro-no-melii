
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { SupplierOfferPage } from './pages/SupplierOfferPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { StrategyPage } from './pages/StrategyPage';
import { HomeHubPage } from './pages/HomeHubPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { SupplierDashboardPage } from './pages/admin/SupplierDashboardPage';
import { UserDashboardPage } from './pages/dashboard/UserDashboardPage';
import { LoanCalculatorPage } from './pages/LoanCalculatorPage';
import { AffiliatePage } from './pages/AffiliatePage';
import { ApiSettingsPage } from './pages/ApiSettingsPage';
import { SettingsPage } from './pages/SettingsPage';
import { GuidePage } from './pages/guide/GuidePage';
import { MarketIntelligencePage } from './pages/MarketIntelligencePage';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { MagicNumbersPanel } from './components/MagicNumbersPanel';
import { DrePanel } from './components/DrePanel';
import { CalculationInfoModal } from './components/CalculationInfoModal';
import { SearchByImageModal } from './components/SearchByImageModal';
import { Toast } from './components/Toast';
import { calculateMetrics } from './services/calculationService';
import { dbSaveSimulation, dbDeleteSimulation, dbSaveInsight, dbSaveReportLog, dbGetReports, dbGetSimulations, dbGetInsights, syncUserProfile } from './services/persistenceService';
import type { UserSettings, CalculatorInputs, SavedSimulation, SavedInsight, Supplier, SavedReport, HighlightedProduct, MarketIntelligence } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [simulations, setSimulations] = useState<SavedSimulation[]>([]);
  const [insights, setInsights] = useState<SavedInsight[]>([]);
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [activeSupplier, setActiveSupplier] = useState<Supplier | undefined>(undefined);
  const [activeOffer, setActiveOffer] = useState<{ supplier: Supplier; product: HighlightedProduct } | null>(null);
  const [strategyState, setStrategyState] = useState<{ skuId: string; prompt: string } | null>(null);
  const [marketIntelligenceData, setMarketIntelligenceData] = useState<{ mi: MarketIntelligence, imageUrl: string } | null>(null);
  const [activeSupplierId, setActiveSupplierId] = useState<string | null>(null);

  const [settings, setSettings] = useState<UserSettings>({
    userName: 'Garimpeiro',
    userPhone: '',
    companyName: '',
    email: '',
    city: '',
    subscriptionLevel: 'free',
    searchesToday: 0,
    lastSearchDate: new Date().toISOString(),
    savesCount: 0,
    savesLimit: 10,
    defaultTargetMarginPercentage: 0.15,
    defaultTargetRoiPercentage: 0.30,
    defaultTaxPercentage: 0.08,
    defaultPackagingCost: 0,
    defaultShippingCost: 0,
    defaultOtherCost: 0,
    defaultAdsPercentage: 0.10,
    defaultMlFeeType: 'classic',
    defaultPromotionPercentage: 0,
    defaultProLaborePercentage: 0.07,
    preferredCalculator: 'meli',
  });

  const [meliInputs, setMeliInputs] = useState<CalculatorInputs>({
    productName: '',
    productCost: 0,
    sellPrice: 0,
    mlFeeType: 'classic',
    mlFeePercentage: 0.11,
    adsPercentage: 0.10,
    taxPercentage: 0.08,
    packagingCost: 0,
    shippingCost: 0,
    otherCost: 0,
    isFull: false,
    fullCost: 0,
    targetMarginPercentage: 0.15,
    targetRoiPercentage: 0.30,
    promotionPercentage: 0,
    proLaborePercentage: 0.07,
    additionalFees: []
  });

  const [physicalInputs, setPhysicalInputs] = useState<CalculatorInputs>({
    productName: '',
    productCost: 0,
    sellPrice: 0,
    mlFeeType: 'other',
    mlFeePercentage: 0,
    adsPercentage: 0,
    taxPercentage: 0,
    packagingCost: 0,
    shippingCost: 0,
    otherCost: 0,
    isFull: false,
    fullCost: 0,
    targetMarginPercentage: 0.15,
    targetRoiPercentage: 0.30,
    promotionPercentage: 0,
    proLaborePercentage: 0,
    additionalFees: []
  });

  const meliOutputs = useMemo(() => calculateMetrics(meliInputs), [meliInputs]);
  const physicalOutputs = useMemo(() => calculateMetrics(physicalInputs), [physicalInputs]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    if (isAuthenticated && settings.email) {
        const loadAllData = async () => {
            const [s, i, r] = await Promise.all([
                dbGetSimulations(settings.email),
                dbGetInsights(settings.email),
                dbGetReports(settings.email)
            ]);
            setSimulations(s || []);
            setInsights(i || []);
            setReports(r || []);
        };
        loadAllData();
    }
  }, [isAuthenticated, settings.email]);

  const handleSaveReportLog = async (report: SavedReport) => {
    await dbSaveReportLog(settings.email, report);
    setReports(prev => [report, ...prev]);
    showToast("Auditoria registrada no histórico.");
  };
  
  const handleSaveSimulation = async (type: 'meli' | 'physical' = 'meli') => {
    const inputs = type === 'meli' ? meliInputs : physicalInputs;
    const outputs = type === 'meli' ? meliOutputs : physicalOutputs;

    if (!inputs.productName) {
        showToast("Dê um nome ao produto antes de salvar.", "error");
        return;
    }
    
    const simToSave: SavedSimulation = {
        id: `sim-${Date.now()}`,
        name: inputs.productName,
        createdAt: new Date().toISOString(),
        inputs: inputs,
        outputs: outputs,
        tags: (type === 'physical' ? ['loja_fisica'] : []),
        simulationType: type
    };

    await dbSaveSimulation(settings.email, simToSave);
    setSimulations([simToSave, ...simulations]);
    setSettings(prev => ({...prev, savesCount: prev.savesCount + 1}));
    showToast(`Produto salvo no portfólio ${type === 'physical' ? 'Físico' : 'Meli'}!`);
  };

  const handleLoadToCalculator = (name: string, cost: number, price: number, supplier?: Supplier) => {
    if (activeView === 'calculator_physical') {
      setPhysicalInputs(prev => ({ ...prev, productName: name, productCost: cost, sellPrice: price }));
    } else {
      setMeliInputs(prev => ({ ...prev, productName: name, productCost: cost, sellPrice: price }));
      setActiveView('calculator');
    }
    setActiveSupplier(supplier);
    showToast("Dados carregados com sucesso.");
  };

  const handleDataFoundBySearch = (data: { productName: string; sellPrice: number; category: string; imageUrl?: string }) => {
      if (activeView === 'calculator_physical') {
          setPhysicalInputs(prev => ({ ...prev, productName: data.productName, sellPrice: data.sellPrice }));
      } else {
          setMeliInputs(prev => ({ ...prev, productName: data.productName, sellPrice: data.sellPrice, imageUrl: data.imageUrl, category: data.category }));
          setActiveView('calculator');
      }
      showToast("Produto minerado!");
  };

  const renderContent = () => {
    if (!isAuthenticated) {
        if (activeView === 'login') return <LoginPage onLogin={(u) => { setIsAuthenticated(true); setActiveView('home'); if(u) setSettings(s => ({...s, ...u})); }} onNavigate={setActiveView} showToast={showToast} />;
        if (activeView === 'pricing') return <PricingPage onNavigate={setActiveView} />;
        return <LandingPage onNavigate={setActiveView} />;
    }

    switch (activeView) {
      case 'home': return <HomeHubPage settings={settings} onNavigate={setActiveView} onOpenSearchByImage={() => setIsSearchModalOpen(true)} />;
      case 'marketIntelligence': 
        return marketIntelligenceData ? (
            <MarketIntelligencePage 
                mi={marketIntelligenceData.mi} 
                imageUrl={marketIntelligenceData.imageUrl} 
                onBack={() => setActiveView('home')} 
                onUseInCalculator={(name, price) => handleLoadToCalculator(name, 0, price)}
            />
        ) : <HomeHubPage settings={settings} onNavigate={setActiveView} onOpenSearchByImage={() => setIsSearchModalOpen(true)} />;
      case 'suppliers': return <SuppliersPage email={settings.email} onLoadToCalculator={handleLoadToCalculator} onOpenOffer={(s, p) => { setActiveOffer({ supplier: s, product: p }); setActiveView('supplierOffer'); }} settings={settings} isAdmin={true} />;
      case 'portfolio': return <PortfolioPage reports={reports} simulations={simulations} insights={insights} onViewDetail={(s) => { if(s.simulationType === 'physical') { setPhysicalInputs(s.inputs); setActiveView('calculator_physical'); } else { setMeliInputs(s.inputs); setActiveView('calculator'); } }} onViewInsightDetail={() => {}} onDeleteSimulation={dbDeleteSimulation} onDeleteInsight={() => {}} onUpdateTags={() => {}} onNew={() => setActiveView('calculator')} onEdit={() => {}} onUpdateImage={() => {}} onUpdateInPlace={() => {}} onToggleFavorite={() => {}} onNavigate={setActiveView} onRedoReport={(r) => { setMeliInputs(r.inputsSnapshot); setActiveView('calculator'); showToast("Auditoria restaurada."); }} />;
      case 'calculator':
        return (
          <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-fade-in-up">
            <div className="lg:col-span-4"><InputPanel inputs={meliInputs} setInputs={setMeliInputs} /></div>
            <div className="lg:col-span-4"><ResultsPanel outputs={meliOutputs} aiInsight={null} isLoading={false} onNavigateToStrategy={() => {}} onSave={() => handleSaveSimulation('meli')} /></div>
            <div className="lg:col-span-4 space-y-6">
                <MagicNumbersPanel outputs={meliOutputs} />
                <DrePanel dre={meliOutputs.dre} outputs={meliOutputs} inputs={meliInputs} settings={settings} onOpenInfoModal={() => setIsInfoDrawerOpen(true)} activeSupplier={activeSupplier} onSaveReportLog={handleSaveReportLog} onSave={() => handleSaveSimulation('meli')} />
            </div>
          </main>
        );
      case 'calculator_physical':
        return (
          <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-fade-in-up">
            <div className="lg:col-span-4"><InputPanel inputs={physicalInputs} setInputs={setPhysicalInputs} isPhysical /></div>
            <div className="lg:col-span-4"><ResultsPanel outputs={physicalOutputs} aiInsight={null} isLoading={false} onNavigateToStrategy={() => {}} onSave={() => handleSaveSimulation('physical')} /></div>
            <div className="lg:col-span-4 space-y-6">
                <MagicNumbersPanel outputs={physicalOutputs} />
                <DrePanel dre={physicalOutputs.dre} outputs={physicalOutputs} inputs={physicalInputs} settings={settings} onOpenInfoModal={() => setIsInfoDrawerOpen(true)} onSaveReportLog={handleSaveReportLog} onSave={() => handleSaveSimulation('physical')} />
            </div>
          </main>
        );
      case 'strategy': return <StrategyPage simulations={simulations} settings={settings} onNavigate={setActiveView} onSaveInsight={async (c,t,id) => { await dbSaveInsight(settings.email, { id: `in-${Date.now()}`, name: t, content: c, type: t, associatedSkuId: id, associatedSkuName: simulations.find(s=>s.id===id)?.name || 'SKU', createdAt: new Date().toISOString() }); showToast("Estratégia Salva!"); }} initialState={strategyState} onInitialStateConsumed={() => setStrategyState(null)} />;
      case 'affiliates': return <AffiliatePage settings={settings} showToast={showToast} onNavigate={setActiveView} />;
      case 'adminDashboard': return <AdminDashboardPage onNavigateToSupplierDashboard={(sid) => { setActiveSupplierId(sid); setActiveView('supplierDashboard'); }} onNavigate={setActiveView} />;
      case 'supplierDashboard': return activeSupplierId ? <SupplierDashboardPage supplierId={activeSupplierId} onBack={() => setActiveView('adminDashboard')} /> : <AdminDashboardPage onNavigateToSupplierDashboard={(sid) => { setActiveSupplierId(sid); setActiveView('supplierDashboard'); }} onNavigate={setActiveView} />;
      case 'profile': return <SettingsPage settings={settings} onSave={(ns) => { setSettings(ns); syncUserProfile(ns.email, ns); showToast("Perfil atualizado."); }} />;
      default: return <HomeHubPage settings={settings} onNavigate={setActiveView} onOpenSearchByImage={() => setIsSearchModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col font-display overflow-x-hidden">
        <Header activeView={activeView} setActiveView={setActiveView} settings={settings} isAuthenticated={isAuthenticated} isAdmin={true} onLogout={() => setIsAuthenticated(false)} onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} activeView={activeView} setActiveView={setActiveView} isAuthenticated={isAuthenticated} isAdmin={true} onLogout={() => setIsAuthenticated(false)} onOpenSearchByImage={() => setIsSearchModalOpen(true)} />

        <div className="flex flex-1 overflow-hidden relative">
            {isAuthenticated && <Sidebar activeView={activeView} setActiveView={setActiveView} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} isAuthenticated={isAuthenticated} isAdmin={true} onOpenSearchByImage={() => setIsSearchModalOpen(true)} />}
            <div className="flex-1 overflow-y-auto">
                {renderContent()}
                <Footer onNavigate={setActiveView} />
            </div>
        </div>
        
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <CalculationInfoModal isOpen={isInfoDrawerOpen} onClose={() => setIsInfoDrawerOpen(false)} />
        <SearchByImageModal 
            isOpen={isSearchModalOpen} 
            onClose={() => setIsSearchModalOpen(false)} 
            settings={settings} 
            onDataFound={handleDataFoundBySearch} 
            onMarketIntelligence={(mi, img) => { setMarketIntelligenceData({ mi, imageUrl: img }); setActiveView('marketIntelligence'); setIsSearchModalOpen(false); }} 
        />
    </div>
  );
};
export default App;
