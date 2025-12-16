'use client';
import NavLink from './NavLink';
import Image from 'next/image';
import { motion } from 'motion/react';

const nav_list = [
	{
		name: 'Headphones',
		href: '/headphones',
		image: '/assets/shared/headphones.png',
	},
	{
		name: 'Speakers',
		href: '/speakers',
		image: '/assets/shared/speakers.png',
	},
	{
		name: 'Earphones',
		href: '/earphones',
		image: '/assets/shared/earphones.png',
	},
];

export default function Categories({
	className = '',
	onClick = () => {},
}: {
	className?: string;
	onClick?: () => void;
}) {
	return (
		<motion.div
			initial={{ y: -25 }}
			animate={{
				y: 0,
				transition: {
					type: 'spring',
					stiffness: 100,
					duration: 0.2,
					ease: 'easeInOut',
				},
			}}
			className={`bg-white py-12 px-8 min-h-100 ${className}`}>
			<div className='grid grid-cols-1 md:grid-cols-3 justify-end items-center gap-8 max-w-[1100px] mx-auto uppercase'>
				{nav_list.map((nav, index) => (
					<NavLink
						key={nav.name}
						href={nav.href}
						className='relative text-black flex flex-col items-center group'
						onClick={onClick}>
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-80px' }}
							transition={{
								duration: 0.5,
								ease: 'easeOut',
								delay: index * 0.08,
							}}
							className='h-28 flex items-end justify-center overflow-visible'>
							<Image
								src={nav.image}
								alt={nav.name}
								width={240}
								height={240}
								className='transition-all duration-500 transform group-hover:-translate-y-2 -mb-16 z-10 w-26 lg:w-30'
							/>
						</motion.div>

						<div className='flex flex-col items-center justify-end gap-3 p-5 h-48 bg-primary-500 w-full rounded-xl'>
							<Image
								src='/assets/shared/shadow.png'
								alt='Shadow'
								width={120}
								height={10}
								className='h-10 w-40 group-hover:w-24 transition-all duration-500'
							/>

							<h2 className='mt-2 text-center text-lg md:text-[15px] text-primary-2'>
								{nav.name}
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
				))}
			</div>
		</motion.div>
	);
}
