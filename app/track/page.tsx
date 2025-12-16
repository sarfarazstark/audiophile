'use client';

import { PackageSearchIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Track() {
	const router = useRouter();
	const [trackingId, setTrackingId] = useState('');

	const handleClick = () => {
		router.push(`/track/${trackingId}`);
	};

	return (
		<section className='bg-primary-500'>
			<div className='max-w-[720px] mx-auto min-h-[60vh] px-4 py-6 flex flex-col items-center justify-center gap-10'>
				<Image
					src='/assets/shipment_truck.png'
					alt='Track your order'
					width={220}
					height={220}
					priority
				/>

				<div className='text-center space-y-2'>
					<h1 className='text-3xl font-semibold text-grey-2'>
						Track Your Order
					</h1>
				</div>

				<div className='w-full bg-white rounded-lg border border-grey-3 p-6 space-y-4'>
					<div className='space-y-3'>
						<label
							htmlFor='trackingId'
							className='text-sm font-medium text-grey-2'>
							Tracking ID
						</label>
						<input
							value={trackingId}
							onChange={(e) => setTrackingId(e.target.value)}
							id='trackingId'
							type='text'
							placeholder='e.g. FK-ORD-9X82K'
							className='w-full p-4 rounded-xl border-2 border-grey-3 text-grey-2 focus-visible:outline-none focus-visible:border-primary-100'
						/>
						<p className='text-xs text-grey-1'>
							You can find this in your order confirmation email.
						</p>
					</div>

					<button
						type='button'
						className='w-full flex items-center justify-center gap-2 p-4 bg-primary-100 text-white font-medium hover:bg-primary-1-lt transition cursor-pointer'
						onClick={() => handleClick()}>
						<PackageSearchIcon className='w-5 h-5' />
						Track Order
					</button>
				</div>
			</div>
		</section>
	);
}
