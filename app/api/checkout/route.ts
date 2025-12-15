import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Rate from '@/lib/utility';
import { PaymentProvider } from '@/app/generated/prisma/enums';
import { generatePayuHash, PayuInitPayload } from '@/lib/payu';
import crypto from 'crypto';

interface IncomingCartItem {
	id: number;
	quantity: number;
}

interface IncomingRequest {
	data: {
		name: string;
		email: string;
		phone: string;
		addressLine1: string;
		addressLine2?: string;
		city: string;
		state: string;
		pinCode: string;
		paymentType: 'cod' | 'online';
	};
	items: IncomingCartItem[];
}

export async function POST(req: Request) {
	try {
		const body: IncomingRequest = await req.json();
		const { data, items } = body;

		const key = process.env.PAYU_MERCHANT_KEY;
		const salt = process.env.PAYU_MERCHANT_SECRET;
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
		const env = process.env.PAYU_ENV;

		if (!key || !salt || !baseUrl) {
			console.error('❌ CRITICAL: Missing PayU Environment Variables.');
			return NextResponse.json(
				{ error: 'Server Configuration Error: Missing PayU Keys' },
				{ status: 500 },
			);
		}

		const qtyMap = Object.fromEntries(items.map((i) => [i.id, i.quantity]));

		const products = await prisma.product.findMany({
			where: { id: { in: items.map((i) => i.id) } },
			select: { id: true, name: true, price: true },
		});

		const subtotal = products.reduce(
			(sum, p) => sum + p.price * qtyMap[p.id],
			0,
		);

		const grandTotal = new Rate(subtotal).getTotalPrice();
		const trackingId = crypto.randomBytes(5).toString('hex').toUpperCase();

		const order = await prisma.order.create({
			data: {
				trackingId,
				email: data.email,
				fullName: data.name,
				phoneNumber: data.phone,
				addressLine1: data.addressLine1,
				addressLine2: data.addressLine2 ?? '',
				city: data.city,
				state: data.state,
				postalCode: data.pinCode,
				country: 'India',
				totalAmount: grandTotal,
				items: {
					create: products.map((p) => ({
						productId: p.id,
						quantity: qtyMap[p.id],
						unitPrice: p.price,
						subtotal: p.price * qtyMap[p.id],
					})),
				},
				payment: {
					create: {
						provider: PaymentProvider.PAYU,
						currency: 'INR',
						amount: grandTotal,
					},
				},
			},
			include: { payment: true },
		});

		const payuScriptUrl =
			env === 'prod'
				? 'https://jssdk.payu.in/bolt/bolt.min.js'
				: 'https://jssdk-uat.payu.in/bolt/bolt.min.js';

		let productInfo = products
			.map((p) => `${p.name} x ${qtyMap[p.id]}`)
			.join(', ');

		if (productInfo.length > 100) {
			productInfo = productInfo.substring(0, 97) + '...';
		}

		const payload: PayuInitPayload = {
			key: key,
			txnid: order.payment!.id,
			amount: grandTotal.toFixed(2),
			productinfo: productInfo,
			firstname: data.name,
			email: data.email,
			phone: data.phone || '9999999999',
			surl: `${baseUrl}/payment/success`,
			furl: `${baseUrl}/payment/failure`,
		};

		const hash = generatePayuHash(payload, salt);

		return NextResponse.json({
			url: payuScriptUrl,
			params: { ...payload, hash },
			orderId: order.trackingId,
		});
	} catch (err) {
		console.error('PayU Checkout Error:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
