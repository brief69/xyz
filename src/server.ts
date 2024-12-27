import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { cwd } from 'process';
import path from 'path';
import express from 'express';
import cors from 'cors';
import apiRouter from './pages/api/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('ENV Path:', join(__dirname, '../../.env'));
dotenv.config({ path: join(cwd(), '.env') });

const envPath = path.join(process.cwd(), '.env');
console.log('ENV Path:', envPath);
dotenv.config({ path: envPath });

const rawEnvValues = {
  OPEN_EXCHANGE_RATES_API_KEY: process.env.OPEN_EXCHANGE_RATES_API_KEY,
  MARKETSTACK_API_KEY: process.env.MARKETSTACK_API_KEY,
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY
};

console.log('Raw ENV Values:', rawEnvValues);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API Server is running' });
});

app.use('/api', apiRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
  console.log('Environment variables loaded:', {
    OPEN_EXCHANGE_RATES_API_KEY: process.env.OPEN_EXCHANGE_RATES_API_KEY ? 'Set' : 'Not set',
    MARKETSTACK_API_KEY: process.env.MARKETSTACK_API_KEY ? 'Set' : 'Not set',
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY ? 'Set' : 'Not set'
  });
}); 