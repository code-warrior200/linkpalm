import { create } from 'zustand';
import { Order } from '../types';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  fetchOrders: () => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  isLoading: false,

  setOrders: (orders: Order[]) => set({ orders }),

  addOrder: (order: Order) => {
    set((state) => ({
      orders: [...state.orders, order],
    }));
  },

  updateOrder: (id: string, order: Partial<Order>) => {
    set((state) => ({
      orders: state.orders.map((item) =>
        item.id === id ? { ...item, ...order } : item
      ),
    }));
  },

  fetchOrders: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app, fetch from API
    set({ isLoading: false });
  },
}));

