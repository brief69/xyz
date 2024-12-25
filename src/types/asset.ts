export type AssetCategory = "cryptocurrency" | "fiat" | "commodity";

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  xll_value: number;
  category: AssetCategory;
}

export interface AssetResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export interface YahooFinanceResponse {
  chart: {
    result: [{
      meta: {
        regularMarketPrice: number;
        previousClose: number;
      };
    }];
  };
}