import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@/app/generated/prisma/enums';
import { generatePayuResponseHash } from '@/lib/payu';

export async function POST(req: NextRequest) {
	try {
		const form = await req.formData();

		const txnid = String(form.get('txnid'));
		const status = String(form.get('status'));
		const amount = String(form.get('amount'));
		const productinfo = String(form.get('productinfo'));
		const firstname = String(form.get('firstname'));
		const email = String(form.get('email'));
		const receivedHash = String(form.get('hash'));

		const key = process.env.PAYU_MERCHANT_KEY!;
		const salt = process.env.PAYU_MERCHANT_SALT!;

		const expectedHash = generatePayuResponseHash(salt, key, status, {
			txnid,
			amount,
			productinfo,
			firstname,
			email,
		});

		if (receivedHash !== expectedHash) {
			console.error(`❌ Hash mismatch for successful transaction ${txnid}`);
			return NextResponse.redirect(
				`${process.env.NEXT_PUBLIC_SITE_URL}/payment/failed?error=security_breach`,
				303
			);
		}

		// Update payment status if it isn't already handled by webhook
		const payment = await prisma.payment.findUnique({
			where: { id: txnid }
		});

		if (payment && payment.status !== PaymentStatus.SUCCEEDED) {
			await prisma.payment.update({
				where: { id: txnid },
				data: { status: PaymentStatus.SUCCEEDED },
			});
			console.log(`✅ Payment ${txnid} marked as SUCCEEDED via user redirect`);
		}

		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?order=${txnid}`,
			303
		);
	} catch (err) {
		console.error('Success handler error:', err);
		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_SITE_URL}/payment/failed?error=internal_error`,
			303
		);
	}
}
