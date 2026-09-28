import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRate,
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1.5 select-none">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = activeRating >= starValue;
          const isHalf = !isFilled && activeRating >= starValue - 0.5;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              onClick={() => interactive && onRate && onRate(starValue)}
              className={`relative transition-transform ${
                interactive ? 'cursor-pointer hover:scale-115 active:scale-95' : 'cursor-default'
              }`}
            >
              {isHalf ? (
                <div className="relative">
                  <Star className={`${starSizes[size]} text-stone-600`} />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className={`${starSizes[size]} text-amber-400 fill-amber-400`} />
                  </div>
                </div>
              ) : (
                <Star
                  className={`${starSizes[size]} transition-colors ${
                    isFilled ? 'text-amber-400 fill-amber-400' : 'text-stone-600 fill-stone-800/40'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-mono tabular-nums font-semibold text-amber-400/90 ml-0.5">
          {rating > 0 ? rating.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
};
