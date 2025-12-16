import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@/app/generated/prisma/enums';
import { generatePayuResponseHash } from '@/lib/payu'; // Ensure you import your hash helper

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
		const errorMsg = String(form.get('error_Message') || 'payment_failed');

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
			console.error(`❌ Hash mismatch for failed transaction ${txnid}`);
			return NextResponse.redirect(
				`${process.env.NEXT_PUBLIC_SITE_URL}/payment/failed?error=security_breach`,
			);
		}

		await prisma.payment.update({
			where: { id: txnid },
			data: {
				status: PaymentStatus.FAILED,
				rawPayload: errorMsg,
			},
		});

		console.log(`❌ Payment ${txnid} marked as FAILED`);

		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_SITE_URL}/payment/failed?order=${txnid}`,
		);
	} catch (err) {
		console.error('Failure handler error:', err);
		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_SITE_URL}/payment/failed?error=internal_error`,
		);
	}
}
