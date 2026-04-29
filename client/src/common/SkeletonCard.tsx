export const SkeletonCard = () => (
  <div className="bg-white p-4 border border-gray-100 rounded-lg animate-pulse">
    <div className="h-48 bg-gray-200 rounded-xl mb-8"></div>
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-2 w-full">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-5"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="w-10 h-8 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);
