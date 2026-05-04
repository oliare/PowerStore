import { PackageCheck, PackageX, AlertTriangle } from "lucide-react";

interface StockStatusProps {
  quantity: number;
  showIcon?: boolean;
}

export const StockStatus = ({
  quantity,
  showIcon = true,
}: StockStatusProps) => {
  if (quantity <= 0) {
    return (
      <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full w-fit">
        {showIcon && <PackageX size={12} />}
        <span className="text-xs font-semibold">Немає в наявності</span>
      </div>
    );
  }

  if (quantity <= 10) {
    return (
      <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-3 py-1 rounded-full w-fit">
        {showIcon && <AlertTriangle size={12} />}
        <span className="text-xs font-semibold">
          Закінчується (лишилося {quantity})
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1 rounded-full w-fit">
      {showIcon && <PackageCheck size={12} />}
      <span className="text-xs font-semibold">В наявності</span>
    </div>
  );
};
