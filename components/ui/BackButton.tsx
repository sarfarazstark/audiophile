'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function BackButton() {
	const router = useRouter();

	return (
		<button
			className='text-primary-200 hover:text-primary font-bold cursor-pointer flex items-center gap-2 group'
			onClick={() => router.back()}>
			<Image
				src='/assets/shared/desktop/icon-arrow-right.svg'
				alt='Go Back'
				width={8}
				height={8}
				className='rotate-180 group-hover:-translate-x-0.5 transition-all duration-300'
			/>
			Go Back
		</button>
	);
}
