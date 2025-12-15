import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import BackButton from '@/components/ui/BackButton';
import NavLink from '@/components/layouts/NavLink';
import Categories from '@/components/layouts/Categories';
import About from '@/components/layouts/About';
import { CartAction } from '@/components/layouts/CartAction';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { price } from '@/lib/utilities';

// 1. Define Props
type Props = {
	params: Promise<{ productId: string; }>;
};

const getProduct = async (slug: string) => {
	return await unstable_cache(
		async () => {
			return await prisma.product.findUnique({
				where: { slug },
				include: {
					images: true,
					includes: true,
					gallery: {
						orderBy: { position: 'asc' },
					},
					recommendations: {
						include: {
							recommendedProduct: {
								include: {
									images: true,
								},
							},
						},
					},
					category: true,
				},
			});
		},
		['product-page', slug],
		{
			tags: [`product:${slug}`],
			revalidate: 3600,
		},
	)();
};

export async function generateMetadata(
	{ params }: Props,
): Promise<Metadata> {
	const { productId } = await params;
	const product = await getProduct(productId);

	if (!product) {
		return {
			title: 'Product Not Found',
		};
	}

	const title = `${product.name} | ${product.category.name} | Shop for ${product.name}`;
	const description = product.description;
	const imageUrl =
		product.images?.desktop || product.imageUrl || '/placeholder.svg';

	return {
		title: title,
		description: description,
		openGraph: {
			title: title,
			description: description,
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: product.name,
				},
			],
			type: 'website',
		},
	};
}

export default async function ProductPage({ params: awaitedParams }: Props) {
	const params = await awaitedParams;
	const slug = params.productId;

	if (!slug) {
		notFound();
	}

	const product = await getProduct(slug);

	if (!product) {
		notFound();
	}

	return (
		<>
			<div className='bg-white'>
				<div className='max-w-[1100px] mx-auto py-4 lg:py-16 flex flex-col gap-12 px-4 xl:px-0'>
					<div>
						<BackButton />
					</div>

					{/* Product Overview  */}
					<div
						className='
                            bg-white w-full
                            flex flex-col lg:flex-row
                            gap-8 lg:gap-22 mb-10
                            min-h-full lg:min-h-130
                        '>
						{/* LEFT IMAGE */}
						<div className='flex-1 flex'>
							<picture className='w-full h-auto relative'>
								<source
									srcSet={product.images?.mobile || '/placeholder.svg'}
									media='(max-width: 768px)'
								/>
								<source
									srcSet={product.images?.tablet || '/placeholder.svg'}
									media='(max-width: 1024px)'
								/>
								<Image
									src={
										product.images?.desktop ||
										product.imageUrl ||
										'/placeholder.svg'
									}
									alt={product.name}
									width={600}
									height={600}
									className='w-full h-auto object-cover rounded-xl'
								/>
							</picture>
						</div>

						{/* RIGHT SIDE CONTENT */}
						<div className='flex-1 flex flex-col justify-center items-start'>
							<div className='flex flex-col items-start gap-8'>
								{/* NEW PRODUCT BADGE */}
								{product.new && (
									<span className='text-primary tracking-[0.5em] text-xs md:text-sm font-light uppercase'>
										New Product
									</span>
								)}

								{/* TITLE */}
								<h2 className='text-3xl lg:text-[2.8rem] font-semibold text-primary-200 max-w-sm lg:leading-12'>
									{product.name}
								</h2>

								{/* DESCRIPTION */}
								<p className='text-primary-6/70 font-extralight text-sm lg:text-lg lg:max-w-lg leading-6 tracking-wider'>
									{product.description}
								</p>

								{/* PRICE */}
								<span className='text-primary-200 text-lg font-semibold'>
									{price(product.price)}
								</span>

								{/* ADD TO CART */}
								<CartAction
									product={{
										id: product.id,
										quantity: 1,
										name: product.name
											.split(' ')
											.filter((char) => char !== 'Headphones')
											.join(' '),
										price: product.price,
										imageUrl: '/assets/cart/image-' + product.slug + '.jpg',
									}}
								/>
							</div>
						</div>
					</div>

					{/* Features & Includes */}
					<div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
						<div className='flex flex-col items-start gap-8'>
							<h3 className='text-primary-200 max-w-lg leading-6 tracking-wider text-3xl uppercase font-bold'>
								Features
							</h3>
							<p className='text-primary-6/90 font-extralight leading-6 tracking-wider font-sans whitespace-break-spaces'>
								{product.features}
							</p>
						</div>
						<div className='flex flex-col items-start lg:items-center'>
							<div className='flex flex-col items-start gap-8'>
								<h3 className='text-primary-200 max-w-lg leading-6 tracking-wider text-3xl uppercase font-bold'>
									In the box
								</h3>
								<div className='flex flex-col items-start gap-2'>
									{product.includes.map((include) => (
										<div key={include.id} className='flex items-center gap-4'>
											<span className='font-bold text-primary'>
												{include.quantity}x
											</span>
											<p className='text-primary-6/70 font-extralight leading-6 tracking-wider'>
												{include.item}
											</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Gallery */}
					<div
						className='
                        min-h-155
                        md:min-h-90
                        lg:min-h-155
                        grid gap-8
                        grid-cols-1
                        md:grid-cols-[1fr_60%]
                        md:grid-rows-[auto,auto]
                    '>
						{product.gallery.map((image) => {
							return (
								<picture
									key={image.id}
									className={`
                                    w-full h-auto relative rounded-xl overflow-hidden
                                    ${
																			image.position === 'FIRST' &&
																			'md:row-start-1 md:col-start-1'
																		}
                                    ${
																			image.position === 'SECOND' &&
																			'md:row-start-2 md:col-start-1'
																		}
                                    ${
																			image.position === 'THIRD' &&
																			'row-span-2 md:row-span-2 md:col-start-2'
																		}
                                `}>
									<source srcSet={image.mobile} media='(max-width: 768px)' />
									<source srcSet={image.tablet} media='(max-width: 1024px)' />
									<Image
										src={image.desktop}
										alt={product.name}
										fill
										className='object-cover'
									/>
								</picture>
							);
						})}
					</div>

					{/* Recommendations */}
					<div className='flex flex-col items-center gap-16 py-18'>
						<h3 className='text-primary-200 leading-6 tracking-wider text-xl lg:text-3xl uppercase font-bold'>
							You may also like
						</h3>
						<div className='flex flex-col md:flex-row items-center gap-8 w-full'>
							{product.recommendations.map((recommendation) => (
								<div
									key={recommendation.id}
									className='flex-1 flex flex-col items-center gap-8'>
									<Image
										src={
											recommendation.recommendedProduct.imageUrl ||
											'/placeholder.svg'
										}
										alt={recommendation.recommendedProduct.name}
										width={400}
										height={400}
										className='w-full h-full object-contain rounded-xl'
									/>
									<picture className='w-full h-auto relative'>
										<source
											srcSet={
												recommendation.recommendedProduct.images?.mobile ||
												'/placeholder.svg'
											}
											media='(max-width: 768px)'
										/>
										<source
											srcSet={
												recommendation.recommendedProduct.images?.tablet ||
												'/placeholder.svg'
											}
											media='(max-width: 1024px)'
										/>
										<Image
											src={
												recommendation.recommendedProduct.images?.desktop ||
												recommendation.recommendedProduct.imageUrl ||
												'/placeholder.svg'
											}
											alt={recommendation.recommendedProduct.name}
											width={600}
											height={600}
											className='w-full h-full object-cover rounded-xl absolute inset-0'
										/>
									</picture>
									<h4 className='text-primary-6 text-2xl font-bold leading-6 tracking-wider'>
										{recommendation.recommendedProduct.name
											.split(' ')
											.filter((char) => char !== 'Headphones')
											.join(' ')}
									</h4>
									<NavLink
										href={`/products/${recommendation.recommendedProduct.slug}`}
										className='bg-primary text-white px-6 py-4 uppercase hover:bg-primary-1-lt hover:text-white'>
										See Product
									</NavLink>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<Categories />
			<About />
		</>
	);
}
