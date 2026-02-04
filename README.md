# 🛍️ AC Ana Curve Shop

> **E-commerce completo de Moda Plus Size com checkout integrado ao Mercado Pago**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 📋 Sobre o Projeto

AC Ana Curve Shop é um e-commerce completo e moderno voltado para moda plus size, desenvolvido com as melhores práticas e otimizado para custo mínimo de hospedagem (máximo US$ 5/mês no Railway).

### ✨ Principais Características

- 🎨 **Design Elegante**: Interface moderna com paleta de cores exclusiva
- 🛒 **Carrinho Inteligente**: Gerenciamento de estado com Context API e localStorage
- 💳 **Checkout Completo**: Sistema multi-etapas integrado com Mercado Pago
- 📦 **Gestão de Pedidos**: Painel administrativo completo com CRUD
- 📱 **100% Responsivo**: Mobile-first design
- ⚡ **Performance Otimizada**: Build otimizado para Railway
- 🔒 **Seguro**: Autenticação JWT e PCI compliant (Mercado Pago)

## 🎨 Paleta de Cores

```css
Primary: #C07837    /* Rosa escuro/terracota */
Secondary: #DE9A8D  /* Rosa médio */
Tertiary: #EBC9C3   /* Rosa claro */
Neutral: #AA8476    /* Marrom rosado */
Background: #FAF5F3 /* Bege clarinho */
Text: #4A4A4A       /* Cinza escuro */
```

## 🚀 Tecnologias

### Backend
- **Node.js 18+** com Express
- **PostgreSQL** (via Railway)
- **Prisma ORM** (queries otimizadas)
- **Mercado Pago SDK** (pagamentos)
- **JWT** (autenticação)
- **bcryptjs** (hash de senhas)

### Frontend
- **React 18** com Vite
- **TailwindCSS** (design system)
- **React Router** (navegação)
- **Context API** (gerenciamento de estado)
- **Axios** (requisições HTTP)
- **React Hook Form** (formulários)
- **React Hot Toast** (notificações)
- **React Icons** (ícones)

## 📦 Estrutura do Projeto

```
ac-ana-curve-shop/
├── backend/              # API REST Node.js + Express
│   ├── prisma/          # Schema do banco de dados
│   ├── src/
│   │   ├── config/      # Configurações e seed
│   │   ├── controllers/ # Lógica de negócio
│   │   ├── middleware/  # Auth e validações
│   │   ├── routes/      # Rotas da API
│   │   └── server.js    # Servidor Express
│   └── package.json
│
└── frontend/            # React SPA
    ├── public/
    ├── src/
    │   ├── components/  # Componentes reutilizáveis
    │   ├── context/     # Context API (Cart)
    │   ├── pages/       # Páginas da aplicação
    │   ├── utils/       # Helpers e API client
    │   ├── styles/      # CSS global (Tailwind)
    │   ├── App.jsx      # Roteamento principal
    │   └── main.jsx     # Entry point
    └── package.json
```

## 🏁 Começando

### Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL (ou conta no Railway)
- Conta no Mercado Pago (credenciais de teste)

### Instalação

#### 1. Clone o repositório

```bash
git clone https://github.com/feliperyo/anacurveshop.git
cd anacurveshop
```

#### 2. Configure o Backend

```bash
cd backend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

**Variáveis obrigatórias no `.env`:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/anacurve"
JWT_SECRET=sua-chave-secreta-aqui
MERCADOPAGO_ACCESS_TOKEN=seu-token-aqui
MERCADOPAGO_PUBLIC_KEY=sua-public-key-aqui
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

#### 3. Configure o Banco de Dados

```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas
npx prisma migrate dev --name init

# Popular com dados de exemplo (20 produtos + 1 admin)
npm run prisma:seed
```

#### 4. Configure o Frontend

```bash
cd ../frontend
npm install

# Criar arquivo de ambiente
echo "VITE_API_URL=http://localhost:3000/api" > .env.local
```

#### 5. Inicie os Servidores

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Acesse: **http://localhost:5173**

## 🔑 Acesso Admin

**URL:** http://localhost:5173/admin/login

**Credenciais padrão:**
- Username: `admin`
- Password: `admin123`

> ⚠️ **IMPORTANTE**: Altere essas credenciais em produção!

## 🎯 Funcionalidades

### Para Clientes

- ✅ Catálogo de produtos com filtros
- ✅ Busca de produtos
- ✅ Categorias (Blusas, Calças, Vestidos, Conjuntos)
- ✅ Produtos em destaque e promoções
- ✅ Carrinho de compras persistente
- ✅ Cálculo de frete por CEP (via ViaCEP)
- ✅ Checkout multi-etapas (3 etapas)
- ✅ Integração com Mercado Pago (Pix, Cartão, Boleto)
- ✅ Página de confirmação de pedido
- ✅ Rastreamento de pedidos

### Para Administradores

- ✅ Dashboard com estatísticas
- ✅ CRUD completo de produtos
- ✅ Gestão de pedidos
- ✅ Atualização de status (pagamento e envio)
- ✅ Código de rastreamento
- ✅ Toggle de produtos em destaque/promoção

## 💳 Configuração Mercado Pago

### 1. Obter Credenciais

1. Acesse: https://www.mercadopago.com.br/developers
2. Vá em **Suas integrações** → **Credenciais**
3. Copie as credenciais de **TESTE**:
   - `Public Key` → `MERCADOPAGO_PUBLIC_KEY`
   - `Access Token` → `MERCADOPAGO_ACCESS_TOKEN`

### 2. Configurar Webhook

1. No painel do Mercado Pago, vá em **Webhooks**
2. Adicione a URL: `https://seu-dominio.railway.app/api/webhooks/mercadopago`
3. Selecione os eventos: `payment`, `merchant_order`

### 3. Testar Pagamento

**Cartão de teste:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: Qualquer data futura
- Nome: Qualquer nome

## 🚢 Deploy no Railway

### 1. Prepare o Repositório

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Crie o Projeto no Railway

1. Acesse: https://railway.app
2. **New Project** → **Deploy from GitHub**
3. Selecione o repositório `anacurveshop`

### 3. Adicione PostgreSQL

1. No projeto, clique em **+ New**
2. Selecione **Database** → **PostgreSQL**
3. Copie a `DATABASE_URL` gerada

### 4. Configure Variáveis de Ambiente

No serviço do backend, adicione:

```env
DATABASE_URL=<url-gerada-pelo-railway>
JWT_SECRET=sua-chave-secreta-producao
MERCADOPAGO_ACCESS_TOKEN=<credenciais-de-producao>
MERCADOPAGO_PUBLIC_KEY=<credenciais-de-producao>
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://seu-dominio.railway.app
BACKEND_URL=https://seu-dominio.railway.app
```

### 5. Build e Deploy

Railway detectará automaticamente e fará o build. Comandos:

```json
{
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "start": "cd backend && npm install && npx prisma generate && node src/server.js"
  }
}
```

### 6. Execute as Migrations

No Railway CLI:
```bash
npx prisma migrate deploy
npx prisma db seed
```

## 📊 Estimativa de Custos (Railway)

Com as otimizações implementadas:

| Recurso | Custo Estimado |
|---------|----------------|
| Backend + Frontend | US$ 2-3/mês |
| PostgreSQL (5GB) | Grátis |
| **TOTAL** | **US$ 2-3/mês** ✅ |

### Otimizações Aplicadas:
- ✅ Servidor único (backend serve frontend estático)
- ✅ Connection pool mínimo no Prisma
- ✅ Cache headers agressivos
- ✅ Bundle otimizado com Vite
- ✅ Lazy loading de imagens
- ✅ Sem background jobs pesados

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Scripts Disponíveis

### Backend

```bash
npm run dev          # Servidor em modo desenvolvimento
npm start            # Servidor em produção
npm run prisma:seed  # Popular banco com dados de exemplo
npx prisma studio    # Visualizar banco de dados
```

### Frontend

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Desenvolvido para AC Ana Curve Shop**

## 🙏 Agradecimentos

- Design inspirado em lojas de moda premium
- Integração de pagamento via Mercado Pago
- Otimizado para hospedagem econômica

---

⭐ Se este projeto foi útil, deixe uma estrela no repositório!

**Status do Projeto:** ✅ Completo e Pronto para Produção
