# Blueprint: SHOPP EXPRESS

## Visão Geral

O SHOPP EXPRESS é uma loja online moderna e responsiva, projetada para uma experiência de compra rápida e intuitiva. A plataforma foi construída com HTML, CSS e JavaScript puros, sem o uso de frameworks, e integrada com o Supabase para gerenciamento de produtos e vendas.

## Design e Estilo (Inspiração Detalhada no AliExpress)

O design do SHOPP EXPRESS foi aprimorado para se assemelhar o máximo possível à estética do AliExpress, focando na densidade da informação e nos gatilhos de compra.

- **Cores:** A paleta de cores é dominada pelo vermelho (`#FF4747`) e laranja (`#FF6D00`) para promoções, complementada por branco, preto e cinza.
- **Tipografia:** A fonte principal é a 'Plus Jakarta Sans', e a 'Oswald' para títulos de destaque.
- **Layout:** O layout foi ajustado para maior densidade de informação, replicando a sensação de "caça ao tesouro" do AliExpress.

### Detalhes de Implementação:

- **Cabeçalho:** Redesenhado para ser mais robusto e funcional, com um logo no estilo "marca preta + complemento vermelho".
- **Cards de Produto:**
  - **Preço em Destaque:** O preço tem um destaque ainda maior, com cor vermelha e fonte robusta.
  - **Informações Adicionais:** Inclusão de informações como "Frete Grátis" e um contador de itens "vendidos" para gerar prova social e urgência.
  - **Tags de Oferta:** A seção de promoções foi renomeada para "Super Ofertas", com tags na cor laranja para se assemelhar às "Super Ofertas" do AliExpress.
- **Seção Hero:** A seção de destaque foi refinada para ter um apelo mais direto e promocional.

## Funcionalidades

- **Listagem de Produtos:** Os produtos são carregados dinamicamente do Supabase.
- **Carrinho de Compras:** Funcionalidade de carrinho em painel lateral.
- **Finalização de Pedido:** Formulário simplificado para dados do usuário.
- **Filtro e Busca:** Filtragem de produtos por categoria e busca.
- **Painel de Detalhes:** Painel lateral com detalhes do produto.
- **Perfil do Usuário:** Salvamento de dados do usuário no localStorage.

## Estrutura do Projeto

- `index.html`: A estrutura principal do site.
- `style.css`: A folha de estilos para o design do site.
- `main.js`: O código JavaScript para a funcionalidade do site.
- `blueprint.md`: Este arquivo, que documenta o projeto.
