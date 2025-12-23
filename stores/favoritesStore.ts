import { create } from 'zustand';
import { Listing } from '../types';

interface FavoritesState {
  favorites: Listing[];
  isLoading: boolean;
  addFavorite: (listing: Listing) => void;
  removeFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,

  addFavorite: (listing: Listing) => {
    set((state) => {
      const exists = state.favorites.some((fav) => fav.id === listing.id);
      if (exists) return state;
      return { favorites: [...state.favorites, { ...listing, isFavorite: true }] };
    });
  },

  removeFavorite: (listingId: string) => {
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav.id !== listingId),
    }));
  },

  isFavorite: (listingId: string) => {
    return get().favorites.some((fav) => fav.id === listingId);
  },

  clearFavorites: () => set({ favorites: [] }),
}));

