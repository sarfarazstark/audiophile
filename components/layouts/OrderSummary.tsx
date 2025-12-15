import { CartItem } from '@/lib/store/cart';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import NavLink from './NavLink';
import { Clipboard } from '../ui/Clipboard';
import { price } from '@/lib/utilities';

const ItemRow = ({ item }: { item: CartItem; }) => (
	<div className='flex justify-start items-center w-full gap-2 text-primary-200 mb-4 last:mb-0'>
		<div className='relative w-[50px] h-[50px] shrink-0'>
			<Image
				src={item.imageUrl}
				fill
				alt={item.name}
				className='rounded-lg object-cover'
			/>
		</div>
		<div className='overflow-hidden flex-1'>
			<p className='font-bold text-sm truncate' title={item.name}>
				{item.name}
			</p>
			<span className='text-xs text-grey-1'>
				{price(item.price)}
			</span>
		</div>
		<span className='text-grey-1 text-sm font-bold'>x{item.quantity}</span>
	</div>
);

export function OrderSummary({
	showPopup,
	setShowPopup,
	items,
	grandTotal,
	trackingId,
}: {
	showPopup: boolean;
	setShowPopup: (showPopup: boolean) => void;
	items: CartItem[];
	grandTotal: number;
	trackingId: string;
}) {
	const [showAllItems, setShowAllItems] = useState(false);

	if (!items || items.length === 0) return null;

	const firstItem = items[0];
	const remainingItems = items.slice(1);
	const hasMoreItems = remainingItems.length > 0;

	return (
		<AnimatePresence>
			{showPopup && (
				<div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.3 }}
						className='bg-white text-black md:rounded-lg w-full max-w-lg shadow-xl flex flex-col max-h-screen md:max-h-[90vh] overflow-hidden'
					>
						<div className="p-6 sm:p-8 flex flex-col gap-6 flex-1 overflow-y-auto md:overflow-hidden">

							<motion.img
								src={'assets/shared/success.svg'}
								width={64}
								height={64}
								alt='success'
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{
									type: 'spring',
									stiffness: 260,
									damping: 20,
									delay: 0.1,
								}}
							/>

							<div>
								<h2 className='text-2xl sm:text-3xl font-bold uppercase tracking-wider'>
									Thank you <br /> for your order
								</h2>
								{trackingId && (
									<div className='text-sm text-grey-1 flex items-center gap-1'>
										<span className='font-bold uppercase'>Tracking id:</span>
										<Clipboard text={trackingId} className='cursor-pointer '>
											#{trackingId}
										</Clipboard>
									</div>
								)}
								<p className='text-grey-1 text-sm tracking-wide mt-2'>
									You will receive an email confirmation shortly.
								</p>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 w-full rounded-lg overflow-hidden shrink-0'>
								<div className='bg-gray-100 p-4'>
									<div className='flex flex-col gap-2 md:max-h-45 overflow-y-auto scrollbar-thin'>
										<ItemRow item={firstItem} />

										{showAllItems && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: 'auto' }}
												exit={{ opacity: 0, height: 0 }}
											>
												{remainingItems.map((item) => (
													<ItemRow key={item.id} item={item} />
												))}
											</motion.div>
										)}
									</div>

									{hasMoreItems && (
										<button
											onClick={() => setShowAllItems(!showAllItems)}
											className='text-xs text-black/50 hover:text-black cursor-pointer text-center w-full border-t border-black/10 pt-3 transition-colors'
										>
											{showAllItems
												? 'View Less'
												: `and ${remainingItems.length} other item(s)`}
										</button>
									)}
								</div>

								<div className='bg-black text-white p-6 flex flex-col justify-end gap-1 md:min-w-[150px]'>
									<p className='text-sm uppercase opacity-50 mb-1'>
										Grand Total
									</p>
									<p className='text-lg font-bold'>
										{new Intl.NumberFormat('hi-IN', {
											style: 'currency',
											currency: 'INR',
										}).format(grandTotal)}
									</p>
								</div>
							</div>

							<NavLink
								href={`./track/${trackingId}`}
								onClick={() => setShowPopup(false)}
								className='w-full bg-primary hover:bg-primary-1-lt text-white font-bold uppercase text-sm py-4 tracking-wider transition-colors mt-auto text-center hover:text-primary-400'
							>
								Track Order
							</NavLink>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
