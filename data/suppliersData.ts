
import type { Supplier } from '../types';

export const supplierCategories = [
    { name: 'Maquiagem e Beleza', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&h=600&auto=format&fit=crop' },
    { name: 'Skincare e Cuidados', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&h=600&auto=format&fit=crop' },
    { name: 'Eletrônicos', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=600&h=600&auto=format&fit=crop' },
    { name: 'Ferramentas', image: 'https://images.unsplash.com/photo-1581147036324-c17da42e16c2?q=80&w=600&h=600&auto=format&fit=crop' },
    { name: 'Automotivo', image: 'https://images.unsplash.com/photo-1486006396193-471068589dcb?q=80&w=600&h=600&auto=format&fit=crop' },
    { name: 'Papelaria e Escritório', image: 'https://images.unsplash.com/photo-1583485088034-7160b52ad562?q=80&w=600&h=600&auto=format&fit=crop' },
    { name: 'Pet Shop', image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=600&h=600&auto=format&fit=crop' },
    { name: 'Utilidades / Brinquedos', image: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?q=80&w=600&h=600&auto=format&fit=crop' }
];

export const suppliersData: Supplier[] = [
    {
        id: 'sup_vm_001',
        name: 'Virtual Make Atacado',
        category: 'Maquiagem e Beleza',
        address: 'Rua Cavalheiro, 226 - Brás, São Paulo - SP',
        website: 'https://www.virtualmake.com.br',
        instagram: 'https://instagram.com/virtualmake',
        contact: { phone: '(11) 3228-4444', whatsapp: '551132284444', email: 'vendas@virtualmake.com.br' },
        salesperson: {
            name: 'Ana Carolina (Especialista Meli)',
            whatsapp: '5511999999999',
            photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop'
        },
        specialties: ['Maquiagem Barata', 'Kits Display', 'Skincare Atacado'],
        bannerGeral: {
            id: 'b1',
            title: 'Oferta Relâmpago Virtual Make',
            subtitle: 'Máscara Facial Kyráv com 15% de desconto extra para membros Encontre Ouro.',
            cta: 'Ver Oferta Exclusiva',
            image: 'https://virtualmake.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/k/y/ky-795un-mascara-facial-argila-branca-cha-verde-kaolin-kyrav-atacado-revenda-maquiagem-virtual-make.jpg',
            targetOfferId: 'prod_vm_001',
            color: 'from-pink-600 to-purple-700'
        },
        highlightedProducts: [
            { name: 'Máscara Facial Pocket Kaolin 30g Kyráv', cost: 6.64, sellPrice: 19.90, imageUrl: 'https://virtualmake.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/k/y/ky-795un-mascara-facial-argila-branca-cha-verde-kaolin-kyrav-atacado-revenda-maquiagem-virtual-make.jpg', exclusiveOfferId: 'prod_vm_001' },
            { name: 'Sérum Facial Vitamina C Max Love', cost: 8.40, sellPrice: 29.90, imageUrl: 'https://virtualmake.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/s/e/serum-facial-vitamina-c-oil-free-max-love-atacado-maquiagem-virtual-make-revenda.jpg' },
            { name: 'Batom Matte Vivai Coleção Nude', cost: 2.10, sellPrice: 12.50, imageUrl: 'https://virtualmake.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/b/a/batom-matte-nude-vivai-atacado-maquiagem-virtual-make_1.jpg' }
        ]
    },
    {
        id: 'sup_tools_001',
        name: 'Ponto das Ferramentas',
        category: 'Ferramentas',
        address: 'Av. Industrial, 4500 - São Caetano do Sul, SP',
        website: 'https://www.pontodasferramentas.com.br',
        contact: { phone: '(11) 4004-5050', whatsapp: '5511940045050', email: 'b2b@pontotools.com' },
        salesperson: {
            name: 'Ricardo (Gerente de Contas)',
            whatsapp: '5511988887777'
        },
        specialties: ['Ferramentas Manuais', 'Medição Digital', 'Equipamentos de Proteção'],
        bannersCategoria: {
            'Ferramentas': {
                id: 'bc_tools',
                title: 'Ouro na Construção',
                subtitle: 'Trenas Laser e Níveis com 20% OFF para compras em Lote.',
                cta: 'Baixar Tabela Atacado',
                image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop',
                targetOfferId: 'prod_tools_002',
                color: 'from-orange-700 to-yellow-600'
            }
        },
        highlightedProducts: [
            { name: 'Jogo de Chaves de Fenda e Philips 6 Peças', cost: 32.00, sellPrice: 89.90, imageUrl: 'https://images.unsplash.com/photo-1530124560677-bdaea02c9913?q=80&w=600&h=600&auto=format&fit=crop', benefits: ['Aço Vanádio', 'Cabo Ergonômico', 'Embalagem de Pendurar'] },
            { name: 'Trena Laser Digital Profissional 40m', cost: 85.00, sellPrice: 219.90, imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=600&h=600&auto=format&fit=crop', exclusiveOfferId: 'prod_tools_002' }
        ]
    }
];
