import { PackageCheck, PackageX, AlertTriangle } from "lucide-react";

interface StockStatusProps {
  quantity: number;
  showIcon?: boolean;
  className?: string;
}

export const StockStatus = ({
  quantity,
  showIcon = true,
  className = "",
}: StockStatusProps) => {
  if (quantity <= 0) {
    return (
      <div
        className={`flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-full w-fit ${className}`}
      >
        {showIcon && <PackageX size={12} />}
        <span className="text-[10px] font-medium">Закінчилося</span>
      </div>
    );
  }

  if (quantity <= 10) {
    return (
      <div
        className={`flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit ${className}`}
      >
        {showIcon && <AlertTriangle size={12} />}
        <span className="text-[10px] font-medium">
          Закінчується (лишилося {quantity})
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded-full w-fit ${className}`}
    >
      {showIcon && <PackageCheck size={12} />}
      <span className="text-[10px] font-medium">В наявності</span>
    </div>
  );
};
