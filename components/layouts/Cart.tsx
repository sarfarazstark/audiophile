'use client';
import { useCart } from '@/lib/store/cart';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { price } from '@/lib/utilities';

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

				// if click on checkout button then close the dropdown
			} else if (event.target instanceof HTMLAnchorElement) {
				return;
			}

			setIsOpen(false);
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const total: number = parseFloat(
		items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2),
	);

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
					<motion.div
						initial={{ y: -5 }}
						animate={{
							y: 0,
							transition: {
								type: 'spring',
								stiffness: 500,
								duration: 0.2,
								ease: 'easeInOut',
							},
						}}
						className='absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center pointer-events-none'>
						{totalItems}
					</motion.div>
				)}
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{
							y: '100%',
							opacity: 1,
						}}
						animate={{
							y: 0,
							opacity: 1,
						}}
						exit={{
							y: '100%',
							opacity: 0,
						}}
						transition={{
							type: 'spring',
							stiffness: 120,
							damping: 18,
						}}
						ref={dropdownRef}
						className='fixed top-18 bottom-0 left-0 md:left-auto md:absolute -md:right-4 md:right-0 md:bottom-full md:top-full lg:mt-8 z-10 w-max'>
						<div className='md:mt-5 h-full flex flex-col justify-start gap-5 items-center bg-white shadow-xl md:rounded-xl border border-gray-300 max-w-screen min-w-screen lg:min-w-sm lg:max-w-xs md:max-w-sm md:min-w-sm lg:min-h-110 lg:max-h-125 p-6 md:p-8 text-primary-200'>
							<div className='flex justify-between w-full'>
								<span className='leading-6 tracking-wider uppercase font-bold'>
									Cart ({totalItems})
								</span>
								<button
									className='leading-6 tracking-wider text-sm font-bold hover:text-red-700 cursor-pointer transition-colors'
									onClick={() =>
										confirm('You sure to remove all items?') && clearCart()
									}>
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
											<div className='overflow-hidden'>
												<p
													className='font-bold text-md truncate'
													title={item.name}>
													{item.name}
												</p>
												<span className='text-sm'>
													{price(item.price * item.quantity)}
												</span>
											</div>

											<div className='grid grid-cols-3 items-center justify-between bg-primary-400 min-w-24 min-h-8 ml-auto rounded overflow-hidden'>
												{item.quantity > 1 ? (
													<button
														className='text-primary-200 flex-1 flex items-center justify-center cursor-pointer h-full py-1 hover:text-primary hover:bg-primary-500 transition-colors duration-300'
														onClick={() => decrease(item.id)}>
														<Minus strokeWidth={3} className='size-3' />
													</button>
												) : (
													<button
														className='flex-1 flex items-center justify-center cursor-pointer h-full py-1 text-primary hover:bg-primary-500 transition-colors duration-300'
														onClick={() =>
															confirm(`Delete ${item.name}?`) &&
															removeItem(item.id)
														}>
														<Trash strokeWidth={3} className='size-3' />
													</button>
												)}
												<span className='text-primary-200 flex-1 flex h-full items-center justify-center text-sm py-1 font-bold'>
													{item.quantity}
												</span>
												<button
													className='text-primary-200 flex-1 flex h-full items-center justify-center cursor-pointer py-1 hover:text-primary hover:bg-primary-500 transition-colors duration-300'
													onClick={() => increase(item.id)}>
													<Plus strokeWidth={3} className='size-3' />
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

							{items.length > 0 && (
								<>
									<div className='flex justify-between items-center w-full mt-auto'>
										<span className='font-bold'>Total</span>
										<span className='font-bold'>{price(total)}</span>
									</div>
									<Link
										href='/checkout'
										onClick={() => setIsOpen(false)} // Add this line here
										className='w-full bg-primary text-white font-bold py-3 text-center uppercase hover:bg-primary-1-lt transition-colors'>
										Checkout
									</Link>
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
