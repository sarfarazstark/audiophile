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

	const existingCategories = await prisma.category.findMany({
		where: { slug: { in: categorySlugs } },
	});
	const existingSlugs = new Set(existingCategories.map((c) => c.slug));

	const newCategories = categorySlugs
		.filter((slug) => !existingSlugs.has(slug))
		.map((slug) => ({
			slug,
			name: capitalize(slug),
		}));

	if (newCategories.length > 0) {
		await prisma.category.createMany({ data: newCategories });
	}

	const categories = await prisma.category.findMany();
	const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

	// ============================================================================
	// 2. Seed Products (base info)
	// ============================================================================
	const productSlugs = productsJson.map((p) => p.slug);
	const existingProductsBase = await prisma.product.findMany({
		where: { slug: { in: productSlugs } },
	});
	const existingProductSlugs = new Set(existingProductsBase.map((p) => p.slug));

	const newProducts = productsJson
		.filter((p) => !existingProductSlugs.has(p.slug))
		.map((p) => {
			const categoryId = categoryMap.get(p.category);
			if (!categoryId) throw new Error(`Category not found: ${p.category}`);
			return {
				slug: p.slug,
				name: p.name,
				description: p.description,
				features: p.features,
				price: p.price,
				new: p.new,
				categoryId: categoryId,
				imageUrl: normalize(p.image.desktop),
			};
		});

	if (newProducts.length > 0) {
		await prisma.product.createMany({ data: newProducts });
	}

	const productsToUpdate = productsJson.filter((p) =>
		existingProductSlugs.has(p.slug)
	);
	if (productsToUpdate.length > 0) {
		await prisma.$transaction(
			productsToUpdate.map((p) => {
				const categoryId = categoryMap.get(p.category);
				if (!categoryId) throw new Error(`Category not found: ${p.category}`);
				return prisma.product.update({
					where: { slug: p.slug },
					data: {
						name: p.name,
						description: p.description,
						features: p.features,
						price: p.price,
						new: p.new,
						categoryId: categoryId,
						imageUrl: normalize(p.image.desktop),
					},
				});
			})
		);
	}

	console.log('✓ Products base created');

	const products = await prisma.product.findMany();
	const productMap = new Map(products.map((p) => [p.slug, p.id]));

	// ============================================================================
	// 3. Seed Product Images (main + category)
	// ============================================================================
	const productIds = Array.from(productMap.values());
	const existingProductImages = await prisma.productImage.findMany({
		where: { productId: { in: productIds } },
	});
	const existingProductImageIds = new Set(existingProductImages.map((img) => img.productId));

	const existingCategoryImages = await prisma.categoryImage.findMany({
		where: { productId: { in: productIds } },
	});
	const existingCategoryImageIds = new Set(existingCategoryImages.map((img) => img.productId));

	const newProductImages = [];
	const productImagesToUpdate = [];
	const newCategoryImages = [];
	const categoryImagesToUpdate = [];

	for (const p of productsJson) {
		const productId = productMap.get(p.slug);
		if (!productId) continue;

		const imageData = {
			productId,
			mobile: normalize(p.image.mobile),
			tablet: normalize(p.image.tablet),
			desktop: normalize(p.image.desktop),
		};

		if (existingProductImageIds.has(productId)) {
			productImagesToUpdate.push(imageData);
		} else {
			newProductImages.push(imageData);
		}

		const catImageData = {
			productId,
			mobile: normalize(p.categoryImage.mobile),
			tablet: normalize(p.categoryImage.tablet),
			desktop: normalize(p.categoryImage.desktop),
		};

		if (existingCategoryImageIds.has(productId)) {
			categoryImagesToUpdate.push(catImageData);
		} else {
			newCategoryImages.push(catImageData);
		}
	}

	if (newProductImages.length > 0) {
		await prisma.productImage.createMany({ data: newProductImages });
	}
	if (productImagesToUpdate.length > 0) {
		await prisma.$transaction(
			productImagesToUpdate.map((img) =>
				prisma.productImage.update({
					where: { productId: img.productId },
					data: img,
				})
			)
		);
	}

	if (newCategoryImages.length > 0) {
		await prisma.categoryImage.createMany({ data: newCategoryImages });
	}
	if (categoryImagesToUpdate.length > 0) {
		await prisma.$transaction(
			categoryImagesToUpdate.map((img) =>
				prisma.categoryImage.update({
					where: { productId: img.productId },
					data: img,
				})
			)
		);
	}

	console.log('✓ Product images created');

	// ============================================================================
	// 4. Seed INCLUDES
	// ============================================================================
	// Clear all existing includes for the relevant products in one query
	await prisma.productInclude.deleteMany({
		where: { productId: { in: productIds } },
	});

	const includesToCreate = productsJson.flatMap((p) => {
		const productId = productMap.get(p.slug);
		if (!productId) return [];
		return p.includes.map((inc) => ({
			productId: productId,
			quantity: inc.quantity,
			item: inc.item,
		}));
	});

	if (includesToCreate.length > 0) {
		await prisma.productInclude.createMany({ data: includesToCreate });
	}

	console.log('✓ Includes created');

	// ============================================================================
	// 5. Seed GALLERY
	// ============================================================================
	await prisma.productGallery.deleteMany({
		where: { productId: { in: productIds } },
	});

	const galleryItemsToCreate = productsJson.flatMap((p) => {
		const productId = productMap.get(p.slug);
		if (!productId) return [];
		return [
			{
				productId: productId,
				position: 'FIRST' as const,
				mobile: normalize(p.gallery.first.mobile),
				tablet: normalize(p.gallery.first.tablet),
				desktop: normalize(p.gallery.first.desktop),
			},
			{
				productId: productId,
				position: 'SECOND' as const,
				mobile: normalize(p.gallery.second.mobile),
				tablet: normalize(p.gallery.second.tablet),
				desktop: normalize(p.gallery.second.desktop),
			},
			{
				productId: productId,
				position: 'THIRD' as const,
				mobile: normalize(p.gallery.third.mobile),
				tablet: normalize(p.gallery.third.tablet),
				desktop: normalize(p.gallery.third.desktop),
			},
		];
	});

	if (galleryItemsToCreate.length > 0) {
		await prisma.productGallery.createMany({ data: galleryItemsToCreate });
	}

	console.log('✓ Gallery created');

	// ============================================================================
	// 6. Seed RECOMMENDATIONS
	// ============================================================================
	await prisma.productRecommendation.deleteMany({
		where: { productId: { in: productIds } },
	});

	const recommendationsToCreate = productsJson.flatMap((p) => {
		const productId = productMap.get(p.slug);
		if (!productId) return [];

		return p.others
			.map((other) => {
				const recommendedProductId = productMap.get(other.slug);
				if (!recommendedProductId) return null;

				return {
					productId: productId,
					recommendedProductId: recommendedProductId,
					mobile: normalize(other.image.mobile),
					tablet: normalize(other.image.tablet),
					desktop: normalize(other.image.desktop),
				};
			})
			.filter((r): r is NonNullable<typeof r> => r !== null);
	});

	if (recommendationsToCreate.length > 0) {
		await prisma.productRecommendation.createMany({
			data: recommendationsToCreate,
		});
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
