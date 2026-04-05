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

	const categories = await prisma.category.findMany();
	const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

	// ============================================================================
	// 2. Seed Products (base info)
	// ============================================================================
	for (const p of productsJson) {
		const categoryId = categoryMap.get(p.category);
		if (!categoryId) throw new Error(`Category not found: ${p.category}`);

		await prisma.product.upsert({
			where: { slug: p.slug },
			update: {
				name: p.name,
				description: p.description,
				features: p.features,
				price: p.price,
				new: p.new,
				categoryId: categoryId,
				imageUrl: normalize(p.image.desktop), // legacy fallback
			},
			create: {
				slug: p.slug,
				name: p.name,
				description: p.description,
				features: p.features,
				price: p.price,
				new: p.new,
				categoryId: categoryId,
				imageUrl: normalize(p.image.desktop),
			},
		});
	}

	console.log('✓ Products base created');

	const products = await prisma.product.findMany();
	const productMap = new Map(products.map((p) => [p.slug, p.id]));

	// ============================================================================
	// 3. Seed Product Images (main + category)
	// ============================================================================
	for (const p of productsJson) {
		const productId = productMap.get(p.slug);
		if (!productId) continue;

		// Main Images
		await prisma.productImage.upsert({
			where: { productId: productId },
			update: {
				mobile: normalize(p.image.mobile),
				tablet: normalize(p.image.tablet),
				desktop: normalize(p.image.desktop),
			},
			create: {
				productId: productId,
				mobile: normalize(p.image.mobile),
				tablet: normalize(p.image.tablet),
				desktop: normalize(p.image.desktop),
			},
		});

		// Category Images
		await prisma.categoryImage.upsert({
			where: { productId: productId },
			update: {
				mobile: normalize(p.categoryImage.mobile),
				tablet: normalize(p.categoryImage.tablet),
				desktop: normalize(p.categoryImage.desktop),
			},
			create: {
				productId: productId,
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
		const productId = productMap.get(p.slug);
		if (!productId) continue;

		// Clear old includes (simple)
		await prisma.productInclude.deleteMany({
			where: { productId: productId },
		});

		for (const inc of p.includes) {
			await prisma.productInclude.create({
				data: {
					productId: productId,
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
		const productId = productMap.get(p.slug);
		if (!productId) continue;

		await prisma.productGallery.deleteMany({
			where: { productId: productId },
		});

		await prisma.productGallery.createMany({
			data: [
				{
					productId: productId,
					position: 'FIRST',
					mobile: normalize(p.gallery.first.mobile),
					tablet: normalize(p.gallery.first.tablet),
					desktop: normalize(p.gallery.first.desktop),
				},
				{
					productId: productId,
					position: 'SECOND',
					mobile: normalize(p.gallery.second.mobile),
					tablet: normalize(p.gallery.second.tablet),
					desktop: normalize(p.gallery.second.desktop),
				},
				{
					productId: productId,
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
		const productId = productMap.get(p.slug);
		if (!productId) continue;

		// Clear old relations
		await prisma.productRecommendation.deleteMany({
			where: { productId: productId },
		});

		const recommendationsData = [];
		for (const other of p.others) {
			const recommendedProductId = productMap.get(other.slug);

			if (!recommendedProductId) continue;

			recommendationsData.push({
				productId: productId,
				recommendedProductId: recommendedProductId,
				mobile: normalize(other.image.mobile),
				tablet: normalize(other.image.tablet),
				desktop: normalize(other.image.desktop),
			});
		}

		if (recommendationsData.length > 0) {
			await prisma.productRecommendation.createMany({
				data: recommendationsData,
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
