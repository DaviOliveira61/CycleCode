import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.ts';
import postRoutes from './routes/posts.ts';

const app = express();

app.use(cors()); 

app.use(express.json()); 

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

export default app;