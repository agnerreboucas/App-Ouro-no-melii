import { supabase } from './supabaseClient';

/**
 * Log de cliques
 */
export const logClick = async (userEmail: string, type: string, metadata: any) => {
    try {
        await supabase.from('click_logs').insert({
            user_email: userEmail,
            click_type: type,
            metadata: metadata,
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        console.error("Erro ao logar clique:", e);
    }
};

/**
 * Obtém o IP Público do usuário
 */
export const getUserIp = async (): Promise<string> => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (e) {
        return 'unknown';
    }
};

/**
 * Gera um Fingerprint simples
 */
export const getFingerprint = (): string => {
    const nav = window.navigator;
    const screen = window.screen;
    const guid = `${nav.userAgent}|${screen.width}x${screen.height}|${nav.language}`;
    return btoa(guid);
};

/**
 * Log de Download de PDF
 */
export const logPdfDownload = async (userEmail: string, productName: string) => {
    try {
        await supabase.from('activity_logs').insert({
            user_email: userEmail,
            action: 'pdf_download',
            metadata: { productName },
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        console.error("Erro ao logar download:", e);
    }
};

/**
 * Log de Visita de Página
 */
export const logPageView = async (userEmail: string, pageName: string) => {
    try {
        await supabase.from('page_views').insert({
            user_email: userEmail,
            page_name: pageName,
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        console.error("Erro ao logar visita:", e);
    }
};

/**
 * Verifica e Loga Uso de Rede no Supabase com metadados estendidos
 */
export const checkAndLogUsage = async (userEmail?: string, userMeta?: any): Promise<{ count: number, allowed: boolean }> => {
    const today = new Date().toISOString().split('T')[0];
    const ip = await getUserIp();
    const fp = getFingerprint();
    const identifier = userEmail || `${ip}-${fp}`;

    try {
        // Tenta buscar registro de hoje
        const { data, error } = await supabase
            .from('usage_logs')
            .select('count')
            .eq('identifier', identifier)
            .eq('usage_date', today)
            .single();

        let currentCount = data?.count || 0;
        let limit = userEmail ? 100 : 2; // Plano Free (Não logado) vs Pro (Logado)

        if (currentCount >= limit && !userEmail) {
            return { count: currentCount, allowed: false };
        }

        // Incrementa e sincroniza metadados demográficos
        const { error: upsertError } = await supabase
            .from('usage_logs')
            .upsert({ 
                identifier, 
                usage_date: today, 
                count: currentCount + 1,
                user_email: userEmail || null,
                // Metadados para o Admin Dashboard
                city: userMeta?.city,
                gender: userMeta?.gender,
                has_physical_store: userMeta?.temLojaFisica,
                platforms: userMeta?.canaisVenda,
                subscription_level: userMeta?.subscriptionLevel
            }, { onConflict: 'identifier,usage_date' });

        return { count: currentCount + 1, allowed: true };
    } catch (e) {
        return { count: 0, allowed: true };
    }
};