import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './api/index.js';
const app = express();

app.use(cors()); 

app.use(express.json()); 

app.use('/api', apiRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

export default app;
