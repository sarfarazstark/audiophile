import Image from 'next/image';
import NavLink from './NavLink';

function Bento() {
	return (
		<div className='bg-white px-8'>
			<div className='flex flex-col gap-8 max-w-[1100px] mx-auto min-h-136 uppercase py-12'>
				{/* First */}
				<div className='flex flex-col lg:flex-row bg-primary bg-[url(/assets/home/desktop/pattern-circles.svg)] bg-size-[200%] lg:bg-auto bg-no-repeat bg-position-[50%_-8rem] lg:bg-position-[-90%_10%] min-h-[580px] rounded-xl'>
					<div className='flex-1 flex justify-center items-center lg:items-end'>
						<Image
							src='/assets/home/desktop/image-speaker-zx9.png'
							alt='ZX9 speaker'
							width={400}
							height={400}
							className='w-3/5 lg:w-auto'
						/>
					</div>
					<div className='flex-1 flex items-center justify-center'>
						<div className='flex flex-col lg:gap-7 items-center lg:items-start justify-center h-full max-w-70 lg:max-w-80'>
							<h2 className='text-4xl text-center lg:text-left lg:text-6xl font-bold text-white max-w-40'>
								ZX9 speaker
							</h2>
							<p className='text-primary-500 normal-case mb-5 text-center lg:text-left m-4 lg:m-0'>
								Upgrade to premium speakers that are phenomenally built to
								deliver truly remarkable sound.
							</p>
							<NavLink
								href={`/products/xx99-mark-two-headphones`}
								className='bg-primary-200 hover:bg-primary-6 transition-colors duration-500 text-primary-400 font-semibold px-6 py-3 text-xs'>
								See Product
							</NavLink>
						</div>
					</div>
				</div>

				{/* Second */}
				<div className='flex bg-primary-500 bg-[url(/assets/home/mobile/image-speaker-zx7.jpg)] bg-cover lg:bg-[url(/assets/home/desktop/image-speaker-zx7.jpg)] bg-no-repeat lg:bg-position-[150%_10%] min-h-80 rounded-xl'>
					<div className='flex-1 flex items-start justify-start'>
						<div className='flex flex-col gap-7 items-start justify-center h-full px-8 lg:px-22'>
							<h2 className='text-3xl font-bold text-primary-200'>
								ZX7 speaker
							</h2>

							<NavLink
								href={`/products/xx99-mark-two-headphones`}
								className='bg-transparent hover:bg-primary-6 transition-colors duration-500 border-2 border-primary-200 text-primary-200 font-semibold px-6 py-3 text-xs'>
								See Product
							</NavLink>
						</div>
					</div>
				</div>

				{/* Third */}
				<div className='flex flex-col lg:flex-row gap-8'>
					<Image
						src='/assets/home/desktop/image-earphones-yx1.jpg'
						alt='yx1 earphones'
						width={400}
						height={400}
						className='flex-1 rounded-2xl hidden lg:block'
					/>
					<Image
						src='/assets/home/tablet/image-earphones-yx1.jpg'
						alt='yx1 earphones'
						width={400}
						height={400}
						className='flex-1 rounded-2xl lg:hidden'
					/>
					<div className='flex-1 bg-primary-500 flex items-start justify-start rounded-2xl aspect-square'>
						<div className='flex flex-col gap-7 items-start justify-center h-full px-12 lg:px-22'>
							<h2 className='text-3xl font-bold text-primary-200'>
								yx1 earphones
							</h2>

							<NavLink
								href={`/products/xx99-mark-two-headphones`}
								className='bg-transparent hover:bg-primary-6 transition-colors duration-500 border-2 border-primary-200 text-primary-200 font-semibold px-6 py-3 text-xs'>
								See Product
							</NavLink>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Bento;
