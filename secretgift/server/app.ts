import express from 'express';
import { authRouter } from './routes/auth.ts';
import { groupsRouter } from './routes/groups.ts';
import { wishlistRouter } from './routes/wishlist.ts';
import { initDatabase } from './store.ts';

export async function createExpressApp() {
  await initDatabase();

  const app = express();

  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/groups', groupsRouter);
  app.use('/api/wishlist', wishlistRouter);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'SecretGift Backend API',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
