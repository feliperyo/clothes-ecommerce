# Guia de Testes - Painel Administrativo

## Checklist de Funcionalidades

### 1. AdminLogin.jsx

- [ ] **Acesso à página de login**
  - Navegue para: `http://localhost:5173/admin/login`
  - Deve exibir formulário com campos de username e password
  - Design elegante com gradiente

- [ ] **Validação de campos vazios**
  - Deixe username em branco e tente logar
  - Deve exibir: "Usuário é obrigatório"
  - Deixe password em branco e tente logar
  - Deve exibir: "Senha é obrigatória"

- [ ] **Validação de password curta**
  - Digite password com menos de 6 caracteres
  - Deve exibir: "Senha deve ter no mínimo 6 caracteres"

- [ ] **Login bem-sucedido**
  - Digite credenciais válidas (conforme backend)
  - Clique em "Entrar no Painel"
  - Deve ver spinner de loading
  - Deve ser redirecionado para `/admin`
  - Deve exibir: "Login realizado com sucesso!"

- [ ] **Login com falha**
  - Digite credenciais inválidas
  - Deve exibir mensagem de erro do backend
  - Deve permanecer na página de login

- [ ] **Token armazenado**
  - Após login bem-sucedido, abra DevTools
  - Verifique localStorage:
    - `clothesshop_admin_token`: deve conter JWT
    - `clothesshop_admin_user`: deve conter JSON do user

### 2. AdminLayout.jsx

- [ ] **Sidebar navigation**
  - Deve exibir logo "AC Ana" no topo
  - Deve ter 3 links: Dashboard, Produtos, Pedidos
  - Links devem ter ícones apropriados
  - Link atual deve ser destacado (background + border)

- [ ] **Header**
  - Deve exibir "Painel Administrativo" no topo
  - Deve ter botão de toggle menu (mobile)
  - Deve ter ícone de logout escondido em desktop
  - Deve visível em mobile

- [ ] **Mobile responsiveness**
  - Redimensione para mobile (< 768px)
  - Sidebar deve estar escondida por padrão
  - Clique no botão menu (≡)
  - Sidebar deve aparecer com overlay escuro
  - Clique em um link
  - Sidebar deve fechar
  - Overlay deve desaparecer

- [ ] **Logout**
  - Clique no botão "Sair"
  - localStorage deve ser limpo
  - Deve ser redirecionado para `/admin/login`
  - Deve exibir: "Logout realizado com sucesso"

- [ ] **Verificação de autenticação**
  - Limpe localStorage manualmente
  - Tente acessar `/admin`
  - Deve ser redirecionado para `/admin/login`

### 3. AdminDashboard.jsx

- [ ] **Cards de estatísticas**
  - Deve exibir 4 cards
  - Card 1: "Total de Produtos" com ícone de caixa
  - Card 2: "Total de Pedidos" com ícone de carrinho
  - Card 3: "Receita Total" com preço formatado
  - Card 4: "Pedidos Pendentes" com ícone de trending

- [ ] **Formatação de valores**
  - Receita deve estar em formato "R$ 1.500,00"
  - Números devem estar grandes e destacados

- [ ] **Tabela de pedidos recentes**
  - Deve listar últimos pedidos
  - Colunas: Pedido, Cliente, Total, Pagamento, Envio, Data
  - Badges de status devem ter cores diferentes:
    - Pendente: amarelo
    - Pago: verde
    - Processando: amarelo
    - Enviado: azul
    - Entregue: verde

- [ ] **Produtos mais vendidos**
  - Deve listar top 3-5 produtos
  - Mostrar posição (#1, #2, etc)
  - Mostrar nome, quantidade de vendas
  - Mostrar receita gerada

- [ ] **Produtos com baixo estoque**
  - Deve listar produtos com poucos itens
  - Destaque visual em vermelho
  - Mostrar estoque atual

- [ ] **Loading state**
  - Ao carregar a página
  - Deve exibir spinner
  - Deve exibir "Carregando dashboard..."

- [ ] **Error handling**
  - Desligue o backend temporariamente
  - Página deve exibir erro
  - Deve exibir botão "Tentar Novamente"

### 4. AdminProducts.jsx

- [ ] **Listar produtos**
  - Tabela deve listar todos os produtos
  - Deve mostrar imagem em miniatura
  - Deve mostrar nome, categoria, preço
  - Deve exibir estoque com badge colorida

- [ ] **Cores de estoque**
  - Verde: > 10 unidades
  - Amarelo: 1-10 unidades
  - Vermelho: sem estoque

- [ ] **Botões de ação inline**
  - Botão editar (lápis azul)
  - Botão deletar (lixeira vermelha)
  - Botão destaque (estrela amarela quando ativo)
  - Botão promoção (trending vermelho quando ativo)

- [ ] **Criar novo produto**
  - Clique no botão "Novo Produto"
  - Modal deve abrir
  - Deve exibir formulário vazio
  - Título: "Novo Produto"

- [ ] **Modal de criação**
  - Preencha todos os campos obrigatórios:
    - Nome: "Blusa Teste"
    - Descrição: "Descrição teste"
    - Categoria: selecione uma
    - URL da Imagem: URL válida
    - Preço: 99.90
    - Estoque: 50
    - Tamanhos: P,M,G,GG
  - Deixe Desconto em branco (opcional)
  - Clique "Criar Produto"
  - Modal deve fechar
  - Toast deve exibir: "Produto criado com sucesso!"
  - Novo produto deve aparecer no topo da tabela

- [ ] **Editar produto**
  - Clique no botão editar de um produto
  - Modal deve abrir com título "Editar Produto"
  - Campos devem estar preenchidos com dados atuais
  - Modifique um campo (ex: nome)
  - Clique "Atualizar"
  - Modal deve fechar
  - Toast: "Produto atualizado com sucesso!"
  - Produto na tabela deve refletir mudança

- [ ] **Deletar produto**
  - Clique no botão deletar
  - Confirmação deve aparecer
  - Clique "OK" ou "Cancelar"
  - Se OK: produto desaparece e toast de sucesso
  - Se Cancelar: nada acontece

- [ ] **Toggle destaque**
  - Clique no botão estrela de um produto
  - Estrela deve ficar amarela
  - Toast: "Status de destaque atualizado!"
  - Clique novamente: estrela volta a cinza
  - Confirme se `featured` muda no backend

- [ ] **Toggle promoção**
  - Similar ao destaque
  - Botão deve ficar vermelho quando ativo
  - Confirme atualização

- [ ] **Validações de formulário**
  - Tente criar produto sem nome
  - Erro deve aparecer: "Nome é obrigatório"
  - Tente sem descrição
  - Erro: "Descrição é obrigatória"
  - Tente sem URL de imagem
  - Erro: "URL da imagem é obrigatória"

- [ ] **Empty state**
  - Se não houver produtos (ou delete todos)
  - Deve exibir ícone de caixa vazia
  - Texto: "Nenhum produto cadastrado"
  - Botão: "Criar Primeiro Produto"

### 5. AdminOrders.jsx

- [ ] **Listar pedidos**
  - Tabela deve mostrar todos os pedidos
  - Colunas: Pedido, Cliente, Total, Pagamento, Envio, Data, Ações
  - Formato correto: #PED001, email visível

- [ ] **Abrir detalhes do pedido**
  - Clique no ícone de "olho" em um pedido
  - Modal deve abrir com "Pedido #PED001"
  - Deve exibir cliente e total

- [ ] **Status de pagamento**
  - Modal deve mostrar 4 botões: PENDING, PAID, CANCELLED, REFUNDED
  - Botão atual deve estar com background primário (marrom)
  - Outros devem ter background cinza
  - Clique em um novo status
  - Deve mudar visualmente
  - Toast: "Status de pagamento atualizado!"
  - Tabela deve atualizar o badge de cor

- [ ] **Status de envio**
  - Modal deve mostrar 3 botões: PROCESSING, SHIPPED, DELIVERED
  - Clique em diferentes status
  - Deve atualizar visualmente
  - Toast: "Status de envio atualizado!"
  - Tabela deve atualizar

- [ ] **Código de rastreio**
  - Campo input deve estar vazio inicialmente
  - Digite um código (ex: BR123456789BR)
  - Clique em "Atualizar"
  - Toast: "Código de rastreio atualizado!"
  - Texto abaixo deve mostrar: "Rastreio atual: BR123456789BR"
  - Se voltar ao modal, código deve estar salvo

- [ ] **Itens do pedido**
  - Deve listar todos os itens
  - Mostrar imagem em miniatura
  - Nome do produto
  - Tamanho e quantidade
  - Preço unitário e total
  - Exemplo: "2 x Blusa Rosa - Tamanho G"

- [ ] **Endereço de entrega**
  - Deve exibir endereço completo
  - Rua, número, complemento
  - Cidade, estado, CEP
  - Formatado: "Rua das Flores, 123, Apt 456, São Paulo, SP, 01234-567"

- [ ] **Empty state**
  - Se não houver pedidos
  - Ícone de caixa vazia
  - Texto: "Nenhum pedido cadastrado"

## Teste de Fluxo Completo

### Cenário 1: Criar produto e verificar no dashboard
1. Login no painel
2. Vá para Produtos
3. Crie novo produto
4. Volte para Dashboard
5. Verifique se "Total de Produtos" aumentou em 1

### Cenário 2: Criar pedido (via frontend) e gerenciar no admin
1. Saia do painel (`/admin/logout` ou limpe localStorage)
2. Vá para página de home
3. Compre um produto (complete o checkout)
4. Login no painel admin
5. Vá para Pedidos
6. Deve ver novo pedido na lista
7. Clique para ver detalhes
8. Atualize status de pagamento
9. Adicione código de rastreio
10. Confirme mudanças

### Cenário 3: Responsividade em mobile
1. Abra DevTools (F12)
2. Mude para modo mobile (Ctrl+Shift+M)
3. Teste em diferentes tamanhos de tela
4. Verifique se layout se adapta
5. Teste sidebar toggle
6. Teste tabelas com scroll horizontal

## Performance

- [ ] **Tempo de carregamento**
  - Dashboard deve carregar em < 2s
  - Listar produtos deve ser rápido

- [ ] **Responsividade da UI**
  - Não deve travar ao interagir
  - Spinners devem aparecer durante requisições
  - Cliques devem ter feedback visual

## Segurança

- [ ] **Proteção de rota**
  - Limpe localStorage
  - Tente acessar `/admin`
  - Deve redirecionar para `/admin/login`

- [ ] **Token no header**
  - Abra DevTools → Network
  - Faça uma requisição (ex: listar produtos)
  - Verifique header `Authorization`
  - Deve conter: `Bearer {token}`

- [ ] **Logout funciona**
  - Faça logout
  - localStorage deve estar vazio
  - Tente acessar `/admin` manualmente
  - Deve redirecionar para login

## Cross-browser Testing

Teste em:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Accessibility (Básico)

- [ ] Todos os botões têm title
- [ ] Formulários têm labels
- [ ] Cores têm constraste adequado
- [ ] Ícones têm fallback de texto
- [ ] Tab navigation funciona

## Bugs Comuns

### Problema: Modal não fecha
**Solução**: Verifique z-index do CSS, reload página

### Problema: Token não incluído na requisição
**Solução**: Verifique se `clothesshop_admin_token` está no localStorage

### Problema: Tabelas vazias
**Solução**: Verifique se backend retorna dados, confira DevTools Network

### Problema: Ícones não aparecem
**Solução**: Reinstale react-icons: `npm install react-icons@latest`

### Problema: Estilos não carregam
**Solução**: Verifique se Tailwind CSS está compilado, restart dev server

## Comandos Úteis para Debug

```javascript
// No console do navegador

// Ver token
console.log(localStorage.getItem('clothesshop_admin_token'));

// Ver dados do user
console.log(JSON.parse(localStorage.getItem('clothesshop_admin_user')));

// Limpar localStorage
localStorage.clear();

// Simular logout
localStorage.removeItem('clothesshop_admin_token');
localStorage.removeItem('clothesshop_admin_user');
location.reload();

// Testar API manualmente
fetch('http://localhost:3000/api/admin/products', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('clothesshop_admin_token')}`
  }
})
.then(r => r.json())
.then(console.log);
```

## Relatório de Teste

Ao testar, documente:
- Data do teste
- Navegador e versão
- Sistema operacional
- Funcionalidades testadas
- Bugs encontrados (com screenshots)
- Tempo de resposta da API
- Observações

Template:
```
Data: DD/MM/YYYY
Navegador: Chrome 120
OS: Windows 11

Funcionalidades Testadas:
- [ ] Login: OK
- [ ] Dashboard: OK
- [ ] Produtos (Create): ERRO - Modal não fecha
- [ ] Produtos (Edit): OK
- [ ] Pedidos: OK

Bugs:
1. Modal de criar produto não fecha após submit
   - Gravidade: Alta
   - Steps: Criar → Salvar → Modal permanece

Sugestões:
- Implementar paginação em tabelas
- Adicionar busca/filtro
```

## Próximos Testes

- [ ] Teste de carga (múltiplos usuários)
- [ ] Teste com dados grandes (1000+ produtos)
- [ ] Teste de timeout de sessão
- [ ] Teste de cache
- [ ] Teste de sincronização em tempo real
