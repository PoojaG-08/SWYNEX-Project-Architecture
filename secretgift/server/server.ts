import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { authRouter } from './routes/auth.ts';
import { groupsRouter } from './routes/groups.ts';
import { wishlistRouter } from './routes/wishlist.ts';
import { initDatabase } from './store.ts';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Simple CORS header setup for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/wishlist', wishlistRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'SecretGift Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Initialize database and start listening
async function bootstrap() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🎁 SecretGift backend listening at http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
