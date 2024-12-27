import express from 'express';
import cors from 'cors';
import { fetchFiatRates } from '../../services/api/fiatService.js';
import { fetchCryptoPrices } from '../../services/api/cryptoService.js';
import { fetchCommodityPrices } from '../../services/api/commodityService.js';
import { calculateXLL } from '../../services/api/xllService.js';
import { Request, Response } from 'express';

const router = express.Router();

router.use(cors());

router.get('/fiat', async (_req, res) => {
  try {
    const data = await fetchFiatRates();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fiat rates' });
  }
});

router.get('/crypto', async (_req, res) => {
  try {
    const data = await fetchCryptoPrices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crypto prices' });
  }
});

router.get('/commodities', async (_req: Request, res: Response) => {
  try {
    const commodityPrices = await fetchCommodityPrices(process.env.ALPHA_VANTAGE_API_KEY || '');
    res.json(commodityPrices);
  } catch (error) {
    console.error('Commodities API error:', error);
    res.status(500).json({ error: 'Failed to fetch commodity prices' });
  }
});

router.get('/xll', async (_req, res) => {
  try {
    const data = await calculateXLL();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate XLL' });
  }
});

export default router; 