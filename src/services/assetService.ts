import { Asset, AssetResponse } from "@/types/asset";

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const JPY_TO_XLL = 100;

export async function fetchAssets(): Promise<Asset[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=jpy&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }

    const data: AssetResponse[] = await response.json();
    
    return data.map(asset => ({
      ...asset,
      xll_value: JPY_TO_XLL / asset.current_price
    }));
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
}