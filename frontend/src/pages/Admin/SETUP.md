# Setup e Configuração - Painel Administrativo

## Verificação de Arquivos

Todos os 5 arquivos necessários foram criados:

```
frontend/src/pages/Admin/
├── AdminLogin.jsx          (Login page com autenticação)
├── AdminLayout.jsx         (Layout wrapper com sidebar)
├── AdminDashboard.jsx      (Dashboard com estatísticas)
├── AdminProducts.jsx       (CRUD de produtos)
├── AdminOrders.jsx         (Gerenciamento de pedidos)
├── README.md               (Documentação completa)
└── SETUP.md               (Este arquivo)
```

## Dependências Necessárias

Todas as dependências já estão no `package.json`:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "react-hook-form": "^7.49.3",
    "axios": "^1.6.5",
    "react-icons": "^5.0.1",
    "react-hot-toast": "^2.4.1"
  }
}
```

Execute para instalar:
```bash
cd frontend
npm install
```

## Integração com App.jsx

O arquivo `App.jsx` já contém as importações necessárias:

```jsx
// Admin Pages (já importadas)
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminLayout from './pages/Admin/AdminLayout';

// Routes (já configuradas)
<Routes>
  {/* Admin Routes */}
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="orders" element={<AdminOrders />} />
  </Route>

  {/* Public Routes */}
  ...
</Routes>
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` ou `.env` na pasta `frontend`:

```env
VITE_API_URL=http://localhost:3000/api
```

Para produção:
```env
VITE_API_URL=https://sua-api.com/api
```

## Backend - Endpoints Necessários

O backend (Express) já possui as rotas em `backend/src/routes/admin.js`:

### Autenticação
```
POST   /api/admin/login
```
**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "username": "admin",
    "name": "Admin Name"
  }
}
```

### Dashboard
```
GET    /api/admin/dashboard
```
**Response:**
```json
{
  "totalProducts": 150,
  "totalOrders": 1250,
  "totalRevenue": 125000.00,
  "pendingOrders": 23,
  "recentOrders": [...],
  "topProducts": [...],
  "lowStockProducts": [...]
}
```

### Produtos
```
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
PATCH  /api/admin/products/:id/featured
PATCH  /api/admin/products/:id/promotion
```

### Pedidos
```
GET    /api/admin/orders
GET    /api/admin/orders/:id
PATCH  /api/admin/orders/:id/status
PATCH  /api/admin/orders/:id/tracking
```

## Middleware de Autenticação

O backend usa middleware `authenticateAdmin` em todas as rotas protegidas:

```javascript
// backend/src/middleware/auth.js
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
```

## Fluxo de Autenticação

```
1. Usuário acessa /admin
   ↓
2. AdminLayout verifica token
   ↓
3. Se não tem token → redireciona para /admin/login
   ↓
4. Usuário faz login com credenciais
   ↓
5. API retorna token e dados do usuário
   ↓
6. Front-end salva no localStorage
   ↓
7. Redireciona para /admin (dashboard)
   ↓
8. AdminLayout agora encontra token e renderiza layout
```

## Fluxo de Token

```
Login page faz POST /admin/login
            ↓
Backend valida credenciais
            ↓
Retorna token JWT + user data
            ↓
Frontend salva em localStorage:
  - 'clothesshop_admin_token' (token)
  - 'clothesshop_admin_user' (user data)
            ↓
Interceptor automático adiciona token
a todas as requisições:
  Authorization: Bearer {token}
            ↓
Se 401 → limpa localStorage e redireciona
```

## Executar em Desenvolvimento

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start
# Porta: 3000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Porta: 5173
```

Acesse: `http://localhost:5173/admin/login`

## Testar Autenticação

```javascript
// Console do navegador
// Salvar um token de teste (se disponível)
localStorage.setItem('clothesshop_admin_token', 'seu_token_aqui');
localStorage.setItem('clothesshop_admin_user', JSON.stringify({
  id: '1',
  username: 'admin',
  name: 'Administrador'
}));

// Refresh página
location.reload();

// Você deve ver o dashboard agora
```

## Formatação de Dados

As páginas utilizam funções helpers em `utils/helpers.js`:

```javascript
// Preço em Real Brasileiro
formatPrice(1500.50) // "R$ 1.500,50"

// Data formatada
formatDate('2024-01-15T10:30:00') // "15/01/2024 10:30"

// Status de Pagamento
getPaymentStatusLabel('PAID') // "Pago"
getPaymentStatusLabel('PENDING') // "Pendente"
getPaymentStatusLabel('CANCELLED') // "Cancelado"

// Status de Envio
getShippingStatusLabel('SHIPPED') // "Enviado"
getShippingStatusLabel('DELIVERED') // "Entregue"

// Cores para badges
getStatusColor('PAID') // "bg-green-100 text-green-800"
```

## Estrutura de Dados Esperada

### Produto
```javascript
{
  id: "uuid",
  name: "Nome do Produto",
  description: "Descrição...",
  category: "Blusas",
  price: 129.90,
  discountPrice: null,
  stock: 50,
  imageUrl: "https://...",
  sizes: ["P", "M", "G", "GG"],
  featured: true,
  promotion: false,
  createdAt: "2024-01-15T10:30:00"
}
```

### Pedido
```javascript
{
  id: "uuid",
  orderNumber: "PED001",
  customerName: "João Silva",
  customerEmail: "joao@email.com",
  total: 459.90,
  paymentStatus: "PAID",
  shippingStatus: "SHIPPED",
  trackingCode: "BR123456789BR",
  items: [
    {
      id: "uuid",
      name: "Blusa Rosa",
      size: "G",
      quantity: 2,
      price: 129.90,
      imageUrl: "https://..."
    }
  ],
  shippingAddress: {
    street: "Rua das Flores",
    number: "123",
    complement: "Apt 456",
    city: "São Paulo",
    state: "SP",
    cep: "01234-567"
  },
  createdAt: "2024-01-15T10:30:00"
}
```

## Troubleshooting

### Erro: Token não reconhecido
- Verifique se o backend está rodando em http://localhost:3000
- Confirme se VITE_API_URL está correto no .env.local
- Teste manualmente com curl: `curl http://localhost:3000/api/admin/login`

### Erro: "Token expirado"
- Limpe localStorage: `localStorage.clear()`
- Faça login novamente
- Verifique JWT_SECRET no backend

### Modais não aparecem
- Verifique z-index do CSS (deve estar alto)
- Confirme que Tailwind CSS está carregando
- Inspecione no DevTools

### Tabelas sem dados
- Verifique se backend retorna dados corretos
- Abra DevTools → Network → veja response da API
- Confirme estrutura de dados

### Ícones não aparecem
- Verifique se react-icons está instalado
- Reboot do servidor dev se necessário
- `npm install react-icons@latest`

## Performance

Para melhorar performance em produção:

1. **Lazy Load de rotas admin**:
```jsx
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/Admin/AdminProducts'));
```

2. **Memoização de componentes**:
```jsx
const AdminLayout = memo(AdminLayout);
```

3. **Paginação em tabelas** (futuro):
- Implementar paginação ao listar produtos/pedidos
- Limitar requisições

## Segurança

- ✅ Token armazenado seguro (localStorage)
- ✅ Validação de autenticação em cada rota
- ✅ Interceptor para detectar token expirado
- ✅ CORS configurado no backend
- ✅ Validação de campos no frontend
- ✅ Validação adicional no backend

## Próximos Passos

1. Configurar email de notificação de pedido
2. Adicionar filtros/busca na tabela de pedidos
3. Exportar relatórios (CSV, PDF)
4. Adicionar histórico de alterações
5. Sistema de permissões multi-user
6. Backup automático de dados

## Suporte

Para dúvidas sobre:
- **Backend API**: Verifique `backend/src/controllers/adminController.js`
- **Rotas**: Verifique `backend/src/routes/admin.js`
- **Autenticação**: Verifique `backend/src/middleware/auth.js`
- **Frontend**: Consulte documentação em `README.md`
