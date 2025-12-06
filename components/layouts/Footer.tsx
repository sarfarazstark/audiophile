import logo from '@/public/assets/shared/logo.svg';
import Image from 'next/image';
import NavLink from '@/components/layouts/NavLink';
import { cn } from '@/lib/utilities';

export default function Footer({ className = '' }: { className?: string }) {
	return (
		<footer className={cn(' bg-black', className)}>
			<div className='max-w-[1100px] mx-auto flex justify-between items-center border-b border-grey-2/40 h-24'>
				<Image src={logo} alt='Audiophile logo' />
				<nav>
					<NavLink href='/'>Home</NavLink>
					<NavLink href='/headphones'>Headphones</NavLink>
					<NavLink href='/speakers'>Speakers</NavLink>
					<NavLink href='/earphones'>Earphones</NavLink>
				</nav>
			</div>
		</footer>
	);
}
