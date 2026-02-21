require('dotenv').config();
// Server v2
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');


const app = express();
const PORT = process.env.PORT || 3000;

// Prisma com pool mínimo para otimização Railway
// Adiciona parâmetros SSL se não estiverem na URL
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl && !databaseUrl.includes('?')) {
  databaseUrl += '?schema=public&sslmode=require';
} else if (databaseUrl && !databaseUrl.includes('sslmode')) {
  databaseUrl += '&sslmode=require';
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// Make prisma available globally BEFORE loading routes
global.prisma = prisma;

// Routes (loaded AFTER prisma is set)
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const webhookRoutes = require('./routes/webhooks');
const seedRoutes = require('./routes/seed');

// Middlewares - CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'https://anacurveshop.vercel.app',
  'https://anacurveshop-git-main-felipe-ryos-projects.vercel.app',
  'https://anacurveshop-9u9jug756-felipe-ryos-projects.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
// Responde preflight OPTIONS imediatamente para todas as rotas
app.options('*', cors(corsOptions));

// Limite de payload para otimização
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Cache headers para otimização
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-cache'); // APIs não cacheiam
  } else {
    res.set('Cache-Control', 'public, max-age=86400'); // 1 dia para estáticos
  }
  next();
});

// Health check + root
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ status: 'Ana Curve API running' });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/seed', seedRoutes);

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Database connection with retry
async function connectWithRetry(maxRetries = 10, delay = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔌 Attempting to connect to database (attempt ${i + 1}/${maxRetries})...`);
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`; // Test query
      console.log('✅ Database connected successfully!');
      return true;
    } catch (error) {
      console.error(`❌ Database connection failed (attempt ${i + 1}/${maxRetries}):`, error.message);
      if (i < maxRetries - 1) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      }
    }
  }
  throw new Error('Failed to connect to database after maximum retries');
}

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server with database connection check
async function startServer() {
  try {
    // Connect to database first
    await connectWithRetry();

    // Then start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

 
