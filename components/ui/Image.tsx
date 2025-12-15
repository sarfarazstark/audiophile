import NextImage from 'next/image';

export const Image = ({
	mobile,
	tablet,
	desktop,
	alt,
	width,
	height,
	className,
}: {
	mobile: string;
	tablet: string;
	desktop: string;
	className: string;
	alt: string;
	width: number;
	height: number;
}) => {
	return (
		<picture>
			<source srcSet={mobile} type='image/webp' media='(max-width: 768px)' />
			<source srcSet={tablet} type='image/webp' media='(max-width: 1024px)' />
			<NextImage
				src={desktop}
				alt={alt}
				width={width}
				height={height}
				className={className}
			/>
		</picture>
	);
};
