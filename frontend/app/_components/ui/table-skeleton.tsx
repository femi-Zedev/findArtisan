// Custom Skeleton component with pulse animation using Tailwind CSS
interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  radius?: string;
  className?: string;
}

function Skeleton({ height = 24, width = '100%', radius = '0.375rem', className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
      style={{ height, width, borderRadius: radius }}
    />
  );
}

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  rowHeight?: number;
  hasHeader?: boolean;
}

export function TableSkeleton({
  rowCount = 5,
  columnCount = 4,
  rowHeight = 50,
  hasHeader = true,
}: TableSkeletonProps) {
  return (
    <div className='w-full'>
      {/* Header */}
      {hasHeader && (
        <div className='flex gap-4 p-4 bg-gray-50 w-full'>
          {Array.from({ length: columnCount }).map((_, index) => (
            <Skeleton
              key={`header-${index}`}
              height={18}
              width={`${100 / columnCount}%`}
              radius='0.25rem'
            />
          ))}
        </div>
      )}
      <hr className='mx-4 min-w-max border-gray-200' />
      {/* Rows */}
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className='flex gap-4 p-4 w-full'
          style={{ height: `${rowHeight}px` }}
        >
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              height={24}
              width={`${100 / columnCount}%`}
              radius='0.25rem'
            />
          ))}
        </div>
      ))}
    </div>
  );
}
