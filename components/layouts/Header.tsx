import Image from 'next/image';
import NavLink from '@/components/layouts/NavLink';
import Link from 'next/link';
import HamMenu from './Menu';
import { Cart } from './Cart';

export default function Header({ className = '' }: { className?: string }) {
	return (
		<header
			className={`sticky top-0 z-50 bg-black lg:px-8 xl:px-0 ${className}`}>
			<div className='flex justify-between items-center border-b border-grey-2/40 h-auto lg:h-24 bg-black max-w-[1100px] mx-auto px-4 py-6 lg:px-0 relative'>
				<HamMenu />
				<Link href='/' className='flex-2 md:flex-10 lg:flex-1'>
					<Image
						src='/assets/shared/logo.svg'
						width={135}
						height={45}
						alt='Audiophile logo'
						className='w-48 md:w-36 lg:w-auto mx-auto md:mr-auto md:ml-0 lg:mx-0'
					/>
				</Link>
				<nav className='lg:flex items-center justify-center gap-8 flex-3 uppercase hidden'>
					<NavLink href='/'>Home</NavLink>
					<NavLink href='/headphones'>Headphones</NavLink>
					<NavLink href='/speakers'>Speakers</NavLink>
					<NavLink href='/earphones'>Earphones</NavLink>
				</nav>
				<Cart />
			</div>
		</header>
	);
}
