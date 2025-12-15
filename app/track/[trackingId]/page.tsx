// app/track/[trackingId]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TrackOrderClient from '@/components/layouts/TrackOrder';
import type { Prisma } from '@/app/generated/prisma/client';

type OrderWithItems = Prisma.OrderGetPayload<{
	include: {
		items: {
			include: {
				product: {
					include: {
						images: true;
					};
				};
			};
		};
	};
}>;

export default async function Page({
	params,
}: {
	params: Promise<{ trackingId: string }>;
}) {
	const { trackingId } = await params;
	const order = await prisma.order.findUnique({
		where: { trackingId },
		include: {
			items: {
				include: {
					product: {
						include: {
							images: true,
						},
					},
				},
			},
		},
	});

	if (!order) notFound();

	return <TrackOrderClient order={order as OrderWithItems} />;
}
