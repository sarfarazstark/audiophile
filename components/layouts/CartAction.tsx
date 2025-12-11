'use client';

import { CartItem, useCart } from '@/lib/store/cart';
import { useState } from 'react';

export function CartAction({ product }: { product: CartItem }) {
	const addItem = useCart((state) => state.addItem);

	const [count, setCount] = useState(product.quantity || 1);

	const update = (delta: number) =>
		setCount((prev) => Math.max(1, prev + delta));

	const handleAddToCart = () => {
		addItem(product, count);
		setCount(1);
	};

	console.log(product);

	return (
		<div className='flex gap-3'>
			<div className='flex items-center justify-between bg-primary-500 min-w-32'>
				<button
					className='text-primary-200 flex-1 flex items-center justify-center cursor-pointer'
					onClick={() => update(-1)}>
					-
				</button>
				<span className='text-primary-200 flex-1 flex items-center justify-center'>
					{count}
				</span>
				<button
					className='text-primary-200 flex-1 flex items-center justify-center cursor-pointer'
					onClick={() => update(1)}>
					+
				</button>
			</div>

			<button
				className='bg-primary text-white px-6 md:px-8 py-3 font-bold cursor-pointer hover:bg-primary-1-lt transition-colors duration-500'
				onClick={handleAddToCart}>
				Add to Cart
			</button>
		</div>
	);
}
