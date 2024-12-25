import { Asset } from "@/types/asset";

interface YllDisplayProps {
  assets: Asset[];
}

export function YllDisplay({ assets }: YllDisplayProps) {
  const calculateYll = (assets: Asset[]) => {
    if (!assets.length) return null;
    
    const sortedXllValues = [...assets]
      .map(asset => asset.xll_value)
      .sort((a, b) => a - b);
    
    const middle = Math.floor(sortedXllValues.length / 2);
    
    if (sortedXllValues.length % 2 === 0) {
      return (sortedXllValues[middle - 1] + sortedXllValues[middle]) / 2;
    }
    
    return sortedXllValues[middle];
  };

  const yll = calculateYll(assets);

  return (
    <div className="w-full bg-card border rounded-lg p-6 mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-2">
        Current Median Value (YLL)
      </h2>
      {yll !== null ? (
        <p className="text-3xl font-bold text-primary">
          {new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          }).format(yll)}
        </p>
      ) : (
        <p className="text-muted-foreground">
          Median Value (YLL) currently unavailable
        </p>
      )}
    </div>
  );
}