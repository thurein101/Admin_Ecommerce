"use client"
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number; 
}

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      
      // ပစ္စည်းအသစ်ထည့်ခြင်း
      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          // စတော့ထက် ကျော်မကျော် စစ်ဆေးခြင်း
          if (existingItem.quantity >= data.stock) {
            alert("Sorry, out of stock!");
            return;
          }
          // ရှိပြီးသားဆိုရင် အရေအတွက် (၁) တိုးမယ်
          set({
            items: currentItems.map((item) =>
              item.id === data.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          // မရှိသေးရင် ခြင်းတောင်းထဲ အသစ်ထည့်မယ်
          set({ items: [...get().items, { ...data, quantity: 1 }] });
        }
      },

      // ပစ္စည်းပြန်ဖျက်ခြင်း
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      // အရေအတွက် အတိုးအလျှော့လုပ်ခြင်း (Cart Page တွင်သုံးရန်)
      updateQuantity: (id: string, quantity: number) => {
        const item = get().items.find((i) => i.id === id);
        if (item && quantity > item.stock) {
          alert("Cannot exceed available stock!");
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      // ခြင်းတောင်းတစ်ခုလုံး ရှင်းလင်းခြင်း (Order တင်ပြီးချိန်တွင် သုံးရန်)
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // Local storage key name
      storage: createJSONStorage(() => localStorage),
    }
  )
);