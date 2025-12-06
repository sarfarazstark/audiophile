import Image from 'next/image';
import NavLink from './NavLink';

function Bento() {
	return (
		<div className='bg-primary-500'>
			<div className='grid grid-cols-2 justify-center items-center gap-8 max-w-[1100px] mx-auto min-h-136 uppercase'>
				<NavLink
					href='/headphones'
					className='relative text-black bg-primary-500 flex flex-col items-center h-48 overflow-visible rounded-xl group'>
					<Image
						src='/assets/shared/headphones.png'
						alt='Headphones'
						width={120}
						height={120}
						className='absolute bottom-3/4 left-1/2 -translate-x-1/2 group-hover:-translate-y-3.5 transition-transform duration-500'
					/>

					<div className='mt-6 flex flex-col items-center gap-3 p-5'>
						<Image
							src='/assets/shared/shadow.png'
							alt='Shadow'
							width={120}
							height={10}
							className='h-10 w-40 group-hover:w-24 transition-all duration-500'
						/>

						<h2 className='mt-2 text-center text-lg text-primary-2'>
							Headphones
						</h2>
						<span className='flex items-center gap-2'>
							<p className='text-primary-2 group-hover:text-shadow-primary transition-colors duration-500'>
								Shop
							</p>
							<Image
								src='/assets/shared/desktop/icon-arrow-right.svg'
								alt='Right icon'
								width={6}
								height={6}
								className='group-hover:ml-1 transition-all duration-500'
							/>
						</span>
					</div>
				</NavLink>

				<NavLink
					href='/speaker'
					className='relative text-black bg-primary-500 flex flex-col items-center h-48 overflow-visible rounded-xl group'>
					<Image
						src='/assets/shared/speakers.png'
						alt='Speakers'
						width={120}
						height={120}
						className='absolute bottom-3/4 left-1/2 -translate-x-1/2 group-hover:-translate-y-3.5 transition-transform duration-500'
					/>

					<div className='mt-6 flex flex-col items-center gap-3 p-5'>
						<Image
							src='/assets/shared/shadow.png'
							alt='Shadow'
							width={120}
							height={10}
							className='h-10 w-40 group-hover:w-24 transition-all duration-500'
						/>

						<h2 className='mt-2 text-center text-lg text-primary-2'>
							Speakers
						</h2>
						<span className='flex items-center gap-2'>
							<p className='text-primary-2 group-hover:text-shadow-primary transition-colors duration-500'>
								Shop
							</p>
							<Image
								src='/assets/shared/desktop/icon-arrow-right.svg'
								alt='Right icon'
								width={6}
								height={6}
								className='group-hover:ml-1 transition-all duration-500'
							/>
						</span>
					</div>
				</NavLink>

				<NavLink
					href='/earphones'
					className='relative text-black bg-primary-500 flex flex-col items-center h-48 overflow-visible rounded-xl group'>
					<Image
						src='/assets/shared/earphones.png'
						alt='Earphones'
						width={120}
						height={120}
						className='absolute bottom-3/4 left-1/2 -translate-x-1/2 group-hover:-translate-y-3.5 transition-transform duration-500'
					/>

					<div className='mt-6 flex flex-col items-center gap-3 p-5'>
						<Image
							src='/assets/shared/shadow.png'
							alt='Shadow'
							width={120}
							height={10}
							className='h-10 w-40 group-hover:w-24 transition-all duration-500'
						/>

						<h2 className='mt-2 text-center text-lg text-primary-2'>
							Earphones
						</h2>
						<span className='flex items-center gap-2'>
							<p className='text-primary-2 group-hover:text-shadow-primary transition-colors duration-500'>
								Shop
							</p>
							<Image
								src='/assets/shared/desktop/icon-arrow-right.svg'
								alt='Right icon'
								width={6}
								height={6}
								className='group-hover:ml-1 transition-all duration-500'
							/>
						</span>
					</div>
				</NavLink>
			</div>
		</div>
	);
}
export default Bento;
