import { useEffect, useState } from "react";
import { Asset, AssetCategory } from "@/types/asset";
import { fetchAssets } from "@/services/assetService";
import { SearchInput } from "@/components/SearchInput";
import { AssetTable } from "@/components/AssetTable";
import { YllDisplay } from "@/components/YllDisplay";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useToast } from "@/components/ui/use-toast";

const REFRESH_INTERVAL = 3600000; // 1 hour in milliseconds

export default function Index() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | "all">("all");
  const [sortColumn, setSortColumn] = useState<keyof Asset>("xll_value");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  const loadAssets = async () => {
    try {
      const data = await fetchAssets();
      setAssets(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch asset data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadAssets();
    const interval = setInterval(loadAssets, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (column: keyof Asset) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedAssets = assets
    .filter(
      (asset) =>
        (selectedCategory === "all" || asset.category === selectedCategory) &&
        (asset.name.toLowerCase().includes(search.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      const modifier = sortDirection === "asc" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * modifier;
      }

      return ((aValue as number) - (bValue as number)) * modifier;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-muted-foreground">Loading assets...</div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Asset Prices</h1>
          <p className="text-muted-foreground">
            Real-time asset prices converted to XLL (100 JPY equivalent)
          </p>
        </div>

        <YllDisplay assets={assets} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-sm">
            <SearchInput value={search} onChange={setSearch} />
          </div>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <div className="rounded-lg border bg-card">
          <AssetTable
            assets={filteredAndSortedAssets}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>

        <div className="text-sm text-muted-foreground text-center">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}