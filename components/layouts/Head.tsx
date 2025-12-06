import Image from 'next/image';
import NavLink from '@/components/layouts/NavLink';
import Link from 'next/link';

export default function Head({ className = '' }: { className?: string }) {
	return (
		<header className={`sticky top-0 z-50 bg-black ${className}`}>
			<div className='flex justify-between items-center border-b border-grey-2/40 h-24 bg-black max-w-[1100px] mx-auto '>
				<Link href='/' className='flex-1'>
					<Image
						src='./assets/shared/logo.svg'
						width={135}
						height={45}
						alt='Audiophile logo'
					/>
				</Link>
				<nav className='flex items-center justify-center gap-8 flex-3 uppercase'>
					<NavLink href='/'>Home</NavLink>
					<NavLink href='/headphones'>Headphones</NavLink>
					<NavLink href='/speakers'>Speakers</NavLink>
					<NavLink href='/earphones'>Earphones</NavLink>
				</nav>
				<div className='flex-1 flex justify-end items-center'>
					<Image
						src='./assets/shared/icon-cart.svg'
						width={25}
						height={25}
						alt='Cart icon'
					/>
				</div>
			</div>
		</header>
	);
}
