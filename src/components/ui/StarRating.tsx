import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export default function StarRating({ rating, max = 5, size = 14, interactive = false, onChange }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <button
            key={i}
            onClick={() => interactive && onChange?.(i + 1)}
            disabled={!interactive}
            className={`transition-transform ${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
            aria-label={`${i + 1} star`}
          >
            <Star
              size={size}
              className={filled || half ? 'text-yellow-400' : 'text-neutral-600'}
              fill={filled ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
