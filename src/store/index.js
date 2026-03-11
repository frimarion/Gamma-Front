import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useCartStore = create(
  immer((set, get) => ({
    items: [],

    addItem(item) {
      set(state => {
        const existing = state.items.find(i => i.menu_item_id === item.menu_item_id);
        if (existing) {
          existing.qty += 1;
        } else {
          state.items.push({ ...item, qty: 1 });
        }
      });
    },

    removeItem(menu_item_id) {
      set(state => {
        const idx = state.items.findIndex(i => i.menu_item_id === menu_item_id);
        if (idx === -1) return;
        if (state.items[idx].qty > 1) {
          state.items[idx].qty -= 1;
        } else {
          state.items.splice(idx, 1);
        }
      });
    },

    deleteItem(menu_item_id) {
      set(state => {
        state.items = state.items.filter(i => i.menu_item_id !== menu_item_id);
      });
    },

    clearCart() {
      set(state => { state.items = []; });
    },

    get totalItems() {
      return get().items.reduce((s, i) => s + i.qty, 0);
    },

    get totalAmount() {
      return get().items.reduce((s, i) => s + i.price * i.qty, 0);
    },

    getQty(menu_item_id) {
      return get().items.find(i => i.menu_item_id === menu_item_id)?.qty || 0;
    },
  }))
);

export const useUserStore = create(
  immer((set) => ({
    user: null,
    loading: true,
    error: null,

    setUser(user) {
      set(state => {
        state.user = user;
        state.loading = false;
        state.error = null;
      });
    },

    setLoading(loading) {
      set(state => { state.loading = loading; });
    },

    setError(error) {
      set(state => {
        state.error = error;
        state.loading = false;
      });
    },

    clearUser() {
      set(state => { state.user = null; });
    },
  }))
);
