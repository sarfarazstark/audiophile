'use client';
import Image from 'next/image';
import { motion } from 'motion/react';

const About = () => {
	return (
		<div className='bg-white py-12 px-8'>
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-80px' }}
				transition={{
					duration: 0.5,
					ease: 'easeOut',
				}}
				className='flex flex-col-reverse lg:flex-row justify-end items-center gap-12 max-w-[1100px] mx-auto min-h-150'>
				<div className='space-y-6 flex-1 flex flex-col justify-center mx-2 lg:mx-0 lg:max-w-[450px]'>
					<h1 className='text-2xl text-center lg:text-left lg:text-[2.5rem] tracking-wide font-bold text-primary-200 uppercase lg:leading-11 '>
						Bringing you the <span className='text-primary'>best</span> audio
						gear
					</h1>
					<p className='text-primary-200/50 tracking-wider text-center lg:text-left'>
						Located at the heart of New York City, Audiophile is the premier
						store for high end headphones, earphones, speakers, and audio
						accessories. We have a large showroom and luxury demonstration rooms
						available for you to browse and experience a wide range of our
						products. Stop by our store to meet some of the fantastic people who
						make Audiophile the best place to buy your portable audio equipment.
					</p>
				</div>
				<Image
					src='/assets/shared/man-headphone.png'
					alt='About'
					width={400}
					height={400}
					className='w-full flex-1 rounded-2xl md:max-h-80 lg:max-h-full object-cover'
				/>
			</motion.div>
		</div>
	);
};

export default About;
