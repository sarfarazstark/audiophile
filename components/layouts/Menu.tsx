'use client';

import { useState, useEffect } from 'react';
import Categories from './Categories';
import Image from 'next/image';

const HamMenu = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		setIsOpen((prev) => {
			const next = !prev;

			if (typeof document !== 'undefined') {
				document.body.style.overflow = next ? 'hidden' : '';
			}

			return next;
		});
	};

	// Cleanup on unmount (in case component unmounts while menu is open)
	useEffect(() => {
		return () => {
			if (typeof document !== 'undefined') {
				document.body.style.overflow = '';
			}
		};
	}, []);

	return (
		<div className='flex-1 lg:hidden'>
			<button onClick={toggle}>
				<Image
					src={
						isOpen
							? '/assets/shared/tablet/icon-close-menu.svg'
							: '/assets/shared/tablet/icon-hamburger.svg'
					}
					width={18}
					height={18}
					alt='Menu icon'
				/>
			</button>

			<Categories
				className={
					isOpen
						? 'fixed left-0 right-0 top-16 md:top-20 bottom-0 md:bottom-26 overflow-y-auto bg-white z-50'
						: 'hidden'
				}
			/>
		</div>
	);
};

export default HamMenu;
