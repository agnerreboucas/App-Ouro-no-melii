
import React, { useState, useMemo, useRef } from 'react';
import { suppliersData as initialSuppliers, supplierCategories } from '../data/suppliersData';
import type { Supplier, UserSettings, HighlightedProduct, Banner } from '../types';
import { logClick } from '../services/usageService';

interface SuppliersPageProps {
  onLoadToCalculator: (name: string, cost: number, price: number, supplier?: Supplier) => void;
  onOpenOffer: (supplier: Supplier, product: HighlightedProduct) => void;
  settings: UserSettings;
  isAdmin?: boolean;
  email: string;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

const AdBanner: React.FC<{ banner: Banner; onClick: () => void }> = ({ banner, onClick }) => (
    <div 
        onClick={onClick}
        className={`w-full mb-6 md:mb-12 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 bg-gradient-to-r ${banner.color} text-white flex items-center justify-between gap-4 cursor-pointer shadow-lg hover:scale-[1.01] transition-all relative overflow-hidden group min-h-[100px] md:min-h-[180px]`}
    >
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute -right-10 -top-10 size-40 md:size-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="space-y-1 md:space-y-3 relative z-10 flex-1">
            <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest border border-white/30">Destaque</span>
            <h2 className="text-sm md:text-3xl font-black uppercase tracking-tighter leading-none">{banner.title}</h2>
            <p className="text-[10px] md:text-base font-bold opacity-80 line-clamp-1">{banner.subtitle}</p>
            <div className="pt-1 md:pt-2">
                <span className="text-[9px] md:text-sm font-black uppercase bg-white text-black px-3 py-1 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-md">
                    {banner.cta}
                </span>
            </div>
        </div>

        <div className="size-20 md:size-48 rounded-xl md:rounded-3xl overflow-hidden shadow-xl relative z-10 border-2 md:border-4 border-white/20 transform rotate-3 group-hover:rotate-0 transition-transform flex-shrink-0">
            <img src={banner.image} className="w-full h-full object-cover" alt="Oferta" />
        </div>
    </div>
);

const QuoteLineUI: React.FC<{ platform: string; price: number; isBest?: boolean }> = ({ platform, price, isBest }) => {
    return (
        <div className={`flex items-center justify-between p-2 md:p-3 rounded-xl border ${isBest ? 'bg-primary/5 border-primary' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10'}`}>
            <div className="flex items-center gap-2">
                <span className="text-[8px] md:text-[9px] font-bold uppercase text-gray-400">{platform}</span>
                {isBest && <span className="text-[6px] md:text-[7px] font-black bg-primary text-text-light-primary px-1.5 py-0.5 rounded-full uppercase">Alvo</span>}
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-xs md:text-sm font-bold ${isBest ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}>{formatCurrency(price)}</span>
                <span className="material-symbols-outlined text-[10px] text-gray-300">lock</span>
            </div>
        </div>
    );
};

export const SuppliersPage: React.FC<SuppliersPageProps> = ({ onLoadToCalculator, onOpenOffer, settings, isAdmin = true, email }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [previewProduct, setPreviewProduct] = useState<any | null>(null);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<{
        name: string;
        imageUrl: string;
        zoom: number;
        positionY: number;
        fit: 'cover' | 'contain';
        id: string;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const productsInCategory = useMemo(() => {
        if (!selectedCategory) return [];
        const list: any[] = [];
        suppliers.forEach(s => {
            if (s.category === selectedCategory) {
                s.highlightedProducts.forEach(p => list.push({ ...p, supplier: s.name, supplierObj: s }));
            }
        });
        return list;
    }, [selectedCategory, suppliers]);

    const activeBanners = useMemo(() => {
        const banners: Banner[] = [];
        if (!selectedCategory) {
            suppliers.forEach(s => s.bannerGeral && banners.push(s.bannerGeral));
        } else {
            suppliers.forEach(s => {
                if (s.bannersCategoria?.[selectedCategory]) {
                    banners.push(s.bannersCategoria[selectedCategory]);
                }
            });
        }
        return banners;
    }, [selectedCategory, suppliers]);

    const handleBannerClick = (banner: Banner) => {
        logClick(email, 'banner_click', { bannerId: banner.id, target: banner.targetOfferId });
        for (const sup of suppliers) {
            const prod = sup.highlightedProducts.find(p => p.exclusiveOfferId === banner.targetOfferId);
            if (prod) {
                onOpenOffer(sup, prod);
                return;
            }
        }
    };

    const handleOpenEdit = (e: React.MouseEvent, prod: any) => {
        e.stopPropagation();
        setEditData({
            id: prod.name,
            name: prod.name,
            imageUrl: prod.imageUrl || '',
            zoom: 1,
            positionY: 50,
            fit: 'cover'
        });
        setIsEditing(true);
    };

    const saveEdit = () => {
        if (!editData) return;
        setSuppliers(prev => prev.map(s => ({
            ...s,
            highlightedProducts: s.highlightedProducts.map(p => 
                p.name === editData.id ? { 
                    ...p, 
                    name: editData.name, 
                    imageUrl: editData.imageUrl 
                } : p
            )
        })));
        setIsEditing(false);
        setPreviewProduct(null);
    };

    return (
        <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto overflow-x-hidden animate-fade-in-up">
            <header className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-3xl font-extrabold tracking-tight uppercase">
                        {selectedCategory ? (
                            <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-primary">
                                <span className="material-symbols-outlined text-lg md:text-xl">arrow_back_ios</span> {selectedCategory}
                            </button>
                        ) : "Biblioteca de Ouro"}
                    </h1>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Minerando fornecedores em tempo real</p>
                </div>
                
                <div className="flex gap-2">
                    {isAdmin && <span className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-xl uppercase tracking-widest border border-primary/30">Modo Curador Ativo</span>}
                </div>
            </header>

            {activeBanners.length > 0 && (
                <AdBanner 
                    banner={activeBanners[0]} 
                    onClick={() => handleBannerClick(activeBanners[0])} 
                />
            )}

            {!selectedCategory ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8">
                    {supplierCategories.map(cat => (
                        <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className="group flex flex-col gap-2 md:gap-3">
                            <div className="aspect-square rounded-xl md:rounded-[2rem] overflow-hidden border border-border-light shadow-md group-hover:scale-105 transition-all">
                                <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                            </div>
                            <span className="font-bold text-[10px] md:text-sm uppercase tracking-tight text-center">{cat.name}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
                    {productsInCategory.map((prod, i) => (
                        <div key={i} onClick={() => setPreviewProduct(prod)} className="group bg-card-light dark:bg-card-dark p-3 rounded-xl md:rounded-3xl border border-border-light dark:border-border-dark shadow-sm hover:border-primary transition-all text-left relative cursor-pointer">
                            {isAdmin && (
                                <button 
                                    onClick={(e) => handleOpenEdit(e, prod)}
                                    className="absolute top-2 right-2 size-6 md:size-8 bg-white/90 dark:bg-black/90 rounded-full flex items-center justify-center border border-border-light z-20 hover:text-primary"
                                >
                                    <span className="material-symbols-outlined text-[10px] md:text-sm">settings</span>
                                </button>
                            )}
                            <div className="aspect-square rounded-lg md:rounded-2xl overflow-hidden bg-gray-50 mb-2">
                                <img src={prod.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-[10px] font-semibold truncate text-text-light-secondary">{prod.name}</h3>
                            <p className="text-xs md:text-sm font-extrabold mt-1 text-primary">{formatCurrency(prod.sellPrice)}</p>
                        </div>
                    ))}
                </div>
            )}

            {previewProduct && !isEditing && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-2">
                    <div className="bg-card-light dark:bg-card-dark w-full max-w-5xl h-auto max-h-[98vh] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in-up relative">
                        <button onClick={() => setPreviewProduct(null)} className="absolute top-4 right-4 z-20 size-8 md:size-10 bg-black/20 text-white rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-sm">close</span></button>
                        
                        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-4 aspect-square md:aspect-auto">
                            <img src={previewProduct.imageUrl} className="w-full h-full object-cover" alt={previewProduct.name} />
                        </div>

                        <div className="w-full md:w-1/2 p-5 md:p-12 overflow-y-auto scrollbar-hide flex flex-col">
                            {previewProduct.exclusiveOfferId && (
                                <div 
                                    onClick={() => handleBannerClick({ targetOfferId: previewProduct.exclusiveOfferId } as any)}
                                    className="mb-4 md:mb-8 p-3 md:p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between cursor-pointer hover:bg-primary/20 transition-all group"
                                >
                                    <div className="flex-1">
                                        <p className="text-[7px] md:text-[8px] font-black text-primary uppercase">Vip</p>
                                        <p className="text-[10px] md:text-xs font-black">Este produto possui uma oferta exclusiva direto na fábrica.</p>
                                    </div>
                                    <span className="material-symbols-outlined text-primary text-sm">arrow_forward</span>
                                </div>
                            )}

                            <div className="space-y-1 mb-4 md:mb-6">
                                <h2 className="text-lg md:text-2xl font-extrabold uppercase leading-tight tracking-tight">{previewProduct.name}</h2>
                                <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-black uppercase rounded-full">Validado</span>
                            </div>

                            <div className="space-y-2 mb-4 md:mb-6">
                                <h4 className="text-[8px] md:text-[9px] font-black uppercase text-gray-400 tracking-widest">Referência Meli:</h4>
                                <QuoteLineUI platform="Mercado Livre" price={previewProduct.sellPrice} isBest />
                            </div>

                            <div className="p-3 md:p-6 bg-background-light dark:bg-white/5 rounded-xl md:rounded-2xl border border-border-light grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
                                <div><p className="text-[7px] md:text-[10px] font-black text-gray-400 uppercase">Custo</p><p className="text-sm md:text-xl font-extrabold">{formatCurrency(previewProduct.cost)}</p></div>
                                <div><p className="text-[7px] md:text-[10px] font-black text-primary uppercase">Margem</p><p className="text-sm md:text-xl font-extrabold text-primary">~ 28%</p></div>
                            </div>

                            <div className="mt-auto space-y-2">
                                <button 
                                    onClick={() => { onLoadToCalculator(previewProduct.name, previewProduct.cost, previewProduct.sellPrice, previewProduct.supplierObj); setPreviewProduct(null); }}
                                    className="w-full py-3 md:py-6 bg-primary text-text-light-primary font-black rounded-xl md:rounded-2xl text-xs md:text-lg shadow-xl hover:scale-105 transition-all uppercase tracking-tight"
                                >
                                    Auditar Produto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isEditing && editData && (
                <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3">
                    <div className="bg-card-light dark:bg-card-dark w-full max-w-md md:max-w-4xl h-auto rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-primary/30">
                        <div className="w-full md:w-1/2 p-4 md:p-8 bg-background-dark/50 flex flex-col gap-4 items-center border-b md:border-b-0 md:border-r border-border-dark">
                            <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-primary bg-black relative max-w-[200px] md:max-w-full">
                                <img 
                                    src={editData.imageUrl} 
                                    className="absolute transition-transform duration-200" 
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transform: `scale(${editData.zoom}) translateY(${editData.positionY - 50}%)`,
                                    }} 
                                />
                                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 size-8 bg-primary text-black rounded-full shadow-lg flex items-center justify-center z-20"><span className="material-symbols-outlined text-sm">photo_camera</span></button>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col gap-4 md:gap-8">
                            <h2 className="text-lg font-bold uppercase tracking-tight text-primary">Editor do Curador</h2>
                            <label className="block space-y-1">
                                <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest ml-1">Nome</span>
                                <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full h-10 px-4 rounded-xl bg-background-light dark:bg-background-dark border border-border-light font-bold text-xs focus:border-primary outline-none" />
                            </label>
                            <div className="mt-auto flex flex-col gap-2">
                                <button onClick={saveEdit} className="w-full py-3 bg-primary text-text-light-primary font-black rounded-xl shadow-lg hover:scale-[1.02] transition-all uppercase text-xs">Salvar</button>
                                <button onClick={() => setIsEditing(false)} className="w-full py-2 text-[8px] font-bold text-gray-500 uppercase tracking-widest">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
