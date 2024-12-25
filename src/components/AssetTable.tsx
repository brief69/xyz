import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Asset } from "@/types/asset";
import { ArrowDown, ArrowUp } from "lucide-react";

interface AssetTableProps {
  assets: Asset[];
  sortColumn: keyof Asset;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof Asset) => void;
}

export function AssetTable({
  assets,
  sortColumn,
  sortDirection,
  onSort,
}: AssetTableProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  };

  const SortIcon = ({ column }: { column: keyof Asset }) => {
    if (column !== sortColumn) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 inline" />
    );
  };

  const renderSortableHeader = (
    label: string,
    column: keyof Asset,
    className?: string
  ) => (
    <div
      className={`flex items-center cursor-pointer ${className}`}
      onClick={() => onSort(column)}
    >
      {label}
      <SortIcon column={column} />
    </div>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{renderSortableHeader("Name", "name")}</TableHead>
          <TableHead className="text-right">
            {renderSortableHeader("Price (JPY)", "current_price")}
          </TableHead>
          <TableHead className="text-right">
            {renderSortableHeader("24h Change", "price_change_percentage_24h")}
          </TableHead>
          <TableHead className="text-right">
            {renderSortableHeader("XLL Value", "xll_value")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.id} className="animate-fade-in">
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {asset.symbol.toUpperCase()}
                </span>
                <span>{asset.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              ¥{formatNumber(asset.current_price)}
            </TableCell>
            <TableCell
              className={`text-right ${
                asset.price_change_percentage_24h >= 0
                  ? "text-positive"
                  : "text-negative"
              }`}
            >
              {asset.price_change_percentage_24h >= 0 ? "+" : ""}
              {formatNumber(asset.price_change_percentage_24h)}%
            </TableCell>
            <TableCell className="text-right">
              {formatNumber(asset.xll_value)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}