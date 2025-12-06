import Image from 'next/image';
import { cn } from '@/lib/utilities';
import Link from 'next/link';

export default async function Hero({ className = '' }: { className?: string }) {
	return (
		<div className={cn('bg-black', className)}>
			<section className=' text-white mx-auto max-w-[1100px] max-h-[calc(100vh-6rem)] flex items-center py-20'>
				<div className='flex flex-col gap-7 items-start flex-1 uppercase'>
					<span className='text-grey-1 tracking-[0.5em] font-light'>
						New Product
					</span>
					<h1 className='text-6xl font-bold'>XX99 Mark II Headphones</h1>
					<p className='text-grey-3 normal-case mb-5 max-w-[380px]'>
						Experience natural, lifelike audio and exceptional build quality
						made for the passionate music enthusiast.
					</p>
					<Link
						href={`/products/xx99-mark-two-headphones`}
						className='bg-primary hover:bg-primary-1-lt transition-colors duration-500 text-white font-semibold px-8 py-3 text-sm'>
						See Product
					</Link>
				</div>
				<div className='flex-1'>
					<Image
						src='/assets/home/desktop/headphone-hero-image.png'
						alt='XX99 Mark II Headphones'
						width={480}
						height={480}
					/>
				</div>
			</section>
		</div>
	);
}
