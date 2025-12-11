import { NextResponse } from 'next/server';
import Rate from '@/lib/utility';
import { prisma } from '@/lib/prisma';
import {
	generatePayuSignature,
	getPayuUrls,
	PayuInitiatePayload,
} from '@/lib/payu';
import { cuid, ulid } from 'zod/v4';
import { PaymentProvider } from '@/app/generated/prisma/enums';

export async function POST(req: Request) {
	try {
		const { data, items } = await req.json();

		// --------- Prepare Lookups ----------
		const ids = items.map((i: { id: number }) => i.id);

		// quantity lookup for faster access
		const qtyMap: Record<number, number> = {};
		for (const item of items) qtyMap[item.id] = item.quantity;

		// --------- Fetch Products ----------
		const products = await prisma.product.findMany({
			where: { id: { in: ids } },
			select: { id: true, price: true, name: true },
		});

		// --------- Product Info ----------
		const productInfo = products
			.map((p) => `${p.name} x ${qtyMap[p.id]}`)
			.join(', ');

		// --------- Total Price ----------
		const totalPrice = products.reduce(
			(sum, p) => sum + p.price * qtyMap[p.id],
			0,
		);

		const grandTotal = new Rate(totalPrice).getTotalPrice();

		// --------- Create Order ----------
		const order = await prisma.order.create({
			data: {
				trackingId: String(ulid()),
				email: data.email,
				fullName: data.name,
				phoneNumber: data.phone,
				addressLine1: data.addressLine1,
				addressLine2: data.addressLine2,
				city: data.city,
				state: data.state,
				postalCode: data.postalCode,
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

		// --------- PayU Setup ----------
		const key = process.env.PAYU_MERCHANT_KEY!;
		const secret = process.env.PAYU_MERCHANT_SECRET!;
		const env = process.env.PAYU_ENV;
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

		if (!key || !secret) {
			return NextResponse.json(
				{ error: 'Server misconfiguration' },
				{ status: 500 },
			);
		}

		const date = new Date().toUTCString();

		const payload: PayuInitiatePayload = {
			accountId: key,
			txnId: order.payment?.id || String(cuid()),
			order: {
				productInfo,
				paymentChargeSpecification: { price: grandTotal },
			},
			billingDetails: {
				firstName: data.name,
				email: data.email,
				phone: data.phone,
				address: {
					address1: data.addressLine1,
					city: data.city,
					state: data.state,
					country: 'India',
					zipCode: data.postalCode,
				},
			},
			callBackActions: {
				successAction: `${baseUrl}/payment/success`,
				failureAction: `${baseUrl}/payment/failure`,
				cancelAction: `${baseUrl}/payment/cancel`,
			},
			additionalInfo: {
				txnFlow: 'non-seamless',
			},
		};

		// --------- Signature ----------
		const signature = generatePayuSignature(payload, date, secret);
		const authHeader = `hmac username="${key}", algorithm="sha512", headers="date", signature="${signature}"`;

		const urls = getPayuUrls(env);

		// --------- PayU Request ----------
		const response = await fetch(urls.payment, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				date,
				authorization: authHeader,
			},
			body: JSON.stringify(payload),
		});

		const payuData = await response.json();

		if (!response.ok || !payuData.result?.checkoutUrl) {
			console.error('PayU Init Error:', payuData);
			return NextResponse.json(
				{ error: payuData.status || 'Failed to initiate' },
				{ status: 400 },
			);
		}

		// --------- Final Response ----------
		return NextResponse.json({ url: payuData.result.checkoutUrl });
	} catch (error) {
		console.error('Checkout Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
