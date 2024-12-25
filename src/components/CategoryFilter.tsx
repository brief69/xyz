import { AssetCategory } from "@/types/asset";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryFilterProps {
  selectedCategory: AssetCategory | "all";
  onCategoryChange: (category: AssetCategory | "all") => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <Tabs value={selectedCategory} onValueChange={(value) => onCategoryChange(value as AssetCategory | "all")}>
      <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="cryptocurrency">Crypto</TabsTrigger>
        <TabsTrigger value="fiat">Fiat</TabsTrigger>
        <TabsTrigger value="commodity">Commodities</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}