import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  variant = 'text', 
  width, 
  height, 
  className = '',
  count = 1 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    card: 'rounded-lg h-64',
  };

  const skeletonElement = (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="mb-3">
            {skeletonElement}
          </div>
        ))}
      </>
    );
  }

  return skeletonElement;
};

// Pre-built skeleton components
export const CarCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
    <Skeleton variant="rectangular" height="192px" />
    <div className="p-4 space-y-3">
      <Skeleton width="80%" height="24px" />
      <Skeleton width="60%" height="16px" />
      <Skeleton width="100%" height="48px" />
      <div className="pt-3 space-y-2">
        <Skeleton height="40px" />
        <Skeleton height="40px" />
      </div>
    </div>
  </div>
);

export const ListItemSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 animate-pulse">
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" width="48px" height="48px" />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" height="20px" />
        <Skeleton width="60%" height="16px" />
      </div>
    </div>
  </div>
);

export default Skeleton;
