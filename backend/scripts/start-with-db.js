const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

// Adiciona parâmetros SSL se não estiverem na URL
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl && !databaseUrl.includes('?')) {
  databaseUrl += '?schema=public&connect_timeout=30';
} else if (databaseUrl && !databaseUrl.includes('connect_timeout')) {
  databaseUrl += '&connect_timeout=30';
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

async function waitForDatabase(maxRetries = 15, delay = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔌 Checking database connection (attempt ${i + 1}/${maxRetries})...`);
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database is ready!');
      await prisma.$disconnect();
      return true;
    } catch (error) {
      console.error(`❌ Database not ready (attempt ${i + 1}/${maxRetries}):`, error.message);
      if (i < maxRetries - 1) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 1.5, 15000); // Max 15s
      }
    }
  }
  throw new Error('Database connection timeout');
}

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl }
    });
    console.log('✅ Migrations completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

async function startServer() {
  try {
    console.log('🚀 Starting server...');
    require('../src/server.js');
  } catch (error) {
    console.error('❌ Server start failed:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await waitForDatabase();
    await runMigrations();
    await startServer();
  } catch (error) {
    console.error('💥 Startup failed:', error.message);
    process.exit(1);
  }
}

main();
