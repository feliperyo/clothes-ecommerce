# Guia de Deploy - Clothes Ecommerce E-commerce

Este guia orienta o deploy do projeto em produção usando **Vercel** (frontend) e **Railway** (backend).

---

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Railway](https://railway.app)
- Conta no [Mercado Pago](https://www.mercadopago.com.br) (credenciais de produção)
- Git configurado com o repositório do projeto

---

## 🚀 Deploy do Backend (Railway)

### 1. Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Conecte seu repositório do GitHub
5. Selecione a branch `main`

### 2. Adicionar Banco de Dados PostgreSQL

1. No seu projeto Railway, clique em **"New"**
2. Selecione **"Database"** → **"PostgreSQL"**
3. O Railway criará automaticamente o banco e a variável `DATABASE_URL`

### 3. Configurar Variáveis de Ambiente

No Railway, vá em **Settings** → **Variables** e adicione:

```bash
# O Railway já fornece automaticamente:
# DATABASE_URL=postgresql://...

# Adicione manualmente:
NODE_ENV=production
PORT=3001

# JWT Secret - Gere uma chave forte
JWT_SECRET=sua-chave-secreta-super-segura-aqui

# Admin (para seed inicial)
ADMIN_EMAIL=admin@clothesshop.com
ADMIN_PASSWORD=sua-senha-segura-aqui

# Mercado Pago (PRODUÇÃO)
MP_ACCESS_TOKEN=APP_USR-seu-access-token-de-producao
MP_PUBLIC_KEY=APP_USR-sua-public-key-de-producao

# CORS - URL do frontend Vercel (sem barra no final)
CLIENT_URL=https://seu-site.vercel.app
FRONTEND_URL=https://seu-site.vercel.app
```

### 4. Configurar Build e Deploy

O Railway usará automaticamente o arquivo `railway.json`:

- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm run deploy` (roda migrations + inicia servidor)

### 5. Deploy Inicial

1. O Railway fará o deploy automaticamente
2. Aguarde o build terminar (acompanhe nos logs)
3. Após deploy, execute o seed manualmente (primeira vez):
   - No Railway, vá em **"Terminal"**
   - Execute: `npm run prisma:seed`

### 6. Obter URL do Backend

- Copie a URL gerada pelo Railway (ex: `https://seu-projeto.railway.app`)
- Você usará essa URL no frontend

---

## 🎨 Deploy do Frontend (Vercel)

### 1. Preparar o Frontend

1. Certifique-se de que o arquivo `vercel.json` existe na pasta `frontend/`
2. Esse arquivo já está configurado para SPA routing

### 2. Deploy no Vercel

#### Opção A: Via Dashboard Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New"** → **"Project"**
3. Importe seu repositório do GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Opção B: Via CLI

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login
vercel login

# Na pasta frontend, execute
cd frontend
vercel --prod
```

### 3. Configurar Variáveis de Ambiente

No Vercel, vá em **Settings** → **Environment Variables** e adicione:

```bash
# URL do backend Railway (sem /api no final)
VITE_API_URL=https://seu-backend.railway.app/api

# Mercado Pago Public Key (PRODUÇÃO)
VITE_MP_PUBLIC_KEY=APP_USR-sua-public-key-de-producao
```

### 4. Redeploy

Após adicionar as variáveis, faça um redeploy:
- Vá em **Deployments** → último deploy → **"Redeploy"**

### 5. Obter URL do Frontend

- Copie a URL gerada pela Vercel (ex: `https://seu-site.vercel.app`)
- **IMPORTANTE**: Adicione essa URL nas variáveis `CLIENT_URL` e `FRONTEND_URL` do Railway

---

## 🔄 Configuração Final

### 1. Atualizar CORS no Backend

Certifique-se de que no Railway você configurou:
```bash
CLIENT_URL=https://seu-site.vercel.app
```

### 2. Testar Integração

1. Acesse seu site na Vercel
2. Verifique se os produtos carregam (teste de integração backend/frontend)
3. Faça login no admin com as credenciais que você configurou
4. Teste uma compra até o checkout

---

## 📦 Estrutura de Arquivos de Deploy

```
Ecommerce/
├── frontend/
│   ├── vercel.json              # Configuração Vercel (SPA routing)
│   └── .env.example            # Exemplo de variáveis frontend
├── backend/
│   ├── railway.json            # Configuração Railway
│   ├── .env.example           # Exemplo de variáveis backend
│   └── package.json           # Scripts de deploy configurados
└── DEPLOY.md                  # Este arquivo
```

---

## 🔐 Checklist de Segurança

- [ ] Use credenciais de **PRODUÇÃO** do Mercado Pago
- [ ] Altere o `ADMIN_PASSWORD` padrão para algo seguro
- [ ] Gere um `JWT_SECRET` forte e único
- [ ] Nunca commite arquivos `.env` com credenciais reais
- [ ] Configure CORS corretamente (apenas suas URLs)
- [ ] Ative HTTPS (Vercel e Railway fazem isso automaticamente)

---

## 🐛 Troubleshooting

### Backend não conecta ao banco

- Verifique se a variável `DATABASE_URL` está configurada no Railway
- Confirme que as migrations rodaram: veja os logs do Railway

### Frontend não carrega produtos

- Verifique se `VITE_API_URL` está correto no Vercel
- Teste a URL do backend diretamente: `https://seu-backend.railway.app/health`
- Verifique CORS no backend (logs do Railway)

### Erro de CORS

- Confirme que `CLIENT_URL` no Railway tem a URL exata da Vercel
- Sem barra no final: ✅ `https://site.vercel.app` | ❌ `https://site.vercel.app/`

### Migrations não rodaram

No Railway, execute manualmente:
```bash
npm run prisma:deploy
```

### Precisa resetar o banco

```bash
# No terminal do Railway
npx prisma migrate reset --force
npm run prisma:seed
```

---

## 🔄 Atualizações Futuras

Para fazer deploy de novas mudanças:

1. **Faça commit e push** para o GitHub:
   ```bash
   git add .
   git commit -m "sua mensagem"
   git push
   ```

2. **Railway** e **Vercel** farão redeploy automático

3. Se houver mudanças no schema do banco:
   ```bash
   # Crie uma nova migration
   npx prisma migrate dev --name nome_da_mudanca

   # Push para o GitHub
   git push

   # O Railway rodará automaticamente a migration no deploy
   ```

---

## 📞 Suporte

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Prisma**: [prisma.io/docs](https://www.prisma.io/docs)

---

## ✅ Deploy Completo!

Após seguir todos os passos:

- ✅ Backend rodando no Railway com PostgreSQL
- ✅ Frontend rodando na Vercel
- ✅ CORS configurado corretamente
- ✅ Mercado Pago integrado
- ✅ Admin seed criado

Seu e-commerce está no ar! 🎉
