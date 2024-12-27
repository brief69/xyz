import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CryptoPrice {
  id: string;
  symbol: string;
  current_price: number;
}

export const fetchCryptoPrices = async (): Promise<CryptoPrice[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/simple/price`, {
      params: {
        ids: 'bitcoin,ethereum,ripple,cardano',
        vs_currencies: 'jpy',
        include_24hr_change: true
      }
    });
    
    return Object.entries(response.data).map(([id, data]: [string, any]) => ({
      id,
      symbol: id,
      current_price: data.jpy
    }));
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error);
    throw new Error('Failed to fetch crypto prices');
  }
}; 