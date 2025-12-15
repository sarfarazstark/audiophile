'use client';

import { motion } from 'motion/react';
import { Check, Package, Truck, MapPin } from 'lucide-react';
import type { OrderStatus } from '@/app/generated/prisma/enums';
import { Prisma } from '@/app/generated/prisma/client';
import { Image } from '../ui/Image';
import { Metadata } from 'next';
import { Clipboard } from '../ui/Clipboard';
import BackButton from '../ui/BackButton';
/* -------------------------------- TYPES -------------------------------- */

type OrderWithItems = Prisma.OrderGetPayload<{
	include: {
		items: {
			include: {
				product: {
					include: {
						images: true;
					};
				};
			};
		};
	};
}>;

/* -------------------------------- CONFIG -------------------------------- */

const STEPS = [
	{ id: 'PAID', label: 'Confirmed', icon: Check },
	{ id: 'PROCESSING', label: 'Processing', icon: Package },
	{ id: 'SHIPPED', label: 'On the way', icon: Truck },
	{ id: 'DELIVERED', label: 'Delivered', icon: MapPin },
];

const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
	PENDING_PAYMENT: 'text-neutral-400',
	PAID: 'text-primary-100',
	PROCESSING: 'text-primary-200',
	SHIPPED: 'text-primary-200',
	DELIVERED: 'text-primary-100',
	CANCELLED: 'text-red-600',
};

/* -------------------------------- HELPERS -------------------------------- */

const stepIndex = (status: OrderStatus) =>
	status === 'PENDING_PAYMENT' || status === 'CANCELLED'
		? -1
		: STEPS.findIndex((s) => s.id === status);

const progress = (i: number) => (i < 0 ? 0 : (i / (STEPS.length - 1)) * 100);

const money = (a: number, c: string) =>
	new Intl.NumberFormat(c === 'INR' ? 'en-IN' : 'en-US', {
		style: 'currency',
		currency: c,
		maximumFractionDigits: 0,
	}).format(a);

const date = (d: Date) =>
	new Intl.DateTimeFormat('en-IN', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(new Date(d));

/* -------------------------------- COMPONENT -------------------------------- */

export const metadata: Metadata = {
	title: 'Order Tracking - Audiophile',
};

export default function TrackOrderClient({ order }: { order: OrderWithItems }) {
	const index = stepIndex(order.status);

	const address = [
		order.addressLine1,
		order.addressLine2,
		order.city,
		order.state,
		order.postalCode,
		order.country,
	]
		.filter(Boolean)
		.join(', ');

	return (
		<div className='min-h-screen bg-white text-grey-2 px-4 py-6 sm:px-6 md:px-12'>
			<div className='max-w-[1100px] mx-auto mb-6'>
				<BackButton />
			</div>
			<div className='max-w-[1100px] mx-auto'>
				{/* Header */}
				<h1 className='text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-2'>
					Order Tracking
				</h1>

				<div className='flex flex-col md:flex-row gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 mb-10'>
					<span>
						Order{' '}
						<Clipboard text={order.id} className='cursor-pointer uppercase'>
							#{order.id}
						</Clipboard>
					</span>
					<span>Placed on {date(order.createdAt)}</span>
				</div>

				{/* Stepper */}
				<div className='relative mb-12 px-2 sm:px-5'>
					<div className='absolute left-0 top-5 w-full h-px bg-grey-3 z-0' />

					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${progress(index)}%` }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						className='absolute left-0 top-5 h-0.5 bg-primary-100 z-0'
					/>

					<div className='relative z-10 flex justify-between'>
						{STEPS.map((s, i) => {
							const active = i <= index;

							return (
								<div key={s.id} className='flex flex-col items-center gap-2'>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: i * 0.1 }}
										className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 bg-primary-300
										${
											active
												? 'border-primary-100 text-primary-100'
												: 'border-neutral-300 text-neutral-300'
										}`}>
										<s.icon size={16} className='sm:size-[18px]' />
									</motion.div>

									<p
										className={`hidden sm:block text-[10px] sm:text-xs uppercase tracking-wider
										${active ? 'text-primary-100' : 'text-neutral-400'}`}>
										{s.label}
									</p>
								</div>
							);
						})}
					</div>
				</div>

				{/* Order Info */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-y border-grey-3/50 py-8 mb-12'>
					<div>
						<p className='text-xs text-neutral-400'>Shipped To</p>
						<p className='uppercase'>{order.fullName}</p>
						<p className='text-sm text-neutral-500'>{address}</p>
					</div>

					<div>
						<p className='text-xs text-neutral-400'>Tracking ID</p>
						<p className='uppercase wrap-break-word'>{order.trackingId}</p>
					</div>

					<div>
						<p className='text-xs text-neutral-400'>Status</p>
						<p
							className={`uppercase tracking-widest ${
								ORDER_STATUS_COLOR[order.status]
							}`}>
							{order.status}
						</p>
					</div>

					<div className='lg:text-right'>
						<p className='text-xs text-neutral-400'>Total</p>
						<p className='text-xl sm:text-2xl uppercase'>
							{money(order.totalAmount, order.currency)}
						</p>
					</div>
				</div>

				{/* Items */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
					{order.items.map((item) => (
						<div
							key={item.id}
							className='group bg-primary-400 border border-grey-3/50 rounded-lg p-4 transition hover:shadow-lg grid grid-cols-[48px_1fr] sm:grid-cols-[56px_1fr] items-center gap-3'>
							<div className='relative w-12 h-12 sm:w-14 sm:h-14'>
								{item.product.images?.desktop ? (
									<Image
										desktop={item.product.images.desktop}
										tablet={item.product.images.tablet}
										mobile={item.product.images.mobile}
										alt={item.product.name}
										width={56}
										height={56}
										className='rounded-md object-cover'
									/>
								) : (
									<div className='w-full h-full bg-grey-3 flex items-center justify-center text-xs'>
										—
									</div>
								)}
							</div>

							<div className='flex justify-between gap-3 overflow-hidden'>
								<div className='min-w-0'>
									<p className='uppercase text-xs truncate'>
										{item.product.name}
									</p>
									<p className='text-xs font-medium'>
										{money(item.unitPrice, order.currency)}
									</p>
								</div>

								<p className='text-xs text-neutral-400 mt-1'>
									×{item.quantity}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
