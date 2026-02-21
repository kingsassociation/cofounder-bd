import { Star, StarHalf } from "lucide-react";
interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}
export default function StarRating({
  rating,
  size = 16,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating: ${rating} out of 5`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""} fill-yellow-400 text-yellow-400`}
          onClick={() => handleClick(i)}
        />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""} text-neutral-300`}
          onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + i)}
        />
      ))}
    </div>
  );
}
