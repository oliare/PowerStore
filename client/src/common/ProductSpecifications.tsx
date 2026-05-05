import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export const ProductSpecifications = ({
  spec,
}: {
  spec: { Name: string; Value: string }[];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const limit = 4;
  const hasMore = spec.length > limit;

  const visibleSpecs = isExpanded ? spec : spec.slice(0, limit);

  return (
    <div className="w-full max-w-2xl py-6">
      <div className="space-y-4">
        {visibleSpecs.map((spec, index) => (
          <div key={index} className="flex items-end gap-2 group">
            <span className="text-gray-600 text-sm whitespace-nowrap">
              {spec.Name}
            </span>

            <div className="flex-1 border-b border-dotted border-gray-300 mb-1 opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <span className="text-gray-900 text-sm font-medium text-right hover:text-brand-primary transition-colors cursor-pointer">
              {spec.Value}
            </span>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-all group"
          >
            {isExpanded ? (
              <>
                Згорнути характеристики
                <ChevronUp
                  size={16}
                  className="group-hover:-translate-y-1 transition-transform"
                />
              </>
            ) : (
              <>
                Всі характеристики
                <ChevronDown
                  size={16}
                  className="group-hover:translate-y-1 transition-transform"
                />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
