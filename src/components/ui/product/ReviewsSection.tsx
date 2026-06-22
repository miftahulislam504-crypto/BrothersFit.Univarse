"use client";

import { Star } from "lucide-react";
import { Review } from "@/lib/productDetail";

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          strokeWidth={0}
          fill={i < rating ? "#ff3d1a" : "#2a2a35"}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({ reviews, averageRating }: ReviewsSectionProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-white/8 pt-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke">
          Reviews ({reviews.length})
        </p>
        <div className="flex items-center gap-1.5">
          <StarRow rating={Math.round(averageRating)} />
          <span className="font-mono text-[10px] text-smoke">{averageRating}</span>
        </div>
      </div>

      <div className="flex max-h-44 flex-col gap-3 overflow-y-auto pr-1">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-semibold text-bone">
                {review.author}
              </span>
              <span className="font-mono text-[9px] text-smoke/50">
                {review.daysAgo}d ago
              </span>
            </div>
            <StarRow rating={review.rating} />
            <p className="font-body text-[11px] leading-relaxed text-smoke/70">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
