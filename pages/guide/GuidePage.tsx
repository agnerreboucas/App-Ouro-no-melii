
import React, { useState } from 'react';

const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border-light dark:border-border-dark">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4 px-2"
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <span className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-text-light-secondary dark:text-text-dark-secondary prose prose-sm dark:prose-invert max-w-none">
          {children}
        </div>
      )}
    </div>
  );
};

export const GuidePage: React.FC = () => {
  return (
    <main className="flex-grow py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight">Guia Rápido</h1>
          <p className="text-lg text-text-light-secondary dark:text-text-dark-secondary mt-2">
            Aprenda a usar as principais ferramentas para maximizar seus lucros.
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl border border-border-light dark:border-border-dark">
            <AccordionItem title="Passo 1: Usando a Calculadora">
                <p>A Calculadora é o coração da ferramenta. Para começar:</p>
                <ol>
                    <li>Preencha os campos <strong>obrigatórios</strong>: Nome do Produto, Custo e Preço de Venda.</li>
                    <li>Selecione a <strong>Taxa do Mercado Livre</strong> (Clássico ou Premium). Se for diferente, escolha "Outro" e digite a porcentagem.</li>
                    <li>Use os painéis de "Custos de Visibilidade", "Imposto & Embalagem" e "Frete & Logística" para adicionar todos os outros custos associados ao produto.</li>
                    <li>Observe os resultados de <strong>Lucro Líquido</strong> e <strong>Margem</strong> serem atualizados em tempo real no painel direito.</li>
                </ol>
            </AccordionItem>
            <AccordionItem title="Passo 2: Entendendo os Resultados e a IA">
                <p>Os números são calculados instantaneamente:</p>
                <ul>
                    <li><strong>Lucro Líquido / Un:</strong> O valor exato que sobra para você após todas as deduções.</li>
                    <li><strong>Margem Líquida:</strong> A porcentagem de lucro em relação ao preço de venda.</li>
                    <li><strong>Diagnóstico de Saúde:</strong> Uma análise rápida da IA que classifica seu produto como Saudável, Ajustável ou com Prejuízo.</li>
                    <li><strong>Números Mágicos:</strong> Descubra o <strong>Break-even</strong> (preço mínimo para não ter prejuízo) e o <strong>Preço Máximo de Compra</strong> (quanto pagar no fornecedor para atingir sua margem alvo).</li>
                </ul>
            </AccordionItem>
            <AccordionItem title="Passo 3: Salvando e Gerenciando seu Portfólio">
                <p>Nunca perca uma análise importante:</p>
                <ol>
                    <li>Após preencher os dados, clique em <strong>"Salvar SKU"</strong>.</li>
                    <li>Dê um nome e adicione tags (ex: 'eletrônicos', 'fornecedor A', 'comprar') para organizar.</li>
                    <li>Acesse a aba <strong>"Portfólio"</strong> para ver todos os seus produtos salvos.</li>
                    <li>Use a busca e os filtros por tag para encontrar rapidamente o que procura.</li>
                </ol>
            </AccordionItem>
            <AccordionItem title="Passo 4: Criando Estratégias com IA">
                 <p>Vá além dos números e crie planos de ação:</p>
                <ol>
                    <li>Navegue até a página <strong>"Estratégia"</strong>.</li>
                    <li>Selecione um produto salvo do seu portfólio.</li>
                    <li>No campo de texto, escreva o que você precisa. A IA já tem o contexto do seu produto. Peça por:
                        <ul>
                            <li>Sugestões de títulos para o anúncio.</li>
                            <li>Uma descrição de venda completa.</li>
                            <li>Ideias de produtos complementares para vender junto.</li>
                            <li>Uma análise da concorrência (hipotética).</li>
                        </ul>
                    </li>
                    <li>Clique em "Gerar com IA" e veja a mágica acontecer.</li>
                </ol>
            </AccordionItem>
        </div>
      </div>
    </main>
  );
};
