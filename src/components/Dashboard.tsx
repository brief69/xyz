import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { XLLData } from '../services/api/xllService';

// APIベースURLを環境変数から取得
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<XLLData | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/xll`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const xllData = await response.json();
        console.log('Fetched XLL data:', xllData); // デバッグログを追加
        setData(xllData);
      } catch (error) {
        console.error('Failed to fetch XLL data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>YLL (Median XLL): {data?.yll.toFixed(4)}</CardTitle>
        </CardHeader>
      </Card>

      <Input
        placeholder="Search assets..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        className="mb-4"
      />

      <Tabs defaultValue="fiat">
        <TabsList>
          <TabsTrigger value="fiat">Fiat Currencies</TabsTrigger>
          <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
          <TabsTrigger value="commodities">Commodities</TabsTrigger>
        </TabsList>

        <TabsContent value="fiat">
          <AssetList
            assets={data?.fiat}
            search={search}
          />
        </TabsContent>

        <TabsContent value="crypto">
          <AssetList
            assets={data?.crypto}
            search={search}
          />
        </TabsContent>

        <TabsContent value="commodities">
          <AssetList
            assets={data?.commodities}
            search={search}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AssetListProps {
  assets: Record<string, number> | undefined;
  search: string;
}

const AssetList: React.FC<AssetListProps> = ({ assets, search }) => {
  if (!assets) return null;

  const filteredAssets = Object.entries(assets)
    .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredAssets.map(([key, value]) => (
        <Card key={key}>
          <CardContent className="p-4">
            <div className="font-bold">{key}</div>
            <div>XLL: {value.toFixed(4)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 