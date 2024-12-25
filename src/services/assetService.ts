import { Asset, AssetResponse, YahooFinanceResponse } from "@/types/asset";

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const YAHOO_FINANCE_API = "https://query1.finance.yahoo.com/v8/finance/chart";
const JPY_TO_XLL = 100;

const FIAT_SYMBOLS = ["EURUSD=X", "GBPUSD=X", "USDCNY=X", "USDJPY=X"];
const COMMODITY_SYMBOLS = ["GC=F", "SI=F", "PL=F", "CL=F", "NG=F", "ZW=F", "ZC=F", "KC=F", "SB=F"];

async function fetchYahooFinancePrice(symbol: string): Promise<number> {
  try {
    const response = await fetch(`${YAHOO_FINANCE_API}/${symbol}`);
    if (!response.ok) throw new Error(`Failed to fetch ${symbol}`);
    const data: YahooFinanceResponse = await response.json();
    return data.chart.result[0].meta.regularMarketPrice;
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    throw error;
  }
}

async function fetchFiatPrices(): Promise<Asset[]> {
  const fiatAssets: Asset[] = [];
  for (const symbol of FIAT_SYMBOLS) {
    try {
      const price = await fetchYahooFinancePrice(symbol);
      const jpy_price = symbol === "USDJPY=X" ? price : price * await fetchYahooFinancePrice("USDJPY=X");
      fiatAssets.push({
        id: symbol,
        symbol: symbol.replace("=X", ""),
        name: getCurrencyName(symbol),
        current_price: jpy_price,
        price_change_percentage_24h: 0, // We could calculate this from previousClose if needed
        xll_value: JPY_TO_XLL / jpy_price,
        category: "fiat"
      });
    } catch (error) {
      console.error(`Failed to fetch ${symbol}`, error);
    }
  }
  return fiatAssets;
}

async function fetchCommodityPrices(): Promise<Asset[]> {
  const commodityAssets: Asset[] = [];
  for (const symbol of COMMODITY_SYMBOLS) {
    try {
      const price = await fetchYahooFinancePrice(symbol);
      const jpy_price = price * await fetchYahooFinancePrice("USDJPY=X");
      commodityAssets.push({
        id: symbol,
        symbol: symbol.replace("=F", ""),
        name: getCommodityName(symbol),
        current_price: jpy_price,
        price_change_percentage_24h: 0,
        xll_value: JPY_TO_XLL / jpy_price,
        category: "commodity"
      });
    } catch (error) {
      console.error(`Failed to fetch ${symbol}`, error);
    }
  }
  return commodityAssets;
}

async function fetchCryptoPrices(): Promise<Asset[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=jpy&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    if (!response.ok) throw new Error('Failed to fetch crypto assets');
    const data: AssetResponse[] = await response.json();
    return data.map(asset => ({
      ...asset,
      xll_value: JPY_TO_XLL / asset.current_price,
      category: "cryptocurrency" as const
    }));
  } catch (error) {
    console.error('Error fetching crypto assets:', error);
    throw error;
  }
}

function getCurrencyName(symbol: string): string {
  const names: Record<string, string> = {
    "EURUSD=X": "Euro",
    "GBPUSD=X": "British Pound",
    "USDCNY=X": "Chinese Yuan",
    "USDJPY=X": "US Dollar"
  };
  return names[symbol] || symbol;
}

function getCommodityName(symbol: string): string {
  const names: Record<string, string> = {
    "GC=F": "Gold",
    "SI=F": "Silver",
    "PL=F": "Platinum",
    "CL=F": "Crude Oil",
    "NG=F": "Natural Gas",
    "ZW=F": "Wheat",
    "ZC=F": "Corn",
    "KC=F": "Coffee",
    "SB=F": "Sugar"
  };
  return names[symbol] || symbol;
}

export async function fetchAssets(): Promise<Asset[]> {
  try {
    const [cryptoAssets, fiatAssets, commodityAssets] = await Promise.all([
      fetchCryptoPrices(),
      fetchFiatPrices(),
      fetchCommodityPrices()
    ]);
    
    return [...cryptoAssets, ...fiatAssets, ...commodityAssets];
  } catch (error) {
    console.error('Error fetching all assets:', error);
    throw error;
  }
}