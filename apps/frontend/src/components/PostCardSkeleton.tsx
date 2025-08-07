// components/PostCardSkeleton.tsx
export default function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full animate-pulse">
      <div className="relative aspect-video w-full bg-gray-300"></div>
      <div className="p-4 sm:p-6 flex-grow flex flex-col space-y-3">
        <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
        <div className="space-y-2 mt-3 flex-grow">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/4 ml-auto"></div>
      </div>
    </div>
  );
}
