# Páginas Administrativas - AC Clothes Shop

Este diretório contém todas as páginas e componentes do painel administrativo do AC Clothes Shop.

## Arquivos Criados

### 1. **AdminLogin.jsx**
Página de autenticação do painel administrativo.

**Funcionalidades:**
- Formulário com username e password
- Validação com react-hook-form
- Integração com API `/admin/login`
- Armazenamento seguro do token no localStorage
- Redirecionamento automático para `/admin` após login bem-sucedido
- Design elegante com ícones e feedback visual
- Tratamento de erros com toast notifications

**Fluxo de Autenticação:**
1. Usuário digita credenciais (username e password)
2. Form valida os campos obrigatórios
3. Chamada à API `adminLogin()` com as credenciais
4. Token e dados do usuário são salvos no localStorage
5. Redirecionamento automático para o dashboard

### 2. **AdminLayout.jsx**
Layout wrapper que estrutura toda a interface administrativa.

**Componentes:**
- **Sidebar**: Navegação lateral com links para Dashboard, Produtos e Pedidos
- **Header**: Barra superior com botão de logout e toggle do menu mobile
- **Main Content**: Área principal com Outlet para rotas filhas
- **Mobile Menu**: Versão responsiva da sidebar para dispositivos móveis

**Funcionalidades:**
- Verificação de autenticação ao montar
- Redirecionamento para login se sem token
- Parsing seguro do usuário do localStorage
- Sidebar responsiva com toggle
- Links de navegação com estado "ativo" destacado
- Logout com limpeza de dados locais
- Overlay escuro ao abrir sidebar em mobile

### 3. **AdminDashboard.jsx**
Dashboard principal com estatísticas gerais e resumo de pedidos.

**Seções:**
- **Cards de Estatísticas**:
  - Total de Produtos
  - Total de Pedidos
  - Receita Total (formatada em Real)
  - Pedidos Pendentes

- **Tabela de Pedidos Recentes**:
  - Número do pedido
  - Nome do cliente
  - Total do pedido
  - Status de pagamento (com badge colorido)
  - Status de envio (com badge colorido)
  - Data formatada

- **Produtos Mais Vendidos**:
  - Lista dos top products por receita
  - Quantidade de vendas
  - Receita gerada

- **Produtos com Baixo Estoque**:
  - Alerta visual em vermelho
  - Categorias dos produtos
  - Quantidade atual em estoque

**Estados:**
- Loading com spinner animado
- Error handling com retry button
- Empty states com ícones descritivos

### 4. **AdminProducts.jsx**
CRUD completo para gerencimento de produtos.

**Funcionalidades:**

#### Tabela de Produtos
- Listagem de todos os produtos
- Imagens em miniatura
- Preços com destaque para descontos
- Badge de estoque (verde/amarelo/vermelho)
- Botões de ação inline

#### Modal de Criar/Editar Produto
Formulário completo com campos:
- Nome (obrigatório)
- Descrição (obrigatório, textarea)
- Categoria (select com opções pré-definidas)
- URL da Imagem (obrigatório)
- Preço (obrigatório, com validação)
- Preço com Desconto (opcional)
- Estoque (obrigatório, inteiro)
- Tamanhos (obrigatório, comma-separated)
- Checkboxes: Destacado e Promoção

#### Ações por Produto
- **Editar**: Abre modal com dados pré-preenchidos
- **Deletar**: Com confirmação antes de excluir
- **Toggle Destaque**: Botão de estrela (amarela quando ativo)
- **Toggle Promoção**: Botão de trending (vermelho quando ativo)

**Validações:**
- Campos obrigatórios com error messages
- Valores numéricos validados
- URLs validadas como URL válida

### 5. **AdminOrders.jsx**
Sistema completo de gerenciamento de pedidos.

**Funcionalidades:**

#### Tabela de Pedidos
- Listagem com todos os pedidos
- Número do pedido em formato "#{orderNumber}"
- Dados do cliente (nome e email)
- Total do pedido
- Badges de status de pagamento e envio
- Data de criação formatada
- Botão para ver detalhes

#### Modal de Detalhes do Pedido
Seções interativas:

**1. Informações Gerais:**
- Nome e email do cliente
- Total do pedido com destaque

**2. Atualização de Status de Pagamento:**
- Botões para: PENDING, PAID, CANCELLED, REFUNDED
- Estado visual mostrando status atual
- Atualização em tempo real

**3. Atualização de Status de Envio:**
- Botões para: PROCESSING, SHIPPED, DELIVERED
- Estado visual mostrando status atual
- Atualização em tempo real

**4. Código de Rastreio:**
- Input para adicionar/atualizar código
- Botão de atualização
- Exibição do código atual

**5. Itens do Pedido:**
- Listagem com miniatura da imagem
- Nome do produto
- Tamanho e quantidade
- Preço unitário e total

**6. Endereço de Entrega:**
- Exibição completa do endereço
- Rua, número, complemento
- Cidade, estado, CEP

**Estados e Feedback:**
- Loading states em todas operações
- Toast notifications para sucesso/erro
- Desabilitação de botões durante operações
- Confirmações visuais de atualização

## Integração com API

Todos os componentes utilizam as funções do arquivo `utils/api.js`:

### AdminLogin
```javascript
adminLogin(credentials) // POST /admin/login
```

### AdminDashboard
```javascript
getDashboard() // GET /admin/dashboard
```

### AdminProducts
```javascript
getAllProductsAdmin()     // GET /admin/products
createProduct(data)       // POST /admin/products
updateProduct(id, data)   // PUT /admin/products/:id
deleteProduct(id)         // DELETE /admin/products/:id
toggleFeatured(id)        // PATCH /admin/products/:id/featured
togglePromotion(id)       // PATCH /admin/products/:id/promotion
```

### AdminOrders
```javascript
getAllOrders()                          // GET /admin/orders
getOrderById(id)                        // GET /admin/orders/:id
updateOrderStatus(id, statusData)       // PATCH /admin/orders/:id/status
updateTracking(id, trackingCode)        // PATCH /admin/orders/:id/tracking
```

## Autenticação e Segurança

### Token Management
- Token armazenado em `localStorage` com chave `clothesshop_admin_token`
- Dados do usuário em `clothesshop_admin_user` (JSON stringified)
- Token automaticamente incluído em requisições via interceptor

### Verificação de Autenticação
- AdminLayout verifica token ao montar
- Redirecionamento automático para login se não autenticado
- Logout limpa localStorage e redireciona

### Interceptor de Erros
- Detecta status 401 (Unauthorized)
- Limpa dados locais automaticamente
- Redireciona para login em caso de token expirado

## Estilos e Design

Todos os componentes utilizam:
- **Tailwind CSS** para estilos utility-first
- **React Icons (FiXxx)** para ícones feather
- **Paleta de cores** consistente com o projeto:
  - Primary: `#C07837` (marrom)
  - Secondary: cores complementares
  - Tertiary: tons adicionais
- **Componentes responsivos** para desktop, tablet e mobile

### Classes Reutilizáveis
- `.btn-primary`: Botão principal com estilo
- `.section`: Seções com padding padrão
- `.container`: Container com max-width
- `.spinner`: Loading spinner animado

## Tratamento de Erros

- **Toast Notifications**: Feedback visual para ações do usuário
- **Try/Catch blocks**: Em todas as chamadas de API
- **Error messages**: Mensagens descriptivas do backend
- **Fallback messages**: Mensagens genéricas se erro desconhecido
- **Empty states**: Feedback visual quando não há dados

## Estados de Loading

- Spinners animados durante requisições
- Botões desabilitados durante submissão
- Feedback visual de progresso
- Retry buttons para tentar novamente em caso de erro

## Responsividade

- Layout adaptado para mobile, tablet e desktop
- Sidebar colapsável em mobile
- Overlay escuro ao abrir menu mobile
- Tabelas com scroll horizontal em telas pequenas
- Modais com full-width em mobile

## Próximos Passos

1. Instalar dependências: `npm install`
2. Configurar variáveis de ambiente (VITE_API_URL)
3. Iniciar servidor de desenvolvimento: `npm run dev`
4. Acessar painel em: `http://localhost:5173/admin/login`

## Notas Importantes

- Todas as páginas requerem autenticação (verificada em AdminLayout)
- Modais utilizam portais para melhor UX
- Formulários usam react-hook-form para validação
- API calls incluem tratamento de erro com toast feedback
- Todos os dados sensíveis são validados no backend
