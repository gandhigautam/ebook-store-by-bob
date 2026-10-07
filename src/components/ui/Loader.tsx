interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: LoaderProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <span
      className={`inline-block rounded-full border-2 border-neutral-600 border-t-blue-500 animate-spin ${sizes[size]} ${className}`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden animate-pulse">
      <div className="h-44 bg-neutral-700" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-neutral-700 rounded w-3/4" />
        <div className="h-3 bg-neutral-700 rounded w-1/2" />
        <div className="h-3 bg-neutral-700 rounded w-1/3" />
      </div>
    </div>
  );
}
