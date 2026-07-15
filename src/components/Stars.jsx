import { Star } from "lucide-react";

export default function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < Math.round(rating) ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">{rating.toFixed(1)}/5</span>
    </div>
  );
}
