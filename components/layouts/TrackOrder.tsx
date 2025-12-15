'use client';

import { motion } from 'motion/react';
import { Check, Package, Truck, MapPin } from 'lucide-react';
import type { OrderStatus } from '@/app/generated/prisma/enums';
import { Image } from '../ui/Image';
import { Prisma } from '@/app/generated/prisma/client';

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

const STEPS = [
	{ id: 'PAID', label: 'Confirmed', icon: Check },
	{ id: 'PROCESSING', label: 'Processing', icon: Package },
	{ id: 'SHIPPED', label: 'On the way', icon: Truck },
	{ id: 'DELIVERED', label: 'Delivered', icon: MapPin },
];

const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
	PENDING_PAYMENT: 'text-neutral-200',
	PAID: 'text-primary-100',
	PROCESSING: 'text-primary-200',
	SHIPPED: 'text-primary-300',
	DELIVERED: 'text-primary-400',
	CANCELLED: 'text-neutral-200',
};

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
		<div className='text-grey-2 bg-primary-300 p-6 md:p-0 md:px-12 md:py-12 xl:px-0'>
			<div className='max-w-[1100px] mx-auto'>
				<h1 className='text-3xl uppercase font-bold tracking-wider mb-2'>
					Order Tracking
				</h1>
				<div className='flex gap-2 text-xs uppercase tracking-widest text-neutral-500 mb-12'>
					<span>Order #{order.id}</span> •{' '}
					<span>Placed On {date(order.createdAt)}</span>
				</div>

				<div className='relative mb-16 px-5'>
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
								<div key={s.id} className='flex flex-col items-center'>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: i * 0.1, duration: 0.3 }}
										className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-primary-300 transition-colors
													${
														active
															? 'border-primary-100 text-primary-100'
															: 'border-neutral-300 text-neutral-300'
													}`}>
										<s.icon size={18} strokeWidth={2} />
									</motion.div>
									<p
										className={`mt-3 text-xs font-medium uppercase transition-colors ${
											active ? 'text-primary-100' : 'text-neutral-400'
										}`}>
										{s.label}
									</p>
								</div>
							);
						})}
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-4 gap-8 border-y border-grey-3/50 py-8 mb-12'>
					<div>
						<p className='text-xs text-neutral-400'>Shipped To</p>
						<p className='uppercase'>{order.fullName}</p>
						<p className='text-sm text-neutral-500'>{address}</p>
					</div>

					<div>
						<p className='text-xs text-neutral-400'>Tracking ID</p>
						<p className='uppercase'>{order.trackingId}</p>
					</div>

					<div>
						<p className='text-xs text-neutral-400'>Status</p>
						<p className={`uppercase ${ORDER_STATUS_COLOR[order.status]}`}>
							{order.status}
						</p>
					</div>

					<div className='md:text-right'>
						<p className='text-xs text-neutral-400'>Total</p>
						<p className='uppercase text-2xl'>
							{money(order.totalAmount, order.currency)}
						</p>
					</div>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
					{order.items.map((item) => (
						<div
							key={item.id}
							className='group bg-primary-400 border border-grey-3/50 rounded-lg p-4 transition-all duration-500 hover:shadow-lg hover:border-grey-3/90 grid grid-cols-[50px_1fr] items-center gap-2'>
							{item.product.images?.desktop ? (
								<Image
									desktop={item.product.images?.desktop}
									tablet={item.product.images?.tablet}
									mobile={item.product.images?.mobile}
									alt={item.product.name}
									width={50}
									height={50}
									className='object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg'
								/>
							) : (
								<div className='absolute inset-0 flex items-center justify-center text-neutral-300 text-sm'>
									No image
								</div>
							)}

							<div className='flex justify-between items-start gap-4 overflow-hidden'>
								<div className='min-w-0'>
									<p className='uppercase text-xs leading-tight truncate'>
										{item.product.name}
									</p>
									<p className='text-xs font-medium whitespace-nowrap'>
										{money(item.unitPrice, order.currency)}
									</p>
								</div>
								<p className='text-sm text-neutral-400 mt-1'>
									x{item.quantity}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
