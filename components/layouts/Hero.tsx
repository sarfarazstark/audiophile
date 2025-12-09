import { cn } from '@/lib/utilities';
import Link from 'next/link';

export default async function Hero({ className = '' }: { className?: string }) {
	return (
		<div
			className={cn(
				'bg-black px-8 min-h-[calc(100svh-4rem)] md:min-h-180 lg:h-[calc(100vh-6rem)] relative flex',
				className,
			)}>
			<picture>
				<source
					media='(min-width: 1024px)'
					srcSet='/assets/home/desktop/hero.png'
				/>
				<source
					media='(min-width: 768px)'
					srcSet='/assets/home/tablet/image-header.png'
				/>
				<img
					src='/assets/home/mobile/image-header.png'
					alt='hero headphones'
					className=' absolute inset-0 w-full h-full object-contain md:object-cover'
				/>
			</picture>
			<section
				className='
					text-white m-auto h-full w-[1100px]
					flex flex-col lg:flex-row
					items-center
					overflow-hidden
				'>
				{/* Background image via <picture> */}

				{/* Content */}
				<div className='relative z-10 flex flex-col gap-3 md:gap-7 justify-center items-center lg:items-start flex-1 uppercase max-w-96'>
					<span className='text-grey-3 tracking-[0.5em] text-xs md:text-sm font-light'>
						New Product
					</span>

					<h1 className='text-4xl md:text-6xl text-center lg:text-left font-bold'>
						XX99 Mark II Headphones
					</h1>

					<p className='text-grey-3 normal-case mb-5 text-center lg:text-left lg:max-w-[380px]'>
						Experience natural, lifelike audio and exceptional build quality
						made for the passionate music enthusiast.
					</p>

					<Link
						href={`/products/xx99-mark-two-headphones`}
						className='bg-primary hover:bg-primary-1-lt transition-colors duration-500 text-white font-semibold px-8 py-3 text-sm'>
						See Product
					</Link>
				</div>

				<div className='flex-1 flex h-full w-full'></div>
			</section>
		</div>
	);
}
