# Documento de Requisitos de Produto (PRD) - Encontre Ouro no Meli

## 1. Visão Geral do Produto
O **Encontre Ouro no Meli** é um ecossistema de inteligência para e-commerce que combina ferramentas financeiras de precisão com inteligência artificial avançada. O objetivo é permitir que o vendedor saiba exatamente quanto lucra em cada venda no Mercado Livre e identifique oportunidades de mercado através de visão computacional e análise de dados.

---

## 2. Objetivos Estratégicos
- **Eliminar o Prejuízo "Invisível"**: Fornecer uma calculadora que considere todos os custos ocultos (impostos, ads, taxas de marketplace, embalagem).
- **Acelerar a Mineração de Produtos**: Usar IA para identificar produtos e estimar viabilidade em segundos.
- **Profissionalizar o Anúncio**: Gerar conteúdo de alta conversão (Copy, Kits, Descrições) automaticamente.

---

## 3. Funcionalidades Detalhadas

### 3.1. Calculadoras Financeiras (O "Coração" do App)
O sistema possui duas frentes de cálculo: **Calculadora Meli** (focada no ecossistema Mercado Livre) e **Calculadora de Loja Física/E-commerce Geral**.

#### A. Entradas de Dados (Inputs)
- **Custo do Produto**: Valor de aquisição unitário.
- **Preço de Venda**: Valor final anunciado.
- **Taxas de Marketplace (Meli)**: 
  - Tipos: Clássico, Premium ou Personalizado.
  - Taxa fixa de R$ 6,50 para produtos abaixo de R$ 79,00.
- **Custo de Ads (Publicidade)**: Porcentagem investida sobre o faturamento.
- **Impostos**: Alíquota baseada no regime tributário (Simples Nacional, etc).
- **Logística**: Frete por conta do vendedor, custos de embalagem e taxas de Full (armazenagem e coleta).
- **Operacional**: Pro-labore (retirada do dono) e custos fixos rateados.

#### B. Processamento e Saídas (Outputs)
- **Margem Líquida Real**: O que sobra após todos os descontos.
- **ROI (Retorno sobre Investimento)**: Rentabilidade sobre o capital investido (Produto + Custos Fixos).
- **Ponto de Equilíbrio (Break-even)**: O preço mínimo para não ter prejuízo.
- **DRE Unitário**: Detalhamento visual de cada centro de custo.
- **Preço Máximo de Compra**: Calcula automaticamente quanto o usuário pode pagar no fornecedor para manter a margem ou ROI alvo desejado.

---

### 3.2. Inteligência Artificial (Powered by Google Gemini)
O app utiliza modelos multimodais (Flash e Pro) para diferentes tarefas:

- **Agente de Copywriting**: Gera títulos de 60 caracteres (SEO), bullet points de benefícios, fichas técnicas e FAQs.
- **Agente de Estratégia de Kits**: Sugere agrupamentos de produtos (Kits) para fugir da concorrência de catálogo e aumentar o ticket médio.
- **Visão Computacional (Mineração por Imagem)**: 
  - Identifica produtos através de fotos.
  - Estima preços de mercado e categorias automaticamente.
- **Inteligência de Mercado (Market Intelligence)**: Analisa nichos, saturação, presença de concorrentes no Full e sugere estratégias de diferenciação.
- **Dossiê de Influência**: Analisa métricas de redes sociais de parceiros para validar se a audiência é compatível com o produto.
- **Voz e Áudio**: Interface de chat por voz para consultas rápidas de métricas.

---

### 3.3. Gestão de Portfólio (My SKUs)
- **Histórico de Simulações**: Armazenamento em nuvem (Supabase) de todos os cálculos realizados.
- **Tags de Status**: Organização por etiquetas (ex: "🚀 Escalar", "⚠️ Revisar Preço", "📦 Pedido Pendente").
- **Insight Detail**: Visualização profunda de cada SKU com análise de sensibilidade (impacto de aumento de custos ou queda de preços).

---

### 3.4. Ecossistema de Fornecedores
- **Diretório de Fornecedores**: Banco de dados com contatos de WhatsApp, endereços e catálogos.
- **Auditoria de Ofertas**: Validador de ofertas recebidas. O usuário insere o que o fornecedor ofereceu e o app diz se a margem é "Saudável" ou "Prejuízo".
- **Dashboard de Fornecedor**: Interface simplificada para fornecedores cadastrados enviarem propostas.

---

## 4. Requisitos Técnicos e Arquitetura

### 4.1. Stack Tecnológica
- **Frontend**: React 19 (Hooks, Context API).
- **Estilização**: Tailwind CSS com tema personalizado (Paleta baseada na nota de R$ 100,00).
- **Backend/Banco**: Supabase (PostgreSQL para dados, Auth para login).
- **IA**: Google Generative AI SDK (`gemini-1.5-flash` para velocidade, `gemini-1.5-pro` para análise profunda).
- **Exportação**:
  - `xlsx`: Relatórios de faturamento.
  - `jsPDF`: Relatórios técnicos de auditoria.
  - `pptxgenjs`: Apresentações de estratégia.

### 4.2. Segurança e Proteção de Dados
- **Anti-Cópia**: Desativação de seleção de texto e arraste de imagens em áreas sensíveis.
- **Anti-Print**: Camadas de proteção CSS para dificultar capturas de tela indesejadas de estratégias mineradas.
- **Isolamento de Dados**: Dados de simulação são privados por usuário via RLS (Row Level Security) no Supabase.

---

## 5. Fluxos de Usuário Principais

1.  **Mineração**: Usuário sobe foto de um produto -> IA identifica e sugere preço -> Carrega na calculadora.
2.  **Cálculo**: Usuário ajusta custos -> App mostra DRE e status de saúde (Verde/Amarelo/Vermelho).
3.  **Estratégia**: Usuário pede copy -> IA gera descrição e kits -> Usuário salva no portfólio.
4.  **Auditoria**: Usuário recebe oferta de fornecedor -> Roda simulador de investimento -> Exporta PDF para decisão de compra.

---

## 6. Diferenciais Competitivos
- **Velocidade**: Respostas de IA em sub-segundos com Gemini Flash.
- **Precisão**: Fórmulas matemáticas validadas para a realidade do marketplace brasileiro.
- **Ecossistema Único**: Não é apenas uma planilha, é um assistente estratégico completo.
