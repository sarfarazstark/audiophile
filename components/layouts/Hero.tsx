import { cn } from '@/lib/utilities';
import Link from 'next/link';

export default async function Hero({ className = '' }: { className?: string }) {
	return (
		<div className={cn('bg-black px-8', className)}>
			<section className=' text-white mx-auto max-w-[1100px] min-h-[calc(100svh-4rem)] lg:min-h-[calc(100vh-6rem)] flex flex-col lg:flex-row items-center lg:py-20 bg-[url(/assets/home/desktop/headphone-hero-image.png)] lg:bg-size-[45%] bg-contain bg-position-[top_50%_left_50%] bg-no-repeat lg:bg-position-[92%_50%]'>
				<div className='flex flex-col gap-3 lg:gap-7 justify-center items-center lg:items-start flex-1 uppercase'>
					<span className='text-grey-1 tracking-[0.5em] font-light'>
						New Product
					</span>
					<h1 className='text-4xl lg:text-6xl text-center lg:text-left font-bold'>
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
				<div className='lg:flex-1'></div>
			</section>
		</div>
	);
}
