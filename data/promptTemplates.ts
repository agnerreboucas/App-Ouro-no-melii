
interface PromptTemplate {
    id: string;
    name: string;
    icon: string;
    template: string;
}

interface PromptCategories {
    quickIdeas: PromptTemplate[];
    advancedMarketing: PromptTemplate[];
    imageEnvironments: PromptTemplate[];
}

export const promptCategories: PromptCategories = {
    quickIdeas: [
        {
            id: 'copy-sensorial',
            name: 'Copy Sensorial (Tato/Visão/Som)',
            icon: 'brush',
            template: 'Crie uma copy sensorial profunda para minha escrivaninha branca, focando na textura, na paz visual e no silêncio operacional.'
        },
        {
            id: 'titles',
            name: 'Títulos e SEO Meli',
            icon: 'title',
            template: 'Gere 5 títulos otimizados para "Escrivaninha Mesa Office Branca" com alto volume de busca.'
        }
    ],
    advancedMarketing: [
        {
            id: 'faq',
            name: 'FAQ de Objeções',
            icon: 'quiz',
            template: 'Responda as 10 maiores dúvidas de quem compra móveis online para quebrar objeções de frete e montagem.'
        }
    ],
    imageEnvironments: [
        {
            id: 'bedroom',
            name: 'Ambiente Quarto',
            icon: 'bed',
            template: 'Modern white minimalist desk in a cozy Scandinavian bedroom, warm lighting, study setup.'
        },
        {
            id: 'kitchen',
            name: 'Suporte Microondas (Cozinha)',
            icon: 'microwave',
            template: 'The white desk being used as a sturdy microwave stand in a bright modern kitchen, sleek organization.'
        },
        {
            id: 'office',
            name: 'Home Office de Luxo',
            icon: 'work',
            template: 'Professional home office setup with the white desk as centerpiece, dual monitors, luxury executive vibe.'
        },
        {
            id: 'external',
            name: 'Área Externa / Varanda',
            icon: 'deck',
            template: 'Outdoor balcony garden office, the white desk with a laptop, plants, natural sunlight, covered area.'
        }
    ]
};
