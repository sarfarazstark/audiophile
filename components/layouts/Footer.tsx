import logo from '@/public/assets/shared/logo.svg';
import Image from 'next/image';
import NavLink from '@/components/layouts/NavLink';
import { cn } from '@/lib/utilities';

export default function Footer({ className = '' }: { className?: string }) {
	return (
		<footer className={cn(' bg-black', className)}>
			<div className='max-w-[1100px] mx-auto border-grey-2/40 px-8 xl:px-0'>
				<div className='w-full flex justify-center md:justify-start'>
					<hr className='border-none h-1 bg-primary w-26' />
				</div>
				<div className='flex flex-col items-center md:flex-row justify-between lg:items-end min-h-24 gap-8 py-8'>
					<Image src={logo} alt='Audiophile logo' />
					<nav className='flex md:flex-row flex-col items-center gap-8 uppercase'>
						<NavLink href='/'>Home</NavLink>
						<NavLink href='/headphones'>Headphones</NavLink>
						<NavLink href='/speakers'>Speakers</NavLink>
						<NavLink href='/earphones'>Earphones</NavLink>
						<NavLink href='/track'>Track Order</NavLink>
					</nav>
				</div>
				<div className='w-full grid grid-cols-1 md:grid-cols-2 justify-between justify-items-center items-center lg:items-start gap-7 mb-8'>
					<p className='md:col-span-2 lg:col-span-1 text-primary-600 text-[0.92rem] text-center md:text-left mx-3 md:mx-0 lg:mx-0 tracking-wider leading-6 flex-1'>
						Audiophile is an all in one stop to fulfill your audio needs.
						We&apos;re a small team of music lovers and sound specialists who
						are devoted to helping you get the most out of personal audio. Come
						and visit our demo facility - we’re open 7 days a week.
					</p>
					<div className='md:col-start-2 md:ml-auto flex justify-end items-center gap-4 lg:gap-6 flex-1 h-full mt-auto'>
						<NavLink href='#'>
							<Image
								src='/assets/shared/desktop/icon-facebook.svg'
								alt='Facebook'
								width={20}
								height={20}
							/>
						</NavLink>
						<NavLink href='#'>
							<Image
								src='/assets/shared/desktop/icon-twitter.svg'
								alt='Twitter'
								width={20}
								height={20}
								className='h-full w-6'
							/>
						</NavLink>
						<NavLink href='#'>
							<Image
								src='/assets/shared/desktop/icon-instagram.svg'
								alt='Instagram'
								width={20}
								height={20}
							/>
						</NavLink>
					</div>
					<div className='md:row-start-2 lg:col-span-2 w-full'>
						<p className='text-primary-400 text-sm font-bold text-center md:text-left tracking-wider'>
							Copyright 2021. All Rights Reserved
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
