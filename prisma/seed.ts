// prisma/seed.ts
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

type DeviceImages = {
	mobile: string;
	tablet: string;
	desktop: string;
};

type ProductJson = {
	id: number;
	slug: string;
	name: string;
	image: DeviceImages;
	category: string;
	categoryImage: DeviceImages;
	new: boolean;
	price: number;
	description: string;
	features: string;
	includes: { quantity: number; item: string }[];
	gallery: {
		first: DeviceImages;
		second: DeviceImages;
		third: DeviceImages;
	};
	others: {
		slug: string;
		name: string;
		image: DeviceImages;
	}[];
};

function loadProducts(): ProductJson[] {
	const filePath = path.join('./data.json');
	const content = fs.readFileSync(filePath, 'utf-8');
	return JSON.parse(content) as ProductJson[];
}

function normalize(p: string): string {
	return p.replace(/^\.\//, '/');
}

function capitalize(str: string): string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

async function main() {
	console.log('\n🌱 Seeding start…\n');

	const productsJson = loadProducts();

	// ============================================================================
	// 1. Seed Categories
	// ============================================================================
	const categorySlugs = [...new Set(productsJson.map((p) => p.category))];

	for (const slug of categorySlugs) {
		await prisma.category.upsert({
			where: { slug },
			update: {},
			create: {
				slug,
				name: capitalize(slug),
			},
		});
	}

	// ============================================================================
	// 2. Seed Products (base info)
	// ============================================================================
	for (const p of productsJson) {
		const category = await prisma.category.findUnique({
			where: { slug: p.category },
		});
		if (!category) throw new Error(`Category not found: ${p.category}`);

		await prisma.product.upsert({
			where: { slug: p.slug },
			update: {
				name: p.name,
				description: p.description,
				features: p.features,
				price: p.price,
				new: p.new,
				categoryId: category.id,
				imageUrl: normalize(p.image.desktop), // legacy fallback
			},
			create: {
				slug: p.slug,
				name: p.name,
				description: p.description,
				features: p.features,
				price: p.price,
				new: p.new,
				categoryId: category.id,
				imageUrl: normalize(p.image.desktop),
			},
		});
	}

	console.log('✓ Products base created');

	// ============================================================================
	// 3. Seed Product Images (main + category)
	// ============================================================================
	for (const p of productsJson) {
		const product = await prisma.product.findUnique({
			where: { slug: p.slug },
		});
		if (!product) continue;

		// Main Images
		await prisma.productImage.upsert({
			where: { productId: product.id },
			update: {
				mobile: normalize(p.image.mobile),
				tablet: normalize(p.image.tablet),
				desktop: normalize(p.image.desktop),
			},
			create: {
				productId: product.id,
				mobile: normalize(p.image.mobile),
				tablet: normalize(p.image.tablet),
				desktop: normalize(p.image.desktop),
			},
		});

		// Category Images
		await prisma.categoryImage.upsert({
			where: { productId: product.id },
			update: {
				mobile: normalize(p.categoryImage.mobile),
				tablet: normalize(p.categoryImage.tablet),
				desktop: normalize(p.categoryImage.desktop),
			},
			create: {
				productId: product.id,
				mobile: normalize(p.categoryImage.mobile),
				tablet: normalize(p.categoryImage.tablet),
				desktop: normalize(p.categoryImage.desktop),
			},
		});
	}

	console.log('✓ Product images created');

	// ============================================================================
	// 4. Seed INCLUDES
	// ============================================================================
	for (const p of productsJson) {
		const product = await prisma.product.findUnique({
			where: { slug: p.slug },
		});
		if (!product) continue;

		// Clear old includes (simple)
		await prisma.productInclude.deleteMany({
			where: { productId: product.id },
		});

		for (const inc of p.includes) {
			await prisma.productInclude.create({
				data: {
					productId: product.id,
					quantity: inc.quantity,
					item: inc.item,
				},
			});
		}
	}

	console.log('✓ Includes created');

	// ============================================================================
	// 5. Seed GALLERY
	// ============================================================================
	for (const p of productsJson) {
		const product = await prisma.product.findUnique({
			where: { slug: p.slug },
		});
		if (!product) continue;

		await prisma.productGallery.deleteMany({
			where: { productId: product.id },
		});

		await prisma.productGallery.createMany({
			data: [
				{
					productId: product.id,
					position: 'FIRST',
					mobile: normalize(p.gallery.first.mobile),
					tablet: normalize(p.gallery.first.tablet),
					desktop: normalize(p.gallery.first.desktop),
				},
				{
					productId: product.id,
					position: 'SECOND',
					mobile: normalize(p.gallery.second.mobile),
					tablet: normalize(p.gallery.second.tablet),
					desktop: normalize(p.gallery.second.desktop),
				},
				{
					productId: product.id,
					position: 'THIRD',
					mobile: normalize(p.gallery.third.mobile),
					tablet: normalize(p.gallery.third.tablet),
					desktop: normalize(p.gallery.third.desktop),
				},
			],
		});
	}

	console.log('✓ Gallery created');

	// ============================================================================
	// 6. Seed RECOMMENDATIONS
	// ============================================================================
	for (const p of productsJson) {
		const product = await prisma.product.findUnique({
			where: { slug: p.slug },
		});
		if (!product) continue;

		// Clear old relations
		await prisma.productRecommendation.deleteMany({
			where: { productId: product.id },
		});

		for (const other of p.others) {
			const recommended = await prisma.product.findUnique({
				where: { slug: other.slug },
			});

			if (!recommended) continue;

			await prisma.productRecommendation.create({
				data: {
					productId: product.id,
					recommendedProductId: recommended.id,
					mobile: normalize(other.image.mobile),
					tablet: normalize(other.image.tablet),
					desktop: normalize(other.image.desktop),
				},
			});
		}
	}

	console.log('✓ Recommendations created');

	console.log('\n🌱 Seeding complete.\n');
}

main()
	.catch((e) => {
		console.error('Seeding error:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
