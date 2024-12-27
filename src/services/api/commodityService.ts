import axios, { AxiosError } from 'axios';

export interface CommodityPrice {
  symbol: string;
  name: string;
  price: number;
  currency: string;
}

interface MetalsAPIResponse {
  success: boolean;
  rates: {
    [key: string]: number;
  };
}

export const fetchCommodityPrices = async (_apiKey: string): Promise<CommodityPrice[]> => {
  try {
    console.log('Fetching commodity prices from Metals-API');
    
    // 一時的にモックデータを返す
    console.log('Using mock data while setting up Metals-API');
    return [
      {
        symbol: 'XAU',
        name: 'Gold',
        price: 2023.50,
        currency: 'USD'
      },
      {
        symbol: 'XAG',
        name: 'Silver',
        price: 25.63,
        currency: 'USD'
      },
      {
        symbol: 'BRENT',
        name: 'Crude Oil',
        price: 75.21,
        currency: 'USD'
      }
    ];

    /* 実際のAPI実装（APIキー取得後に使用）
    const response = await axios.get<MetalsAPIResponse>(
      'https://metals-api.com/api/latest',
      {
        params: {
          access_key: 'YOUR_API_KEY',
          base: 'USD',
          symbols: 'XAU,XAG,BRENT'
        }
      }
    );

    const data = response.data;
    console.log('Raw response from Metals-API:', JSON.stringify(data, null, 2));

    if (!data.success) {
      throw new Error('Failed to fetch data from Metals-API');
    }

    const commodityMap: { [key: string]: string } = {
      'XAU': 'Gold',
      'XAG': 'Silver',
      'BRENT': 'Crude Oil'
    };

    return Object.entries(data.rates).map(([symbol, rate]) => {
      return {
        symbol,
        name: commodityMap[symbol] || symbol,
        price: 1 / rate,
        currency: 'USD'
      };
    });
    */

  } catch (error) {
    console.error('Failed to fetch commodity prices:', error);
    if (error instanceof AxiosError && error.response) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw new Error('Failed to fetch commodity prices');
  }
}; 