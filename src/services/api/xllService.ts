import { fetchFiatRates } from './fiatService.js';
import { fetchCryptoPrices } from './cryptoService.js';
import { fetchCommodityPrices } from './commodityService.js';

export interface XLLData {
  fiat: Record<string, number>;
  crypto: Record<string, number>;
  commodities: Record<string, number>;
  yll: number; // median xll value
  timestamp: number;
}

export const calculateXLL = async (): Promise<XLLData> => {
  try {
    const [fiatData, cryptoData, commodityData] = await Promise.all([
      fetchFiatRates(),
      fetchCryptoPrices(),
      fetchCommodityPrices(process.env.MARKETSTACK_API_KEY || '')
    ]);

    const xllData: XLLData = {
      fiat: {},
      crypto: {},
      commodities: {},
      yll: 0,
      timestamp: Date.now()
    };

    // Calculate XLL for fiat (100 JPY / rate)
    Object.entries(fiatData.rates).forEach(([currency, rate]) => {
      xllData.fiat[currency] = 100 / ((rate as number) * (fiatData.rates.JPY as number));
    });

    // Calculate XLL for crypto
    cryptoData.forEach((crypto: { id: string; current_price: number }) => {
      xllData.crypto[crypto.id] = 100 / crypto.current_price;
    });

    // Calculate XLL for commodities
    commodityData.forEach((commodity: { symbol: string; price: number }) => {
      xllData.commodities[commodity.symbol] = 100 / (commodity.price * (fiatData.rates.JPY as number));
    });

    // Calculate YLL (median XLL)
    const allXLLValues = [
      ...Object.values(xllData.fiat),
      ...Object.values(xllData.crypto),
      ...Object.values(xllData.commodities)
    ];
    xllData.yll = calculateMedian(allXLLValues);

    return xllData;
  } catch (error) {
    console.error('Failed to calculate XLL:', error);
    throw new Error('Failed to calculate XLL');
  }
};

const calculateMedian = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}; 