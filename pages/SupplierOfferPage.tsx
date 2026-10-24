
import React, { useState, useMemo } from 'react';
import type { Supplier, HighlightedProduct, UserSettings } from '../types';
import { logClick } from '../services/usageService';

interface SupplierOfferPageProps {
    supplier: Supplier;
    product: HighlightedProduct;
    onBack: () => void;
    onLoadToCalculator: (name: string, cost: number, price: number, supplier: Supplier) => void;
    email: string;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

export const SupplierOfferPage: React.FC<SupplierOfferPageProps> = ({ supplier, product, onBack, onLoadToCalculator, email }) => {
    const mediaItems = [
        ...(product.imageUrl ? [product.imageUrl] : []),
        ...(product.imageUrls || [])
    ];
    const [activeMedia, setActiveMedia] = useState(mediaItems[0] || product.videoUrl);
    const [isShowingVideo, setIsShowingVideo] = useState(!mediaItems[0] && !!product.videoUrl);

    // Prioriza o WhatsApp do vendedor, se não houver, usa o do fornecedor
    const contactNumber = supplier.salesperson?.whatsapp || supplier.contact.whatsapp;
    const salespersonName = supplier.salesperson?.name || supplier.name;

    const handleWhatsApp = () => {
        logClick(email, 'external_link_click', { type: 'whatsapp', supplier: supplier.name, product: product.name, salesperson: supplier.salesperson?.name });
        const message = `Olá ${salespersonName}! Vi o produto ${product.name} no portal Encontre Ouro e gostaria de negociar uma compra para meu e-commerce.`;
        window.open(`https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const videoId = useMemo(() => {
        if (!product.videoUrl) return null;
        try {
            const url = new URL(product.videoUrl);
            if (url.hostname === 'youtu.be') return url.pathname.slice(1);
            if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
                return url.searchParams.get('v');
            }
        } catch (e) { return null; }
        return null;
    }, [product.videoUrl]);

    return (
        <div className="h-full flex flex-col bg-background-light dark:bg-background-dark animate-fade-in-up">
            <div className="px-4 py-3 flex items-center justify-between border-b border-border-light dark:border-border-dark sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20">
                <button onClick={onBack} className="flex items-center gap-1 text-gray-500 font-black uppercase text-[10px] tracking-widest">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Voltar
                </button>
                <div className="bg-ml-yellow text-black font-black px-2 py-0.5 rounded-full text-[8px] uppercase tracking-tighter shadow-sm">
                    Oferta VIP Ativa
                </div>
            </div>

            <div className="flex-1 flex flex-col p-4 md:p-12 max-w-6xl mx-auto w-full md:grid md:grid-cols-2 md:gap-12 md:items-start overflow-y-auto scrollbar-hide">
                <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-0">
                    <div className="bg-card-light dark:bg-card-dark rounded-[2rem] p-4 border border-border-light dark:border-border-dark shadow-xl relative overflow-hidden group">
                        <div className="aspect-square w-full">
                            {isShowingVideo && videoId ? (
                                <iframe
                                    className="w-full h-full rounded-2xl"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <img 
                                    src={activeMedia} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover rounded-2xl" 
                                />
                            )}
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 p-4 md:p-8 rounded-2xl md:rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-4">
                            {supplier.salesperson?.photoUrl ? (
                                <img src={supplier.salesperson.photoUrl} className="size-12 rounded-full border-2 border-primary object-cover" />
                            ) : (
                                <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white"><span className="material-symbols-outlined">person</span></div>
                            )}
                            <div>
                                <p className="text-[10px] font-black uppercase text-primary">Vendedor Responsável</p>
                                <p className="text-sm font-black">{salespersonName}</p>
                            </div>
                        </div>
                        <ul className="grid grid-cols-1 gap-2 border-t border-primary/10 pt-4">
                            {(product.benefits || ['Lucro Real Garantido', 'Alto Giro no Meli', 'Estoque no Brasil']).map((b, i) => (
                                <li key={i} className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-text-light-secondary dark:text-gray-300">
                                    <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-6 md:gap-10">
                    <div className="space-y-1 md:space-y-4">
                        <span className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{supplier.name}</span>
                        <h1 className="text-xl md:text-5xl font-black uppercase tracking-tighter leading-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-2 md:gap-4 pt-2">
                             <div className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-background-dark text-white rounded-xl">
                                <p className="text-[7px] md:text-[9px] font-black uppercase opacity-60">Custo Atacado</p>
                                <p className="text-sm md:text-2xl font-black text-primary">{formatCurrency(product.cost)}</p>
                             </div>
                             <div className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-primary/10 border border-primary/20 rounded-xl">
                                <p className="text-[7px] md:text-[9px] font-black uppercase text-primary">Preço de Revenda</p>
                                <p className="text-sm md:text-2xl font-black">{formatCurrency(product.sellPrice)}</p>
                             </div>
                        </div>
                    </div>

                    <div className="p-5 md:p-8 bg-card-light dark:bg-card-dark border-2 border-primary/30 rounded-2xl md:rounded-[2.5rem] shadow-xl space-y-4 md:space-y-8">
                        <div>
                            <h4 className="text-xs md:text-lg font-black uppercase tracking-tighter mb-2">Compre Direto com {salespersonName}</h4>
                            <p className="text-[10px] md:text-sm text-gray-400 font-bold mb-6">Identifique-se como membro <strong>Encontre Ouro</strong> para garantir o preço de tabela VIP.</p>
                            <button 
                                onClick={handleWhatsApp}
                                className="w-full py-4 md:py-6 bg-primary text-text-light-primary font-black rounded-xl md:rounded-2xl text-sm md:text-xl shadow-xl hover:scale-[1.02] transition-all uppercase flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg md:text-2xl">chat</span> 
                                Chamar {salespersonName.split(' ')[0]} no Whats
                            </button>
                        </div>
                        
                        <div className="pt-4 border-t border-dashed border-border-light flex flex-col gap-2">
                             <button 
                                onClick={() => onLoadToCalculator(product.name, product.cost, product.sellPrice, supplier)}
                                className="w-full py-3 border border-border-light dark:border-border-dark rounded-xl font-black uppercase text-[10px] md:text-sm hover:border-primary transition-colors flex items-center justify-center gap-2"
                             >
                                <span className="material-symbols-outlined text-sm">calculate</span> Auditar Margem na Calculadora
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-background-light dark:bg-white/5 rounded-2xl border border-border-light">
                            <span className="material-symbols-outlined text-primary mb-2">location_on</span>
                            <p className="text-[10px] font-black uppercase text-gray-400">Distribuição</p>
                            <p className="text-[10px] font-bold leading-tight">{supplier.address}</p>
                        </div>
                         <div className="p-4 bg-background-light dark:bg-white/5 rounded-2xl border border-border-light">
                            <span className="material-symbols-outlined text-primary mb-2">verified_user</span>
                            <p className="text-[10px] font-black uppercase text-gray-400">Procedência</p>
                            <p className="text-[10px] font-bold leading-tight">Fornecedor Verificado IA</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
