import logo from '@/public/assets/shared/logo.svg';
import Image from 'next/image';
import NavLink from '@/components/layouts/NavLink';
import { cn } from '@/lib/utilities';

export default function Footer({ className = '' }: { className?: string }) {
	return (
		<footer className={cn(' bg-black', className)}>
			<div className='max-w-[1100px] mx-auto border-grey-2/40 space-y-8 px-8'>
				<div className='w-full flex justify-center md:justify-start'>
					<hr className='border-none h-1 bg-primary w-26' />
				</div>
				<div className='flex flex-col items-center lg:flex-row justify-between lg:items-end min-h-24 gap-8'>
					<Image src={logo} alt='Audiophile logo' />
					<nav className='flex lg:flex-row flex-col items-center gap-8 uppercase'>
						<NavLink href='/'>Home</NavLink>
						<NavLink href='/headphones'>Headphones</NavLink>
						<NavLink href='/speakers'>Speakers</NavLink>
						<NavLink href='/earphones'>Earphones</NavLink>
					</nav>
				</div>
				<div className='w-full flex flex-col lg:flex-row justify-between items-center lg:items-start gap-7'>
					<p className='text-primary-600 text-[0.92rem] text-center lg:text-left mx-3 lg:mx-0 tracking-wider leading-6 flex-1'>
						Audiophile is an all in one stop to fulfill your audio needs.
						We&apos;re a small team of music lovers and sound specialists who
						are devoted to helping you get the most out of personal audio. Come
						and visit our demo facility - we’re open 7 days a week.
					</p>
					<div className='flex justify-end justify-items-end gap-8 flex-1 h-full mt-auto'>
						<NavLink href='#'>
							<Image
								src='/assets/shared/desktop/icon-facebook.svg'
								alt='Facebook'
								width={24}
								height={24}
							/>
						</NavLink>
						<NavLink href='#'>
							<Image
								src='/assets/shared/desktop/icon-twitter.svg'
								alt='Twitter'
								width={24}
								height={24}
								className='h-full w-7'
							/>
						</NavLink>
						<NavLink href='#'>
							<Image
								src='/assets/shared/desktop/icon-instagram.svg'
								alt='Instagram'
								width={24}
								height={24}
							/>
						</NavLink>
					</div>
				</div>
				<div className='py-12'>
					<p className='text-primary-400 text-sm font-bold text-center lg:text-left tracking-wider'>
						Copyright 2021. All Rights Reserved
					</p>
				</div>
			</div>
		</footer>
	);
}
