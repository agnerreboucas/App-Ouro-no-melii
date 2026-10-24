
import { GoogleGenAI, Type } from "@google/genai";
import type { UserSettings, AudienceAnalysis, SavedSimulation, MarketIntelligence, ImageSearchResult } from '../types';

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Utilitário de segurança para garantir que o JSON seja extraído corretamente
 */
const safeParseJson = (text: string | undefined, defaultValue: any = {}) => {
    if (!text) return defaultValue;
    try {
        // Limpa possíveis marcações de Markdown do modelo
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : cleanText;
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Erro no parse da IA:", text);
        return defaultValue;
    }
};

export const getAiStrategyContent = async (simulation: SavedSimulation, type: 'kits' | 'copy' | 'description', settings: UserSettings): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let prompt = "";
    
    if (type === 'kits') {
        prompt = `Aja como Especialista em E-commerce Meli. PRODUTO: ${simulation.name}. Sugira 3 KITS inteligentes com EAN próprio para fugir do catálogo. Use Markdown.`;
    } else if (type === 'copy') {
        prompt = `Crie um ANÚNCIO MESTRE de alta conversão para: ${simulation.name}. Inclua gatilhos mentais (Escassez, Urgência) e quebra de objeções. Use Markdown.`;
    } else {
        prompt = `GERE UMA DESCRIÇÃO PROFISSIONAL PARA MERCADO LIVRE do produto: ${simulation.name}. 
        Siga RIGOROSAMENTE esta estrutura:
        # Título Otimizado p/ SEO (60 caracteres)
        - Destaque 3 benefícios principais em bullet points.
        - FICHA TÉCNICA completa (especificações prováveis).
        - O QUE VEM NA EMBALAGEM.
        - FAQ com as 3 perguntas mais comuns.
        - GARANTIA E SUPORTE PÓS-VENDA.
        Use formatação Markdown limpa e elegante.`;
    }

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt
    });
    return response.text || "Não foi possível gerar a estratégia agora. Tente em instantes.";
};

export const analyzePartnerAudience = async (images: {data: string, mime: string}[], settings: UserSettings): Promise<AudienceAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analise os prints de métricas sociais e gere um JSON de Dossiê de Inteligência.`;

    const parts = images.map(img => ({
        inlineData: { data: img.data, mimeType: img.mime }
    }));
    parts.push({ text: prompt } as any);

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts },
        config: { responseMimeType: "application/json" }
    });

    return safeParseJson(response.text);
};

export const findProductByImage = async (base64: string, mime: string, settings: UserSettings): Promise<ImageSearchResult> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prompt "Proibido Falhar": instrui a IA a sempre dar um nome descritivo se não souber o modelo exato
    const prompt = `Identifique este produto comercialmente. 
    REGRAS CRÍTICAS:
    1. Se não souber o modelo exato, forneça um Nome Descritivo (ex: "Kit de Ferramentas Automotivas 12 peças").
    2. NUNCA deixe o campo productName vazio.
    3. Estime o preço médio no Mercado Livre Brasil.
    Retorne APENAS JSON: { "productName": "string", "sellPrice": number, "category": "string" }`;

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [{
            parts: [
                { inlineData: { data: base64, mimeType: mime } },
                { text: prompt }
            ]
        }],
        config: { responseMimeType: "application/json" }
    });
    
    const result = safeParseJson(response.text, { productName: "Produto em Análise", sellPrice: 0, category: "Geral" });
    
    // Validação extra pós-parse
    if (!result.productName || result.productName.trim() === "") {
        result.productName = "Produto Identificado por Visão Neural";
        result.sellPrice = 49.90;
    }
    
    return result;
};

export const findProductByText = async (query: string, settings: UserSettings): Promise<ImageSearchResult[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Analise preços para: ${query}. Retorne ARRAY JSON {productName, sellPrice, category}.`,
        config: { responseMimeType: "application/json" }
    });
    return safeParseJson(response.text, []);
};

export const getMarketIntelligence = async (base64: string, mime: string, settings: UserSettings): Promise<MarketIntelligence> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [{
            parts: [
                { inlineData: { data: base64, mimeType: mime } },
                { text: "Dê inteligência de mercado detalhada para este produto. Retorne JSON estruturado." }
            ]
        }],
        config: { responseMimeType: "application/json" }
    });
    return safeParseJson(response.text);
};

export const generateProImage = async (prompt: string, settings: UserSettings, aspectRatio: string = "1:1", imageSize: string = "1K"): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ text: prompt }],
        config: { imageConfig: { aspectRatio: aspectRatio as any } }
    });
    
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Falha na geração");
};

export const analyzeImageWithPro = async (base64: string, mime: string, settings: UserSettings, prompt?: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{
            parts: [
                { inlineData: { data: base64, mimeType: mime } },
                { text: prompt || "Analise técnica profunda." }
            ]
        }]
    });
    return response.text || "";
};

export const transcribeAudioWithFlash = async (audioBase64: string, mimeType: string, settings: UserSettings): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [{
            parts: [
                { inlineData: { data: audioBase64, mimeType } },
                { text: "Transcreva este áudio para insights." }
            ]
        }]
    });
    return response.text || "";
};

export const getSearchGroundedInfo = async (prompt: string, settings: UserSettings) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    return {
        text: response.text || "",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};
