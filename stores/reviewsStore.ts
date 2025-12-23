import { create } from 'zustand';
import { Review } from '../types';

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  addReview: (review: Review) => void;
  getReviewsByListing: (listingId: string) => Review[];
  getReviewsBySeller: (sellerId: string) => Review[];
  getAverageRating: (listingId: string) => number;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: [],
  isLoading: false,

  addReview: (review: Review) => {
    set((state) => ({
      reviews: [...state.reviews, review],
    }));
  },

  getReviewsByListing: (listingId: string) => {
    return get().reviews.filter((review) => review.listingId === listingId);
  },

  getReviewsBySeller: (sellerId: string) => {
    return get().reviews.filter((review) => review.sellerId === sellerId);
  },

  getAverageRating: (listingId: string) => {
    const listingReviews = get().reviews.filter((review) => review.listingId === listingId);
    if (listingReviews.length === 0) return 0;
    const sum = listingReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / listingReviews.length;
  },
}));

