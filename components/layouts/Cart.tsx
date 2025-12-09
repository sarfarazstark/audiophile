'use client';
import { useCart } from '@/lib/store/cart';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function Cart() {
	const items = useCart((state) => state.items);
	const clearCart = useCart((state) => state.clearCart);
	const increase = useCart((state) => state.increase);
	const decrease = useCart((state) => state.decrease);
	const removeItem = useCart((state) => state.removeItem);

	const totalItems = items.length;

	const [isOpen, setIsOpen] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current?.contains(event.target as Node) ||
				toggleRef.current?.contains(event.target as Node)
			) {
				return;
			}

			setIsOpen(false);
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className='flex-1 lg:flex-1 flex justify-end items-center relative'>
			<div
				className='relative cursor-pointer'
				onClick={() => setIsOpen(!isOpen)}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					ref={toggleRef}
					src='/assets/shared/icon-cart.svg'
					width={25}
					height={25}
					alt='Cart icon'
				/>
				{totalItems > 0 && (
					<div className='absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center pointer-events-none'>
						{totalItems}
					</div>
				)}
			</div>

			{isOpen && (
				<div
					ref={dropdownRef}
					className='absolute -right-4 md:right-0 top-full mt-8 z-10 w-max'>
					<div className='flex flex-col justify-start gap-5 items-center bg-primary-400 shadow-xl rounded-2xl border border-gray-300 min-w-xs md:min-w-sm min-h-120 max-h-120 p-6 md:p-8 text-primary-200'>
						<div className='flex justify-between w-full'>
							<span className='leading-6 tracking-wider uppercase font-bold'>
								Cart ({totalItems})
							</span>
							<button
								className='leading-6 tracking-wider text-sm font-bold hover:text-white transition-colors'
								onClick={clearCart}>
								Remove All
							</button>
						</div>

						<div className='flex flex-col justify-between items-start gap-4 w-full overflow-y-auto'>
							{items.length > 0 ? (
								items.map((item) => (
									<div
										key={item.id}
										className='flex justify-start items-center w-full gap-4'>
										<Image
											src={item.imageUrl}
											width={70}
											height={70}
											alt={item.name}
											className='rounded-lg'
										/>
										<div>
											<p className='font-bold text-md'>{item.name}</p>
											<span className='text-sm'>
												${' '}
												{Intl.NumberFormat('en-US').format(
													item.price * item.quantity,
												)}
											</span>
										</div>

										<div className='flex items-center justify-between bg-primary-500 min-w-24 ml-auto'>
											{item.quantity > 1 ? (
												<button
													className='text-primary-200 flex-1 flex items-center justify-center cursor-pointer py-2'
													onClick={() => decrease(item.id)}>
													-
												</button>
											) : (
												<button
													className='text-primary-200 flex-1 flex items-center justify-center cursor-pointer py-2'
													onClick={() => removeItem(item.id)}>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														width='14'
														height='14'
														viewBox='0 0 24 24'
														fill='none'
														stroke='currentColor'
														strokeWidth='2'
														strokeLinecap='round'
														strokeLinejoin='round'
														className='text-red-400'>
														<path d='M10 11v6' />
														<path d='M14 11v6' />
														<path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' />
														<path d='M3 6h18' />
														<path d='M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
													</svg>
												</button>
											)}
											<span className='text-primary-200 flex-1 flex items-center justify-center text-sm py-2'>
												{item.quantity}
											</span>
											<button
												className='text-primary-200 flex-1 flex items-center justify-center cursor-pointer py-2'
												onClick={() => increase(item.id)}>
												+
											</button>
										</div>
									</div>
								))
							) : (
								<div className='text-center w-full h-50 my-auto flex flex-col items-center justify-center'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='100'
										height='100'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='text-primary-1-lt'>
										<path d='m15 11-1 9' />
										<path d='m19 11-4-7' />
										<path d='M2 11h20' />
										<path d='m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4' />
										<path d='M4.5 15.5h15' />
										<path d='m5 11 4-7' />
										<path d='m9 11 1 9' />
									</svg>
									No items in cart
								</div>
							)}
						</div>

						<div className='flex justify-between items-center w-full mt-auto'>
							<span className='font-bold'>Total</span>
							<span className='font-bold'>
								${' '}
								{items
									.reduce((acc, item) => acc + item.price * item.quantity, 0)
									.toFixed(2)}
							</span>
						</div>

						{items.length > 0 && (
							<button className='w-full bg-primary text-white font-bold py-3 uppercase hover:bg-primary-1-lt transition-colors'>
								Checkout
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
