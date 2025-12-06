'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utilities';

// Define the props the link needs
interface NavLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
}

export default function NavLink({ href, children, className }: NavLinkProps) {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			href={href}
			className={cn(
				'text-gray-100 hover:text-primary-1-lt transition-colors duration-500 text-[0.8125rem] font-semibold tracking-[0.15em] leading-tight',
				isActive && 'text-primary',
				className,
			)}>
			{children}
		</Link>
	);
}
