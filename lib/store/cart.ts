import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
	id: number | string;
	name: string;
	price: number;
	imageUrl: string;
	quantity: number;
};

type CartState = {
	items: CartItem[];

	addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
	removeItem: (id: CartItem['id']) => void;

	increase: (id: CartItem['id']) => void;
	decrease: (id: CartItem['id']) => void;

	clearCart: () => void;

	totalItems: () => number;
	totalPrice: () => number;
};

export const useCart = create<CartState>()(
	persist(
		(set, get) => ({
			items: [],

			addItem: (item, qty = 1) => {
				const items = get().items;
				const exists = items.find((i) => i.id === item.id);

				if (exists) {
					set({
						items: items.map((i) =>
							i.id === item.id ? { ...i, quantity: i.quantity + qty } : i,
						),
					});
				} else {
					set({
						items: [...items, { ...item, quantity: qty }],
					});
				}
			},

			removeItem: (id) =>
				set({
					items: get().items.filter((i) => i.id !== id),
				}),

			increase: (id) =>
				set({
					items: get().items.map((i) =>
						i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
					),
				}),

			decrease: (id) =>
				set({
					items: get()
						.items.map((i) =>
							i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i,
						)
						.filter((i) => i.quantity > 0),
				}),

			clearCart: () => set({ items: [] }),

			totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

			totalPrice: () =>
				get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
		}),
		{
			name: 'cart-storage',
		},
	),
);
