import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { prisma } from '@/lib/prisma';
import { generatePayuResponseHash } from '@/lib/payu';
import crypto from 'crypto';
import { PaymentStatus } from '@/app/generated/prisma/enums';
import { log } from '@/lib/logger';

export async function POST(req: NextRequest) {
	try {
		// Webhooks send data as x-www-form-urlencoded
		const form = await req.formData();

		const txnid = String(form.get('txnid'));
		const status = String(form.get('status'));
		const amount = String(form.get('amount'));
		const productinfo = String(form.get('productinfo'));
		const email = String(form.get('email'));
		const firstname = String(form.get('firstname'));
		const receivedHash = String(form.get('hash'));

		const salt = process.env.PAYU_MERCHANT_SALT!;
		const key = process.env.PAYU_MERCHANT_KEY!;
		const isProd = process.env.PAYU_ENV === 'prod';

		log(`🪝 Webhook received for ${txnid} | Status: ${status}`);

		/* ------------------ STEP 1: Verify HASH ------------------ */
		const expectedHash = generatePayuResponseHash(salt, key, status, {
			email,
			firstname,
			productinfo,
			amount,
			txnid,
		});

		if (receivedHash !== expectedHash) {
			log(`❌ Webhook Hash Mismatch for ${txnid}`);
			return NextResponse.json({ message: 'Invalid Hash' }, { status: 200 });
		}

		/* ------------------ STEP 2: Fetch Local Payment Record ------------------ */
		const existingPayment = await prisma.payment.findUnique({
			where: { id: txnid },
		});

		if (!existingPayment) {
			log(`⚠️ Payment record ${txnid} not found in DB`);
			return NextResponse.json({ status: 'ok' });
		}

		// Short-circuit if payment is already in a final state
		if (
			existingPayment.status === PaymentStatus.SUCCEEDED ||
			existingPayment.status === PaymentStatus.FAILED
		) {
			log(
				`ℹ️ Payment ${txnid} already in final state: ${existingPayment.status}`,
			);
			return NextResponse.json({ status: 'ok' });
		}

		/* ------------------ STEP 3: Verify with PayU Server ------------------ */
		const verifyPayload = {
			key,
			command: 'verify_payment',
			var1: txnid,
			hash: cryptoHashVerify(key, 'verify_payment', txnid, salt),
		};

		const payuHost = isProd ? 'https://info.payu.in' : 'https://test.payu.in';

		const verifyRes = await axios.post(
			`${payuHost}/merchant/postservice?form=2`,
			new URLSearchParams(verifyPayload),
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
		);

		const vp = verifyRes.data;

		if (vp.status !== 1 || !vp.transaction_details?.[txnid]) {
			console.error(`❌ PayU Verification API failed for ${txnid}`);
			return NextResponse.json(
				{ message: 'Verification Failed' },
				{ status: 200 },
			);
		}

		const payuStatus = vp.transaction_details[txnid].status;
		const mihpayid = vp.transaction_details[txnid].mihpayid;

		if (payuStatus === 'success') {
			await prisma.payment.update({
				where: { id: txnid },
				data: {
					status: PaymentStatus.SUCCEEDED,
					providerPaymentId: mihpayid,
				},
			});
			log(`✅ Payment ${txnid} updated to SUCCEEDED`);
		} else if (payuStatus === 'failure') {
			await prisma.payment.update({
				where: { id: txnid },
				data: {
					status: PaymentStatus.FAILED,
					providerPaymentId: mihpayid,
				},
			});
			log(`❌ Payment ${txnid} marked as FAILED`);
		}

		return NextResponse.json({ status: 'ok' });
	} catch (err) {
		log('Webhook handler error: ' + err);
		return NextResponse.json({ status: 'error' }, { status: 500 });
	}
}

function cryptoHashVerify(
	key: string,
	command: string,
	var1: string,
	salt: string,
) {
	const raw = `${key}|${command}|${var1}|${salt}`;
	return crypto.createHash('sha512').update(raw).digest('hex');
}
