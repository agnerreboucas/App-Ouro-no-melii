
import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Partner, ReferralLead, PartnerCategory, UserSettings, AudienceAnalysis, HighlightedProduct, Supplier } from '../types';
import { dbRegisterPartner, dbGetPartnerByEmail, dbGetReferralsForPartner, dbUpdatePartnerAnalysis } from '../services/persistenceService';
import { analyzePartnerAudience } from '../services/aiService';
import { suppliersData } from '../data/suppliersData';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface AffiliatePageProps {
    settings: UserSettings;
    showToast: (msg: string, type?: 'success' | 'error') => void;
    onNavigate?: (view: string) => void;
}

type TabType = 'metrics' | 'dossier' | 'links' | 'sales';

export const AffiliatePage: React.FC<AffiliatePageProps> = ({ settings, showToast, onNavigate }) => {
    const [step, setStep] = useState<'landing' | 'profile' | 'dashboard'>('landing');
    const [activeTab, setActiveTab] = useState<TabType>('metrics');
    const [partner, setPartner] = useState<Partner | null>(null);
    const [leads, setLeads] = useState<ReferralLead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const [formData, setFormData] = useState({
        name: settings.userName || '',
        category: 'Influencer' as PartnerCategory,
        phone: settings.userPhone || '',
        email: settings.email || '',
        pixKey: '',
        instagram: '',
        tiktok: '',
        youtube: '',
        blog: '',
        website: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkPartner = async () => {
            setIsLoading(true);
            try {
                if (settings.email) {
                    const p = await dbGetPartnerByEmail(settings.email);
                    if (p) {
                        setPartner(p);
                        const l = await dbGetReferralsForPartner(p.id);
                        setLeads(l);
                        setStep('dashboard');
                    } else {
                        setStep('landing');
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar parceiro:", err);
            } finally {
                setIsLoading(false);
            }
        };
        checkPartner();
    }, [settings.email]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const refCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newPartner: Partner = {
            id: `pt-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            category: formData.category,
            pixKey: formData.pixKey,
            referralCode: refCode,
            createdAt: new Date().toISOString(),
            socialLinks: {
                instagram: formData.instagram,
                tiktok: formData.tiktok,
                youtube: formData.youtube,
                blog: formData.blog,
                website: formData.website
            },
            stats: { clicks: 0, leads: 0, sales: { basic: 0, pro: 0, annual: 0 }, totalEarned: 0 }
        };
        await dbRegisterPartner(newPartner);
        setPartner(newPartner);
        setStep('dashboard');
        showToast("Seja bem-vindo ao Time de Elite!", "success");
    };

    const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        setIsAnalyzing(true);
        const images: {data: string, mime: string}[] = [];
        
        try {
            const limit = Math.min(files.length, 10);
            for (let i = 0; i < limit; i++) {
                const file = files[i];
                const base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const result = ev.target?.result as string;
                        resolve(result.split(',')[1]);
                    };
                    reader.readAsDataURL(file);
                });
                images.push({ data: base64, mime: file.type });
            }

            const analysis = await analyzePartnerAudience(images, settings);
            if (partner && analysis) {
                await dbUpdatePartnerAnalysis(partner.id, analysis);
                setPartner(prev => prev ? ({...prev, audienceAnalysis: analysis}) : null);
                showToast("Dossiê Neural gerado!", "success");
                setActiveTab('dossier'); // Força mudança de aba para mostrar os resultados
            } else {
                throw new Error();
            }
        } catch (err) {
            showToast("Falha na auditoria. Tente prints mais nítidos.", "error");
        } finally {
            setIsAnalyzing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const exportPDFDossier = () => {
        const analysis = partner?.audienceAnalysis;
        if (!analysis) return;
        
        const doc = new jsPDF() as any;
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFillColor(26, 61, 91);
        doc.rect(0, 0, pageWidth, 55, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("DOSSIÊ DE INTELIGÊNCIA DE AUDIÊNCIA", margin, 30);
        
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.text(`INTELIGÊNCIA GARIMPO DIGITAL | EMITIDO: ${new Date().toLocaleDateString()}`, margin, 40);

        doc.setTextColor(40);
        doc.setFontSize(14);
        doc.text("1. Raio-X Demográfico e Engajamento", margin, 70);
        
        doc.autoTable({
            startY: 75,
            margin: { left: margin, right: margin },
            head: [['Indicador', 'Métrica Auditada']],
            body: [
                ['Alcance Estimado', analysis.reachLabel || 'N/A'],
                ['Público Feminino', `${analysis.demographics?.gender?.female || 0}%`],
                ['Público Masculino', `${analysis.demographics?.gender?.male || 0}%`],
                ['Idade Predominante', analysis.demographics?.topAgeRange || 'N/A'],
                ['Nicho de Influência', analysis.predominantNiche || 'N/A'],
                ['Taxa de Engajamento', `${analysis.engagementRate || 0}%`],
                ['Power Score IA', `${analysis.authorityScore || 0}/100`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [0, 150, 204] }
        });

        doc.save(`Dossie_${partner?.name.replace(/\s/g, '_')}.pdf`);
    };

    const copyAffiliateLink = (prodName: string) => {
        const link = `${window.location.origin}/?ref=${partner?.referralCode}&product=${encodeURIComponent(prodName)}`;
        navigator.clipboard.writeText(link);
        showToast("Link de Ouro copiado!", "success");
    };

    if (isLoading) return <div className="p-20 text-center font-black animate-pulse text-primary uppercase">Validando Rede...</div>;

    if (step === 'landing') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-8 animate-fade-in-up">
                <div className="size-24 bg-primary text-secondary rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-12 transform hover:rotate-0 transition-transform duration-500">
                    <span className="material-symbols-outlined text-5xl">handshake</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
                    Venda Inteligência. <br/><span className="text-primary italic">Lucre com Dados.</span>
                </h1>
                <p className="text-xl text-gray-500 font-bold max-w-xl">
                    Seja um Sócio Gold. Use nosso laboratório de IA para auditar sua audiência e lucrar 30% em indicações.
                </p>
                <button onClick={() => setStep('profile')} className="px-12 py-6 bg-primary text-secondary font-black rounded-2xl text-2xl uppercase shadow-2xl hover:scale-105 transition-all">Ativar Minha Conta</button>
            </div>
        );
    }

    if (step === 'profile') {
        const inputCls = "w-full h-14 px-5 rounded-2xl border border-border-light bg-white font-bold text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all";
        return (
            <div className="max-w-3xl mx-auto p-6 md:p-12 animate-fade-in-up">
                <form onSubmit={handleRegister} className="bg-card-light p-10 rounded-[3rem] border border-border-light shadow-2xl space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-black uppercase">Perfil de <span className="text-primary">Sócio Gold</span></h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Dados para recebimentos.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input required value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} placeholder="Seu Nome / Agência" className={inputCls} />
                        <input required value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} placeholder="WhatsApp" className={inputCls} />
                        <input required value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} placeholder="E-mail" className={inputCls} />
                        <input required value={formData.pixKey} onChange={e=>setFormData({...formData, pixKey:e.target.value})} placeholder="Chave PIX" className={inputCls} />
                    </div>
                    <button type="submit" className="w-full py-6 bg-primary text-secondary font-black rounded-2xl text-xl uppercase shadow-xl hover:scale-[1.02] transition-all">Finalizar e Abrir Painel</button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-12 space-y-10 pb-40 animate-fade-in-up">
            <header className="bg-secondary p-10 rounded-[3rem] text-white flex flex-col md:flex-row md:items-end justify-between gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-30px] right-[-30px] size-80 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="space-y-4 relative z-10">
                    <h1 className="text-5xl font-black uppercase tracking-tighter">Olá, <span className="text-primary">{partner?.name.split(' ')[0]}</span>.</h1>
                    <p className="text-sm font-bold text-gray-300">Link Mestre: <span className="text-white font-black bg-white/10 px-3 py-1 rounded-lg ml-2">{partner?.referralCode}</span></p>
                </div>
                <div className="flex flex-wrap gap-3 relative z-10">
                    <button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing} className="px-8 py-4 bg-primary text-secondary font-black rounded-2xl text-xs uppercase shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                        {isAnalyzing ? "Analisando..." : "Auditoria de Prints"}
                        {!isAnalyzing && <span className="material-symbols-outlined text-sm">analytics</span>}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleBatchUpload} multiple accept="image/*" className="hidden" />
                </div>
            </header>

            <div className="flex border-b border-border-light overflow-x-auto scrollbar-hide gap-8">
                {[{id: 'metrics', label: 'Performance', icon: 'dashboard'}, {id: 'dossier', label: 'Dossiê IA', icon: 'psychology'}, {id: 'links', label: 'Links', icon: 'sell'}, {id: 'sales', label: 'Financeiro', icon: 'payments'}].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === tab.id ? 'border-primary text-secondary' : 'border-transparent text-gray-400 hover:text-secondary'}`}>
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>{tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'metrics' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-card-light p-8 rounded-[2rem] border border-border-light shadow-sm">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Ganhos</p>
                        <p className="text-4xl font-black text-primary">R$ {partner?.stats.totalEarned.toFixed(2)}</p>
                    </div>
                    <div className="bg-card-light p-8 rounded-[2rem] border border-border-light shadow-sm">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cliques</p>
                        <p className="text-4xl font-black">{partner?.stats.clicks}</p>
                    </div>
                </div>
            )}

            {activeTab === 'dossier' && (
                <div className="space-y-8 animate-fade-in-up">
                    {partner?.audienceAnalysis ? (
                        <div className="bg-card-light p-10 rounded-[3rem] border-2 border-primary/20 shadow-2xl space-y-10">
                            <div className="flex justify-between items-start">
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Auditoria <span className="text-primary">Varejista</span></h2>
                                <button onClick={exportPDFDossier} className="px-8 py-4 bg-secondary text-white font-black rounded-2xl text-xs uppercase shadow-xl flex items-center gap-2 hover:bg-primary transition-all">
                                    <span className="material-symbols-outlined text-base">picture_as_pdf</span> Baixar PDF
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-8 bg-background-light rounded-3xl border border-border-light space-y-4">
                                    <p className="text-[10px] font-black uppercase text-gray-400">Demografia</p>
                                    <div className="flex justify-between text-xs font-black">
                                        <span className="text-pink-500">Fem: {partner.audienceAnalysis.demographics?.gender?.female || 0}%</span>
                                        <span className="text-primary">Masc: {partner.audienceAnalysis.demographics?.gender?.male || 0}%</span>
                                    </div>
                                </div>
                                <div className="p-8 bg-background-light rounded-3xl border border-border-light space-y-4">
                                    <p className="text-[10px] font-black uppercase text-gray-400">Power Score</p>
                                    <p className="text-3xl font-black text-secondary">{partner.audienceAnalysis.authorityScore}/100</p>
                                </div>
                                <div className="p-8 bg-background-light rounded-3xl border border-border-light space-y-4">
                                    <p className="text-[10px] font-black uppercase text-gray-400">Nicho</p>
                                    <p className="text-xl font-black uppercase">{partner.audienceAnalysis.predominantNiche}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-primary/5 p-20 rounded-[3rem] border-2 border-dashed border-primary/20 text-center space-y-8">
                            <span className="material-symbols-outlined text-8xl text-primary animate-bounce">analytics</span>
                            <h2 className="text-3xl font-black uppercase">Auditoria IA Necessária</h2>
                            <p className="text-base text-gray-500 font-bold max-w-lg mx-auto">Suba prints das métricas da sua rede social para gerar seu dossiê comercial.</p>
                            <button onClick={() => fileInputRef.current?.click()} className="px-12 py-5 bg-primary text-secondary font-black rounded-2xl text-xl uppercase shadow-2xl hover:scale-105 transition-all">Começar Agora</button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'links' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {suppliersData.flatMap(s => (s.highlightedProducts || []).map((p, i) => (
                        <div key={`${s.id}-${i}`} className="bg-card-light p-8 rounded-[2.5rem] border border-border-light flex flex-col group hover:border-primary transition-all shadow-sm">
                            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 mb-6">
                                <img src={p.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 mb-6">
                                <h3 className="text-lg font-black uppercase truncate">{p.name}</h3>
                                <p className="font-black text-green-500">Lucro Estimado: 30%</p>
                            </div>
                            <button onClick={() => copyAffiliateLink(p.name)} className="w-full py-4 bg-secondary text-white text-xs font-black uppercase rounded-xl hover:bg-primary transition-all">Gerar Link</button>
                        </div>
                    )))}
                </div>
            )}
        </div>
    );
};
