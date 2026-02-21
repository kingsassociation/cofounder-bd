"use client";
import StarRating from "@/components/ui/StarRating";
import { Loader2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string | null;
    imageUrl: string | null;
  };
}
interface ReviewsTabProps {
  productId: string;
}
export default function ReviewsTab({ productId }: ReviewsTabProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    fetchReviews();
  }, [productId]);
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      const data = await res.json();
      if (Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to write a review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }
      toast.success("Review submitted successfully!");
      setShowForm(false);
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
          <p className="text-sm text-gray-500 mt-1">
            {reviews.length > 0
              ? `Based on ${reviews.length} review${reviews.length > 1 ? "s" : ""}`
              : "No reviews yet"}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              if (!session) {
                toast.error("Please login to write a review");
                return;
              }
              setShowForm(true);
            }}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Write a Review
          </button>
        )}
      </div>
      {}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-slide-down">
          <h4 className="font-bold text-gray-900 mb-4">Write your review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <StarRating
                rating={rating}
                size={28}
                interactive
                onRatingChange={setRating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="Share your thoughts about this product..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      {}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.user.imageUrl ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={review.user.imageUrl}
                        alt={review.user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <User size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-semibold text-gray-900">
                      {review.user.name || "Anonymous User"}
                    </h5>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    <StarRating rating={review.rating} size={14} />
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
}
