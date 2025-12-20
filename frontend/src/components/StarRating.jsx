import React from 'react'
import { Star } from 'lucide-react'

export function StarRating({ rating, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-neutral-300 hover:text-amber-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
