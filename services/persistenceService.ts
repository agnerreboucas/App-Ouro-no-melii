
import { supabase } from './supabaseClient';
import type { UserSettings, SavedSimulation, SavedInsight, Partner, ReferralLead, SavedReport, PartnerCategory, AudienceAnalysis } from '../types';

// --- MOCK DATA PARA DASHBOARDS ---
// FIX: Updated MOCK_PARTNERS to strictly follow the Partner and AudienceAnalysis interfaces from types.ts
const MOCK_PARTNERS: Partner[] = [
    { 
        id: "pt-1", 
        name: "Bruno Logística & Tech", 
        email: "bruno@exemplo.com", 
        phone: "1199999999", 
        category: "Influencer", 
        pixKey: "bruno@pix.com", 
        referralCode: "BRUNO30", 
        createdAt: new Date().toISOString(),
        socialLinks: {
            website: "https://brunologistica.com.br",
            instagram: "@brunologistica"
        },
        audienceAnalysis: {
            reachEstimate: 1200000, 
            reachLabel: "1.2M", 
            predominantNiche: "Logística e Varejo", 
            subNiches: ["Transporte", "E-commerce", "Gestão"], 
            engagementLevel: "Alto (4.8%)", 
            engagementRate: 4.8,
            topCities: ["São Paulo", "Rio de Janeiro", "Curitiba"],
            demographics: { 
                gender: { male: 85, female: 15 }, 
                // FIX: Added missing ageDistribution property
                ageDistribution: [
                    { range: "25-34", percentage: 40 },
                    { range: "35-44", percentage: 60 }
                ],
                topAgeRange: "25-44 anos" 
            },
            psychographics: { 
                interests: ["Tecnologia", "Empreendedorismo", "Carros"], 
                behaviors: ["Compras online frequentes", "Buscadores de produtividade"], 
                lifestyle: "Executivo urbano focado em performance." 
            },
            recommendedApproach: "Focar em eficiência operacional.", 
            targetIndustries: ["Tires/Pneus", "Fuel/Combustível", "Logística", "Segurança"], 
            authorityScore: 92,
            // FIX: Added missing required property contentRecommendations
            contentRecommendations: ["Otimização de rotas", "Equipamentos logísticos"]
        },
        // FIX: Removed invalid networkSales and roiGenerated properties from stats
        stats: { 
            clicks: 5000, 
            leads: 1200, 
            sales: { basic: 40, pro: 10, annual: 6 }, 
            totalEarned: 15400 
        }
    },
    { 
        id: "pt-2", 
        name: "Luiza Home Decor", 
        email: "luiza@exemplo.com", 
        phone: "2199999999", 
        category: "Influencer", 
        pixKey: "luiza@pix.com", 
        referralCode: "LUIZA10", 
        createdAt: new Date().toISOString(),
        socialLinks: {
            website: "https://casadaluiza.com",
            instagram: "@casadaluiza"
        },
        audienceAnalysis: {
            reachEstimate: 450000, 
            reachLabel: "450k", 
            predominantNiche: "Casa e Cozinha", 
            subNiches: ["Decoração", "Organização"], 
            engagementLevel: "Médio (3.2%)", 
            engagementRate: 3.2,
            topCities: ["Belo Horizonte", "São Paulo", "Fortaleza"],
            demographics: { 
                gender: { male: 20, female: 80 }, 
                // FIX: Added missing ageDistribution property
                ageDistribution: [
                    { range: "18-24", percentage: 20 },
                    { range: "25-34", percentage: 80 }
                ],
                topAgeRange: "25-34 anos" 
            },
            psychographics: { 
                interests: ["Decoração de Interiores", "Artesanato", "Gastronomia"], 
                behaviors: ["Público visual", "Decisores de compra familiar"], 
                lifestyle: "Público focado em bem-estar no lar e estética." 
            },
            recommendedApproach: "Focar em estética.", 
            targetIndustries: ["Embalagens de Papel", "Plástico Bolha", "Fitas Decorativas", "Utensílios"], 
            authorityScore: 88,
            // FIX: Added missing required property contentRecommendations
            contentRecommendations: ["DIY Casa", "Dicas de Organização"]
        },
        // FIX: Removed invalid networkSales and roiGenerated properties from stats
        stats: { 
            clicks: 2100, 
            leads: 400, 
            sales: { basic: 12, pro: 5, annual: 2 }, 
            totalEarned: 4200 
        }
    }
];

export const dbGetClickCounts = async (): Promise<{ total: number }> => {
    return { total: 483 }; // Mocked
};

export const dbGetAllPartners = async (): Promise<Partner[]> => {
    return MOCK_PARTNERS; // Mocked
};

export const dbUpdatePartnerAnalysis = async (partnerId: string, analysis: AudienceAnalysis) => {
    try {
        await supabase.from('partners').update({ audience_analysis_json: analysis }).eq('id', partnerId);
    } catch (e) { console.error(e); }
};

export const dbGetSupplierStats = async (supplierId: string): Promise<any> => {
    return {
        productViews: 1250, offerClicks: 340, contactClicks: 85, calculations: 450,
        topProducts: [
            { name: 'Máscara Facial Kyráv', calculations: 120, avgMargin: '32.5' },
            { name: 'Sérum Vitamina C', calculations: 95, avgMargin: '28.1' },
            { name: 'Batom Matte Vivai', calculations: 88, avgMargin: '45.2' },
        ]
    };
};

export const dbSaveReportLog = async (userEmail: string, report: SavedReport) => {
    try {
        // FIX: Used report.inputsSnapshot and report.outputsSnapshot instead of underscore versions
        await supabase.from('user_reports').insert({ 
            id: report.id, 
            user_email: userEmail, 
            product_name: report.productName, 
            category: report.category || 'Geral', 
            inputs_snapshot: report.inputsSnapshot, 
            outputs_snapshot: report.outputsSnapshot, 
            created_at: report.createdAt 
        });
    } catch (e) { console.error(e); }
};

export const dbGetReports = async (userEmail: string): Promise<SavedReport[]> => {
    try {
        const { data } = await supabase.from('user_reports').select('*').eq('user_email', userEmail).order('created_at', { ascending: false });
        return (data || []).map(item => ({ id: item.id, productName: item.product_name, category: item.category, createdAt: item.created_at, inputsSnapshot: item.inputs_snapshot, outputsSnapshot: item.outputs_snapshot }));
    } catch (e) { return []; }
};

export const dbRegisterPartner = async (partner: Partner) => {
    try {
        // FIX: Removed non-existent properties address, commissionPercentage, lastActivityDate, and contractEndDate
        await supabase.from('partners').upsert({ 
            id: partner.id, 
            name: partner.name, 
            email: partner.email, 
            phone: partner.phone, 
            category: partner.category, 
            pix_key: partner.pixKey, 
            referral_code: partner.referralCode, 
            stats_json: partner.stats, 
            created_at: partner.createdAt 
        });
    } catch (e) { console.error(e); }
};

export const dbGetPartnerByEmail = async (email: string): Promise<Partner | null> => {
    const found = MOCK_PARTNERS.find(p => p.email === email);
    return found || null;
};

export const dbGetReferralsForPartner = async (partnerId: string): Promise<ReferralLead[]> => {
    // FIX: Updated ReferralLead objects to strictly follow the interface (removed userEmail and plan)
    return [
        { id: 'ref1', partnerId, userName: 'João Silva', status: 'customer', conversionValue: 29.70, createdAt: new Date().toISOString() },
        { id: 'ref2', partnerId, userName: 'Maria Souza', status: 'customer', conversionValue: 14.70, createdAt: new Date().toISOString() },
    ];
};

export const syncUserProfile = async (email: string, settings: UserSettings) => {
    try {
        await supabase.from('user_profiles').upsert({ email, settings_json: settings, updated_at: new Date().toISOString() }, { onConflict: 'email' });
    } catch (e) { console.error(e); }
};

export const dbSaveSimulation = async (userEmail: string, simulation: SavedSimulation) => {
    try {
        await supabase.from('user_simulations').upsert({ id: simulation.id, user_email: userEmail, name: simulation.name, inputs_json: simulation.inputs, outputs_json: simulation.outputs, tags: simulation.tags, is_favorite: simulation.isFavorite || false, created_at: simulation.createdAt, simulation_type: simulation.simulationType });
    } catch (e) { console.error(e); }
};

export const dbGetSimulations = async (userEmail: string): Promise<SavedSimulation[]> => {
    try {
        const { data } = await supabase.from('user_simulations').select('*').eq('user_email', userEmail).order('created_at', { ascending: false });
        return (data || []).map(item => ({ id: item.id, name: item.name, createdAt: item.created_at, inputs: item.inputs_json, outputs: item.outputs_json, tags: item.tags || [], isFavorite: item.is_favorite || false, simulationType: item.simulation_type || 'meli' }));
    } catch (e) { return []; }
};

export const dbDeleteSimulation = async (id: string) => { await supabase.from('user_simulations').delete().eq('id', id); };

export const dbSaveInsight = async (userEmail: string, insight: SavedInsight) => {
    try {
        await supabase.from('user_insights').insert({ id: insight.id, user_email: userEmail, sku_id: insight.associatedSkuId, sku_name: insight.associatedSkuName, name: insight.name, content: insight.content, type: insight.type, image_url: insight.generatedImageUrl, created_at: insight.createdAt });
    } catch (e) { console.error(e); }
};

export const dbGetInsights = async (userEmail: string): Promise<SavedInsight[]> => {
    try {
        const { data } = await supabase.from('user_insights').select('*').eq('user_email', userEmail).order('created_at', { ascending: false });
        return (data || []).map(item => ({ id: item.id, name: item.name, createdAt: item.created_at, associatedSkuId: item.sku_id, associatedSkuName: item.sku_name, type: item.type, content: item.content, generatedImageUrl: item.image_url }));
    } catch (e) { return []; }
};

export const dbDeleteInsight = async (id: string) => { await supabase.from('user_insights').delete().eq('id', id); };
