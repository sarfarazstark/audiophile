import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Products from '@/components/layouts/Products';
import Categories from '@/components/layouts/Categories';
import About from '@/components/layouts/About';
import { Metadata } from 'next';

interface Props {
	params: Promise<{ categoryId: string; }>;
}

export async function generateMetadata(
	{ params }: Props,
): Promise<Metadata> {
	const { categoryId } = await params;
	const category = await prisma.category.findUnique({
		where: {
			slug: categoryId,
		},
	});

	if (!category) {
		return {
			title: 'Category not found',
		};
	}

	return {
		title: category.name + ' | Audiophile',
	};
}

export default async function CategoryPage({
	params: awaitedParams,
}: Props) {
	const params = await awaitedParams;
	const categoryId = params.categoryId;

	if (!categoryId) {
		notFound();
	}

	const category = await prisma.category.findUnique({
		where: {
			slug: categoryId,
		},
	});

	if (!category) {
		notFound();
	}

	const products = await prisma.product.findMany({
		where: {
			categoryId: category.id,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	return (
		<div>
			<div className='bg-black'>
				<div className='max-w-[1100px] mx-auto bg-black min-h-60 flex items-center justify-center'>
					<h1 className='text-4xl font-bold tracking-wider text-white text-center uppercase'>
						{categoryId}
					</h1>
				</div>
			</div>
			<div className='bg-white'>
				<div className='max-w-[1100px] mx-auto py-24'>
					<Products products={products} />
				</div>
			</div>
			<Categories />
			<About />
		</div>
	);
}
