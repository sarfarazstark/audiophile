import Image from 'next/image';
import NavLink from './NavLink';

export type products = {
	id: number;
	slug: string;
	name: string;
	description: string;
	new: boolean;
	features: string;
	price: number;
	imageUrl: string | null;
	categoryId: number;
	createdAt: Date;
	updatedAt: Date | null;
	images: {
		id: number;
		productId: number;
		mobile: string;
		tablet: string;
		desktop: string;
	} | null;
};

export const ProductCard = ({
	product,
	isReverse,
}: {
	product: products;
	isReverse: boolean;
}) => (
	<div
		key={product.id}
		className={`bg-white p-4 w-full flex flex-col gap-14 lg:gap-22 ${
			isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
		}`}>
		<div className='flex-1'>
			{/* <Image
			src={product.imageUrl || '/placeholder.svg'}
			alt={product.name}
			width={400}
			height={400}
			className='w-full'
		/> */}

			<picture>
				<source
					media='(min-width: 1024px)'
					srcSet={product.images?.desktop || '/placeholder.svg'}
				/>
				<source
					media='(min-width: 768px)'
					srcSet={product.images?.tablet || '/placeholder.svg'}
				/>
				<img
					src={product.images?.mobile || '/placeholder.svg'}
					alt='ZX7 speaker background'
					className='w-full h-full'
				/>
			</picture>
		</div>
		<div className='flex-1 flex flex-col justify-center lg:items-start'>
			<div className='flex flex-col items-center lg:items-start gap-8'>
				{product.new && (
					<span className='text-primary tracking-[0.5em] text-xs md:text-sm font-light uppercase'>
						New Product
					</span>
				)}
				<h2 className='text-4xl font-bold text-primary-200 max-w-sm text-center lg:text-left'>
					{product.name}
				</h2>
				<p className='text-primary-6/70 text-center lg:text-left font-extralight max-w-lg leading-6 tracking-wider'>
					{product.description}
				</p>
				<NavLink
					href={`/products/${product.slug}`}
					className='bg-primary text-white px-8 py-4 uppercase hover:bg-primary-1-lt hover:text-white'>
					View Product
				</NavLink>
			</div>
		</div>
	</div>
);

export default function Products({ products }: { products: products[] }) {
	return (
		<div className='grid grid-cols-1 gap-20'>
			{products.map((product, i) => (
				<ProductCard
					key={product.id}
					product={product}
					isReverse={i % 2 === 1}
				/>
			))}
		</div>
	);
}
