'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utilities';

interface NavLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
}

export default function NavLink({
	href,
	children,
	className,
	onClick,
}: NavLinkProps) {
	const pathname = usePathname();
	const router = useRouter();

	const isActive = pathname === href;

	const handleClick = (e: React.MouseEvent) => {
		if (onClick) {
			e.preventDefault();
			onClick();
			router.push(href);
		}
	};

	return (
		<Link
			href={href}
			onClick={handleClick}
			className={cn(
				'text-gray-100 hover:text-primary-1-lt transition-colors duration-500 text-[0.8125rem] font-semibold tracking-[0.15em] leading-tight',
				isActive && 'text-primary',
				className,
			)}>
			{children}
		</Link>
	);
}
