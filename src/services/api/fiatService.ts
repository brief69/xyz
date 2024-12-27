import axios from 'axios';

const API_KEY = process.env.OPEN_EXCHANGE_RATES_API_KEY;
const BASE_URL = 'https://openexchangerates.org/api/latest.json';

export interface FiatRates {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

export const fetchFiatRates = async (): Promise<FiatRates> => {
  try {
    console.log('API_KEY:', API_KEY);
    const response = await axios.get(BASE_URL, {
      params: {
        app_id: API_KEY,
        base: 'USD'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch fiat rates:', error);
    throw new Error('Failed to fetch fiat rates');
  }
}; 