# Exemplos de Uso - Painel Administrativo

## Exemplos de Dados para Testes

### Login Válido

```javascript
// Credenciais para teste (conforme seu backend)
{
  "username": "admin",
  "password": "admin123"
}
```

**Response do servidor:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluIn0...",
  "user": {
    "id": "1",
    "username": "admin",
    "name": "Administrador"
  }
}
```

---

## AdminDashboard - Dados Esperados

### GET /api/admin/dashboard

**Response completo esperado:**

```json
{
  "totalProducts": 156,
  "totalOrders": 1250,
  "totalRevenue": 125450.50,
  "pendingOrders": 23,
  "recentOrders": [
    {
      "id": "uuid-123",
      "orderNumber": "PED001250",
      "customerName": "Maria Silva",
      "customerEmail": "maria@email.com",
      "total": 459.90,
      "paymentStatus": "PAID",
      "shippingStatus": "SHIPPED",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid-124",
      "orderNumber": "PED001249",
      "customerName": "João Santos",
      "customerEmail": "joao@email.com",
      "total": 199.90,
      "paymentStatus": "PENDING",
      "shippingStatus": "PROCESSING",
      "createdAt": "2024-01-15T09:15:00Z"
    }
  ],
  "topProducts": [
    {
      "id": "prod-001",
      "name": "Blusa Rosa Premium",
      "sales": 145,
      "revenue": 21155.50
    },
    {
      "id": "prod-002",
      "name": "Calça Jeans Skinny",
      "sales": 132,
      "revenue": 18920.00
    },
    {
      "id": "prod-003",
      "name": "Vestido Floral",
      "sales": 98,
      "revenue": 14215.50
    }
  ],
  "lowStockProducts": [
    {
      "id": "prod-010",
      "name": "Conjunto Inverno",
      "category": "Conjuntos",
      "stock": 3
    },
    {
      "id": "prod-011",
      "name": "Blusa Seda",
      "category": "Blusas",
      "stock": 5
    }
  ]
}
```

---

## AdminProducts - Exemplos de Dados

### Criar Produto

**POST /api/admin/products**

```json
{
  "name": "Blusa Botões Frontal",
  "description": "Blusa elegante com botões frontal em linho de alta qualidade. Perfeita para looks casuais e formais.",
  "category": "Blusas",
  "price": 129.90,
  "discountPrice": 99.90,
  "stock": 45,
  "sizes": ["P", "M", "G", "GG", "XG"],
  "imageUrl": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500",
  "featured": true,
  "promotion": false
}
```

**Response (201 Created):**
```json
{
  "id": "prod-new-001",
  "name": "Blusa Botões Frontal",
  "description": "Blusa elegante com botões frontal...",
  "category": "Blusas",
  "price": 129.90,
  "discountPrice": 99.90,
  "stock": 45,
  "sizes": ["P", "M", "G", "GG", "XG"],
  "imageUrl": "https://images.unsplash.com/...",
  "featured": true,
  "promotion": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Listar Produtos

**GET /api/admin/products**

```json
[
  {
    "id": "prod-001",
    "name": "Blusa Rosa Premium",
    "description": "Blusa rosada em modal...",
    "category": "Blusas",
    "price": 149.90,
    "discountPrice": null,
    "stock": 23,
    "sizes": ["P", "M", "G", "GG"],
    "imageUrl": "https://...",
    "featured": true,
    "promotion": false,
    "createdAt": "2024-01-10T14:20:00Z"
  },
  {
    "id": "prod-002",
    "name": "Calça Jeans",
    "description": "Calça jeans premium...",
    "category": "Calças",
    "price": 179.90,
    "discountPrice": 149.90,
    "stock": 8,
    "sizes": ["P", "M", "G", "GG", "XG"],
    "imageUrl": "https://...",
    "featured": false,
    "promotion": true,
    "createdAt": "2024-01-08T09:10:00Z"
  }
]
```

### Atualizar Produto

**PUT /api/admin/products/:id**

```json
{
  "name": "Blusa Rosa Premium v2",
  "description": "Blusa atualizada...",
  "category": "Blusas",
  "price": 139.90,
  "discountPrice": 99.90,
  "stock": 30,
  "sizes": ["P", "M", "G", "GG", "XG"],
  "imageUrl": "https://...",
  "featured": true,
  "promotion": true
}
```

---

## AdminOrders - Exemplos de Dados

### Listar Pedidos

**GET /api/admin/orders**

```json
[
  {
    "id": "order-123",
    "orderNumber": "PED001250",
    "customerName": "Maria Silva",
    "customerEmail": "maria@email.com",
    "total": 459.90,
    "paymentStatus": "PAID",
    "shippingStatus": "SHIPPED",
    "trackingCode": "BR123456789BR",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Detalhes do Pedido

**GET /api/admin/orders/:id**

```json
{
  "id": "order-123",
  "orderNumber": "PED001250",
  "customerName": "Maria Silva",
  "customerEmail": "maria@email.com",
  "customerPhone": "(11) 98765-4321",
  "total": 459.90,
  "subtotal": 419.90,
  "shippingCost": 40.00,
  "paymentStatus": "PAID",
  "shippingStatus": "SHIPPED",
  "trackingCode": "BR123456789BR",
  "items": [
    {
      "id": "item-1",
      "productId": "prod-001",
      "name": "Blusa Rosa Premium",
      "size": "G",
      "quantity": 2,
      "price": 149.90,
      "imageUrl": "https://..."
    },
    {
      "id": "item-2",
      "productId": "prod-002",
      "name": "Calça Jeans",
      "size": "M",
      "quantity": 1,
      "price": 179.90,
      "imageUrl": "https://..."
    }
  ],
  "shippingAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 456",
    "city": "São Paulo",
    "state": "SP",
    "cep": "01234-567"
  },
  "billingAddress": {
    "street": "Avenida Paulista",
    "number": "1000",
    "complement": null,
    "city": "São Paulo",
    "state": "SP",
    "cep": "01311-100"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T15:45:00Z"
}
```

### Atualizar Status de Pagamento

**PATCH /api/admin/orders/:id/status**

```json
{
  "paymentStatus": "PAID"
}
```

**Response:**
```json
{
  "id": "order-123",
  "orderNumber": "PED001250",
  "paymentStatus": "PAID",
  "updatedAt": "2024-01-15T16:00:00Z"
  // ... resto dos dados
}
```

### Atualizar Código de Rastreio

**PATCH /api/admin/orders/:id/tracking**

```json
{
  "trackingCode": "BR987654321BR"
}
```

**Response:**
```json
{
  "id": "order-123",
  "orderNumber": "PED001250",
  "trackingCode": "BR987654321BR",
  "updatedAt": "2024-01-15T16:05:00Z"
  // ... resto dos dados
}
```

---

## Fluxos de Exemplo

### Fluxo 1: Criar um Novo Produto

```javascript
// 1. Usuário clica em "Novo Produto"
// Frontend: Abre modal de criação

// 2. Usuário preenche formulário:
const productData = {
  name: "Nova Blusa",
  description: "Uma blusa bonita",
  category: "Blusas",
  price: 99.90,
  discountPrice: null,
  stock: 50,
  sizes: "P,M,G,GG",
  imageUrl: "https://...",
  featured: true,
  promotion: false
};

// 3. Frontend converte para formato correto:
const apiData = {
  ...productData,
  price: 99.90,
  stock: 50,
  sizes: ["P", "M", "G", "GG"],
  discountPrice: null
};

// 4. POST para API
// Response: produto criado com ID

// 5. Frontend atualiza lista
// 6. Modal fecha
// 7. Toast exibe sucesso
```

### Fluxo 2: Gerenciar Pedido

```javascript
// 1. Admin vê pedido com status PENDING/PROCESSING

// 2. Clica para ver detalhes
// Frontend: GET /api/admin/orders/order-123

// 3. Modal abre com dados do pedido

// 4. Admin verifica pagamento:
//    - Status é PENDING
//    - Clica no botão PAID
//    - POST /api/admin/orders/order-123/status
//    - Status muda para verde (PAID)

// 5. Admin verifica envio:
//    - Status é PROCESSING
//    - Clica no botão SHIPPED
//    - POST /api/admin/orders/order-123/status
//    - Status muda para azul (SHIPPED)

// 6. Admin adiciona rastreio:
//    - Digite: "BR123456789BR"
//    - Clique "Atualizar"
//    - POST /api/admin/orders/order-123/tracking
//    - Campo exibe código atualizado

// 7. Cliente recebe email com rastreio
// 8. Cliente pode rastrear pacote
```

---

## Boas Práticas de Dados

### Validação no Frontend

```javascript
// AdminProducts.jsx - Validação de preço
register('price', {
  required: 'Preço é obrigatório',
  validate: value => {
    if (value <= 0) return 'Preço deve ser maior que zero';
    if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Formato inválido';
    return true;
  }
})

// Conversão para número
price: parseFloat(data.price)
stock: parseInt(data.stock)
sizes: data.sizes.split(',').map(s => s.trim())
```

### Validação no Backend

```javascript
// Exemplo de validação Express
router.post('/products', authenticateAdmin, (req, res) => {
  const { name, price, stock, sizes } = req.body;

  // Validações
  if (!name) return res.status(400).json({ message: 'Nome obrigatório' });
  if (price <= 0) return res.status(400).json({ message: 'Preço inválido' });
  if (stock < 0) return res.status(400).json({ message: 'Estoque inválido' });
  if (!Array.isArray(sizes)) return res.status(400).json({ message: 'Tamanhos inválidos' });

  // Criar produto...
});
```

---

## Exemplos de Mensagens de Erro

### Login
- "Usuário é obrigatório"
- "Senha é obrigatória"
- "Senha deve ter no mínimo 6 caracteres"
- "Credenciais inválidas"
- "Erro ao fazer login"

### Produtos
- "Nome é obrigatório"
- "Descrição é obrigatória"
- "URL da imagem é obrigatória"
- "Preço deve ser maior que zero"
- "Estoque não pode ser negativo"
- "Erro ao salvar produto"
- "Erro ao deletar produto"

### Pedidos
- "Erro ao carregar pedidos"
- "Erro ao carregar detalhes do pedido"
- "Erro ao atualizar status de pagamento"
- "Erro ao atualizar status de envio"
- "Digite um código de rastreio"
- "Erro ao atualizar código de rastreio"

---

## Exemplo de Integração Completa

### Arquivo: AdminProducts.jsx - Snippet Importante

```jsx
// Hook de submissão do formulário
const onSubmit = async (data) => {
  try {
    setSubmitting(true);

    // Converter dados do formulário para formato API
    const productData = {
      name: data.name,
      description: data.description,
      category: data.category,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      sizes: data.sizes.split(',').map(s => s.trim()),
      imageUrl: data.imageUrl,
      discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
      featured: data.featured,
      promotion: data.promotion
    };

    if (editingProduct) {
      // Atualizar produto existente
      const updated = await updateProduct(editingProduct.id, productData);

      // Atualizar lista local
      setProducts(products.map(p => p.id === editingProduct.id ? updated : p));

      // Feedback ao usuário
      toast.success('Produto atualizado com sucesso!');
    } else {
      // Criar novo produto
      const created = await createProduct(productData);

      // Adicionar à lista (no topo)
      setProducts([created, ...products]);

      // Feedback ao usuário
      toast.success('Produto criado com sucesso!');
    }

    // Fechar modal
    closeModal();
  } catch (error) {
    // Mensagem de erro do backend ou fallback
    const message = error.response?.data?.message || 'Erro ao salvar produto';
    toast.error(message);
  } finally {
    setSubmitting(false);
  }
};
```

---

## Dicas de Desenvolvimento

### 1. Testing Local

```bash
# Terminal 1: Backend
cd backend
npm start
# http://localhost:3000

# Terminal 2: Frontend
cd frontend
npm run dev
# http://localhost:5173

# Acesse: http://localhost:5173/admin/login
```

### 2. Console Debug

```javascript
// No console do navegador, após fazer login:

// Ver token
const token = localStorage.getItem('clothesshop_admin_token');
console.log('Token:', token);

// Ver dados do usuário
const user = JSON.parse(localStorage.getItem('clothesshop_admin_user'));
console.log('User:', user);

// Testar API manualmente
fetch('http://localhost:3000/api/admin/dashboard', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log);
```

### 3. Mock Data para Testes

```javascript
// Se backend não responder, você pode simular dados:
const mockProducts = [
  {
    id: '1',
    name: 'Produto Teste',
    price: 99.90,
    stock: 50,
    // ...
  }
];

// Em AdminProducts.jsx, durante desenvolvimemto:
// setProducts(mockProducts);
```

---

## Referência Rápida de APIs

| Operação | Método | Endpoint |
|----------|--------|----------|
| Login | POST | /admin/login |
| Dashboard | GET | /admin/dashboard |
| Listar Produtos | GET | /admin/products |
| Criar Produto | POST | /admin/products |
| Atualizar Produto | PUT | /admin/products/:id |
| Deletar Produto | DELETE | /admin/products/:id |
| Toggle Destaque | PATCH | /admin/products/:id/featured |
| Toggle Promoção | PATCH | /admin/products/:id/promotion |
| Listar Pedidos | GET | /admin/orders |
| Ver Pedido | GET | /admin/orders/:id |
| Atualizar Status | PATCH | /admin/orders/:id/status |
| Atualizar Rastreio | PATCH | /admin/orders/:id/tracking |
