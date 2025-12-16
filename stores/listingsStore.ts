import { create } from 'zustand';
import { Listing } from '../types';

interface ListingsState {
  listings: Listing[];
  isLoading: boolean;
  setListings: (listings: Listing[]) => void;
  addListing: (listing: Listing) => void;
  updateListing: (id: string, listing: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  fetchListings: () => Promise<void>;
}

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: [],
  isLoading: false,

  setListings: (listings: Listing[]) => set({ listings }),

  addListing: (listing: Listing) => {
    set((state) => ({
      listings: [...state.listings, listing],
    }));
  },

  updateListing: (id: string, listing: Partial<Listing>) => {
    set((state) => ({
      listings: state.listings.map((item) =>
        item.id === id ? { ...item, ...listing } : item
      ),
    }));
  },

  deleteListing: (id: string) => {
    set((state) => ({
      listings: state.listings.filter((item) => item.id !== id),
    }));
  },

  fetchListings: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, fetch from API
    set({ isLoading: false });
  },
}));

